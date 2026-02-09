<template>
  <h2>Result Craft</h2>

  <div
    @click="selectedOrb()"
    class="item"
    style="padding: 15px; border: 2px solid floralwhite"
  >
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
        @click="useSkyOrb({ ench: enchantment, positionIndex: index })"
        style="
          border: 1px solid blue;
          cursor: pointer;
          margin-bottom: 8px;
          user-select: none;
        "
      >
        {{ index }} | {{ enchantment.group }} |
        {{ enchantment.enchant }}
        <button
          @click.stop="removeEnchant(enchantment.enchant)"
          class="clear-btn"
          :title="`Удалить ${enchantment.enchant}`"
        >
          ❌
        </button>
      </li>
      <li
        v-if="
          enchantmentStore.isCurseExist &&
          enchantmentStore.selectedCurse !== undefined
        "
        @click="
          useSkyOrb({ ench: enchantmentStore.selectedCurse, isCurse: true })
        "
        style="border: 1px solid red; cursor: pointer"
      >
        {{ enchantmentStore.selectedCurse.group }} |
        {{ enchantmentStore.selectedCurse.formattedEnchant }}
      </li>
    </ul>
  </div>

  <Orbs></Orbs>
</template>

<script setup>
import { computed, ref } from "vue";
import { useEnchantmentSelection } from "../composables/useEnchantmentSelection";
import Orbs from "./orbs.vue";
import { orbNameMap } from "../const/Const";
import { useOrbSelection } from "../composables/useOrbSelection";

const { currentArmor, removeEnchant, enchantmentStore } =
  useEnchantmentSelection();

const { useSkyOrb, selectedOrb } = useOrbSelection();
</script>
