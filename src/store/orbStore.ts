import { defineStore } from "pinia";
import { ref } from "vue";
import { orbName } from "../const/Const";

export const useOrbStore = defineStore("orb", () => {
  const isOrbSelected = ref<boolean>(false);
  const nameOrb = ref<number>(0);
  const exaltedCount = ref<number>(0);
  const essence = ref<boolean>(false);
  const sky = ref<boolean>(false);

  function setSelectOrb(name: keyof typeof orbName) {
    isOrbSelected.value = true;
    nameOrb.value = orbName[name];
  }

  function removeSelectOrb() {
    isOrbSelected.value = false;
    // nameOrb.value = orbName["noname"];
    resetSkyOrb();
  }

  function resetSkyOrb() {
    sky.value = false;
  }

  function clearOrbStore() {
    removeSelectOrb();
    exaltedCount.value = 0;
    essence.value = false;
    sky.value = false;
    document.body.style.cursor = 'auto'
  }

  return {
    isOrbSelected,
    nameOrb,
    exaltedCount,
    essence,
    sky,
    resetSkyOrb,

    setSelectOrb,
    removeSelectOrb,
    clearOrbStore,
  };
});
