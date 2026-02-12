import { defineStore } from "pinia";
import { ref } from "vue";
import { orbName } from "../const/Const";

export const useOrbStore = defineStore("orb", () => {
  const isOrbSelected = ref<boolean>(false);
  const nameOrb = ref<number>(0);
  const exaltedCount = ref<number>(0);
  const essence = ref<boolean>(false);

  function setSelectOrb(name: keyof typeof orbName) {
    isOrbSelected.value = true;
    nameOrb.value = orbName[name];
  }

  function removeSelectOrb() {
    isOrbSelected.value = false;
    nameOrb.value = orbName["noname"];
  }

  function clearOrbStore() {
    removeSelectOrb();
    exaltedCount.value = 0;
    essence.value = false;
  }

  return {
    isOrbSelected,
    nameOrb,
    exaltedCount,
    essence,

    setSelectOrb,
    removeSelectOrb,
    clearOrbStore,
  };
});
