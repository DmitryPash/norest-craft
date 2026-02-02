export type ArmorType = "cloth" | "leather" | "mail" | "plate";
export type ArmorBase = "helmet" | "chest" | "pants" | "gloves";
export type EnchantmentType = "commmon" | "magic" | "plagued";

export interface ArmorItem {
  name: String;
  type: ArmorType;
  base: ArmorBase;
  enchantment: EnchantmentType;
  iLvl?: Number;
}
