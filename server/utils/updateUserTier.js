import { TIER_RULES } from "../config/tierRules.js";

export const getTierBySpent = (totalSpent) => {
  if (totalSpent >= TIER_RULES.gold.minSpent) return "gold";
  if (totalSpent >= TIER_RULES.silver.minSpent) return "silver";
  return "bronze";
};
