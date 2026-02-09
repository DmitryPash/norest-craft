import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useArmorStore } from "./armorStore";
import type { AddEnchantmentOptions, SelectedEnchant } from "../type/enchant";
import { formattedString } from "../utils/foramttedString";

export const useEnchantmentStore = defineStore("enchantment", () => {
  const armorStore = useArmorStore();

  const selectedEnchantments = ref<SelectedEnchant[]>([]);
  const selectedCurse = ref<SelectedEnchant>();
  const isCurseExist = ref<boolean>(false);

  const currentCategory = computed(
    () => armorStore.getArmor()?.enchantment ?? null,
  );

  const maxEnchantments = computed(() => {
    const cat = currentCategory.value;
    if (cat === "magic") return 3;
    if (cat === "plagued") return 4;
    return 0;
  });

  const currentCount = computed(() => selectedEnchantments.value.length);
  const canAddMore = computed(() => currentCount.value < maxEnchantments.value);

  function addEnchantment(options: AddEnchantmentOptions) {
    const { ench, positionIndex, isCurse = false } = options;

    if (isCurse) {
      console.log("curse = ===== ===== ", ench);
      isCurseExist.value = true;
      selectedCurse.value = ench;
    }

    // Проверяем общее количество (включая curse, если оно уже есть)
    if (!canAddMore.value) {
      console.warn("Нельзя добавить больше зачарований — лимит достигнут");
      return;
    }

    // Проверяем дубликат по enchant
    if (selectedEnchantments.value.some((e) => e.enchant === ench.enchant)) {
      console.warn(`Зачарование "${ench.enchant}" уже существует`);
      return;
    }

    // Проверяем занятость группы
    if (selectedEnchantments.value.some((e) => e.group === ench.group)) {
      console.warn(`Группа "${ench.group}" уже занята`);
      return;
    }

    // Добавляем обычное свойство
    const newEnchant = {
      group: ench.group,
      enchant: formattedString(ench.enchant, ench.range, ench.percent),
    };

    if (typeof positionIndex === "number" && positionIndex >= 0) {
      const safeIndex = Math.min(
        positionIndex,
        selectedEnchantments.value.length,
      );
      selectedEnchantments.value.splice(safeIndex, 0, newEnchant);
    } else {
      selectedEnchantments.value.push(newEnchant);
    }
  }

  function removeEnchantment(enchantName: string) {
    selectedEnchantments.value = selectedEnchantments.value.filter(
      (item) => item.enchant !== enchantName,
    );
  }

  function clearEnchantments() {
    selectedEnchantments.value = [];
    selectedCurse.value = undefined;
    isCurseExist.value = false;
  }

  return {
    selectedEnchantments,
    currentCategory,
    maxEnchantments,
    currentCount,
    canAddMore,
    isCurseExist,
    selectedCurse,

    addEnchantment,
    removeEnchantment,
    clearEnchantments,
  };
});
