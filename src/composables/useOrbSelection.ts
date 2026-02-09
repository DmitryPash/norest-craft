import { useEnchantmentSelection } from "./useEnchantmentSelection";
import type { SelectedEnchant } from "../type/enchant";
import { useArmorStore } from "../store/armorStore";
import { useOrbStore } from "../store/orbStore";
import { orbNameMap, orbName } from "../const/Const";
import type { EnchantmentType } from "../type/enchant";
import { useEnchantmentStore } from "../store/enchantmentStore";

export function useOrbSelection() {
  const enchantmentStore = useEnchantmentStore();
  const armorStore = useArmorStore();
  const orbStore = useOrbStore();
  const { removeEnchant, addRandomEnchantReplacement, addRandomCurse } =
    useEnchantmentSelection();

  function clearEnch() {
    enchantmentStore.clearEnchantments();
  }

  function useSkyOrb({
    ench,
    positionIndex,
    isCurse,
  }: {
    ench: SelectedEnchant;
    positionIndex?: number;
    isCurse?: boolean;
  }) {
    console.log("useSkyOrb");
    console.log("isCurse = ", isCurse);
    removeEnchant(ench.enchant);

    if (isCurse) {
      addRandomCurse();

      return;
    }

    addRandomEnchantReplacement(positionIndex);
  }

  function useAwakeningOrb() {
    clearEnch();
    armorStore.setArmorEnchantment("magic");

    for (let i = 3; i >= 0; i--) {
      addRandomEnchantReplacement();
    }
  }

  function useCorruptingOrb() {
    clearEnch();
    armorStore.setArmorEnchantment("plagued");

    for (let i = 4; i >= 0; i--) {
      addRandomEnchantReplacement();
    }

    addRandomCurse();
  }

  function selectedOrb() {
    const nameOrb = orbStore.nameOrb;

    if (nameOrb === orbName.awakening) {
      useAwakeningOrb();
    }

    if (nameOrb === orbName.corrupting) {
      useCorruptingOrb();
    }
  }

  return {
    useSkyOrb,

    selectedOrb,
  };
}
