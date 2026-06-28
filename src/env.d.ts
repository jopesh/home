/// <reference path="../.astro/types.d.ts" />

declare global {
  interface Window {
    /**
     * Resolves and applies the active theme (light/dark `class` on `<html>`).
     * Defined by the inline no-flash script in `base-head.astro` so the theme
     * picker can trigger it without duplicating the resolution logic.
     */
    applyTheme?: () => void;
  }
}

export {};
