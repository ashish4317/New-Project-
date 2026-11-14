/* Services filter */
/* Services filter */
document.getElementById('filterBar').addEventListener('click', function (e) {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('#servicesGrid .service-card').forEach(card => {
        const show = filter === 'all' || card.dataset.cat === filter;
        card.style.display = show ? 'flex' : 'none';
        if (show) { card.style.animation = 'none'; card.offsetHeight; card.style.animation = ''; }
    });
});

function selectServiceAndScroll(serviceName) {
    document.getElementById('selectedService').value = serviceName;
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
}


/* "Popular treatments" tiles: pick that service in the booking form, then the link scrolls there */
document.addEventListener('click', function (e) {
    const link = e.target.closest('[data-service]');
    if (!link) return;
    const select = document.getElementById('selectedService');
    if (select) select.value = link.dataset.service;
});
