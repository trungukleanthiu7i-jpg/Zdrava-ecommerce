import { PRICING_TIERS } from "../config/pricingTiers.js";

/**
 * Calculate final product price based on user tier.
 * This function is the single source of truth for pricing.
 */
export const getFinalPrice = ({ basePrice, user }) => {
  // 🛑 Safety: no user → base price
  if (!user) return basePrice;

  // 🛑 Admins always see base price
  if (user.role === "admin") return basePrice;

  // 1️⃣ Tier-based pricing
  const tier = user.tier || "bronze";
  const tierConfig = PRICING_TIERS[tier];

  if (tierConfig?.discount && tierConfig.discount > 0) {
    const discounted = basePrice * (1 - tierConfig.discount / 100);
    return Number(discounted.toFixed(2));
  }

  // 2️⃣ Default (bronze or unknown tier)
  return basePrice;
};
