export interface SelectedEnchant {
  group: string;
  enchant: string;
  range: { from: number; to: number };
  percent: boolean;
}

export interface AddEnchantmentOptions {
  ench: SelectedEnchant;
  positionIndex?: number;
  isCurse?: boolean;
}

export type EnchantmentType = "commmon" | "magic" | "plagued";
