// Configure Script Properties before deploying; see README.md in this folder.
function doPost(event) {
  var data;
  var saved = false;
  var config = PropertiesService.getScriptProperties();
  try {
    if (!event.parameter.payload || event.parameter.payload.length > 4000) throw new Error('Invalid request size');
    data = JSON.parse(event.parameter.payload);
    var origins = (config.getProperty('ALLOWED_ORIGINS') || '').split(',').map(function (item) { return item.trim(); });
    if (!origins.includes(data.origin) || !/^https?:\/\/[^/]+$/.test(data.origin)) throw new Error('Origin not allowed');
    if (!/^[a-f0-9-]{36}$/.test(data.id) || !/^[a-f0-9-]{36}$/.test(data.nonce)) throw new Error('Invalid request');
    if (typeof data.name !== 'string' || data.name.trim().length < 2 || data.name.length > 80 || !/\p{L}/u.test(data.name)) throw new Error('Invalid name');
    if (typeof data.phone !== 'string' || !/^\+?\d{10,15}$/.test(data.phone)) throw new Error('Invalid phone');
    var email = typeof data.email === 'string' ? data.email.trim() : '';
    if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) throw new Error('Invalid email');
    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var book = SpreadsheetApp.openById(config.getProperty('SPREADSHEET_ID'));
      var sheet = book.getSheetByName('Chatbot leads') || book.insertSheet('Chatbot leads');
      if (!sheet.getLastRow()) sheet.appendRow(['Lead ID', 'Created at', 'Name', 'Phone', 'First question', 'Page', 'Location', 'Project', 'Intent', 'Email status', 'Visitor email']);
      if (sheet.getRange(1, 11).getValue() !== 'Visitor email') sheet.getRange(1, 11).setValue('Visitor email');
      var ids = sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues() : [];
      var match = ids.findIndex(function (row) { return row[0] === data.id; });
      var row = match < 0 ? sheet.getLastRow() + 1 : match + 2;
      if (match < 0) {
        sheet.getRange(row, 1, 1, 10).setValues([[data.id, new Date(), safeCell(data.name, 80), safeCell(data.phone, 24), safeCell(data.question, 500), safeCell(data.page, 300), '', '', '', 'Pending']]);
      } else {
        sheet.getRange(row, 3, 1, 2).setValues([[safeCell(data.name, 80), safeCell(data.phone, 24)]]);
      }
      sheet.getRange(row, 11).setValue(safeCell(email, 254));
      if (typeof data.location === 'string') sheet.getRange(row, 7, 1, 3).setValues([[safeCell(data.location, 160), safeCell(data.projectName, 100), safeCell(data.intent, 40)]]);
      SpreadsheetApp.flush();
      saved = true;
      if (match < 0) {
        try {
          var recipient = config.getProperty('NOTIFICATION_EMAIL');
          if (!recipient || MailApp.getRemainingDailyQuota() < 1) throw new Error('Email unavailable');
          MailApp.sendEmail({ to: recipient, subject: 'New Maha website enquiry', body: 'Name: ' + data.name + '\nPhone: ' + data.phone + '\nEmail: ' + (email || 'Not provided') + '\nQuestion: ' + String(data.question || '').slice(0, 500) + '\n\nView the lead register: ' + book.getUrl() });
          sheet.getRange(row, 10).setValue('Sent');
        } catch (emailError) { sheet.getRange(row, 10).setValue('Not sent — check email configuration or quota'); }
      }
    } finally { lock.releaseLock(); }
  } catch (error) {
    // Never return submitted details or private configuration in a public response.
  }
  if (!data || !(config.getProperty('ALLOWED_ORIGINS') || '').split(',').map(function (item) { return item.trim(); }).includes(data.origin)) return HtmlService.createHtmlOutput('Request rejected');
  var receipt = JSON.stringify({ type: 'maha-lead-receipt', nonce: data.nonce, id: data.id, saved: saved }).replace(/</g, '\\u003c');
  var origin = JSON.stringify(data.origin).replace(/</g, '\\u003c');
  return HtmlService.createHtmlOutput('<script>window.top.postMessage(' + receipt + ',' + origin + ');</script>').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function safeCell(value, limit) {
  var text = typeof value === 'string' ? value.trim().slice(0, limit) : '';
  return /^[=+\-@\t\r]/.test(text) ? "'" + text : text;
}
