import { useEnchantmentSelection } from "./useEnchantmentSelection";
import type { SelectedEnchant } from "../type/enchant";
import { useArmorStore } from "../store/armorStore";
import { useOrbStore } from "../store/orbStore";
import { orbName } from "../const/Const";
import { useEnchantmentStore } from "../store/enchantmentStore";
import { randomInt } from "../utils/random";
import { formattedString } from "../utils/foramttedString";

export function useOrbSelection() {
  const enchantmentStore = useEnchantmentStore();
  const armorStore = useArmorStore();
  const orbStore = useOrbStore();
  const { removeEnchant, addRandomEnchantReplacement, addRandomCurse, selectEnchant } =
    useEnchantmentSelection();

  function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

  function chooseOrb(nameOrb: string) {
      orbStore.removeSelectOrb()

      Object.assign(document.body.style, {
          cursor: `url('src/assets/icons/sphere/64/${nameOrb}.png') 16 16, auto`,
      })
      if(orbName[nameOrb] === 5) {
        orbStore.essence = true;
      }

      orbStore.setSelectOrb(nameOrb);
  }

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
    if (orbStore.exaltedCount >= 4) {
      console.warn("Больше нет свойств для Exalt");

      return;
    }

    const randomIndexEnchant = randomInt(
      0,
      enchantmentStore.selectedEnchantments.length - 1,
    );

    const targetEnch =
      enchantmentStore.selectedEnchantments[randomIndexEnchant];
    const safeIndex = Math.min(
      randomIndexEnchant,
      enchantmentStore.selectedEnchantments.length,
    );
    const saveFirstValue =
      targetEnch?.firstRangeValue ?? targetEnch?.rangeValue;
    const valueGap = saveFirstValue * 0.25;
    const newRangeValue =  targetEnch?.rangeValue + valueGap;
    const valueTofix = Number(newRangeValue.toFixed(0))

    const newValueEnchant = formattedString({
      text: targetEnch.notFormattedString,
      percent: targetEnch?.percent,
      isRandomNumber: valueTofix,
      range: targetEnch?.range,
    });

    let countExaltProperty = targetEnch?.exalt ?? 0;

    removeEnchant(targetEnch.enchant);

    countExaltProperty++;

    const newEnchant = {
      group: targetEnch?.group,
      enchant: newValueEnchant,
      rangeValue: valueTofix,
      firstRangeValue: saveFirstValue,
      notFormattedString: targetEnch?.notFormattedString,
      percent: targetEnch?.percent,
      range: targetEnch?.range,
      exalt: countExaltProperty,
    };

    orbStore.exaltedCount += 1;
    enchantmentStore.selectedEnchantments.splice(safeIndex, 0, newEnchant);
  }

  function useEssenceOrb() {
    orbStore.essence = false;

    orbStore.clearOrbStore();
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

    if(nameOrb === orbName.essence) {
      useEssenceOrb()
    }
  }

  return {
    useSkyOrb,
    useEssenceOrb,

    chooseOrb,
    getKeyByValue,
    selectedOrb,
  };
}
