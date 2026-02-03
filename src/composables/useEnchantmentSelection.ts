import { ref, computed } from "vue";
import enchantsJson from "../assets/data/ench.json" assert {type: "json"};
import { useArmorStore } from "../store/armorStore";
import type { SelectedEnchant } from "../type/enchant";
import { useEnchantmentStore } from "../store/enchantmentStore";
import { useOrbStore } from "../store/orbStore";
import { partMap } from "../const/Const";

export function useEnchantmentSelection() {
  const armorStore = useArmorStore();
  const enchantmentStore = useEnchantmentStore();
  const orbStore = useOrbStore();

  const currentArmor = computed(() => armorStore.getArmor());
  const nameOrb = computed(() => orbStore.nameOrb);

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

    const result: Record<string, any> = { [catKey]: {} };

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
        result[catKey][part] = list;
      }
    }

    // Если в категории ничего не осталось — возвращаем пустой объект
    if (Object.keys(result[catKey]).length === 0) {
      return {};
    }

    return result;
  });

  const getEnchantsByGroup = (groupName: string): SelectedEnchant[] => {
    const enchants: SelectedEnchant[] = [];

    const filtered = filteredEnchants.value;
    if (!filtered || Object.keys(filtered).length === 0) return enchants;

    // Проходим по всем категориям (обычно одна, но на всякий случай)
    Object.values(filtered).forEach(categoryObj => {
      // Проходим по всем частям (helmet, chest и т.д.)
      Object.values(categoryObj).forEach(partArray => {
        if (Array.isArray(partArray)) {
          partArray.forEach(enchant => {
            if (enchant.group === groupName) {
              enchants.push(enchant);
            }
          });
        }
      });
    });

  return enchants;
  };

  function removeEnchant(enchantName: string) {
    enchantmentStore.removeEnchantment(enchantName);
  }

  function addRandomEnchantReplacement(positionIndex?: number) {
    const MAX_ATTEMPTS = 50;

    let attempts = 0;

    while (attempts < MAX_ATTEMPTS) {
      attempts++;

      // 1. Собираем ВСЕ видимые зачарования (из всех групп, всех частей)
      const allVisible: SelectedEnchant[] = Object.values(filteredEnchants.value)
        .flatMap((category:Record<string, SelectedEnchant[]>) => Object.values(category))
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
      if (enchantmentStore.selectedEnchantments.some(e => e.enchant === candidate.enchant)) {
        continue;
      }

      // Самое важное: группа уже занята на предмете?
      if (enchantmentStore.selectedEnchantments.some(e => e.group === candidate.group)) {
        continue;
      }

      // Всё ок → добавляем
      enchantmentStore.addEnchantment(candidate, positionIndex);
      return;
    }

    console.warn(`Не удалось подобрать случайное зачарование после ${MAX_ATTEMPTS} попыток (возможно, почти все группы уже заняты)`);
  }

  function clearAllEnch() {
    enchantmentStore.clearEnchantments();
  }

  function useOrb(ench: SelectedEnchant, positionIndex?: number) {
    console.log(ench)

    // *** Логика для "plague" сферы ***//
    if(nameOrb.value === 1) {
      removeEnchant(ench.enchant);

      addRandomEnchantReplacement(positionIndex)
    }
  }

  function selectEnchant(ench: SelectedEnchant) {
    // Здесь сохраняем конкретное зачарование в стор, если нужно
    enchantmentStore.addEnchantment(ench);
  }

  return {
    currentArmor,
    search,
    filteredEnchants,
    selectEnchant,
    removeEnchant,
    clearAllEnch,
    useOrb,
    enchantmentStore,
  };
}
