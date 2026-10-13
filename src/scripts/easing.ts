// The house easing (--ease-soft in src/styles/global.css) for scripts that
// cannot read CSS: Motion wants the four numbers, the Web Animations API the string.
export const EASE_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_SOFT_CSS = `cubic-bezier(${EASE_SOFT.join(', ')})`;
