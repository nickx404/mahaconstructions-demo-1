import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, ChatCircleDots, X } from '@phosphor-icons/react';
import { sitePath, siteRoute } from './paths.js';
import { saveChatbotLead } from './chatbotLead.js';
import { answerQuestion } from './chatbotKnowledge.js';
import { ongoingProjects } from './siteContent.js';
import { leadDeliveryEnabled, readSavedContact, rememberContact, submitChatbotContact, validateContact } from './chatbotSubmission.js';

const greeting = 'Hi, I’m Maha. How can I help you today?';
const initialReply = { text: greeting, choices: ['Ongoing projects', 'Joint venture', 'Request a callback'] };
const initialLead = { name: '', phone: '', email: '', location: '' };

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState(null);
  const [step, setStep] = useState('chat');
  const [messages, setMessages] = useState([{ from: 'bot', ...initialReply }]);
  const [context, setContext] = useState({});
  const [savedContact, setSavedContact] = useState(readSavedContact);
  const [lead, setLead] = useState(() => ({ ...initialLead, ...readSavedContact() }));
  const [pending, setPending] = useState(null);
  const [saving, setSaving] = useState(false);
  const [contactError, setContactError] = useState('');
  const contactId = useRef(readSavedContact()?.id || crypto.randomUUID());
  const submitting = useRef(false);
  const contactInput = useRef(null);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const launcher = useRef(null);
  const panel = useRef(null);
  const conversation = useRef(null);
  const input = useRef(null);
  const manualOpen = useRef(false);
  const collecting = step === 'location';
  const capturing = step === 'contact';
  const lastMessage = messages[messages.length - 1];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (manualOpen.current || document.hidden || document.querySelector('.menu-open, [aria-modal="true"]') ||
        document.activeElement?.matches('input, textarea, select, [contenteditable="true"]')) return;
      setOpen(true);
    }, 10000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (open && manualOpen.current) panel.current?.focus();
  }, [open]);

  useEffect(() => {
    if (conversation.current) conversation.current.scrollTop = conversation.current.scrollHeight;
    if (manualOpen.current) {
      if (step === 'contact') contactInput.current?.focus();
      else input.current?.focus();
    }
  }, [messages, step]);

  function close() {
    manualOpen.current = true;
    setOpen(false);
    launcher.current?.focus();
  }

  function promptFor() {
    return intent === 'joint-venture' ? 'Where is your land located? A locality or area is enough.' :
      'Do you have a preferred location? You can say “skip” if you’re still exploring.';
  }

  function append(visitor, bot) {
    setMessages((current) => [...current, { from: 'visitor', text: visitor }, { from: 'bot', ...bot }]);
  }

  function start(nextIntent, visitor) {
    setIntent(nextIntent);
    setStep('location');
    const intro = nextIntent === 'joint-venture' ? 'Let’s put together your landowner enquiry.' : 'Of course. Let’s put together your callback enquiry.';
    const question = nextIntent === 'joint-venture' ? 'Where is your land located?' : 'Do you have a preferred location? You can say “skip” if you’re still exploring.';
    append(visitor, { text: `${intro} ${question}` });
    setError('');
  }

  async function ask(value, action) {
    manualOpen.current = true;
    const text = value.trim();
    if (!text) return;
    if (submitting.current || capturing) return;
    setAnswer('');
    setError('');
    if (!savedContact || (leadDeliveryEnabled && !savedContact.delivered)) {
      setPending({ text, action });
      setStep('contact');
      append(text, { text: 'Sure, I can help. May I have your name and phone number?' });
      return;
    }
    if (/^(cancel|stop|never mind|nevermind|main menu|start over)$/i.test(text)) {
      setStep('chat');
      append(text, { text: 'Of course. We can keep exploring. What would you like to know?', choices: initialReply.choices });
      return;
    }
    const isQuestion = /\?|^(what|where|which|can|could|do|does|how|tell|show|is|are|hi|hello)\b/i.test(text) || /\b(projects?|amenities|bhk|pricing|price|joint venture|completed|services|office|gallery|floor plans?|brochure)\b/i.test(text);
    if (collecting && !action && !isQuestion) {
      const cleaned = text;
      const skipped = step === 'location' && /^(skip|not sure|not decided|anywhere|no preference)$/i.test(cleaned);
      if (skipped && intent === 'joint-venture') return setError('Please share the land locality so our team knows which property your enquiry concerns.');
      const nextLead = { ...lead, location: skipped ? '' : cleaned.slice(0, 160) };
      const project = ongoingProjects.find((item) => item.slug === context.projectSlug);
      submitting.current = true;
      setSaving(true);
      try {
        if (leadDeliveryEnabled) await submitChatbotContact({ ...savedContact, location: nextLead.location, projectName: project?.name || '', intent });
      } catch (problem) { setError(problem.message); return; }
      finally { submitting.current = false; setSaving(false); }
      setLead(nextLead);
      setStep('review');
      append(text, { text: leadDeliveryEnabled ? `Thank you, ${nextLead.name}. Your enquiry details have been updated. You can continue asking questions here, or add more details in our contact form.` : `Thank you, ${nextLead.name}. You can continue asking questions here. To reach our team, please use the phone or email on our Contact page.`, links: leadDeliveryEnabled ? undefined : [{ label: 'Contact our team', path: '/contact' }] });
      return;
    }

    const response = action ? { action } : answerQuestion(text, context);
    if (response.action) {
      if (collecting && response.action === intent) append(text, { text: `I’m already helping you with that. ${promptFor()}` });
      else start(response.action, text);
      return;
    }
    setContext({ topic: response.topic, projectSlug: response.projectSlug });
    const resumePrompt = intent === 'joint-venture' ? 'For your enquiry, where is your land located?' : 'For your enquiry, do you have a preferred location?';
    append(text, collecting ? { ...response, text: `${response.text}\n\n${resumePrompt}`, choices: undefined } : response);
  }

  async function captureContact(event) {
    event.preventDefault();
    if (submitting.current || !pending) return;
    setContactError('');
    let contact;
    try { contact = validateContact(lead.name, lead.phone, lead.email); }
    catch (problem) { setContactError(problem.message); return; }
    submitting.current = true;
    setSaving(true);
    const record = { ...contact, id: contactId.current, question: pending.text, page: window.location.pathname, delivered: leadDeliveryEnabled };
    try {
      if (leadDeliveryEnabled) await submitChatbotContact(record);
      rememberContact(record);
      setSavedContact(record);
      setLead((current) => ({ ...current, ...contact }));
      setStep('chat');
      setMessages((current) => [...current, { from: 'bot', text: leadDeliveryEnabled ? `Thank you, ${contact.name}. Your enquiry has been saved.` : `Thanks, ${contact.name}. Let’s continue with your question.` }]);
      // Resume the saved question without repeating the visitor's message.
      const response = pending.action ? { action: pending.action } : answerQuestion(pending.text, context);
      if (response.action) {
        setIntent(response.action);
        setStep('location');
        setMessages((current) => [...current, { from: 'bot', text: response.action === 'joint-venture' ? 'Where is your land located? A locality or area is enough.' : 'Do you have a preferred location? You can say “skip” if you’re still exploring.' }]);
      } else {
        setContext({ topic: response.topic, projectSlug: response.projectSlug });
        setMessages((current) => [...current, { from: 'bot', ...response }]);
      }
      setPending(null);
    } catch (problem) { setContactError(problem.message); }
    finally { submitting.current = false; setSaving(false); }
  }

  function continueToForm() {
    const project = ongoingProjects.find((item) => item.slug === context.projectSlug);
    if (!saveChatbotLead({ ...lead, intent, projectName: intent === 'callback' ? project?.name || '' : '' })) {
      setError('I couldn’t carry your details across. Please open the contact form below and enter them there.');
      return;
    }
    if (siteRoute() === '/contact') {
      window.dispatchEvent(new Event('maha-chatbot-enquiry'));
      setOpen(false);
      document.getElementById('contact-form')?.scrollIntoView();
    } else window.location.assign(sitePath('/contact#contact-form'));
  }

  return (
    <div className="maha-chat">
      {open && <section id="maha-chat-panel" className="maha-chat-panel" role="dialog" aria-modal="false" aria-labelledby="maha-chat-title" tabIndex={-1} ref={panel}
        onKeyDown={(event) => { if (event.key === 'Escape') { event.stopPropagation(); close(); } }}>
        <header className="maha-chat-header">
          <span className="maha-chat-avatar" aria-hidden="true">M</span>
          <div><h2 id="maha-chat-title">Chat with Maha</h2><p>Maha Constructions · Website assistant</p></div>
          <button type="button" onClick={close} aria-label="Close chatbot"><X size={20} aria-hidden="true" /></button>
        </header>

        <div className="maha-chat-conversation" ref={conversation}>
          <div className="maha-chat-transcript" role="log" aria-label="Chat conversation" aria-live="polite" aria-relevant="additions">
            {messages.map((message, index) => <div key={index} className={`maha-chat-bubble${message.from === 'visitor' ? ' is-visitor' : ''}`}>
              <span className="maha-chat-sr">{message.from === 'visitor' ? 'You: ' : 'Maha: '}</span><p>{message.text}</p>
              {message.links?.length > 0 && <div className="maha-chat-sources">{message.links.map((item) => <a key={item.path} href={sitePath(item.path)}>{item.label}<ArrowUpRight size={14} aria-hidden="true" /></a>)}</div>}
            </div>)}
          </div>

          {!collecting && !capturing && lastMessage.choices && <div className="maha-chat-suggestions" aria-label="Suggested replies">{lastMessage.choices.map((choice) => {
            const label = typeof choice === 'string' ? choice : choice.label;
            return <button type="button" key={label} onClick={() => ask(label, choice.action)}>{label}</button>;
          })}</div>}

          {capturing && <form className="maha-chat-contact" onSubmit={captureContact} aria-label="Your contact details" aria-busy={saving}>
            <label htmlFor="maha-lead-name">Name</label>
            <input id="maha-lead-name" ref={contactInput} name="name" autoComplete="name" required minLength={2} maxLength={80} value={lead.name} disabled={saving} onChange={(event) => { setLead({ ...lead, name: event.target.value }); setContactError(''); }} />
            <label htmlFor="maha-lead-phone">Phone number</label>
            <input id="maha-lead-phone" name="phone" type="tel" autoComplete="tel" required maxLength={24} value={lead.phone} disabled={saving} onChange={(event) => { setLead({ ...lead, phone: event.target.value }); setContactError(''); }} />
            <label htmlFor="maha-lead-email">Email (optional)</label>
            <input id="maha-lead-email" name="email" type="email" autoComplete="email" maxLength={254} value={lead.email || ''} disabled={saving} onChange={(event) => { setLead({ ...lead, email: event.target.value }); setContactError(''); }} />
            {contactError && <p className="maha-chat-error" role="alert">{contactError} <a href={sitePath('/contact')}>Contact our team</a></p>}
            <button className="maha-chat-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : contactError ? 'Retry' : 'Continue'} {!saving && <ArrowRight size={17} aria-hidden="true" />}</button>
          </form>}

          {step === 'review' && <div className="maha-chat-actions">
            <dl className="maha-chat-summary"><div><dt>Name</dt><dd>{lead.name}</dd></div><div><dt>Phone</dt><dd>{lead.phone}</dd></div>{lead.email && <div><dt>Email</dt><dd>{lead.email}</dd></div>}<div><dt>{intent === 'joint-venture' ? 'Land location' : 'Preferred location'}</dt><dd>{lead.location || 'Not specified'}</dd></div></dl>
            <button type="button" className="maha-chat-primary" onClick={continueToForm}>Review enquiry form <ArrowRight size={17} aria-hidden="true" /></button>
            <button type="button" className="maha-chat-secondary" onClick={() => { setStep('contact'); setPending({ text: 'Request a callback', action: intent || 'callback' }); setContactError(''); }}>Edit details</button>
          </div>}
        </div>

        {!capturing && <form className="maha-chat-answer maha-chat-composer" onSubmit={(event) => { event.preventDefault(); ask(answer); }}>
          <label htmlFor="maha-chat-answer">{step === 'location' ? (intent === 'joint-venture' ? 'Your land location' : 'Your preferred location') : 'Message Maha'}</label>
          <div><input id="maha-chat-answer" ref={input} value={answer} onChange={(event) => { setAnswer(event.target.value); setError(''); }} type="text" autoComplete="off" disabled={saving} maxLength={500} placeholder={step === 'location' ? 'e.g. Ambattur, Chennai' : 'Type your question here…'} aria-invalid={Boolean(error)} aria-describedby={error ? 'maha-chat-error' : undefined} /><button type="submit" disabled={saving} aria-label={saving ? 'Saving enquiry' : 'Send message'}><ArrowRight size={19} aria-hidden="true" /></button></div>
          {error && <p id="maha-chat-error" className="maha-chat-error" role="alert">{error} {step === 'review' && <a href={sitePath('/contact#contact-form')}>Open contact form</a>}</p>}
          {collecting && <button type="button" className="maha-chat-text" onClick={() => ask('Cancel')}>Keep browsing instead</button>}
        </form>}
      </section>}
      <button className={`maha-chat-launcher${open ? ' is-open' : ''}`} type="button" ref={launcher} aria-label={open ? 'Minimize chatbot' : 'Open Maha Constructions chatbot'} aria-controls="maha-chat-panel" aria-expanded={open} onClick={() => { manualOpen.current = true; if (open) close(); else setOpen(true); }}>
        {open ? <X size={23} aria-hidden="true" /> : <><ChatCircleDots size={24} weight="fill" aria-hidden="true" /><span>Ask Maha</span></>}
      </button>
    </div>
  );
}
