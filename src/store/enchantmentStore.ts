import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useArmorStore } from "./armorStore";

export const useEnchantmentStore = defineStore("enchantment", () => {
  const armorStore = useArmorStore();
  // Массив выбранных зачарований
  const selectedEnchantments = ref<string[]>([]);

  // Текущая выбранная категория зачарований (magic / plagued / curse и т.д.)
  const currentCategory = computed(
    () => armorStore.getArmor()?.enchantment ?? null,
  );

  // Максимальное количество зачарований в зависимости от категории
  const maxEnchantments = computed(() => {
    if (currentCategory.value === "magic") return 3;
    if (currentCategory.value === "plagued") return 4;

    return 0; // по умолчанию — ничего нельзя выбрать
  });

  const currentCount = computed(() => selectedEnchantments.value.length);

  const canAddMore = computed(() => currentCount.value < maxEnchantments.value);

  // Добавить зачарование
  function addEnchantment(enchantName: string) {
    if (!canAddMore.value) {
      console.warn(
        `Нельзя добавить больше ${maxEnchantments.value} зачарований для категории ${currentCategory.value}`,
      );
      return;
    }

    if (selectedEnchantments.value.includes(enchantName)) {
      console.warn(`"${enchantName}" уже выбрано`);
      return;
    }

    selectedEnchantments.value.push(enchantName);
  }

  function removeEnchantment(ench: string) {
    const index = selectedEnchantments.value.indexOf(ench);
    if (index !== -1) {
      selectedEnchantments.value.splice(index, 1);
    }
  }

  function clearEnchantments() {
    selectedEnchantments.value = [];
  }

  const currentState = computed(() => ({
    category: currentCategory.value,
    selected: selectedEnchantments.value,
    count: currentCount.value,
    max: maxEnchantments.value,
    canAdd: canAddMore.value,
  }));

  return {
    selectedEnchantments,
    currentCategory,
    maxEnchantments,
    currentCount,
    canAddMore,
    currentState,

    addEnchantment,
    removeEnchantment,
    clearEnchantments,
  };
});
