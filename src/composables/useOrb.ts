import { useEnchantmentStore } from "../store/enchantmentStore";

export function useOrb() {
    const enchantmentStore = useEnchantmentStore();

    const orbs = ['plague', 'magic']

    function chooseOrb(name: string) {
        if(name === 'plague') {

        }
    }

    return {
        chooseOrb
    }
}