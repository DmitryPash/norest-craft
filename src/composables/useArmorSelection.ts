import { computed } from "vue";
import { useArmorStore } from "../store/armorStore";
import type { ArmorBase, ArmorType } from "../type/armor";
import type { EnchantmentType } from "../type/enchant";

export function useArmoreSelection() {
  const armorStore = useArmorStore();

  const armorType = ["cloth", "leather", "mail", "plate"] as const;
  const armorBase = [
    "helmet",
    "chest",
    "pants",
    "gloves",
    "weapon",
    "bow",
    "shield",
  ] as const;
  const armorEnchantment = ["commmon", "magic", "plagued"] as const;

  const currentArmor = computed(() => armorStore.getArmor());

  function onSelectType(type: ArmorType) {
    armorStore.setArmorType(type);
  }

  function onSelectBase(base: ArmorBase) {
    armorStore.setArmorBase(base);
  }

  function onSelectEnchantment(ench: EnchantmentType) {
    armorStore.setArmorEnchantment(ench);
  }

  return {
    armorType,
    armorBase,
    armorEnchantment,

    currentArmor,

    onSelectType,
    onSelectBase,
    onSelectEnchantment,
  };
}
