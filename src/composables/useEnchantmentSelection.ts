import { ref, computed } from "vue";
import enchantsJson from "../assets/data/ench.json" assert { type: "json" };
import { useArmorStore } from "../store/armorStore";
import type { SelectedEnchant } from "../type/enchant";
import { useEnchantmentStore } from "../store/enchantmentStore";
import { partMap } from "../const/Const";
import { formattedString } from "../utils/foramttedString";
import { useOrbStore } from "../store/orbStore";

export function useEnchantmentSelection() {
  const armorStore = useArmorStore();
  const enchantmentStore = useEnchantmentStore();
  const orbStore = useOrbStore();

  const currentArmor = computed(() => armorStore.getArmor());
  const exaltCount = computed(() => orbStore.exaltedCount)
  const isEssence = computed(() => orbStore.essence);
  const search = ref("");

  const filteredEnchants = computed(() => {
    const { type, base, enchantment } = currentArmor.value;

    if (!enchantment) return {};

    if (!(enchantment in enchantsJson)) {
      console.warn(`Категория "${enchantment}" не найдена в enchants.json`);
      return {};
    }

    const catKey = enchantment as keyof typeof enchantsJson;
    const category = enchantsJson[catKey];

    if (!category) return {};

    const result: Record<
      string,
      Record<string, Array<SelectedEnchant & { formattedEnchant: string }>>
    > = { [catKey]: {} };

    let allowedParts: string[] = [];

    if (base) {
      const mappedPart = partMap[base as keyof typeof partMap];
      if (mappedPart && mappedPart in category) {
        allowedParts = [mappedPart];
      }
    } else {
      allowedParts = Object.keys(category);
    }

    const isAlreadySelected = (ench: SelectedEnchant) =>
      enchantmentStore.selectedEnchantments.some(
        (selected) => selected.group === ench.group
      );

    for (const part of allowedParts) {
      let list = category[part as keyof typeof category] || [];

      if (search.value.trim()) {
        const q = search.value.toLowerCase();
        list = list.filter(
          (e) =>
            e.enchant.toLowerCase().includes(q) ||
            e.group.toLowerCase().includes(q),
        );
      }

      list = list.filter((e) => !isAlreadySelected(e));

      if (list.length > 0) {
        result[catKey]![part] = list.map((ench) => {
          // Защищаем опциональные поля дефолтными значениями
         const safeRange = ench.range ?? { from: 0, to: 0 };
        const safePercent = ench.percent ?? false;

        return {
          ...ench,
          // Перезаписываем поля, чтобы они были не optional
          range: safeRange,
          percent: safePercent,
          formattedEnchant: formattedString({
            text: ench.enchant,
            range: safeRange,
            percent: safePercent,
          }),
        };
        });
      }
    }

    if (Object.keys(result[catKey]!).length === 0) {
      return {};
    }

    return result;
  });

  const curseEnchants = computed(() => {
      if (!("curse" in enchantsJson)) {
      console.warn('Категория "curse" не найдена в enchants.json');
      return {};
    }

    const curseCategory = enchantsJson["curse" as keyof typeof enchantsJson];

    if (!curseCategory) return {};

    const result: Record<
      string,
      Record<string, Array<
        SelectedEnchant & {
          formattedEnchant: string;
          randomEnchant: string;
          curseNumber: number;
        }
      >>
    > = { curse: {} };

    let allowedParts: string[] = [];

    const { base } = currentArmor.value;

    if (base) {
      const mappedPart = partMap[base as keyof typeof partMap];
      if (mappedPart && mappedPart in curseCategory) {
        allowedParts = [mappedPart];
      }
    } else {
      allowedParts = Object.keys(curseCategory);
    }

    for (const part of allowedParts) {
      let list = curseCategory[part as keyof typeof curseCategory] || [];

      if (search.value.trim()) {
        const q = search.value.toLowerCase();
        list = list.filter(
          (e) =>
            e.enchant.toLowerCase().includes(q) ||
            e.group.toLowerCase().includes(q),
        );
      }

      if (list.length > 0) {
        result.curse![part] = list.map((ench) => {
          const safeRange = ench.range ?? { from: 0, to: 0 };
          const safePercent = ench.percent ?? false;

          return {
            ...ench,
            range: safeRange,
            percent: safePercent,
            formattedEnchant: formattedString({
              text: ench.enchant,
              range: safeRange,
              percent: safePercent,
            }),
            randomEnchant: formattedString({
              text: ench.enchant,
              range: safeRange,
              percent: safePercent,
            }),
            curseNumber: 99,
          };
        });
      }
    }

    if (!result.curse || Object.keys(result.curse).length === 0) {
      return {};
    }

    return result;
  });

  function addRandomEnchantReplacement(positionIndex?: number) {
    const MAX_ATTEMPTS = 50;

    let attempts = 0;

    while (attempts < MAX_ATTEMPTS) {
      attempts++;

      // 1. Собираем ВСЕ видимые зачарования (из всех групп, всех частей)
      const allVisible: SelectedEnchant[] = Object.values(
        filteredEnchants.value,
      )
        .flatMap((category: Record<string, SelectedEnchant[]>) =>
          Object.values(category),
        )
        .flat();

      if (allVisible.length === 0) {
        console.warn("Нет вообще никаких видимых зачарований");
        return;
      }

      // 2. Берём случайное
      const randomIndex = Math.floor(Math.random() * allVisible.length);
      const candidate = allVisible[randomIndex];

      if (!candidate) {
        return;
      }

      if (!candidate.range) {
        continue;
      }

      // 3. Проверяем, можно ли добавить именно это
      if (!enchantmentStore.canAddMore) {
        return;
      }

      // Уже есть точно такое же зачарование?
      if (
        enchantmentStore.selectedEnchantments.some(
          (e) => e.enchant === candidate.enchant,
        )
      ) {
        continue;
      }

      // Самое важное: группа уже занята на предмете?
      if (
        enchantmentStore.selectedEnchantments.some(
          (e) => e.group === candidate.group,
        )
      ) {
        continue;
      }

      // Всё ок → добавляем
      enchantmentStore.addEnchantment({ ench: candidate, positionIndex });
      return;
    }
  }

  function addRandomCurse() {
    const MAX_ATTEMPTS = 50;

    let attempts = 0;

    while (attempts < MAX_ATTEMPTS) {
      attempts++;

      // 1. Собираем ВСЕ видимые зачарования только из категории "curse"
      const curseCategory = curseEnchants.value?.curse;

      if (!curseCategory || Object.keys(curseCategory).length === 0) {
        return;
      }

      // Собираем все зачарования из всех частей категории curse
      const allVisible: SelectedEnchant[] = Object.values(curseCategory).flat();

      if (allVisible.length === 0) {
        return;
      }

      // 2. Берём случайное
      const randomIndex = Math.floor(Math.random() * allVisible.length);
      const candidate = allVisible[randomIndex];

      if(!candidate) return;

      // Уже есть точно такое же зачарование? (по enchant)
      if (
        enchantmentStore.selectedEnchantments.some(
          (e) => e.enchant === candidate.enchant,
        )
      ) {
        continue;
      }

      // Всё ок → добавляем
      enchantmentStore.addEnchantment({ ench: candidate, isCurse: true });
      console.log("Добавлено случайное проклятие:", candidate.enchant);
      return;
    }

    console.warn(
      `Не удалось подобрать случайное проклятие после ${MAX_ATTEMPTS} попыток (возможно, все доступные уже выбраны)`,
    );
  }

  function removeEnchant(enchantName: string) {
    enchantmentStore.removeEnchantment(enchantName);
  }

  function clearAllEnch() {
    enchantmentStore.clearEnchantments();
    orbStore.clearOrbStore();
  }

  function selectEnchant(ench: SelectedEnchant, isCurse?: boolean) {
    enchantmentStore.addEnchantment({ ench, isCurse });
    orbStore.clearOrbStore();
  }

  return {
    currentArmor,
    search,
    filteredEnchants,
    curseEnchants,
    exaltCount,
    isEssence,
    selectEnchant,
    removeEnchant,
    addRandomEnchantReplacement,
    addRandomCurse,
    clearAllEnch,
    enchantmentStore,
  };
}
