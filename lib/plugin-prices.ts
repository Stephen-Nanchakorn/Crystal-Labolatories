export const pluginPrices = {
  "drop-tune": {
    name: "Drop-Tune",
    usd: 0,
    thb: 0,
  },
  "stem-splitter": {
    name: "Stem Splitter",
    usd: 99,
    thb: 3249,
  },
  "analog-eq": {
    name: "Analog EQ",
    usd: 59,
    thb: 1949,
  },
} as const;

export type PluginSlug = keyof typeof pluginPrices;