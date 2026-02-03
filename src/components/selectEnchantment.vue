<template>
  <div class="enchant-filter">
    <h2>Зачарования</h2>
    <button @click="clearAllEnch">clear</button>
    <!-- Показываем текущий выбор -->
    <div
      class="currentArmor-choice"
      v-if="currentArmor.type || currentArmor.base || currentArmor.enchantment"
    >

      <ResultCraft></ResultCraft>
    </div>

    <!-- Поиск -->
    <input
      v-model="search"
      placeholder="Поиск по названию или группе..."
      class="search-input"
    />

    <!-- Список -->
    <div v-if="Object.keys(filteredEnchants).length" class="enchant-groups">
      <div
        v-for="(categoryData, categoryKey) in filteredEnchants"
        :key="categoryKey"
        class="category"
      >
        <h3>{{ categoryKey }}</h3>

        <div
          v-for="(enchants, partKey) in categoryData"
          :key="partKey"
          class="part-section"
        >
          <h4>{{ partKey }}</h4>

          <div
            v-for="ench in enchants"
            :key="ench.enchant"
            class="enchant-item"
            @click="selectEnchant(ench)"
          >
            <div class="enchant-text">{{ ench.enchant }}</div>
            <div class="group-text">Группа: {{ ench.group }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-matches">
      <p v-if="currentArmor.enchantment">
        В категории <strong>{{ currentArmor.enchantment }}</strong>
        {{ currentArmor.base ? `для части ${currentArmor.base}` : "" }}
        ничего не найдено
      </p>
      <p v-else>Выберите категорию зачарований (common / magic / plagued)</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useArmorStore } from "../store/armorStore";
import { useEnchantmentSelection } from "../composables/useEnchantmentSelection";
import ResultCraft from "./resultCraft.vue";

const {
  currentArmor,
  search,
  filteredEnchants,
  selectEnchant,
  removeEnchant,
  clearAllEnch,
  enchantmentStore,
} = useEnchantmentSelection();

</script>

<style scoped>
.enchant-filter {
  padding: 1rem;
}

.currentArmor-choice {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  color: #ccc;
  font-size: 0.95rem;
}

.search-input {
  width: 100%;
  padding: 0.7rem;
  margin-bottom: 1.5rem;
  background: #222;
  border: 1px solid #444;
  border-radius: 6px;
  color: white;
}

.category {
  margin-bottom: 2rem;
}

.part-section {
  margin: 1rem 0;
}

.enchant-item {
  padding: 0.8rem;
  margin: 0.4rem 0;
  background: #2a2a2a;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.15s;
}

.enchant-item:hover {
  background: #383838;
}

.enchant-text {
  font-weight: 600;
}

.group-text {
  font-size: 0.9rem;
  color: #aaa;
  margin-top: 0.3rem;
}

.no-matches {
  text-align: center;
  padding: 3rem 1rem;
  color: #888;
}
</style>
