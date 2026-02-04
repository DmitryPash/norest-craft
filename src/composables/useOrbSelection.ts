
import { useEnchantmentSelection } from "./useEnchantmentSelection";
import type { SelectedEnchant } from "../type/enchant";
import { useArmorStore } from "../store/armorStore";
import { useOrbStore } from "../store/orbStore";
import {orbNameMap, orbName} from '../const/Const'
import type {EnchantmentType} from '../type/enchant'


export function useOrbSelection() {
    // const enchantmentStore = useEnchantmentStore();
    const armorStore = useArmorStore();
    const orbStore = useOrbStore();
    const {removeEnchant, addRandomEnchantReplacement} = useEnchantmentSelection()

   function useSkyOrb(ench: SelectedEnchant, positionIndex?: number) {
         removeEnchant(ench.enchant);

         addRandomEnchantReplacement(positionIndex)
     }

     function useAwakeningOrb() {
        armorStore.setArmorEnchantment("magic");

         for(let i=3; i >= 0; i--) {
           addRandomEnchantReplacement();
         }
     }

     function useCorruptingOrb() {
        armorStore.setArmorEnchantment("plagued");

         for(let i=4; i >= 0; i--) {
           addRandomEnchantReplacement();
         }
     }

     function selectedOrb() {
        const nameOrb = orbStore.nameOrb;

        if(nameOrb === orbName.awakening) {
            useAwakeningOrb()
        }

        if(nameOrb === orbName.corrupting) {
            useCorruptingOrb()
        }
     }

    return {
        useSkyOrb,

        selectedOrb,
    }
}