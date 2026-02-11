<template>
  <div class="result-craft">
    <h2>Result Craft</h2>
    <Orbs class="result-craft__orbs"></Orbs>

    <div
      @click.stop="selectedOrb()"
      class="result-craft-settings result-craft__settings"
    >
      <div class="result-craft-settings__item">
        Тип: <strong>{{ currentArmor.type || "не выбран" }}</strong>
      </div>
      <div>
        Часть: <strong>{{ currentArmor.base || "не выбрана" }}</strong>
      </div>
      <div>
        Категория:
        <strong>{{ currentArmor.enchantment || "не выбрана" }}</strong>
      </div>
      <ul class="result-craft-settings__list">
        <li
          v-for="(enchantment, index) in enchantmentStore.selectedEnchantments"
          :key="enchantment.enchant"
          @click.stop="useSkyOrb({ ench: enchantment, positionIndex: index })"
          class="result-craft-settings__property"
        >
          <p class="result-craft-settings__text">
            {{ index }} | {{ enchantment.group }} |
            {{ enchantment.enchant }}
            {{ enchantment.exalt }}
          </p>
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
          {{ enchantmentStore.selectedCurse.enchant }}
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useEnchantmentSelection } from "../composables/useEnchantmentSelection";
import Orbs from "./orbs.vue";
import { useOrbSelection } from "../composables/useOrbSelection";

const { currentArmor, removeEnchant, enchantmentStore } =
  useEnchantmentSelection();

const { useSkyOrb, selectedOrb } = useOrbSelection();
</script>

<style scroped lang="scss">
.result-craft {
  width: 100%;
  height: 100%;

  &__orbs {
    margin-bottom: 20px;
  }

  &__settings {
    border: 2px solid floralwhite;
    border-radius: 6px;
  }
}

.result-craft-settings {
  padding: 14px;

  &__list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  &__property {
    width: 100%;
    max-width: 350px;
    border: 1px solid blue;
    margin-bottom: 8px;
    user-select: none;
    margin-bottom: 15px;
    border-radius: 14px;
    padding: 8px;
  }

  &__text {
    margin-top: 0;
    margin-bottom: 0;
  }
}
</style>
