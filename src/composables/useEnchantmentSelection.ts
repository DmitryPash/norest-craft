import { ref, computed } from "vue";
import enchantsJson from "../assets/data/ench.json" assert { type: "json" };
import { useArmorStore } from "../store/armorStore";
import type { SelectedEnchant } from "../type/enchant";
import { useEnchantmentStore } from "../store/enchantmentStore";
import { partMap } from "../const/Const";
import { formattedString } from "../utils/foramttedString";

export function useEnchantmentSelection() {
  const armorStore = useArmorStore();
  const enchantmentStore = useEnchantmentStore();

  const currentArmor = computed(() => armorStore.getArmor());
  const search = ref("");

  const filteredEnchants = computed(() => {
    const { type, base, enchantment } = currentArmor.value;

    // Если категория не выбрана — ничего не показываем
    if (!enchantment) return {};

    if (!(enchantment in enchantsJson)) {
      console.warn(`Категория "${enchantment}" не найдена в enchants.json`);
      return {};
    }
    // Получаем ключ категории
    const catKey = enchantment as keyof typeof enchantsJson;
    const category = enchantsJson[catKey];

    if (!category) return {};

    const result: Record<
      string,
      Record<string, Array<SelectedEnchant & { formattedEnchant: string }>>
    > = {
      [catKey]: {},
    };

    // Определяем, какие части показывать
    let allowedParts: string[] = [];

    if (base) {
      const mappedPart = partMap[base as keyof typeof partMap];
      if (mappedPart && mappedPart in category) {
        allowedParts = [mappedPart];
      }
    } else {
      // если часть не выбрана — все доступные части в категории
      allowedParts = Object.keys(category);
    }

    for (const part of allowedParts) {
      let list = category[part as keyof typeof category] || [];

      // Поиск
      if (search.value.trim()) {
        const q = search.value.toLowerCase();
        list = list.filter(
          (e) =>
            e.enchant.toLowerCase().includes(q) ||
            e.group.toLowerCase().includes(q),
        );
      }

      if (list.length > 0) {
        result[catKey][part] = list.map((ench) => ({
          ...ench,
          formattedEnchant: formattedString(
            ench.enchant,
            ench.range,
            ench.percent,
          ),
        }));
      }
    }

    // Если в категории ничего не осталось — возвращаем пустой объект
    if (Object.keys(result[catKey]).length === 0) {
      return {};
    }

    return result;
  });

  const curseEnchants = computed(() => {
    // Если в JSON нет категории "curse" — возвращаем пустой объект
    if (!("curse" in enchantsJson)) {
      console.warn('Категория "curse" не найдена в enchants.json');
      return {};
    }

    const curseCategory = enchantsJson["curse" as keyof typeof enchantsJson];

    if (!curseCategory) return {};

    const result: Record<
      string,
      Record<string, Array<SelectedEnchant & { formattedEnchant: string }>>
    > = {
      curse: {},
    };

    // Определяем, какие части показывать (та же логика, что и в filteredEnchants)
    let allowedParts: string[] = [];

    const { base } = currentArmor.value;

    if (base) {
      const mappedPart = partMap[base as keyof typeof partMap];
      if (mappedPart && mappedPart in curseCategory) {
        allowedParts = [mappedPart];
      }
    } else {
      // если часть не выбрана — показываем все доступные части из curse
      allowedParts = Object.keys(curseCategory);
    }

    // Проходим по нужным частям
    for (const part of allowedParts) {
      let list = curseCategory[part as keyof typeof curseCategory] || [];

      // Применяем поиск, если пользователь что-то ввёл
      if (search.value.trim()) {
        const q = search.value.toLowerCase();
        list = list.filter(
          (e) =>
            e.enchant.toLowerCase().includes(q) ||
            e.group.toLowerCase().includes(q),
        );
      }

      console.log(list);

      // const rangeValue = randomInt(ench.range.from, ench.range.to);

      if (list.length > 0) {
        result.curse[part] = list.map((ench) => ({
          ...ench,
          formattedEnchant: formattedString({
            text: ench.enchant,
            range: ench.range,
            percent: ench.percent,
          }),
          randomEnchant: formattedString({
            text: ench.enchant,
            range: ench.range,
            percent: ench.percent,
            isRandomNumber: 99,
          }),
        }));
      }
    }

    // Если после фильтра ничего не осталось — возвращаем пустой объект
    if (Object.keys(result.curse).length === 0) {
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

      // 3. Проверяем, можно ли добавить именно это
      if (!enchantmentStore.canAddMore) {
        return;
      }

      if (!candidate) {
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

      // Уже есть точно такое же зачарование? (по enchant)
      if (
        enchantmentStore.selectedEnchantments.some(
          (e) => e.enchant === candidate.enchant,
        )
      ) {
        continue;
      }

      // Для curse НЕ проверяем группу — можно добавлять сколько угодно из одной группы

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
  }

  function selectEnchant(ench: SelectedEnchant, isCurse?: boolean) {
    enchantmentStore.addEnchantment({ ench, isCurse });
  }

  return {
    currentArmor,
    search,
    filteredEnchants,
    curseEnchants,
    selectEnchant,
    removeEnchant,
    addRandomEnchantReplacement,
    addRandomCurse,
    clearAllEnch,
    enchantmentStore,
  };
}
