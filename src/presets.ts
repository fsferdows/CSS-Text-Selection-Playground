/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DesignerPreset {
  id: string;
  name: string;
  label: string;
  bgColor: string;
  textColor: string;
  designer: string;
  badge: string;
  context: string;
}

export const VISUAL_PRESETS: DesignerPreset[] = [
  {
    id: "classic_blue",
    name: "Classic Periwinkle",
    label: "Periwinkle",
    bgColor: "#dbeafe",
    textColor: "#1e40af",
    designer: "Linear / Apple",
    badge: "AAA Standard",
    context: "Sleek, comforting workspace hue designed for native system elegance."
  },
  {
    id: "dreamy_purple",
    name: "Dreamy Amethyst",
    label: "Amethyst",
    bgColor: "#e9d5ff",
    textColor: "#581c87",
    designer: "Figma iOS Vibe",
    badge: "Most Liked",
    context: "A high-personality violet layer that fits perfectly with creative design portfolios."
  },
  {
    id: "supabase_teal",
    name: "Emerald Forest Glaze",
    label: "Sleek Teal",
    bgColor: "#ccfbf1",
    textColor: "#115e59",
    designer: "Supabase / Vercel",
    badge: "Highly Readable",
    context: "A striking, tech-forward emerald highlight that commands instant attention."
  },
  {
    id: "notion_amber",
    name: "Notion Editorial Sand",
    label: "Warm Amber",
    bgColor: "#fef3c7",
    textColor: "#78350f",
    designer: "Notion Labs",
    badge: "Notion Style",
    context: "Replicates high-quality stationery parchment highlights with warm under-hues."
  },
  {
    id: "minimal_dark",
    name: "Ink Velvet Black",
    label: "Ink Black",
    bgColor: "#171717",
    textColor: "#ffffff",
    designer: "Minimalist Studio",
    badge: "Avant-Garde",
    context: "Strikes out content in deep anthracite ink with pure white contrast."
  },
  {
    id: "watermelon_rose",
    name: "Watermelon Cream",
    label: "Creamy Rose",
    bgColor: "#ffe4e6",
    textColor: "#9f1239",
    designer: "Warm Layouts",
    badge: "Aesthetic Pop",
    context: "Super organic blush pink pairing that feels friendly and warm."
  }
];
