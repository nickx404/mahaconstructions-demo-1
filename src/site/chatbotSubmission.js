const SESSION_KEY = 'maha-chatbot-saved-contact';
export const leadDeliveryEnabled = Boolean(import.meta.env.VITE_CHATBOT_LEAD_URL);

export function readSavedContact() {
  try {
    const contact = JSON.parse(sessionStorage.getItem(SESSION_KEY));
    return contact?.id && typeof contact.name === 'string' && typeof contact.phone === 'string' ? contact : null;
  } catch { return null; }
}

export function rememberContact(contact) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(contact)); } catch { /* The current conversation still remembers it. */ }
}

export function validateContact(name, phone, email = '') {
  const cleanedName = name.trim();
  const cleanedPhone = phone.trim().replace(/[\s().-]/g, '');
  if (cleanedName.length < 2 || cleanedName.length > 80 || !/\p{L}/u.test(cleanedName)) throw new Error('Please enter your name (2–80 characters).');
  if (!/^\+?\d{10,15}$/.test(cleanedPhone)) throw new Error('Please enter a valid phone number with 10–15 digits.');
  const cleanedEmail = email.trim();
  if (cleanedEmail && (cleanedEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail))) throw new Error('Please enter a valid email address, or leave it blank.');
  return { name: cleanedName, phone: cleanedPhone, email: cleanedEmail };
}

// A form POST avoids cross-origin fetch restrictions; only a verified receipt means saved.
export function submitChatbotContact(contact) {
  const endpoint = import.meta.env.VITE_CHATBOT_LEAD_URL;
  if (!endpoint || !/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(endpoint)) {
    return Promise.reject(new Error('Online enquiries are not connected yet. Please use our Contact page to reach the team.'));
  }
  return new Promise((resolve, reject) => {
    const nonce = crypto.randomUUID();
    const frame = document.createElement('iframe');
    frame.name = `maha-lead-${nonce}`;
    frame.hidden = true;
    frame.title = 'Enquiry submission';
    const form = document.createElement('form');
    form.hidden = true;
    form.method = 'POST';
    form.action = endpoint;
    form.target = frame.name;
    const payload = document.createElement('input');
    payload.name = 'payload';
    payload.value = JSON.stringify({ ...contact, nonce, origin: window.location.origin });
    form.append(payload);
    const finish = (error) => {
      clearTimeout(timer);
      window.removeEventListener('message', receive);
      frame.remove();
      form.remove();
      if (error) reject(error); else resolve();
    };
    const receive = (event) => {
      if (!/^https:\/\/(?:[a-z0-9-]+[.-])?script\.googleusercontent\.com$/.test(event.origin) && event.origin !== 'https://script.google.com') return;
      if (event.data?.type !== 'maha-lead-receipt' || event.data.nonce !== nonce || event.data.id !== contact.id) return;
      finish(event.data.saved === true ? null : new Error('Your enquiry couldn’t be saved. Please retry.'));
    };
    const timer = setTimeout(() => finish(new Error('Saving could not be confirmed. Please retry; your details are still here.')), 30000);
    window.addEventListener('message', receive);
    document.body.append(frame, form);
    try { form.submit(); } catch { finish(new Error('Your enquiry couldn’t be sent. Please retry.')); }
  });
}
