/* Review form: shows the new review on the page (add a database later to keep reviews) */
function handleReviewSubmission(event) {
    event.preventDefault();
    const form = document.getElementById('reviewForm');
    const name = form.reviewerName.value.trim();
    const comment = form.reviewComment.value.trim();
    const rating = parseInt(form.rating.value, 10) || 5;
    const initials = name.split(/\s+/).map(n => n[0]).join('').toUpperCase().substring(0, 2);

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
    text.textContent = '"' + comment + '"';   // textContent avoids HTML injection
    top.append(stars, text);

    const info = document.createElement('div');
    info.className = 'reviewer-info';
    const avatar = document.createElement('div');
    avatar.className = 'reviewer-avatar';
    avatar.textContent = initials;
    const details = document.createElement('div');
    details.className = 'reviewer-details';
    const h4 = document.createElement('h4');
    h4.textContent = name;
    const span = document.createElement('span');
    span.textContent = 'Patient review';
    details.append(h4, span);
    info.append(avatar, details);

    card.append(top, info);
    document.getElementById('reviewsContainer').prepend(card);
    form.reset();
}
