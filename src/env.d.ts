/// <reference types="astro/client" />
import type Lenis from 'lenis';

declare global {
  interface Window {
    /** Smooth scroll instance (src/scripts/animations.js); absent with reduced motion */
    lenis?: Lenis;
    /** Set by src/scripts/consent.ts once the "tickets" category is accepted */
    __ticketsConsent?: boolean;
    showCookiePreferences?: () => void;
    enableTickets?: () => void;
  }
}

export {};
