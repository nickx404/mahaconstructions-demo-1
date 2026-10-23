import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, ChatCircleDots, X } from '@phosphor-icons/react';
import { sitePath, siteRoute } from './paths.js';
import { saveChatbotLead } from './chatbotLead.js';
import { answerQuestion } from './chatbotKnowledge.js';
import { ongoingProjects } from './siteContent.js';

const greeting = 'Hi, I’m Maha. How can I help you today?';
const initialReply = { text: greeting, choices: ['Ongoing projects', 'Joint venture', 'Request a callback'] };
const initialLead = { name: '', phone: '', location: '' };

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState(null);
  const [step, setStep] = useState('chat');
  const [messages, setMessages] = useState([{ from: 'bot', ...initialReply }]);
  const [context, setContext] = useState({});
  const [lead, setLead] = useState(initialLead);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const launcher = useRef(null);
  const panel = useRef(null);
  const conversation = useRef(null);
  const input = useRef(null);
  const manualOpen = useRef(false);
  const collecting = ['name', 'phone', 'location'].includes(step);
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
    if (manualOpen.current) input.current?.focus();
  }, [messages, step]);

  function close() {
    manualOpen.current = true;
    setOpen(false);
    launcher.current?.focus();
  }

  function promptFor(field, nextLead = lead) {
    if (field === 'name') return 'May I know your name?';
    if (field === 'phone') return `Thanks, ${nextLead.name}. What phone number can our team reach you on?`;
    return intent === 'joint-venture' ? 'Where is your land located? A locality or area is enough.' :
      'Do you have a preferred location? You can say “skip” if you’re still exploring.';
  }

  function append(visitor, bot) {
    setMessages((current) => [...current, { from: 'visitor', text: visitor }, { from: 'bot', ...bot }]);
  }

  function start(nextIntent, visitor) {
    setIntent(nextIntent);
    const firstMissing = !lead.name ? 'name' : !lead.phone ? 'phone' : 'location';
    setStep(firstMissing);
    const intro = nextIntent === 'joint-venture' ? 'Let’s put together your landowner enquiry.' : 'Of course. Let’s put together your callback enquiry.';
    const question = firstMissing === 'location' ? (nextIntent === 'joint-venture' ? 'Where is your land located?' : 'Do you have a preferred location? You can say “skip” if you’re still exploring.') : promptFor(firstMissing);
    append(visitor, { text: `${intro} ${question}` });
    setError('');
  }

  function ask(value, action) {
    manualOpen.current = true;
    const text = value.trim();
    if (!text) return;
    setAnswer('');
    setError('');
    if (/^(cancel|stop|never mind|nevermind|main menu|start over)$/i.test(text)) {
      setStep('chat');
      append(text, { text: 'Of course. We can keep exploring. What would you like to know?', choices: initialReply.choices });
      return;
    }
    const isQuestion = /\?|^(what|where|which|can|could|do|does|how|tell|show|is|are|hi|hello)\b/i.test(text) || /\b(projects?|amenities|bhk|pricing|price|joint venture|completed|services|office|gallery|floor plans?|brochure)\b/i.test(text);
    if (collecting && !action && !isQuestion) {
      let cleaned = text;
      if (step === 'name') cleaned = text.replace(/^(my name is|i am|i’m|i'm|this is|name\s*:)\s*/i, '').trim();
      if (step === 'phone') cleaned = text.replace(/^(my\s+)?(phone\s*(number)?|mobile\s*(number)?|number|no\.?)(\s+is|\s*:)?\s*/i, '').trim();
      if (step === 'name' && (cleaned.length < 2 || !/\p{L}/u.test(cleaned))) return setError('Please share your name so I know how to address you.');
      if (step === 'phone' && (!/^\+?[\d\s().-]+$/.test(cleaned) || !/^\d{10,15}$/.test(cleaned.replace(/\D/g, '')))) return setError('That number doesn’t look complete. Please enter 10 to 15 digits, including the country code if needed.');
      if (step === 'phone') cleaned = cleaned.replace(/[\s().-]/g, '');
      const skipped = step === 'location' && /^(skip|not sure|not decided|anywhere|no preference)$/i.test(cleaned);
      if (skipped && intent === 'joint-venture') return setError('Please share the land locality so our team knows which property your enquiry concerns.');
      const nextLead = { ...lead, [step]: skipped ? '' : cleaned.slice(0, step === 'name' ? 80 : step === 'phone' ? 24 : 160) };
      const nextStep = step === 'name' ? 'phone' : step === 'phone' ? 'location' : 'review';
      setLead(nextLead);
      setStep(nextStep);
      append(text, { text: nextStep === 'review' ? `Thank you, ${nextLead.name}. Here’s your enquiry so far. You can review it in our contact form before completing it.` : promptFor(nextStep, nextLead) });
      return;
    }

    const response = action ? { action } : answerQuestion(text, context);
    if (response.action) {
      if (collecting && response.action === intent) append(text, { text: `I’m already helping you with that. ${promptFor(step)}` });
      else start(response.action, text);
      return;
    }
    setContext({ topic: response.topic, projectSlug: response.projectSlug });
    const resumePrompt = step === 'name' ? 'When you’re ready, please share your name for the enquiry.' :
      step === 'phone' ? 'When you’re ready, please share a phone number for your enquiry.' :
        intent === 'joint-venture' ? 'For your enquiry, where is your land located?' : 'For your enquiry, do you have a preferred location?';
    append(text, collecting ? { ...response, text: `${response.text}\n\n${resumePrompt}`, choices: undefined } : response);
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

          {!collecting && lastMessage.choices && <div className="maha-chat-suggestions" aria-label="Suggested replies">{lastMessage.choices.map((choice) => {
            const label = typeof choice === 'string' ? choice : choice.label;
            return <button type="button" key={label} onClick={() => ask(label, choice.action)}>{label}</button>;
          })}</div>}

          {step === 'review' && <div className="maha-chat-actions">
            <dl className="maha-chat-summary"><div><dt>Name</dt><dd>{lead.name}</dd></div><div><dt>Phone</dt><dd>{lead.phone}</dd></div><div><dt>{intent === 'joint-venture' ? 'Land location' : 'Preferred location'}</dt><dd>{lead.location || 'Not specified'}</dd></div></dl>
            <button type="button" className="maha-chat-primary" onClick={continueToForm}>Review enquiry form <ArrowRight size={17} aria-hidden="true" /></button>
            <button type="button" className="maha-chat-secondary" onClick={() => { setStep('name'); append('I’d like to edit my details', { text: 'Of course. What name should I use?' }); }}>Edit details</button>
          </div>}
        </div>

        <form className="maha-chat-answer maha-chat-composer" onSubmit={(event) => { event.preventDefault(); ask(answer); }}>
          <label htmlFor="maha-chat-answer">{step === 'name' ? 'Your name, or ask a question' : step === 'phone' ? 'Your phone number, or ask a question' : step === 'location' ? (intent === 'joint-venture' ? 'Your land location' : 'Your preferred location') : 'Message Maha'}</label>
          <div><input id="maha-chat-answer" ref={input} value={answer} onChange={(event) => { setAnswer(event.target.value); setError(''); }} type="text" inputMode={step === 'phone' ? 'tel' : 'text'} autoComplete={step === 'name' ? 'name' : step === 'phone' ? 'tel' : 'off'} maxLength={500} placeholder={step === 'name' ? 'e.g. My name is Priya' : step === 'phone' ? 'Enter your phone number' : step === 'location' ? 'e.g. Ambattur, Chennai' : 'Type your question here…'} aria-invalid={Boolean(error)} aria-describedby={error ? 'maha-chat-error' : undefined} /><button type="submit" aria-label="Send message"><ArrowRight size={19} aria-hidden="true" /></button></div>
          {error && <p id="maha-chat-error" className="maha-chat-error" role="alert">{error} {step === 'review' && <a href={sitePath('/contact#contact-form')}>Open contact form</a>}</p>}
          {collecting && <button type="button" className="maha-chat-text" onClick={() => ask('Cancel')}>Keep browsing instead</button>}
        </form>
      </section>}
      <button className={`maha-chat-launcher${open ? ' is-open' : ''}`} type="button" ref={launcher} aria-label={open ? 'Minimize chatbot' : 'Open Maha Constructions chatbot'} aria-controls="maha-chat-panel" aria-expanded={open} onClick={() => { manualOpen.current = true; if (open) close(); else setOpen(true); }}>
        {open ? <X size={23} aria-hidden="true" /> : <><ChatCircleDots size={24} weight="fill" aria-hidden="true" /><span>Ask Maha</span></>}
      </button>
    </div>
  );
}
