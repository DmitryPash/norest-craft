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
    <h2>Select meterial</h2>
    <div class="armors__type armor-type">
      <button
        v-for="type in armorType"
        :key="type"
        @click="onSelectType(type)"
        class="armor-type__button"
      >
        {{ type }}

        <div>
          <img :src="getIconUrl(type)" :alt="`${type} icon`">

        </div>
      </button>
    </div>
    <br /><br />
    <h2>Select armor piece</h2>
    <div class="armors__type armor-base">
      <button v-for="base in armorBase" :key="base" @click="onSelectBase(base)" class="armor-base__button">
        {{ base }}

        <div>
          <img :src="getIconUrl(base)" :alt="`${base} icon`">

        </div>
        
      </button>
    </div>
    <br /><br />
  </div>
</template>

<style lang="scss">
.armors{
  transition: all 0.2s ease;

  
  .active {
      border-color: black;
      border: solid;
      padding: 20px;
      transform: scale(1.1);
  }

  &__type {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

}


</style>

<script>

  export default {
  methods: {
    getIconUrl(type) {
      const iconName = type.toLowerCase().replace(/\s+/g, '-');
      return new URL(`../assets/icons/armorIcons/${iconName}.webp`, import.meta.url).href;
    }
  }
}
  console.log("Hello");
  document.addEventListener('DOMContentLoaded', function() {
            const buttons = document.querySelectorAll('.armor-type__button');
            
            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    // Remove active class from all buttons
                    buttons.forEach(btn => btn.classList.remove('active'));
                    
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    // Optional: Get the button ID
                    const buttonId = this.getAttribute('data-id');
                    console.log(`Button ${buttonId} selected`);
                });
            });
        });
        document.addEventListener('DOMContentLoaded', function() {
            const buttons = document.querySelectorAll('.armor-base__button');
            
            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    // Remove active class from all buttons
                    buttons.forEach(btn => btn.classList.remove('active'));
                    
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    // Optional: Get the button ID
                    const buttonId = this.getAttribute('data-id');
                    console.log(`Button ${buttonId} selected`);
                });
            });
        });
</script>
