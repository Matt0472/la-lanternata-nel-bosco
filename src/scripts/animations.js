import { animate, inView, scroll } from 'motion';
import Lenis from 'lenis';
import { EASE_SOFT as EASE } from './easing';

// Marks the html: only with JS running do [data-animate] elements start hidden (see global.css)
document.documentElement.classList.add('js');

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const VARIANTS = {
  'fade-up': { opacity: [0, 1], y: [36, 0] },
  'fade-in': { opacity: [0, 1] },
  'fade-left': { opacity: [0, 1], x: [-36, 0] },
  'fade-right': { opacity: [0, 1], x: [36, 0] },
  'scale-in': { opacity: [0, 1], scale: [0.94, 1] },
};

// In-page jumps move focus too, not only the viewport (A11Y-05, A11Y-06): the
// next Tab starts from where the reader landed.
const focusTarget = (target) => {
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
};

if (!reduced) {
  // Smooth scroll with inertia (Lenis). On touch the native scroll stays: it is
  // already smooth and must never be hijacked.
  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => 1 - Math.pow(1 - t, 3.5),
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  window.lenis = lenis;

  // Anchor links go through Lenis, landing below the fixed header: the same
  // offset as the CSS scroll-padding-top, read from there
  const headerOffset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 80;
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const hash = a.getAttribute('href');
      const target = hash.length > 1 && document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -headerOffset });
      history.pushState(null, '', hash);
      focusTarget(target);
    });
  });

  // Reveal on scroll: each [data-animate] enters when it reaches the viewport.
  // data-animate="fade-up|fade-in|..." · data-delay="0.15" for a manual stagger.
  inView(
    '[data-animate]',
    (el) => {
      const variant = VARIANTS[el.dataset.animate] ?? VARIANTS['fade-up'];
      const delay = parseFloat(el.dataset.delay ?? '0');
      const duration = parseFloat(el.dataset.duration ?? '0.8');
      animate(el, variant, { duration, delay, ease: EASE });
    },
    { amount: 0.25 }
  );

  // Automatic stagger: the direct children of [data-animate-group] enter in sequence.
  inView(
    '[data-animate-group]',
    (group) => {
      animate(Array.from(group.children), VARIANTS['fade-up'], { duration: 0.7, delay: (i) => i * 0.12, ease: EASE });
    },
    { amount: 0.15 }
  );

  // Keyboard focus may land on an element still fading in: its entrance is
  // finished at once, so what has focus is always fully visible
  document.addEventListener('focusin', (e) => {
    const el = e.target instanceof Element && e.target.closest('[data-animate], [data-animate-group] > *');
    if (!el) return;
    const finish = () => el.getAnimations().forEach((a) => a.finish());
    finish();
    // the focus may also have scrolled it into view, starting the entrance now
    setTimeout(finish, 60);
  });

  // Gentle parallax: [data-parallax] moves vertically with the scroll.
  // data-parallax="60" = range in px (default 48).
  document.querySelectorAll('[data-parallax]').forEach((el) => {
    const range = parseFloat(el.dataset.parallax || '48');
    scroll(animate(el, { y: [range, -range] }, { ease: 'linear' }), {
      target: el,
      offset: ['start end', 'end start'],
    });
  });
} else {
  // Without Lenis the browser scrolls on its own; focus still follows the jump
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', () => {
      const hash = a.getAttribute('href');
      const target = hash.length > 1 && document.querySelector(hash);
      if (target) focusTarget(target);
    });
  });
}
