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
  const { removeEnchant, addRandomEnchantReplacement, addRandomCurse, clearAllEnch } =
    useEnchantmentSelection();

  function getKeyByValue(object: any, value: any) {
    return Object.keys(object).find(key => object[key] === value);
  }

  function chooseOrb(nameOrb: keyof typeof orbName) {
      orbStore.removeSelectOrb()

      Object.assign(document.body.style, {
          cursor: `url('icons/sphere/64/${nameOrb}.png') 16 16, auto`,
      })
      if(orbName[nameOrb] === 5) {
        orbStore.essence = true;
      }

       if(orbName[nameOrb] === 1) {
        orbStore.sky = true;
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
    if(!orbStore.sky) return;

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

    const targetEnch = enchantmentStore.selectedEnchantments[randomIndexEnchant];

    if (!targetEnch) {
      console.warn("Не удалось выбрать зачарование для exalt");
      return;
    }

    const saveFirstValue =
      targetEnch.firstRangeValue ?? targetEnch.rangeValue ?? 0;

    const valueGap = saveFirstValue * 0.25;
    const newRangeValue = targetEnch.rangeValue ?? 0 + valueGap;
    const valueTofix = Number(newRangeValue.toFixed(0));

    const newValueEnchant = formattedString({
      text: targetEnch.notFormattedString ?? targetEnch.enchant,
      percent: targetEnch.percent,
      isRandomNumber: valueTofix,
      range: targetEnch.range,
    });

    let countExaltProperty = targetEnch.exalt ?? 0;
    countExaltProperty++;

    // Удаляем старое зачарование
    removeEnchant(targetEnch.enchant);

    // Создаём новое с обновлёнными значениями
    const newEnchant = {
      group: targetEnch.group,
      enchant: newValueEnchant,
      rangeValue: valueTofix,
      firstRangeValue: saveFirstValue,
      notFormattedString: targetEnch.notFormattedString ?? targetEnch.enchant,
      percent: targetEnch.percent,
      range: targetEnch.range,
      exalt: countExaltProperty,
    };

    orbStore.exaltedCount += 1;

    // Вставляем на то же место
    const safeIndex = Math.min(
      randomIndexEnchant,
      enchantmentStore.selectedEnchantments.length,
    );
    enchantmentStore.selectedEnchantments.splice(safeIndex, 0, newEnchant);
  }

  function useEssenceOrb() {
    orbStore.essence = false;

    orbStore.clearOrbStore();
  }

  function useEmptyOrb() {
    clearAllEnch();
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

    if(nameOrb === orbName.empty) {
      useEmptyOrb()
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
