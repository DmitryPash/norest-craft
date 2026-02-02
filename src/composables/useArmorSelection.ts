import { computed } from "vue";
import { useArmorStore } from "../store/armorStore";
import type { ArmorBase, ArmorType, EnchantmentType } from "../type/armor";

export function useArmoreSelection() {
  const store = useArmorStore();

  const armorType = ["cloth", "leather", "mail", "plate"] as const;
  const armorBase = ["helmet", "chest", "pants", "gloves"] as const;
  const armorEnchantment = ["commmon", "magic", "plagued"] as const;

  const currentArmor = computed(() => store.getArmor());

  function onSelectType(type: ArmorType) {
    store.setArmorType(type);
  }

  function onSelectBase(base: ArmorBase) {
    store.setArmorBase(base);
  }

  function onSelectEnchantment(ench: EnchantmentType) {
    store.setArmorEnchantment(ench);
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
