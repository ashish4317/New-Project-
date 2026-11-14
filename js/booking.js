/* Booking form submit (saves to Google Sheet + emails the clinic, then offers WhatsApp) */
async function handleBookingSubmission(event) {
    event.preventDefault();
    const form = document.getElementById('appointmentForm');

    /* spam trap: bots fill the hidden field, people never see it */
    if (form.website && form.website.value) return;

    const timeSlot = form.timeSlot.value;
    if (!timeSlot) {
        alert('Please choose a time for your appointment.');
        return;
    }

    const data = {
        patientType: form.patientType.value,
        name: form.fullName.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        service: form.service.value,
        date: form.date.value,
        time: timeSlot,
        notes: form.notes.value.trim()
    };

    /* 1) Send to Google Sheet / owner email */
    const submitBtn = form.querySelector('.submit-btn');
    submitBtn.disabled = true;
    if (SHEET_URL) {
        try {
            await fetch(SHEET_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: new URLSearchParams(data)
            });
        } catch (err) {
            alert('We could not send your request. Please call the clinic to book.');
            submitBtn.disabled = false;
            return;
        }
    }
    submitBtn.disabled = false;

    /* 2) Prepare WhatsApp message */
    const msg = 'New appointment request\n' +
        'Name: ' + data.name + '\n' +
        'Phone: ' + data.phone + '\n' +
        'Service: ' + data.service + '\n' +
        'Date: ' + data.date + '\n' +
        'Time: ' + data.time + '\n' +
        'Patient: ' + data.patientType +
        (data.notes ? '\nNotes: ' + data.notes : '');
    document.getElementById('whatsappLink').href =
        'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);

    /* 3) Confirmation box: email note + "Add to calendar" link */
    document.getElementById('confirmEmail').textContent = data.email;
    document.getElementById('calendarLink').href = buildCalendarLink(data);

    const confirmationBox = document.getElementById('confirmationBox');
    confirmationBox.style.display = 'block';
    form.reset();
    confirmationBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => { confirmationBox.style.display = 'none'; }, 60000);
}

/* Google Calendar "add event" link for the patient (30-minute visit, India time) */
function buildCalendarLink(d) {
    const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(d.time || '');
    if (!m || !d.date) return '#';
    let hh = parseInt(m[1], 10) % 12;
    if (m[3].toUpperCase() === 'PM') hh += 12;
    const day = d.date.replace(/-/g, '');
    const start = day + 'T' + String(hh).padStart(2, '0') + m[2] + '00';
    const endMin = hh * 60 + parseInt(m[2], 10) + 30;
    const end = day + 'T' + String(Math.floor(endMin / 60) % 24).padStart(2, '0') + String(endMin % 60).padStart(2, '0') + '00';
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
        '&text=' + encodeURIComponent('Dental visit: ' + d.service + ' - Dhritvi Advanced Dental Care') +
        '&dates=' + start + '/' + end + '&ctz=Asia/Kolkata' +
        '&details=' + encodeURIComponent('Appointment request. The clinic will call to confirm. Phone: +' + CLINIC_PHONE);
}
