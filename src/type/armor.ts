import type { EnchantmentType } from "./enchant";

export type ArmorType = "cloth" | "leather" | "mail" | "plate";
export type ArmorBase = "helmet" | "chest" | "pants" | "gloves";

export interface ArmorItem {
  name: string;
  type: ArmorType;
  base: ArmorBase;
  enchantment: EnchantmentType;
  iLvl?: number;
}
