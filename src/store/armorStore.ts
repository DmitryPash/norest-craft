import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { ArmorBase, ArmorType, EnchantmentType } from "../type/armor";

export const useArmorStore = defineStore("armor", () => {
  const selectedArmorType = ref<ArmorType | null>(null);
  const selectedArmorBase = ref<ArmorBase | null>(null);
  const selectedArmorEnchantment = ref<EnchantmentType | null>(null);

  function setArmorType(type: ArmorType) {
    selectedArmorType.value = type;
  }

  function setArmorBase(base: ArmorBase) {
    selectedArmorBase.value = base;
  }

  function setArmorEnchantment(ench: EnchantmentType) {
    selectedArmorEnchantment.value = ench;
  }

  const hasSelectedType = computed(() => selectedArmorType.value !== null);

  const hasSelectedBase = computed(() => selectedArmorBase.value !== null);

  const hasSelectedEnchantment = computed(
    () => selectedArmorEnchantment.value !== null,
  );

  function getArmor() {
    return {
      type: selectedArmorType.value,
      base: selectedArmorBase.value,
      enchantment: selectedArmorEnchantment.value,
    };
  }

  return {
    selectedArmorType,
    selectedArmorBase,
    setArmorEnchantment,

    setArmorType,
    setArmorBase,
    getArmor,

    hasSelectedType,
    hasSelectedBase,
    hasSelectedEnchantment,
  };
});
