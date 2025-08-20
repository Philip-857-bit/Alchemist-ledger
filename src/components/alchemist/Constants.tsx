export type Element =
  | "💧 Water" | "🌍 Earth" | "🔥 Fire" | "🌬️ Air" | "🌱 Plant" | "🌋 Lava"
  | "💨 Steam" | "🧱 Brick" | "⚙️ Metal" | "⚡️ Energy" | "💎 Diamond";

export const BASE_ELEMENTS: Element[] = ["💧 Water", "🌍 Earth", "🔥 Fire", "🌬️ Air"];

export const rarityMap: Record<Element, string> = {
  "💧 Water": "Common", "🌍 Earth": "Common", "🔥 Fire": "Common", "🌬️ Air": "Common",
  "🌱 Plant": "Uncommon", "🌋 Lava": "Uncommon", "💨 Steam": "Uncommon",
  "🧱 Brick": "Rare", "⚙️ Metal": "Rare", "⚡️ Energy": "Epic", "💎 Diamond": "Legendary",
};
export const rarityOrder = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];

export const normalizeKey = (a: Element, b: Element) => [a, b].sort().join("+");

export const recipes: Record<string, { a: Element; b: Element; result: Element }> = {
  [normalizeKey("💧 Water", "🌍 Earth")]: { a: "💧 Water", b: "🌍 Earth", result: "🌱 Plant" },
  [normalizeKey("🔥 Fire", "🌍 Earth")]: { a: "🔥 Fire", b: "🌍 Earth", result: "🌋 Lava" },
  [normalizeKey("🔥 Fire", "💧 Water")]: { a: "🔥 Fire", b: "💧 Water", result: "💨 Steam" },
  [normalizeKey("🔥 Fire", "🌱 Plant")]: { a: "🔥 Fire", b: "🌱 Plant", result: "🧱 Brick" },
  [normalizeKey("🌋 Lava", "💨 Steam")]: { a: "🌋 Lava", b: "💨 Steam", result: "⚙️ Metal" },
  [normalizeKey("⚙️ Metal", "💨 Steam")]: { a: "⚙️ Metal", b: "💨 Steam", result: "⚡️ Energy" },
  [normalizeKey("⚡️ Energy", "🌍 Earth")]: { a: "⚡️ Energy", b: "🌍 Earth", result: "💎 Diamond" },
};
export const totalUniqueElements = new Set(Object.values(recipes).map(r => r.result)).size;

export const achievementsList = [
    { id: "firstCraft", title: "First Craft", condition: (d: string[]) => d.length >= 1 },
    { id: "curiousAlchemist", title: "Curious Alchemist", condition: (d: string[]) => d.length >= 3 },
    { id: "rareFound", title: "Rare Hunter", condition: (d: string[]) => d.some(el => rarityMap[el as Element] === 'Rare') },
    { id: "legendaryFound", title: "Legendary Master", condition: (d: string[]) => d.includes("💎 Diamond") },
    { id: "grandAlchemist", title: "Grand Alchemist", condition: (d: string[]) => d.length === totalUniqueElements },
];