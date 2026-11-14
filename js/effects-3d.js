/* 3D tilt, scroll flip-in and floating-shape parallax */
document.documentElement.classList.add('js-reveal');

/* 3D tilt on mouse hover + flip-in when scrolled into view */
(function () {
    const items = document.querySelectorAll('.why-item, .journey-steps li');
    const heroCard = document.querySelector('.hero-glass-card');
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (canHover && !reduce && heroCard) {
        heroCard.addEventListener('pointermove', e => {
            const r = heroCard.getBoundingClientRect();
            heroCard.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 6).toFixed(2) + 'deg');
            heroCard.style.setProperty('--rx', ((0.5 - (e.clientY - r.top) / r.height) * 6).toFixed(2) + 'deg');
        });
        heroCard.addEventListener('pointerleave', () => {
            heroCard.style.setProperty('--rx', '0deg');
            heroCard.style.setProperty('--ry', '0deg');
        });
    }

    if (canHover && !reduce) {
        items.forEach(el => {
            el.addEventListener('pointermove', e => {
                const r = el.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width;
                const y = (e.clientY - r.top) / r.height;
                el.style.setProperty('--ry', ((x - 0.5) * 14).toFixed(2) + 'deg');
                el.style.setProperty('--rx', ((0.5 - y) * 14).toFixed(2) + 'deg');
                el.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
                el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
            });
            el.addEventListener('pointerleave', () => {
                el.style.setProperty('--rx', '0deg');
                el.style.setProperty('--ry', '0deg');
            });
        });
    }

    /* mouse parallax for the floating 3D shapes in Why Us */
    const why = document.getElementById('features');
    if (why && canHover && !reduce) {
        why.addEventListener('pointermove', e => {
            const r = why.getBoundingClientRect();
            why.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
            why.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
        });
    }

    if (!('IntersectionObserver' in window)) { items.forEach(el => el.classList.add('in')); return; }
    const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
            if (!en.isIntersecting) return;
            const siblings = Array.from(en.target.parentElement.children);
            en.target.style.setProperty('--d', (siblings.indexOf(en.target) * 0.12) + 's');
            en.target.classList.add('in');
            io.unobserve(en.target);
        });
    }, { threshold: 0.15 });
    items.forEach(el => io.observe(el));
})();

