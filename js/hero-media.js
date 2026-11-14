/* Hero background video: plays only when it is allowed and available.
   If there is no images/hero.mp4 / hero.webm, the dental photo simply stays. */
(function () {
    const v = document.getElementById('heroVideo');
    if (!v) return;

    const conn = navigator.connection || {};
    const slow = conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (slow || reduce) { v.remove(); return; }

    v.muted = true;                       // required for autoplay on phones
    v.addEventListener('playing', () => v.classList.add('playing'));
    v.preload = 'auto';
    v.load();
    const start = () => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
    v.addEventListener('canplay', start, { once: true });

    /* pause while the hero is off screen (saves battery and data) */
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(es => {
            es.forEach(e => {
                if (!v.classList.contains('playing') && !v.readyState) return;
                if (e.isIntersecting) start(); else v.pause();
            });
        }, { threshold: 0.05 }).observe(document.getElementById('home'));
    }
})();
