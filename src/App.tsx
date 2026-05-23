/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Check, 
  X, 
  Sparkles, 
  RefreshCw, 
  Palette, 
  Eye, 
  Copy, 
  Share2, 
  Flame, 
  Heart, 
  Layers, 
  Sliders, 
  CheckCircle2, 
  ExternalLink,
  Code2,
  Lock,
  ThumbsUp,
  Award
} from "lucide-react";
import { VISUAL_PRESETS, DesignerPreset } from "./presets";
import { getContrastRatio, getContrastStatus, autoFixContrastColor } from "./utils";

export default function App() {
  const [selectedAccent, setSelectedAccent] = useState<DesignerPreset>(VISUAL_PRESETS[0]);
  const [customBg, setCustomBg] = useState(VISUAL_PRESETS[0].bgColor);
  const [customText, setCustomText] = useState(VISUAL_PRESETS[0].textColor);
  const [highlightMode, setHighlightMode] = useState<"none" | "left" | "right">("right");
  const [copyCodeSuccess, setCopyCodeSuccess] = useState(false);
  const [copyTweetSuccess, setCopyTweetSuccess] = useState(false);
  const [autoFixEnabled, setAutoFixEnabled] = useState(false);
  const [isAutoFixing, setIsAutoFixing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive boundary checking for safe multiplier calculation
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // States for Giant screen-recording helper controls (tailored for Twitter/X video format)
  const [recCardScale, setRecCardScale] = useState<number>(1.5); // Default giant screen recording multiplier scale (1.5x)
  const [recCardTheme, setRecCardTheme] = useState<string>("clean-light"); // "clean-light", "vintage-sand", "slate-dark", "obsidian-black"
  const [recTextToShow, setRecTextToShow] = useState<string>("a quick brown fox");
  const [recLabelText, setRecLabelText] = useState<string>("Brand Accent");
  const [showUXAudits, setShowUXAudits] = useState<boolean>(true); // Dynamic floating UI/UX audit logs overlay

  // Safe tracking of mouse positions to ignore click handlers on cursor selections/moves
  const mouseDownCoords = useRef({ x: 0, y: 0 });

  const handlePreviewMouseDown = (e: React.MouseEvent) => {
    mouseDownCoords.current = { x: e.clientX, y: e.clientY };
  };

  const handlePreviewMouseUp = (mode: "left" | "right", e: React.MouseEvent) => {
    const deltaX = Math.abs(e.clientX - mouseDownCoords.current.x);
    const deltaY = Math.abs(e.clientY - mouseDownCoords.current.y);
    // If they dragged the mouse (e.g. delta > 4px), it's a drag-selection of text, not a simple click
    if (deltaX > 4 || deltaY > 4) {
      return;
    }

    const selectionString = window.getSelection()?.toString();
    if (selectionString && selectionString.trim().length > 0) {
      return;
    }

    setHighlightMode(prev => prev === mode ? "none" : mode);
  };

  // Manual auto-fix trigger with visual simulation feedback
  const handleAutoFix = () => {
    setIsAutoFixing(true);
    const fixedText = autoFixContrastColor(customBg, customText, 4.5);
    setCustomText(fixedText);
    setSelectedAccent((prev) => ({
      ...prev,
      id: "custom",
      name: prev.id === "custom" ? prev.name : `${prev.name} (Auto-Fixed)`,
      textColor: fixedText,
    }));
    setHighlightMode("right");
    setTimeout(() => setIsAutoFixing(false), 800);
  };

  // Automatically enforce contrast ratio when background changes if auto-fix rule is toggled ON
  useEffect(() => {
    if (autoFixEnabled) {
      const fixedText = autoFixContrastColor(customBg, customText, 4.5);
      if (fixedText !== customText) {
        setCustomText(fixedText);
        setSelectedAccent((prev) => ({
          ...prev,
          id: "custom",
          textColor: fixedText,
        }));
      }
    }
  }, [customBg, autoFixEnabled]);
  
  // Custom sandbox playground text state
  const [sandboxText, setSandboxText] = useState(
    "Double click this paragraph to experience physical custom text selections! Everything else in this canvas updates live based on your current chosen palette selection."
  );

  // Randomizer generator list of beautiful color combinations for instant designer inspiration
  const RANDOM_PALETTES = [
    { bg: "#fed7aa", text: "#9a3412", name: "Warm Amber Sunset" },
    { bg: "#bae6fd", text: "#0369a1", name: "Sky Glaze Blue" },
    { bg: "#fed7d7", text: "#9b1c1c", name: "Crimson Rose" },
    { bg: "#dcfce7", text: "#14532d", name: "Deep Spruce Sage" },
    { bg: "#fae8ff", text: "#701a75", name: "Pastel Orchid" },
    { bg: "#fef08a", text: "#854d0e", name: "Honey Ochre" },
    { bg: "#312e81", text: "#ffffff", name: "Royal Midnight" },
    { bg: "#111827", text: "#10b981", name: "Cyberpunk Terminal" },
    { bg: "#f87171", text: "#111827", name: "Retro Scarlet Coral" }
  ];

  const handleRandomize = () => {
    const randomIndex = Math.floor(Math.random() * RANDOM_PALETTES.length);
    const item = RANDOM_PALETTES[randomIndex];
    setCustomBg(item.bg);
    setCustomText(item.text);
    setSelectedAccent({
      id: "custom",
      name: item.name,
      label: "Custom Pair",
      bgColor: item.bg,
      textColor: item.text,
      designer: "Aesthetic Generator",
      badge: "Inspiration",
      context: "A custom randomized pairing showing beautiful designer potential."
    });
    setHighlightMode("right"); // Simulates the custom highlight instantly
  };

  // Keep manual updates synced with selected states
  const handleCustomColorInput = (type: "bg" | "text", value: string) => {
    if (type === "bg") {
      setCustomBg(value);
      setSelectedAccent((prev) => ({
        ...prev,
        id: "custom",
        name: "Custom Composition",
        bgColor: value,
      }));
    } else {
      setCustomText(value);
      setSelectedAccent((prev) => ({
        ...prev,
        id: "custom",
        name: "Custom Composition",
        textColor: value,
      }));
    }
    setHighlightMode("right");
  };

  // State to simulate standard automated swipe selection animations for video recording
  const [isSwiping, setIsSwiping] = useState(false);

  const triggerSimulationSwipe = () => {
    setIsSwiping(true);
    setHighlightMode("left");
    setTimeout(() => {
      setHighlightMode("right");
    }, 1500);
    setTimeout(() => {
      setHighlightMode("none");
      setIsSwiping(false);
    }, 4000);
  };

  // Trigger when a preset is clicked
  const handleSelectPreset = (preset: DesignerPreset) => {
    setSelectedAccent(preset);
    setCustomBg(preset.bgColor);
    setCustomText(preset.textColor);
    setHighlightMode("right");
  };

  // Keyboard shortcuts integration for the playground
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Direct guard to skip triggers when inputting text inside form inputs, textareas or contentEditables
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // 'R' -> Randomize palette
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        handleRandomize();
      }
      // 'C' -> Copy CSS snippet
      else if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        copyCodeToClipboard();
      }
      // Arrow Right or Arrow Down -> Cycle to next designer preset
      else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        const currentIndex = VISUAL_PRESETS.findIndex((p) => p.id === selectedAccent.id);
        if (currentIndex !== -1) {
          const nextIndex = (currentIndex + 1) % VISUAL_PRESETS.length;
          handleSelectPreset(VISUAL_PRESETS[nextIndex]);
        } else {
          handleSelectPreset(VISUAL_PRESETS[0]);
        }
      }
      // Arrow Left or Arrow Up -> Cycle to previous designer preset
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const currentIndex = VISUAL_PRESETS.findIndex((p) => p.id === selectedAccent.id);
        if (currentIndex !== -1) {
          const prevIndex = (currentIndex - 1 + VISUAL_PRESETS.length) % VISUAL_PRESETS.length;
          handleSelectPreset(VISUAL_PRESETS[prevIndex]);
        } else {
          handleSelectPreset(VISUAL_PRESETS[VISUAL_PRESETS.length - 1]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedAccent, customBg, customText]);

  // Contrast math evaluation
  const contrastRatio = getContrastRatio(customBg, customText);
  const contrastStatus = getContrastStatus(contrastRatio);

  // Modern browser selector rules
  const cssCodeSnippet = `/* ── Custom Brand Highlight Color System ── */

/* Modern Standard (Chrome, Safari, Edge, Opera) */
::selection {
  background-color: ${customBg};
  color: ${customText};
}

/* Mozilla Firefox Compatibility */
::-moz-selection {
  background-color: ${customBg};
  color: ${customText};
}`;

  // Pre-configured, design-focused viral post template designed specifically for high-engagement X format
  const xTweetText = `browser default text selection colors often suck! 🫠

using \`::selection\` CSS pseudo-element is a micro-design cheat code that instantly adds premium flavor.

Left: Standard harsh Red/Neon Green warning ❌
Right: Clean Custom Highlight: "${selectedAccent.name}" (Contrast: ${contrastRatio.toFixed(1)}:1) 💎

/* custom brand highlight color */
::selection {
  background-color: ${customBg};
  color: ${customText};
}

Customize yours here: ${window.location.href}
#webdesign #css #uiux`;

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(cssCodeSnippet);
    setCopyCodeSuccess(true);
    setTimeout(() => setCopyCodeSuccess(false), 2200);
  };

  const copyTweetToClipboard = () => {
    navigator.clipboard.writeText(xTweetText);
    setCopyTweetSuccess(true);
    setTimeout(() => setCopyTweetSuccess(false), 2200);
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-[#f3f4f6] font-sans antialiased pb-20 pt-6 sm:pt-10 px-4 select-none relative overflow-hidden">
      
      {/* Dynamic background lighting nodes */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[550px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[650px] bg-sky-500/5 rounded-full blur-[160px] pointer-events-none shrink-0" />

      {/* Styled custom CSS selection rule specifically injected to preview design adjustments */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* LEFT SIDE BAD SELECTION: Jarring high-saturation contrast error (Red vs. Lime-green) */
        .preview-bad-selection::selection,
        .preview-bad-selection *::selection {
          background-color: #ff0000 !important;
          color: #00ff00 !important;
        }

        /* RIGHT SIDE GOOD SELECTION: Tailored brand experience styling with the dynamically selected/tuned hex color values */
        .preview-good-selection::selection,
        .preview-good-selection *::selection {
          background-color: ${customBg} !important;
          color: ${customText} !important;
          transition: background-color 0.15s ease-out;
        }

        /* Standard generic browser default color (fallback to typical old Chrome blue/white highlight) */
        .preview-browser-default::selection,
        .preview-browser-default *::selection {
          background-color: #3b82f6 !important;
          color: #ffffff !important;
        }

        .selectable-text {
          user-select: text !important;
          -webkit-user-select: text !important;
        }
      `}} />

      {/* Primary Layout Frame */}
      <div className="max-w-[1240px] mx-auto flex flex-col gap-8">
        
        {/* Header Ribbon */}
        <header className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-neutral-900 pb-5 select-none">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-sky-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-500/10 tracking-tighter">
              ::s
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-neutral-100 tracking-tight">CSS Selection Laboratory</h1>
                <span className="text-[9px] bg-indigo-950 text-indigo-300 font-extrabold px-2.5 py-1 rounded-full border border-indigo-900/40">UX AUDITOR v3.0</span>
              </div>
              <p className="text-xs text-neutral-400">
                Design, audit, and preview high-retention <span className="font-mono text-sky-450 text-[10px] font-bold">::selection</span> rules that reduce friction and increase brand loyalty.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            {/* Visual feedback indicator */}
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1.5 rounded-full uppercase tracking-widest font-extrabold flex items-center gap-1.5 shadow">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Interactive Audit Active
            </span>
            <button
              onClick={handleRandomize}
              className="flex items-center gap-1.5 text-xs font-bold text-neutral-300 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:text-white px-4 py-2 rounded-xl transition duration-150 cursor-pointer shadow-md"
              title="Generate a random highly premium CSS selection system"
            >
              <RefreshCw className="w-3.5 h-3.5 text-sky-450 animate-spin-slow" />
              <span>Surprise Me</span>
            </button>
          </div>
        </header>

        {/* COMPREHENSIVE UI/UX CRITIQUE AND PROBLEM VS. SOLUTION GRID */}
        <section className="bg-[#0b0c10] border border-neutral-850 rounded-[32px] p-6 sm:p-8 flex flex-col gap-6 relative shadow-2xl overflow-hidden select-none">
          {/* background flares */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-900 pb-5">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] bg-indigo-500/15 text-indigo-400 border border-indigo-500/10 font-black px-2.5 py-1 rounded-full uppercase tracking-widest w-fit">
                Interactive UI/UX Comparison Suite
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-100 tracking-tight">
                Why Selection Highlights Make or Break Your Product
              </h2>
              <p className="text-xs text-neutral-400">
                A simple text highlight is often the most frequent interaction on your site. Don't let default browser styling dilute your hard work.
              </p>
            </div>

            {/* Sweep Control Action Trigger */}
            <button
              onClick={triggerSimulationSwipe}
              disabled={isSwiping}
              className={`flex items-center gap-2 text-xs font-black py-3 px-5 rounded-xl border transition-all duration-300 cursor-pointer ${
                isSwiping 
                  ? "bg-indigo-950/80 border-indigo-500 text-indigo-300 animate-pulse" 
                  : "bg-indigo-600 border-indigo-550 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-200 animate-bounce" />
              <span>{isSwiping ? "Highlighting Screen..." : "Auto-Select Wave Demo"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            
            {/* PROBLEM PANELS: BEFORE (Left Side) */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-[11px] font-extrabold text-red-500 tracking-wider uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  🚨 Before: The Standard Selection Issues
                </span>
                <span className="text-xs font-bold text-neutral-500 bg-red-950/20 text-red-400 border border-red-950/30 px-2.5 py-0.5 rounded-full">
                  Friction Level: Extreme
                </span>
              </div>

              {/* Mock Mac Browser Frame to represent real-world browser default color clashing */}
              <div className="w-full bg-[#16171b] border border-neutral-800 rounded-t-xl px-4 py-2.5 flex items-center gap-2 select-none border-b-0">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/70" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <span className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="bg-[#0f1013] text-[10px] text-neutral-500 rounded px-4 py-1 mx-auto flex-1 max-w-[280px] text-center font-mono truncate">
                  https://myproduct.com/bad-default-ux
                </div>
              </div>

              {/* Sandbox Card with Injected Problem selection rules */}
              <div className="bg-[#0f1014] border border-neutral-850 rounded-b-[24px] p-6 hover:border-neutral-800/80 transition duration-150 flex flex-col gap-4 preview-bad-selection select-text text-selectable cursor-text relative overflow-hidden">
                
                {/* Simulated Glow Overlay mimicking cursor swipe triggers */}
                <AnimatePresence>
                  {(isSwiping || highlightMode === "left") && (
                    <motion.div 
                      initial={{ scaleX: 0, originX: 0 }}
                      animate={{ scaleX: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                      className="absolute inset-0 bg-[#ff0000]/15 pointer-events-none border-l-2 border-red-500"
                    />
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-2 select-none">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                  <span className="text-[10px] font-bold text-red-400 tracking-widest uppercase">UX Flaw #1: Severe Contrast Strain</span>
                </div>

                <h3 className="text-lg font-bold text-neutral-105 tracking-tight leading-snug">
                  Unpolished selection choices leave a cheap, disjointed impression.
                </h3>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  Most developers completely ignore selection style, resulting in either neon bright clashing hues (like the classic pure red-on-green shown under this demo segment) or cold generic default blue highlights that degrade carefully customized color palettes.
                </p>

                {/* Cognitive load checklist diagnostics */}
                <div className="bg-neutral-950/80 rounded-xl border border-neutral-850 overflow-hidden select-none">
                  <div className="p-3 bg-red-950/20 text-red-400 border-b border-neutral-850 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <span>⚠️ Diagnostic Report (Default/Bad Selection)</span>
                  </div>
                  <div className="p-4 space-y-2.5 text-xs text-neutral-400">
                    <div className="flex items-start gap-2.5">
                      <X className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-neutral-200">Eye Strain Quotient:</strong> Extremely High (Pure saturation blocks triggers optical fatigue and sensory discomfort during deep reading sessions).
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 font-sans">
                      <X className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-neutral-200">Brand Fracture:</strong> Highlight colors look entirely uncoordinated, stripping the digital interface of any professional polish.
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <X className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-neutral-200">Contrast Rating:</strong> Fails WCAG 2.1 minimal standard rules completely, blocking readers with accessibility constraints!
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated selection overlay trigger button for X video creators */}
                <div className="p-3 bg-red-950/10 rounded-xl border border-red-950/30 flex items-center justify-between text-[11px] select-none">
                  <span className="text-red-400 font-bold flex items-center gap-1.5">
                    ✕ Failing WCAG Contrast Ratio (0.9:1)
                  </span>
                  <span className="text-neutral-500 italic">Drag to highlight text above 👆</span>
                </div>
              </div>
            </div>

            {/* SOLUTION PANELS: AFTER (Right Side) */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-[11px] font-extrabold text-[#38bdf8] tracking-wider uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                  ✨ After: The Custom selection Solution
                </span>
                <span className="text-xs font-bold text-neutral-500 bg-emerald-950/20 text-emerald-400 border border-emerald-950/30 px-2.5 py-0.5 rounded-full">
                  Friction Level: Perfect AA/AAA
                </span>
              </div>

              {/* Mock Mac Browser Frame representing high-polish selection sandbox */}
              <div className="w-full bg-[#16171b] border border-neutral-800 rounded-t-xl px-4 py-2.5 flex items-center gap-2 select-none border-b-0">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/70" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <span className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="bg-[#0f1013] text-[10px] text-neutral-300 rounded px-4 py-1 mx-auto flex-1 max-w-[280px] text-center font-mono truncate">
                  https://myproduct.com/custom-brand-loyalty
                </div>
              </div>

              {/* Sandbox Card with Injected Custom selection rules */}
              <div className="bg-[#0f1014] border border-neutral-850 rounded-b-[24px] p-6 hover:border-neutral-800/80 transition duration-155 flex flex-col gap-4 preview-good-selection select-text text-selectable cursor-text relative overflow-hidden">
                
                {/* Simulated Glow Overlay mimicking cursor swipe triggers */}
                <AnimatePresence>
                  {(isSwiping || highlightMode === "right") && (
                    <motion.div 
                      initial={{ scaleX: 0, originX: 0 }}
                      animate={{ 
                        scaleX: 1,
                        backgroundColor: `${customBg}20`,
                        borderColor: customBg
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: "easeInOut", delay: 0.8 }}
                      className="absolute inset-0 pointer-events-none border-l-2"
                    />
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-2 select-none">
                  <motion.span 
                    className="w-2.5 h-2.5 rounded-full animate-bounce"
                    animate={{ backgroundColor: customBg }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  />
                  <motion.span 
                    className="text-[10px] font-bold tracking-widest uppercase"
                    animate={{ color: customBg }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  >
                    UX Triumph: Seamless Experience
                  </motion.span>
                </div>

                <h3 className="text-lg font-bold text-neutral-100 tracking-tight leading-snug">
                  Polished micro-states reinforce premium brand fidelity and focus.
                </h3>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  By matching your selection highlight to your product's custom accent colors, you keep users immersed. The text stays perfectly comfortable to read, contrast is preserved, and the experience feels incredibly sleek.
                </p>

                {/* Cognitive load checklist diagnostics for success state */}
                <div className="bg-neutral-950/80 rounded-xl border border-neutral-850 overflow-hidden select-none">
                  <div className="p-3 bg-indigo-950/20 text-indigo-400 border-b border-neutral-850 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <span>✨ Diagnostic Report (Customized / Pro Selection)</span>
                  </div>
                  <div className="p-4 space-y-2.5 text-xs text-neutral-400">
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-neutral-200">Eye-Strain Quotient:</strong> Extremely Low (Smooth tone-on-tone highlights reduce visual noise and encourage long-form documentation reading).
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-neutral-200">Brand Fidelity:</strong> Perfect alignment. The color accent seamlessly matches your chosen brand vibe (Current Preset: <span className="font-semibold text-neutral-300">{selectedAccent.name}</span>).
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-neutral-200">Contrast Rating:</strong> Meets or exceeds critical web accessibility directives, maintaining superb legibility at {contrastRatio.toFixed(1)}:1 contrast.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated selection overlay trigger button for X video creators */}
                <motion.div 
                  className="p-3 rounded-xl border flex items-center justify-between text-[11px] select-none"
                  animate={{ 
                    backgroundColor: `${customBg}0a`, 
                    borderColor: `${customBg}30` 
                  }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                  <motion.span 
                    className="font-bold flex items-center gap-1.5"
                    animate={{ color: customBg }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  >
                    ✓ Perfect WCAG Ratio ({contrastRatio.toFixed(1)}:1)
                  </motion.span>
                  <span className="text-neutral-500 italic">Drag to highlight text above 👆</span>
                </motion.div>
              </div>
            </div>

          </div>

          {/* REAL WORLD EXAMPLES: CHOOSE YOUR PRODUCT FLAVOR */}
          <div className="border-t border-neutral-900 pt-6 mt-2">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4 flex items-center gap-2 select-none">
              <Layers className="w-4 h-4 text-indigo-400" />
              Interactive Device Mockups: Test across 4 Premium Web Environments
            </h3>

            {/* Grid of contextual web app screenshots styled in pure CSS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Context 1: Minimalist SaaS Dashboard (Linear Style) */}
              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-900 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-indigo-950 text-indigo-300 font-bold px-2 py-0.5 rounded border border-indigo-900/40">SaaS App</span>
                  <span className="text-[9px] text-neutral-550">Linear Vibe</span>
                </div>
                <div className="p-3 bg-neutral-900 rounded-xl select-all preview-good-selection cursor-text border border-neutral-850">
                  <span className="text-[10px] font-mono text-neutral-500 block mb-1">Issue #1480</span>
                  <h4 className="text-xs font-bold text-neutral-200 mb-1">Refactor selection engine</h4>
                  <p className="text-[11px] text-neutral-400 leading-normal max-w-full truncate">
                    Double-click or drag this line to see SaaS selection.
                  </p>
                </div>
              </div>

              {/* Context 2: Luxury Editorial Journal (Medium/Substack Style) */}
              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-900 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-amber-950 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-900/40">Editorial</span>
                  <span className="text-[9px] text-neutral-550">Notion Sand</span>
                </div>
                <div className="p-3 bg-neutral-900 rounded-xl select-all preview-good-selection cursor-text border border-neutral-850">
                  <span className="text-[10px] font-serif italic text-amber-400 block mb-1">Weekly Essay</span>
                  <p className="text-xs font-bold text-neutral-200 mb-1 font-serif">The art of typographic texture</p>
                  <p className="text-[11px] text-neutral-400 font-serif leading-normal truncate">
                    Drag text to check sand highlights.
                  </p>
                </div>
              </div>

              {/* Context 3: Real Developer Documentation (Vercel/Supa Vibe) */}
              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-900 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-900/40">Developer Docs</span>
                  <span className="text-[9px] text-neutral-550">Supa/Teal Vibe</span>
                </div>
                <div className="p-3 bg-neutral-900 rounded-xl select-all preview-good-selection cursor-text border border-neutral-850 font-mono">
                  <span className="text-[10px] text-neutral-600 block mb-1">$ npx run production</span>
                  <code className="text-[11px] text-emerald-400 block truncate">
                    git commit -m "custom select style"
                  </code>
                </div>
              </div>

              {/* Context 4: Minimalist Fine-Art Online Checkout Shop */}
              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-900 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-rose-950 text-rose-300 font-bold px-2 py-0.5 rounded border border-rose-900/40">E-Commerce</span>
                  <span className="text-[9px] text-neutral-550">Cream/Rose Vibe</span>
                </div>
                <div className="p-3 bg-neutral-900 rounded-xl select-all preview-good-selection cursor-text border border-neutral-850">
                  <h4 className="text-xs font-bold text-neutral-200">The Minimalist Chair</h4>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[11px] text-neutral-400 font-bold">$799.00 USD</span>
                    <span className="text-[10px] text-rose-300">In Stock</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Quick interactive checklist tips */}
          <div className="bg-neutral-950/60 p-3.5 rounded-2xl border border-neutral-850 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 select-none gap-3">
            <span className="flex items-center gap-2 font-medium">
              <span className="p-1 bg-amber-500/10 text-amber-400 rounded-md">💡</span>
              <span>Double-click words or drag-select text inside the mockup cards to preview highlight rules instantly with your mouse.</span>
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => setHighlightMode(highlightMode === "left" ? "none" : "left")}
                className={`py-1.5 px-3 rounded-lg border text-[11px] font-bold transition-all ${
                  highlightMode === "left" ? "bg-red-950/45 border-red-500/60 text-red-400" : "bg-neutral-905 border-neutral-800 hover:border-neutral-700 hover:text-white"
                }`}
              >
                Simulate Bad Highlight
              </button>
              <button
                onClick={() => setHighlightMode(highlightMode === "right" ? "none" : "right")}
                className={`py-1.5 px-3 rounded-lg border text-[11px] font-bold transition-all ${
                  highlightMode === "right" ? "bg-indigo-950/45 border-indigo-550 text-indigo-400" : "bg-neutral-905 border-neutral-800 hover:border-neutral-700 hover:text-white"
                }`}
              >
                Simulate Pro Highlight
              </button>
            </div>
          </div>
        </section>

        {/* Central Dashboard Matrix splits recreation workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMN 1: THE X SOCIAL POST RECREATION (Takes 5 columns) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center justify-between px-1 select-none">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                Recreated Content Frame
              </span>
              <span className="text-xs text-neutral-500 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Matches IMG_6022.jpg
              </span>
            </div>

            {/* Micro-Interaction Twitter/X Canvas */}
            <div className="w-full bg-[#0a0b0d] border border-neutral-800/80 rounded-[28px] p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col">
              
              {/* Creator details row */}
              <div className="flex items-start justify-between mb-4.5 select-none">
                <div className="flex items-start gap-3.5">
                  <div className="relative">
                    {/* Creators matching original styling but polished */}
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-sky-400 via-indigo-500 to-rose-500 flex items-center justify-center text-white font-extrabold text-base shadow-inner">
                      DB
                    </div>
                    {/* verified badge status blue circle check */}
                    <div className="absolute -bottom-1 -right-1 bg-sky-500 rounded-full p-0.5 border-2 border-[#0a0b0d] flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-white" strokeWidth="3" stroke="white">
                        <path d="M9 16.17l-4.17-4.17-1.42 1.41 5.59 5.59 12-12-1.41-1.41z"/>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-[15px] text-neutral-200 block leading-tight hover:underline cursor-pointer">
                      Dmitry Bezvergiy
                    </span>
                    <span className="text-xs text-neutral-500 block leading-normal mt-0.5">
                      @dmitrybezvergiy • Web Artisan
                    </span>
                  </div>
                </div>

                <div className="text-neutral-500 hover:text-neutral-300 cursor-pointer">
                  <span className="text-lg">•••</span>
                </div>
              </div>

              {/* Exact post copy from image (Completely selectable) */}
              <div className="text-neutral-200 text-[18px] sm:text-[19px] tracking-tight font-medium leading-[1.48] mb-6 space-y-4 selectable-text">
                <p>
                  browser default text selection colors often suck! And every browser handles them differently.
                </p>
                <p>
                  using <code className="font-mono text-[16px] bg-[#1e2025] px-1.5 py-0.5 rounded border border-neutral-800 text-neutral-200 leading-none">::selection</code> CSS pseudo-element to set a custom highlight color based on your design system should be the standard for web interfaces.
                </p>
              </div>

              {/* Advanced Studio Recorder Control HUD */}
              <div className="bg-neutral-950/90 border border-neutral-850 p-4.5 rounded-[22px] mb-4.5 flex flex-col gap-4 select-none">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 font-black px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    Studio X Recording HUD
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-extrabold uppercase font-mono">
                      1000x BETTER
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column Controls */}
                  <div className="flex flex-col gap-3">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[11px] text-neutral-400 font-bold flex items-center gap-1">
                          Scale Multiplier: <span className="text-indigo-400 font-extrabold font-mono text-xs">{(recCardScale).toFixed(2)}x</span>
                        </label>
                        <button 
                          onClick={() => setRecCardScale(1.8)}
                          className="text-[9px] text-neutral-500 hover:text-neutral-350 underline"
                        >
                          Max Rec
                        </button>
                      </div>
                      <input 
                        type="range"
                        min="1.0"
                        max="2.5"
                        step="0.1"
                        value={recCardScale}
                        onChange={(e) => setRecCardScale(parseFloat(e.target.value))}
                        className="w-full h-1.5 rounded-lg bg-neutral-900 border border-neutral-800 accent-indigo-500 cursor-ew-resize appearance-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-neutral-400 font-bold block mb-1.5">
                        Edit Selected Phrase (Live Preview):
                      </label>
                      <input 
                        type="text"
                        value={recTextToShow}
                        onChange={(e) => setRecTextToShow(e.target.value)}
                        placeholder="Type recording text..."
                        className="w-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-100 rounded-xl px-3 py-2 font-medium focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Right Column Controls */}
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-[11px] text-neutral-400 font-bold block mb-1.5">
                        Canvas Theme Preset:
                      </label>
                      <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                        {[
                          { id: "clean-light", name: "Clean Minimalist" },
                          { id: "vintage-sand", name: "Editorial Sand" },
                          { id: "slate-dark", name: "Cold Corporate Slate" },
                          { id: "obsidian-black", name: "Cyber Obsidian" }
                        ].map((theme) => (
                          <button
                            key={theme.id}
                            onClick={() => setRecCardTheme(theme.id)}
                            className={`py-1.5 px-2 rounded-lg border font-bold text-center transition-all ${
                              recCardTheme === theme.id 
                                ? "bg-indigo-600 border-indigo-500 text-white shadow-sm"
                                : "bg-neutral-900 border-neutral-850 text-neutral-400 hover:text-white"
                            }`}
                          >
                            {theme.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-neutral-900/50 rounded-xl border border-neutral-850 mt-1">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-neutral-300">UX Critique Visual Pins</span>
                        <span className="text-[9px] text-neutral-500">Show issues & solutions annotations</span>
                      </div>
                      <button
                        onClick={() => setShowUXAudits(!showUXAudits)}
                        className={`w-9 h-5 rounded-full p-0.5 transition-all outline-none ${
                          showUXAudits ? "bg-emerald-500" : "bg-neutral-800"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-all shadow-sm ${
                          showUXAudits ? "translate-x-4" : "translate-x-0"
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Additional Quick Settings inputs */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-900">
                  <div>
                    <label className="text-[10px] text-neutral-500 font-bold block mb-1">Custom Tag:</label>
                    <input 
                      type="text"
                      value={recLabelText}
                      onChange={(e) => setRecLabelText(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <button
                      onClick={() => {
                        setRecCardScale(1.6);
                        setRecTextToShow("the quick brown fox");
                        setRecCardTheme("clean-light");
                        setShowUXAudits(true);
                      }}
                      className="text-[10px] text-indigo-400 font-bold border border-indigo-950 hover:bg-indigo-950/20 py-2 px-3 rounded-lg transition"
                    >
                      Reset Recording Views
                    </button>
                  </div>
                </div>
              </div>

              {/* The Original Centered Display Card Frame */}
              <div 
                className={`${
                  recCardTheme === "clean-light" ? "bg-[#f0f3ff] text-neutral-800" :
                  recCardTheme === "vintage-sand" ? "bg-[#faf6ee] text-[#1e1e24]" :
                  recCardTheme === "slate-dark" ? "bg-[#16171b] border border-neutral-800 text-[#f3f4f6]" :
                  "bg-[#09090b] border border-[#27272a] text-neutral-105"
                } rounded-[28px] transition-all duration-300 flex flex-col items-center gap-6 relative shadow-inner overflow-hidden select-text`}
                style={{
                  padding: `${Math.max(12, (isMobile ? Math.min(1.1, recCardScale) : recCardScale) * 14)}px ${Math.max(14, (isMobile ? Math.min(1.1, recCardScale) : recCardScale) * 22)}px`
                }}
              >
                
                {/* Simulated Mouse overlay pointer to mirror the image screenshot exactly */}
                <div className="absolute -bottom-1 left-24 sm:left-32 pointer-events-none select-none z-20">
                  <div className="flex flex-col items-center gap-1 bg-[#111216]/95 backdrop-blur text-[9px] font-bold text-white py-1 px-2 rounded-full border border-neutral-800 shadow-md">
                    <span>Double-Click/Drag Text 👇</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between w-full gap-5 relative z-10">
                  
                  {/* Left Bad Selection column */}
                  <div className="flex-1 flex flex-col items-center gap-3 relative w-full">
                    
                    {/* Responsive UI/UX critique display (absolute on desktop, inline block on mobile) */}
                    {showUXAudits && (
                      <>
                        <div className="hidden sm:block absolute -top-3.5 -left-1 z-20 bg-rose-950 border border-rose-800/80 rounded-lg p-2 max-w-[190px] shadow-lg pointer-events-none text-[9px] text-rose-300 font-medium select-none">
                          <div className="flex items-center gap-1 mb-1 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            <span>🚨 UX CRITIQUE ISSUE</span>
                          </div>
                          Fails WCAG AA standard contrast ratio completely. The neon glow causes reading fatigue and destroys visual cohesion.
                        </div>
                        <div className="block sm:hidden w-full bg-rose-950/90 border border-rose-900/60 rounded-xl p-3 text-[10px] text-rose-300 font-medium select-none">
                          <div className="flex items-center gap-1.5 mb-1 font-extrabold text-rose-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            <span>🚨 UX CRITIQUE ISSUE</span>
                          </div>
                          Fails WCAG AA standard contrast ratio completely. Neon glow destroys legibility.
                        </div>
                      </>
                    )}

                    <div 
                      onMouseDown={handlePreviewMouseDown}
                      onMouseUp={(e) => handlePreviewMouseUp("left", e)}
                      style={{
                        fontSize: `${(isMobile ? Math.min(1.1, recCardScale) : recCardScale) * 15}px`,
                        padding: `${(isMobile ? Math.min(1.1, recCardScale) : recCardScale) * 12}px ${(isMobile ? Math.min(1.1, recCardScale) : recCardScale) * 8}px`,
                      }}
                      className="bg-white border border-[#e2e8f0] hover:border-red-300 rounded-[24px] w-full text-center text-[#1e293b] font-black tracking-tight shadow-md cursor-text relative overflow-hidden select-text selectable-text preview-bad-selection"
                      title="Simulates bad contrast defaults shown on Left side"
                    >
                      <span className="relative z-10">{recTextToShow}</span>

                      {/* Forced state simulator */}
                      <AnimatePresence>
                        {highlightMode === "left" && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#ff0000] text-[#00ff00] flex items-center justify-center font-black z-0 px-2 line-clamp-1 pointer-events-none select-none"
                          >
                            {recTextToShow}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Red failure icon and subtitle */}
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setHighlightMode("left")}
                        className={`w-7 h-7 rounded-full bg-[#ef4444] text-white flex items-center justify-center text-[11px] font-bold shadow transition hover:scale-105 active:scale-95 ${
                          highlightMode === "left" ? "outline outline-4 outline-red-200" : ""
                        }`}
                      >
                        ✕
                      </button>
                      <span className="text-[10px] font-extrabold text-rose-500 uppercase tracking-widest">
                        Browser Default
                      </span>
                    </div>
                  </div>

                  {/* Right Good Custom color selection column */}
                  <div className="flex-1 flex flex-col items-center gap-3 relative w-full">

                    {/* Responsive UI/UX solution display (absolute on desktop, inline block on mobile) */}
                    {showUXAudits && (
                      <>
                        <div className="hidden sm:block absolute -top-3.5 -right-1 z-20 bg-emerald-950 border border-emerald-800/80 rounded-lg p-2 max-w-[190px] shadow-lg pointer-events-none text-[9px] text-emerald-300 font-medium select-none">
                          <div className="flex items-center gap-1 mb-1 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                            <span>✅ DYNAMIC SOLUTION</span>
                          </div>
                          Automatic accessibility compliance ({contrastRatio.toFixed(1)}:1). Retains brand atmosphere perfectly.
                        </div>
                        <div className="block sm:hidden w-full bg-emerald-950/90 border border-emerald-900/60 rounded-xl p-3 text-[10px] text-emerald-300 font-medium select-none">
                          <div className="flex items-center gap-1.5 mb-1 font-extrabold text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                            <span>✅ DYNAMIC SOLUTION</span>
                          </div>
                          Enforces 4.5:1 minimum and preserves brand theme.
                        </div>
                      </>
                    )}

                    <div 
                      onMouseDown={handlePreviewMouseDown}
                      onMouseUp={(e) => handlePreviewMouseUp("right", e)}
                      style={{
                        fontSize: `${(isMobile ? Math.min(1.1, recCardScale) : recCardScale) * 15}px`,
                        padding: `${(isMobile ? Math.min(1.1, recCardScale) : recCardScale) * 12}px ${(isMobile ? Math.min(1.1, recCardScale) : recCardScale) * 8}px`,
                      }}
                      className="bg-white border border-[#e2e8f0] hover:border-indigo-300 rounded-[24px] w-full text-center text-[#1e293b] font-black tracking-tight shadow-md cursor-text relative overflow-hidden select-text selectable-text preview-good-selection"
                      title="See your custom selection visual update live"
                    >
                      <span className="relative z-10">{recTextToShow}</span>

                      {/* Custom themed simulator */}
                      <AnimatePresence>
                        {highlightMode === "right" && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, backgroundColor: customBg, color: customText }}
                            exit={{ opacity: 0 }}
                            transition={{ 
                              opacity: { duration: 0.15 },
                              backgroundColor: { duration: 0.35, ease: "easeInOut" },
                              color: { duration: 0.35, ease: "easeInOut" }
                            }}
                            className="absolute inset-0 flex items-center justify-center font-black z-0 px-2 line-clamp-1 pointer-events-none select-none"
                          >
                            {recTextToShow}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Blue check icon and custom designer status tag */}
                    <div className="flex items-center gap-2 select-none">
                      <motion.button 
                        onClick={() => setHighlightMode("right")}
                        className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-[12px] font-bold shadow hover:scale-105 active:scale-95 outline-none focus:outline-none cursor-pointer ${
                          highlightMode === "right" ? "outline outline-3 outline-emerald-200 animate-pulse" : ""
                        }`}
                        animate={{ backgroundColor: customBg, color: customText }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                      >
                        ✓
                      </motion.button>
                      <motion.span 
                        animate={{ color: customBg }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="text-[10px] font-black uppercase tracking-widest animate-[pulse_3s_infinite]"
                      >
                        {recLabelText}
                      </motion.span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Fake Interactive Post statistics counter */}
              <div className="flex items-center justify-between text-neutral-500 text-[13px] font-medium pt-4 mt-5 border-t border-neutral-900 select-none">
                <span className="hover:text-neutral-300 transition-colors flex items-center gap-1 cursor-pointer">
                  💬 42 comments
                </span>
                <span className="hover:text-indigo-400 transition-colors flex items-center gap-1 cursor-pointer">
                  🔄 185 reposts
                </span>
                <span className="text-[#f43f5e] font-semibold flex items-center gap-1.5 cursor-pointer">
                  ❤️ 3,429 likes
                </span>
                <span className="hover:text-neutral-300 transition-colors flex items-center gap-1 cursor-pointer">
                  🔖 392 saves
                </span>
              </div>
            </div>

            {/* ACCESSIBILITY & CONTRAST SCORE ANALYZER (A Twitter gold mine logic) */}
            <div className="w-full bg-[#111216] border border-neutral-800/80 rounded-2xl p-4 shadow-lg flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-400" />
                  Live Accessibility Score Card
                </span>
                <span className="text-[10px] font-mono text-neutral-500">WCAG Ratio Standard</span>
              </div>

              {/* Contrast Bar visual chart */}
              <div className="flex items-center justify-between p-3.5 bg-neutral-950/80 rounded-xl border border-neutral-850">
                <div className="flex flex-col">
                  <span className={`text-base font-extrabold ${contrastStatus.isGood ? "text-emerald-400" : "text-amber-400"}`}>
                    {contrastRatio.toFixed(2)} : 1
                  </span>
                  <span className="text-[10px] text-neutral-500">{contrastStatus.badge}</span>
                </div>

                <div className={`text-xs font-bold px-3 py-1.5 rounded-lg border uppercase tracking-wider ${contrastStatus.colorClass}`}>
                  {contrastStatus.score}
                </div>
              </div>

              <div className="text-[11px] text-neutral-500 leading-normal">
                {contrastStatus.isGood ? (
                  <span className="text-emerald-500/90 font-medium">✨ Splendid palette contrast! Selectable layers are easy and comforting to read. Truly pixel perfect.</span>
                ) : (
                  <span className="text-amber-400 font-medium">⚠️ Low contrast score detected. Readers with light-sensitivity might strain during selection. Pick high-contrast combinations.</span>
                )}
              </div>

              {/* Contrast Auto-Fixer Controls */}
              <div className="border-t border-neutral-850/60 pt-3 mt-1 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-neutral-450 uppercase font-black tracking-wider flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-sky-450" /> Tool: Contrast Optimizer
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer text-[11px] text-neutral-400 hover:text-neutral-250 select-none">
                    <input
                      type="checkbox"
                      checked={autoFixEnabled}
                      onChange={(e) => setAutoFixEnabled(e.target.checked)}
                      className="rounded border-neutral-800 bg-neutral-950 text-indigo-600 focus:ring-0 cursor-pointer w-3.5 h-3.5"
                    />
                    <span>Auto-fix on BG change</span>
                  </label>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleAutoFix}
                    disabled={isAutoFixing}
                    className={`flex-1 text-xs font-bold py-2 px-3.5 rounded-xl border transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                      contrastRatio >= 4.5
                        ? "bg-emerald-950/25 border-emerald-900/60 text-emerald-400 hover:bg-emerald-950/40"
                        : "bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/10"
                    }`}
                  >
                    {isAutoFixing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-300" />
                        <span>Optimizing Colors...</span>
                      </>
                    ) : contrastRatio >= 4.5 ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Meets AA Standards (Safe)</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-bounce" />
                        <span>Auto-Fix Contrast (to 4.5:1)</span>
                      </>
                    )}
                  </button>

                  {/* Reset colors option when custom values differ from selected default preset values */}
                  {selectedAccent.id !== "custom" && (customText !== selectedAccent.textColor || customBg !== selectedAccent.bgColor) && (
                    <button
                      onClick={() => {
                        setCustomText(selectedAccent.textColor);
                        setCustomBg(selectedAccent.bgColor);
                      }}
                      className="px-3 py-2 bg-neutral-900 hover:bg-neutral-850 hover:text-white border border-neutral-800 rounded-xl text-neutral-400 text-xs font-bold transition duration-150 cursor-pointer"
                      title="Reset colors to preset defaults"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: CUSTOMIZER WORKBENCH & VIRAL BUILDER (Takes 7 columns) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Design Presets Panel */}
            <div className="bg-[#111216] border border-neutral-800/80 rounded-[24px] p-6 shadow-xl flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-sky-400" />
                  <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-widest leading-none">
                    Select Designer Presets
                  </h3>
                </div>
                <span className="text-[10px] text-neutral-500">Pick a brand atmosphere</span>
              </div>

              {/* Grid of beautifully configured palettes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {VISUAL_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-4 rounded-xl text-left border transition-all duration-200 flex flex-col justify-between h-28 cursor-pointer relative group overflow-hidden ${
                      selectedAccent.id === preset.id
                        ? "bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20"
                        : "bg-neutral-900/40 border-neutral-800/80 hover:bg-neutral-900/80 hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className="font-bold text-xs text-neutral-200 transition-colors group-hover:text-white">
                        {preset.name}
                      </span>
                      <span className="text-[9px] font-medium bg-neutral-950 border border-neutral-800 px-1.5 py-0.5 rounded text-neutral-400">
                        {preset.label}
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-400 leading-normal line-clamp-2 mt-1">
                      {preset.context}
                    </p>

                    <div className="flex items-center justify-between w-full mt-auto pt-1 select-none">
                      <span className="text-[10px] text-neutral-500 italic">By {preset.designer}</span>
                      
                      {/* Round visual colors preview */}
                      <div className="flex items-center gap-1 p-0.5 bg-neutral-950 rounded border border-neutral-800">
                        <span className="w-3.5 h-3.5 rounded" style={{ backgroundColor: preset.bgColor }} />
                        <span className="w-3.5 h-3.5 rounded" style={{ backgroundColor: preset.textColor }} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Color Hex Input Tuners for direct precise customization */}
              <div className="border-t border-neutral-850/60 pt-4 flex flex-col gap-4">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Precise Fine Tuner Setup
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-neutral-400 font-bold block mb-1.5 flex justify-between">
                      <span>Selection Background</span>
                      <span className="font-mono text-indigo-400 text-[10px]">{customBg}</span>
                    </label>
                    <div className="flex gap-2.5 items-center bg-neutral-950 p-2.5 border border-neutral-800/80 rounded-xl">
                      <input
                        type="color"
                        value={customBg}
                        onChange={(e) => handleCustomColorInput("bg", e.target.value)}
                        className="w-7 h-7 rounded-md cursor-pointer bg-transparent border-0 outline-none p-0 flex-shrink-0"
                      />
                      <input
                        type="text"
                        value={customBg}
                        onChange={(e) => handleCustomColorInput("bg", e.target.value)}
                        className="flex-1 bg-transparent border-0 text-xs font-mono text-neutral-200 uppercase outline-none"
                        maxLength={7}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-neutral-400 font-bold block mb-1.5 flex justify-between">
                      <span>Selection Text Color</span>
                      <span className="font-mono text-indigo-400 text-[10px]">{customText}</span>
                    </label>
                    <div className="flex gap-2.5 items-center bg-neutral-950 p-2.5 border border-neutral-800/80 rounded-xl">
                      <input
                        type="color"
                        value={customText}
                        onChange={(e) => handleCustomColorInput("text", e.target.value)}
                        className="w-7 h-7 rounded-md cursor-pointer bg-transparent border-0 outline-none p-0 flex-shrink-0"
                      />
                      <input
                        type="text"
                        value={customText}
                        onChange={(e) => handleCustomColorInput("text", e.target.value)}
                        className="flex-1 bg-transparent border-0 text-xs font-mono text-neutral-200 uppercase outline-none"
                        maxLength={7}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic CSS Code Output block */}
            <div className="bg-[#111216] border border-neutral-800/80 rounded-[24px] p-6 shadow-xl flex flex-col gap-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  Your Copyable CSS Rule
                </span>
                
                <button
                  onClick={copyCodeToClipboard}
                  className="flex items-center gap-1.5 text-xs font-extrabold px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 hover:text-white transition-all cursor-pointer"
                >
                  {copyCodeSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-450 font-bold">Successfully Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-sky-400" />
                      <span>Copy CSS Code</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 bg-neutral-950 rounded-xl overflow-x-auto text-[11px] sm:text-xs font-mono text-[#38bdf8] leading-relaxed border border-neutral-850 select-text">
                <code>{cssCodeSnippet}</code>
              </pre>
            </div>

            {/* VIRAL GO-TO CARD GENERATOR FOR DESIGN TWITTER (X) */}
            <div className="bg-gradient-to-br from-[#1d9bf0]/10 to-[#000000]/30 border border-[#1d9bf0]/20 rounded-[24px] p-6 shadow-xl flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#1d9bf0]/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-[#1d9bf0]" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1d9bf0] uppercase tracking-widest leading-none">
                      Viral X Booster Copy Draft
                    </h4>
                    <p className="text-[10px] text-neutral-400 mt-1">Pre-formatted marketing hook ready for high traction</p>
                  </div>
                </div>

                <button
                  onClick={copyTweetToClipboard}
                  className="flex items-center gap-1.5 text-xs font-extrabold px-3.5 py-1.5 bg-[#1d9bf0] text-white hover:bg-[#1a8cd8] rounded-xl transition duration-150 cursor-pointer shadow-lg shadow-[#1d9bf0]/20 flex-shrink-0"
                >
                  {copyTweetSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Copied Draft!</span>
                    </>
                  ) : (
                    <>
                      <Flame className="w-3.5 h-3.5 text-amber-200 fill-amber-300" />
                      <span>Copy Post Draft</span>
                    </>
                  )}
                </button>
              </div>

              {/* Ready-made tweet preview */}
              <div className="p-4 bg-black/40 rounded-xl border border-[#1d9bf0]/10 max-h-[140px] overflow-y-auto font-sans text-xs text-neutral-300 whitespace-pre-line leading-relaxed select-text">
                {xTweetText}
              </div>

              <div className="text-[10px] text-[#1d9bf0] font-semibold flex items-center gap-1 px-1">
                <span>⚡ Tip:</span>
                <span className="text-neutral-400 font-normal">Copy this post, paste it on X along with a video/image of your interactive selection simulation to secure high engagement!</span>
              </div>
            </div>

            {/* Sandbox Playground Text Box */}
            <div className="bg-[#111216] border border-neutral-800/80 rounded-[24px] p-6 shadow-xl flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-widest leading-none">
                  Custom Sandbox Canvas
                </span>
                <span className="text-[10px] text-neutral-500 font-medium ml-auto">Interactive highlight trial</span>
              </div>

              {/* Sample Sandbox Area container which is style-scoped directly */}
              <div className="sandbox-wrapper bg-white border border-[#e2e8f0] rounded-2xl p-5 text-[#1e293b] select-text selectable-text preview-good-selection shadow-inner">
                <p className="text-[14px] leading-relaxed font-medium transition-colors duration-150 mb-4 font-sans text-neutral-800">
                  {sandboxText}
                </p>

                <div className="flex items-center gap-2 bg-[#f8fafc] border border-[#e2e8f0] p-1.5 rounded-lg">
                  <span className="text-[10px] font-bold text-neutral-400 select-none px-1">Type sandbox text:</span>
                  <input
                    type="text"
                    value={sandboxText}
                    onChange={(e) => setSandboxText(e.target.value)}
                    className="flex-1 bg-white border border-[#cbd5e1] rounded-md px-2.5 py-1 text-xs text-[#334155] font-medium outline-none focus:border-indigo-400"
                    placeholder="Provide sandbox layout preview copy..."
                  />
                </div>
              </div>

              <div className="text-[10px] text-neutral-500 px-1 leading-normal">
                Double click or select text segments in either container to dynamically experience custom text highlights using mouse cursor or touchscreen dragging.
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <footer className="border-t border-neutral-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-600 gap-4 select-none">
          <p>© 2026 CSS Selection Workbench. Specially crafted for pixel-perfect social designers.</p>
          <div className="flex items-center gap-1">
            <span>Crafted in Cloud Run Sandbox</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-1" />
          </div>
        </footer>

      </div>
    </div>
  );
}
