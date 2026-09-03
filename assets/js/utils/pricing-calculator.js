import { WEBSITE_TYPES, PAGE_PRICING, FEATURE_GROUPS, MAINTENANCE_OPTIONS } from "../data/pricing-config.js";

/**
 * Find website type by id.
 */
export function getWebsiteType(id) {
  return WEBSITE_TYPES.find((t) => t.id === id) || null;
}

/**
 * Calculate additional pages cost.
 * 1 halaman included. Additional pages priced by tier based on TOTAL pages.
 * Example: 5 halaman => 4 tambahan * 125k = 500k
 */
export function calcAdditionalPagesCost(totalPages) {
  const n = Math.max(1, Math.floor(Number(totalPages) || 1));
  if (n <= PAGE_PRICING.included) return 0;
  const additional = n - PAGE_PRICING.included;
  const tier = PAGE_PRICING.tiers.find((t) => n <= t.max);
  const per = tier ? tier.perPage : PAGE_PRICING.tiers[PAGE_PRICING.tiers.length - 1].perPage;
  return additional * per;
}

/**
 * Get price for a feature id (from any group).
 */
export function getFeaturePrice(featureId) {
  for (const g of FEATURE_GROUPS) {
    const it = g.items.find((x) => x.id === featureId);
    if (it) return it.price;
  }
  return 0;
}

export function getMaintenancePrice(id) {
  const m = MAINTENANCE_OPTIONS.find((x) => x.id === id);
  return m ? m.price : 0;
}

/**
 * Calculate full breakdown.
 * @param {{ websiteType:string, pages:number, selected:Set<string>|string[], maintenance:string }} state
 */
export function calculatePricing(state) {
  const type = getWebsiteType(state.websiteType);
  const basePrice = type ? type.price : 0;
  const pagesCost = calcAdditionalPagesCost(state.pages);
  const selected = state.selected instanceof Set ? state.selected : new Set(state.selected || []);
  let featuresCost = 0;
  for (const fid of selected) featuresCost += getFeaturePrice(fid);
  const maintenanceCost = getMaintenancePrice(state.maintenance);
  // deployment is part of features (FEATURE_GROUPS includes deployment); no separate bucket needed
  // For breakdown clarity, split deployment vs other features:
  const deploymentIds = new Set((FEATURE_GROUPS.find((g) => g.id === "deployment")?.items || []).map((i) => i.id));
  let deploymentCost = 0;
  let otherFeaturesCost = 0;
  for (const fid of selected) {
    if (deploymentIds.has(fid)) deploymentCost += getFeaturePrice(fid);
    else otherFeaturesCost += getFeaturePrice(fid);
  }

  const total = basePrice + pagesCost + featuresCost + maintenanceCost;

  return {
    baseType: type,
    basePrice,
    pagesCost,
    featuresCost, // total of all selected checkboxes
    deploymentCost,
    otherFeaturesCost,
    maintenanceCost,
    total,
    selectedCount: selected.size,
    pages: Math.max(1, Math.floor(Number(state.pages) || 1)),
  };
}

export function getFeatureLabel(featureId) {
  for (const g of FEATURE_GROUPS) {
    const it = g.items.find((x) => x.id === featureId);
    if (it) return it.label;
  }
  const m = MAINTENANCE_OPTIONS.find((x) => x.id === featureId);
  if (m) return m.label;
  return featureId;
}
