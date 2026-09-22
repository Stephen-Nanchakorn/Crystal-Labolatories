// ✅ Single Source of Truth สำหรับราคา
export type PluginId = "drop-tune" | "stem-splitter" | "analog-eq";

export interface PluginPriceInfo {
  name: string;
  usd: number;
  thb: number;
  isFree: boolean;
}

export const pluginPrices: Record<PluginId, PluginPriceInfo> = {
  "drop-tune": { 
    name: "Drop-Tune", 
    usd: 0, 
    thb: 0, 
    isFree: true 
  },
  "stem-splitter": { 
    name: "Stem Splitter", 
    usd: 99, 
    thb: 3249, 
    isFree: false 
  },
  "analog-eq": { 
    name: "Analog EQ", 
    usd: 59, 
    thb: 1949, 
    isFree: false 
  },
};

export function getPluginPrice(pluginId: string, currency: "THB" | "USD"): number {
  const plugin = pluginPrices[pluginId as PluginId];
  if (!plugin) return 0;
  return currency === "THB" ? plugin.thb : plugin.usd;
}

export function getPriceInCents(pluginId: string, currency: "THB" | "USD"): number {
  return Math.round(getPluginPrice(pluginId, currency) * 100);
}

export function getPluginName(pluginId: string): string {
  return pluginPrices[pluginId as PluginId]?.name || "Unknown Plugin";
}

export function isPluginFree(pluginId: string): boolean {
  return pluginPrices[pluginId as PluginId]?.isFree || false;
}