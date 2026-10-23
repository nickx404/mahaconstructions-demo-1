const STORAGE_KEY = 'maha-chatbot-enquiry';

export function readChatbotLead() {
  try {
    const lead = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    if (!lead || !['callback', 'joint-venture'].includes(lead.intent)) return null;
    if (![lead.name, lead.phone, lead.location].every((value) => typeof value === 'string')) return null;
    return {
      name: lead.name.slice(0, 80),
      phone: lead.phone.slice(0, 24),
      location: lead.location.slice(0, 160),
      intent: lead.intent,
      projectName: typeof lead.projectName === 'string' ? lead.projectName.slice(0, 100) : '',
    };
  } catch {
    return null;
  }
}

export function saveChatbotLead(lead) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(lead));
    return true;
  } catch {
    return false;
  }
}

export function clearChatbotLead() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // The form remains usable when browser storage is unavailable.
  }
}

export function chatbotMessage(lead) {
  const topic = lead.intent === 'joint-venture' ? 'Joint venture / Landowner partnership' : 'Request a callback';
  const locationLabel = lead.intent === 'joint-venture' ? 'Land location' : 'Preferred location';
  return `${topic}${lead.projectName ? `\nProject of interest: ${lead.projectName}` : ''}\n${locationLabel}: ${lead.location || 'Not specified'}\nPlease contact me about this enquiry.`;
}
