<template>
    <h2>Result Craft</h2>

    <div>
        Тип: <strong>{{ currentArmor.type || "не выбран" }}</strong>
      </div>
      <div>
        Часть: <strong>{{ currentArmor.base || "не выбрана" }}</strong>
      </div>
      <div>
        Категория:
        <strong>{{ currentArmor.enchantment || "не выбрана" }}</strong>
      </div>

    <ul>
        <li
          v-for="(enchantment, index) in enchantmentStore.selectedEnchantments"
          :key="enchantment.enchant"
          @click="useOrb(enchantment, index)"
          style="border: 1px solid red; cursor: pointer; margin-bottom: 8px;"
        >
          {{ index }} |
          {{ enchantment.group }} |
          {{ enchantment.enchant }}
          <button
            @click.stop="removeEnchant(enchantment.enchant)"
            class="clear-btn"
            :title="`Удалить ${enchantment.enchant}`"
          >
            ❌
          </button>
        </li>
      </ul>

      <Orbs></Orbs>
</template>

<script setup>
import { computed, ref } from "vue";
import { useEnchantmentSelection } from "../composables/useEnchantmentSelection";
import Orbs from "./orbs.vue";

const {
    currentArmor,
    removeEnchant,
    enchantmentStore,
    useOrb,
} = useEnchantmentSelection();
</script>