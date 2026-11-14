/* Call/WhatsApp links, booking date limits, image fallbacks */
/* Point every Call and WhatsApp button at the numbers in settings.js */
document.querySelectorAll('[data-call]').forEach(a => { a.href = 'tel:+' + CLINIC_PHONE; });
document.querySelectorAll('[data-wa]').forEach(a => {
    a.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' +
        encodeURIComponent('Hello, I would like to book an appointment.');
});

/* Booking date: today up to 90 days ahead */
(function () {
    const field = document.getElementById('appointmentDate');
    if (!field) return;
    const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const today = new Date();
    const last = new Date(); last.setDate(last.getDate() + 90);
    field.min = iso(today);
    field.max = iso(last);
})();

/* Images with data-fallback="url1|url2": if the image fails, try the next one */
document.querySelectorAll('img[data-fallback]').forEach(img => {
    const list = img.dataset.fallback.split('|');
    function next() {
        const src = list.shift();
        if (src) img.src = src; else img.removeEventListener('error', next);
    }
    img.addEventListener('error', next);
    if (img.complete && img.naturalWidth === 0) next();   // already failed before this script ran
});
