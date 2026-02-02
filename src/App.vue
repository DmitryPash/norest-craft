<script setup>
import SelectArmor from "./components/selectArmor.vue";
import SelectEnchantment from "./components/selectEnchantment.vue";
import { useEnchantmentStore } from "./store/enchantmentStore";

const enchantnentStore = useEnchantmentStore();
</script>

<template>
  <div>
    <h1>NO REST CRAFT</h1>
  </div>
  <SelectArmor></SelectArmor>
  {{ enchantnentStore.selectedEnchantments }}
  <SelectEnchantment></SelectEnchantment>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
