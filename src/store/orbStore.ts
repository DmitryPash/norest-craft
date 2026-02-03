import { defineStore } from "pinia";
import { ref } from "vue";
import {orbName} from "../const/Const"

export const useOrbStore = defineStore("orb", () => {
    const isOrbSelected = ref<boolean>(false);
    const nameOrb = ref<number>(0);

    function setSelectOrb(name: keyof typeof orbName) {
        isOrbSelected.value = true;
        nameOrb.value = orbName[name];
    }

    function removeSelectOrb() {
        isOrbSelected.value = false;
        nameOrb.value = orbName['noname']
    }

    return {
        isOrbSelected,
        nameOrb,


        setSelectOrb,
        removeSelectOrb
    }
})