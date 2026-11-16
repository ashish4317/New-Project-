/* Reviews: new reviews go to the Google Sheet ("Reviews" tab) as Pending.
   After the owner sets Status = Approved there, they show on the site for everyone. */

function buildReviewCard(name, rating, comment, label) {
    const card = document.createElement('article');
    card.className = 'review-card';

    const top = document.createElement('div');
    const stars = document.createElement('div');
    stars.className = 'stars';
    stars.setAttribute('role', 'img');
    stars.setAttribute('aria-label', rating + ' out of 5 stars');
    for (let i = 1; i <= 5; i++) {
        const s = document.createElement('i');
        s.className = i <= rating ? 'fa-solid fa-star' : 'fa-regular fa-star';
        s.setAttribute('aria-hidden', 'true');
        if (i > rating) s.style.color = '#cbd5e1';
        stars.appendChild(s);
    }
    const text = document.createElement('p');
    text.className = 'review-text';
    text.textContent = '"' + comment + '"';            // textContent avoids HTML injection
    top.append(stars, text);

    const info = document.createElement('div');
    info.className = 'reviewer-info';
    const avatar = document.createElement('div');
    avatar.className = 'reviewer-avatar';
    avatar.textContent = (name.split(/\s+/).map(n => n[0]).join('').toUpperCase().substring(0, 2)) || '?';
    const details = document.createElement('div');
    details.className = 'reviewer-details';
    const h4 = document.createElement('h4');
    h4.textContent = name;
    const span = document.createElement('span');
    span.textContent = label || 'Patient review';
    details.append(h4, span);
    info.append(avatar, details);

    card.append(top, info);
    return card;
}

async function handleReviewSubmission(event) {
    event.preventDefault();
    const form = document.getElementById('reviewForm');
    if (form.website && form.website.value) return;          // spam trap
    const note = document.getElementById('reviewNote');
    const btn = form.querySelector('button[type="submit"]');

    const data = {
        type: 'review',
        name: form.reviewerName.value.trim(),
        rating: parseInt(form.rating.value, 10) || 5,
        comment: form.reviewComment.value.trim()
    };

    note.className = 'review-note';
    btn.disabled = true;
    try {
        if (!SHEET_URL) throw new Error('no SHEET_URL');
        await fetch(SHEET_URL, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(data) });
        form.reset();
        note.textContent = 'Thank you! Your review was sent and will appear on the site after the clinic approves it.';
        note.classList.add('ok');
    } catch (err) {
        note.textContent = 'Sorry, we could not send your review. Please try again later.';
        note.classList.add('err');
    }
    btn.disabled = false;
}

/* Show approved reviews from the Sheet (the sample reviews below stay as they are) */
(async function loadApprovedReviews() {
    const box = document.getElementById('reviewsContainer');
    if (!box || !SHEET_URL) return;
    try {
        const res = await fetch(SHEET_URL + '?action=reviews&_=' + Date.now());
        const list = await res.json();
        if (!Array.isArray(list)) return;
        list.slice().reverse().forEach(r =>
            box.prepend(buildReviewCard(String(r.name || ''), Math.min(5, Math.max(1, parseInt(r.rating, 10) || 5)), String(r.comment || ''), 'Patient review')));
    } catch (e) { /* offline or not set up yet: keep the sample reviews */ }
})();
