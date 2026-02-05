<script setup>
import { computed, ref } from "vue";
import { useArmorStore } from "../store/armorStore";
import { useArmoreSelection } from "../composables/useArmorSelection";

const {
  armorType,
  armorBase,
  onSelectBase,
  onSelectType,
  currentArmor,
  armorEnchantment,
  onSelectEnchantment,
} = useArmoreSelection();
</script>

<template>
  <div class="armors">
    <button
      v-for="type in armorType"
      :key="type"
      @click="onSelectType(type)"
      class="armors__type"
    >
      {{ type }}
    </button>
    <br /><br />
    <button v-for="base in armorBase" :key="base" @click="onSelectBase(base)">
      {{ base }}
    </button>
    <br /><br />
  </div>
</template>

<style lang="scss">
.armors {
}
</style>
