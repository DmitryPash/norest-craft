import { useEnchantmentSelection } from "./useEnchantmentSelection";
import type { SelectedEnchant } from "../type/enchant";
import { useArmorStore } from "../store/armorStore";
import { useOrbStore } from "../store/orbStore";
import { orbNameMap, orbName } from "../const/Const";
import type { EnchantmentType } from "../type/enchant";
import { useEnchantmentStore } from "../store/enchantmentStore";
import { randomInt } from "../utils/random";
import { formattedString } from "../utils/foramttedString";
import { toRef } from "vue";

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

  function useExaltOrb() {
    const randomIndexEnchant = randomInt(
      0,
      enchantmentStore.selectedEnchantments.length - 1,
    );

    console.log(
      "RANDOM = ",
      randomIndexEnchant,
      enchantmentStore.selectedEnchantments.length,
      randomIndexEnchant,
    );

    const targetEnch =
      enchantmentStore.selectedEnchantments[randomIndexEnchant];

    console.log("targetEnch = ", enchantmentStore.selectedEnchantments);
    const safeIndex = Math.min(
      randomIndexEnchant,
      enchantmentStore.selectedEnchantments.length,
    );
    const newRangeValue =
      targetEnch?.rangeValue * 0.25 + targetEnch?.rangeValue;

    const newValueEnchant = formattedString({
      text: targetEnch.notFormattedString,
      percent: targetEnch?.percent,
      isRandomNumber: newRangeValue,
      range: targetEnch?.range,
    });

    removeEnchant(targetEnch.enchant);

    const newEnchant = {
      group: targetEnch?.group,
      enchant: newValueEnchant,
      rangeValue: newRangeValue,
      notFormattedString: targetEnch?.notFormattedString,
      percent: targetEnch?.percent,
      range: targetEnch?.range,
    };

    enchantmentStore.selectedEnchantments.splice(safeIndex, 0, newEnchant);
  }

  function selectedOrb() {
    const nameOrb = orbStore.nameOrb;

    if (nameOrb === orbName.awakening) {
      useAwakeningOrb();
    }

    if (nameOrb === orbName.corrupting) {
      useCorruptingOrb();
    }

    if (nameOrb === orbName.exalting) {
      useExaltOrb();
    }
  }

  return {
    useSkyOrb,

    selectedOrb,
  };
}
