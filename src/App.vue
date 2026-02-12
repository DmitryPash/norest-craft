<script setup>
import SelectArmor from "./components/selectArmor.vue";
import SelectEnchantment from "./components/selectEnchantment.vue";
import { useOrbStore } from "./store/orbStore";

const orbStore = useOrbStore();

function resetCursor() {
  document.body.style.cursor = 'auto'
  orbStore.clearOrbStore();
  /* Наверное надо переносить в Body */
}
</script>

<template>
  <div @click.stop="resetCursor" class="norest">
    <div>
      <h1>NO REST CRAFT</h1>
    </div>
    <SelectArmor></SelectArmor>
    <SelectEnchantment></SelectEnchantment>
  </div>
</template>

<style scoped>

</style>
