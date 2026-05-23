/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Simple helper utility to calculate color contrast ratios (WCAG conformance)
export function getRelativeLuminance(hex: string): number {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

export function getContrastStatus(ratio: number): {
  score: string;
  badge: string;
  colorClass: string;
  isGood: boolean;
} {
  if (ratio >= 7) {
    return { score: "AAA Max Legibility", badge: "Contrast Ratio ≥ 7:1 (Excellent)", colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", isGood: true };
  } else if (ratio >= 4.5) {
    return { score: "AA Compliant", badge: "Contrast Ratio ≥ 4.5:1 (Great)", colorClass: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20", isGood: true };
  } else if (ratio >= 3) {
    return { score: "Large Text Only", badge: "Contrast Ratio ≥ 3:1 (Suboptimal)", colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/20", isGood: false };
  } else {
    return { score: "🚨 ACCESSIBILITY ERROR", badge: "Contrast Ratio < 3:1 (Jarring/Inaccessible)", colorClass: "text-rose-400 bg-rose-500/10 border-rose-500/20", isGood: false };
  }
}

// Automatically adjusts the text color to maintain a minimum contrast ratio (defaults to WCAG AA 4.5)
export function autoFixContrastColor(bgHex: string, textHex: string, targetRatio = 4.5): string {
  // If already compliant, just return the current text color
  if (getContrastRatio(bgHex, textHex) >= targetRatio) {
    return textHex;
  }

  // Parse Hex to RGB helpers
  const parseHex = (hex: string) => {
    const clean = hex.replace("#", "");
    // Handle short hex formats like #fff
    let r = 0, g = 0, b = 0;
    if (clean.length === 3) {
      r = parseInt(clean[0] + clean[0], 16);
      g = parseInt(clean[1] + clean[1], 16);
      b = parseInt(clean[2] + clean[2], 16);
    } else {
      r = parseInt(clean.substring(0, 2), 16) || 0;
      g = parseInt(clean.substring(2, 4), 16) || 0;
      b = parseInt(clean.substring(4, 6), 16) || 0;
    }
    return [r, g, b];
  };

  const toHexStr = (rgb: number[]) => {
    return "#" + rgb.map(v => {
      const val = Math.max(0, Math.min(255, Math.round(v)));
      const str = val.toString(16);
      return str.length === 1 ? "0" + str : str;
    }).join("");
  };

  const bgLum = getRelativeLuminance(bgHex);
  // If background is light, blend towards pure black; if background is dark, blend towards pure white
  const targetRgb = bgLum > 0.5 ? [0, 0, 0] : [255, 255, 255];
  const textRgb = parseHex(textHex);

  // Take 40 linear steps to blend the original color to target (black or white)
  // to find the exact boundary where it crosses the target contrast ratio.
  for (let i = 0; i <= 40; i++) {
    const factor = i / 40;
    const blendedRgb = [
      textRgb[0] * (1 - factor) + targetRgb[0] * factor,
      textRgb[1] * (1 - factor) + targetRgb[1] * factor,
      textRgb[2] * (1 - factor) + targetRgb[2] * factor
    ];
    const candidateHex = toHexStr(blendedRgb);
    if (getContrastRatio(bgHex, candidateHex) >= targetRatio) {
      return candidateHex;
    }
  }

  return bgLum > 0.5 ? "#000000" : "#ffffff";
}
