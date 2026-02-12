import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useArmorStore } from "./armorStore";
import type { AddEnchantmentOptions, SelectedEnchant } from "../type/enchant";
import { formattedString } from "../utils/foramttedString";
import { randomInt } from "../utils/random";

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

    let formattedEnchant = ench.enchant;
    let rangeValue = 0;

    if (ench.range) {
      rangeValue = randomInt(ench.range.from, ench.range.to);

      formattedEnchant = formattedString({
        text: ench.enchant,
        range: ench.range,
        percent: ench.percent,
        isRandomNumber: rangeValue,
      });
    }

    if (isCurse) {
      isCurseExist.value = true;

      selectedCurse.value = {
        group: ench.group,
        enchant: formattedEnchant,
        range: ench.range ?? { from: 0, to: 0 },
        percent: ench.percent ?? false,
        rangeValue: rangeValue,
        notFormattedString: ench.enchant,
      };
    }

    // Проверяем общее количество (включая curse, если оно уже есть)
    if (!canAddMore.value) {
      return;
    }

    // Проверяем дубликат по enchant
    if (selectedEnchantments.value.some((e) => e.enchant === ench.enchant)) {
      return;
    }

    // Проверяем занятость группы
    if (selectedEnchantments.value.some((e) => e.group === ench.group)) {
      return;
    }

    // Добавляем обычное свойство
    const newEnchant = {
      group: ench.group,
      enchant: formattedEnchant,
      rangeValue: rangeValue,
      notFormattedString: ench.enchant,
      percent: ench.percent,
      range: ench.range,
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
