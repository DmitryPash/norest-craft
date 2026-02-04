export interface SelectedEnchant {
  group: string;
  enchant: string;
}

export interface AddEnchantmentOptions {
  ench: SelectedEnchant;
  positionIndex?: number;
  isCurse?: boolean;
}

export type EnchantmentType = "commmon" | "magic" | "plagued";
