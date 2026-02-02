import { ref, computed } from "vue";
import enchantsJson from "../assets/data/ench.json";
import { useArmorStore } from "../store/armorStore";
import type { SelectedEnchant } from "../type/enchant";
import { useEnchantmentStore } from "../store/enchantmentStore";

export function useEnchantmentSelection() {
  const armorStore = useArmorStore();
  const enchantmentStore = useEnchantmentStore();

  const currentArmor = computed(() => armorStore.getArmor());

  // prettier-ignore
  //   const selectedEnchantments = computed(() => enchantmentStore.selectedEnchantments);

  const search = ref("");

  // Сопоставление частей из стора → ключей в JSON
  const partMap = {
    helmet: "helmet",
    chest: "chest",
    pants: "pants",
    gloves: "gloves",
  };

  // Сопоставление категорий из стора → ключей в JSON
  const categoryMap = {
    common: "common", // если добавишь такой раздел позже
    magic: "magic",
    plagued: "plagued", // plague → plagued
    curse: "curse",
    downsides: "Downsides",
  };

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

  function removeEnchant(enchantName: string) {
    enchantmentStore.removeEnchantment(enchantName);

    // console.log("Удалено зачарование:", enchantName);
    console.log("Текущий список:", enchantmentStore.selectedEnchantments);
  }

  function clearAllEnch() {
    enchantmentStore.clearEnchantments();
  }

  function selectEnchant(ench: SelectedEnchant) {
    console.log("ench = ", ench);
    // Здесь сохраняем конкретное зачарование в стор, если нужно
    enchantmentStore.addEnchantment(ench);

    console.log("Выбрано зачарование:", ench);
  }

  return {
    currentArmor,
    search,
    filteredEnchants,
    selectEnchant,
    removeEnchant,
    clearAllEnch,
  };
}
