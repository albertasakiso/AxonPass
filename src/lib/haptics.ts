/* ===================================================================
   APILIGU LEARNING PASS — Haptics Utility
   Provides subtle tactile haptic vibration feedback for touch devices.
   Safe fallback for non-supporting browsers and desktop.
   =================================================================== */

export function triggerHaptic(pattern: number | number[] = 10): void {
  try {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    // Silently ignore if unsupported or blocked by user gesture policy
  }
}

export function triggerSuccessHaptic(): void {
  triggerHaptic([15, 30, 20]);
}

export function triggerErrorHaptic(): void {
  triggerHaptic([30, 40, 30]);
}
