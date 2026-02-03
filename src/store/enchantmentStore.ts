import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useArmorStore } from "./armorStore";
import type { EnchantmentType, SelectedEnchant } from "../type/enchant";

export const useEnchantmentStore = defineStore("enchantment", () => {
  const armorStore = useArmorStore();

  const selectedEnchantments = ref<SelectedEnchant[]>([]);

  const currentCategory = computed(
    () => armorStore.getArmor()?.enchantment ?? null,
  );

  const maxEnchantments = computed(() => {
    const cat = currentCategory.value;
    if (cat === "magic") return 3;
    if (cat === "plagued") return 4;
    return 0;
  });

  const currentCount = computed(() => selectedEnchantments.value.length);
  const canAddMore = computed(() => currentCount.value < maxEnchantments.value);

  function addEnchantment(ench: SelectedEnchant, positionIndex?: number) {
    if (!canAddMore.value) return;

    if (selectedEnchantments.value.some((e) => e.enchant === ench.enchant))
      return;

    if (selectedEnchantments.value.some((e) => e.group === ench.group)) {
      console.warn(`Группа "${ench.group}" уже занята другим зачарованием`);
      return;
    }

    if(positionIndex >= 0) {
      selectedEnchantments.value.splice(positionIndex, 0 ,{
        group: ench.group,
        enchant: ench.enchant,
      });

      return;
    }

    selectedEnchantments.value.push({
      group: ench.group,
      enchant: ench.enchant,
    });

    console.log("selectedEnchantments.value = ", selectedEnchantments.value);
  }

  function removeEnchantment(enchantName: string) {
    selectedEnchantments.value = selectedEnchantments.value.filter(
      (item) => item.enchant !== enchantName,
    );
  }

  function clearEnchantments() {
    selectedEnchantments.value = [];
  }

  return {
    selectedEnchantments,
    currentCategory,
    maxEnchantments,
    currentCount,
    canAddMore,

    addEnchantment,
    removeEnchantment,
    clearEnchantments,
  };
});
