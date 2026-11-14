/**
 * Dhritvi Advanced Dental Care - booking receiver
 * Saves every appointment request to a Google Sheet, emails the owner,
 * and emails the patient a confirmation message.
 *
 * SETUP (about 5 minutes):
 * 1. Create a new Google Sheet. Name it "Appointments".
 * 2. In the Sheet: Extensions > Apps Script. Delete any code and paste this file.
 * 3. Change OWNER_EMAIL below to the clinic's email address.
 * 4. Click Deploy > New deployment > type "Web app".
 *      Execute as: Me
 *      Who has access: Anyone
 *    Click Deploy and allow the permissions it asks for.
 * 5. Copy the Web app URL and paste it into index.html as SHEET_URL.
 *
 * If you edit this script later, use Deploy > Manage deployments > Edit > New version.
 */

const OWNER_EMAIL = 'clinic@example.com'; // <-- change this
const CLINIC_NAME = 'Dhritvi Advanced Dental Care';
const CLINIC_PHONE = '+91 98728 67433';

function doPost(e) {
  const p = e.parameter || {};
  if (!p.name || !p.phone) return ContentService.createTextOutput('missing');
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

  // Header row on first use
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Received', 'Patient type', 'Name', 'Phone', 'Email',
                     'Service', 'Date', 'Time', 'Notes', 'Status']);
  }

  sheet.appendRow([new Date(), p.patientType, p.name, p.phone, p.email,
                   p.service, p.date, p.time, p.notes, 'New']);

  const body =
    'New appointment request\n\n' +
    'Name: ' + p.name + '\n' +
    'Phone: ' + p.phone + '\n' +
    'Email: ' + p.email + '\n' +
    'Service: ' + p.service + '\n' +
    'Date: ' + p.date + '\n' +
    'Time: ' + p.time + '\n' +
    'Patient: ' + p.patientType + '\n' +
    'Notes: ' + (p.notes || '-');

  MailApp.sendEmail({
    to: OWNER_EMAIL,
    subject: 'New appointment: ' + p.name + ' - ' + p.date + ' ' + p.time,
    body: body
  });

  // Confirmation to the patient (a failure here must not stop the owner email above)
  if (p.email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p.email)) {
    try {
      const esc = s => String(s || '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
      const text =
        'Hello ' + p.name + ',\n\n' +
        'Thank you for choosing ' + CLINIC_NAME + '. We have received your appointment request:\n\n' +
        'Service: ' + p.service + '\nDate: ' + p.date + '\nTime: ' + p.time + '\n\n' +
        'Our team will call you shortly to confirm. Your appointment is final only after that call.\n' +
        'To change or cancel, call us on ' + CLINIC_PHONE + '.\n\n' + CLINIC_NAME;
      const html =
        '<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;border:1px solid #dbe7f5;border-radius:12px;overflow:hidden">' +
        '<div style="background:#1d6fe8;color:#fff;padding:18px 22px"><h2 style="margin:0;font-size:20px">' + esc(CLINIC_NAME) + '</h2>' +
        '<p style="margin:4px 0 0;opacity:.9">Appointment request received</p></div>' +
        '<div style="padding:22px;color:#0b1f3a"><p>Hello ' + esc(p.name) + ',</p>' +
        '<p>Thank you for choosing us. Here are your details:</p>' +
        '<table style="width:100%;border-collapse:collapse">' +
        '<tr><td style="padding:8px;border-bottom:1px solid #eef3fa;color:#5b6b82">Service</td><td style="padding:8px;border-bottom:1px solid #eef3fa"><b>' + esc(p.service) + '</b></td></tr>' +
        '<tr><td style="padding:8px;border-bottom:1px solid #eef3fa;color:#5b6b82">Date</td><td style="padding:8px;border-bottom:1px solid #eef3fa"><b>' + esc(p.date) + '</b></td></tr>' +
        '<tr><td style="padding:8px;color:#5b6b82">Time</td><td style="padding:8px"><b>' + esc(p.time) + '</b></td></tr></table>' +
        '<p>Our team will <b>call you shortly to confirm</b>. Your appointment is final only after that call.</p>' +
        '<p>To change or cancel, call <b>' + esc(CLINIC_PHONE) + '</b>.</p></div></div>';
      MailApp.sendEmail({
        to: p.email,
        replyTo: OWNER_EMAIL,
        name: CLINIC_NAME,
        subject: 'Your appointment request - ' + CLINIC_NAME,
        body: text,
        htmlBody: html
      });
    } catch (err) { /* ignore: owner already notified */ }
  }

  return ContentService.createTextOutput('ok');
}
