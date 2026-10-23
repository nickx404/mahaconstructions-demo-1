import { companyMission, completedProjects, jointVentureReply, ongoingProjects, services } from './siteContent.js';

const normalize = (value) => value.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const link = (label, path) => ({ label, path });
const projectLink = (project, anchor = '') => link(`${project.name} project page`, `/projects/${project.slug}${anchor}`);

// This is a local, scripted knowledge bank, not an AI service. Only shared site facts become answers.
export function answerQuestion(question, context = {}) {
  const text = normalize(question);
  const namedProject = ongoingProjects.find((project) => text.includes(normalize(project.name)) || text.includes(normalize(project.name.replace(/^Maha /, ''))));
  const project = namedProject || ongoingProjects.find((item) => item.slug === context.projectSlug);
  const archiveProject = completedProjects.find((item) => text.includes(normalize(item.name)));
  const reply = (topic, content) => ({ topic, projectSlug: namedProject?.slug || context.projectSlug, ...content });
  const callback = { label: 'Request a callback', action: 'callback' };
  const projectChoices = ['Where is it?', 'What sizes are available?', 'What amenities are listed?'];

  if (/\b(cancel|stop|never mind|nevermind|main menu|start over)\b/.test(text)) {
    return reply('menu', { text: 'Of course. What would you like to know?', choices: ['Ongoing projects', 'Joint venture', 'Request a callback'] });
  }
  if (/\b(no|not|dont|do not|without|skip)\b/.test(text) && /\b(callback|call|contact details|phone number)\b/.test(text)) {
    return reply('menu', { text: 'No problem. We can keep exploring the website. What would you like to know?', choices: ['Ongoing projects', 'Completed projects', 'Joint venture'] });
  }
  if (/\b(call me|call us|call back|callback|want a call|arrange a call|request a call|please call|contact me|speak to|talk to|site visit|schedule a visit|book a visit)\b/.test(text) ||
    (/^(yes|yes please|sure|okay|ok|please do)$/.test(text) && context.topic === 'callback-offer')) {
    return reply('callback', { action: 'callback' });
  }
  if (/\b(start|submit|make|send|begin)\b/.test(text) && /\b(land|joint venture|partnership)\b/.test(text)) {
    return reply('joint-venture', { action: 'joint-venture' });
  }
  if (/\b(price|pricing|cost|budget|rate|payment|discount|emi|loan|bank|rera|cmda|approval|approved|possession|handover|completion date|ready to move|available units|availability|vacant|stock|guarantee|guaranteed|appreciation|rental income|investment return)\b/.test(text)) {
    const subject = /\b(price|pricing|cost|budget|rate|discount|payment)\b/.test(text) ? 'Current prices and payment terms' :
      /\b(emi|loan|bank)\b/.test(text) ? 'Finance and bank loan details' : /\b(rera|cmda|approval|approved)\b/.test(text) ? 'Project approvals' :
        /\b(possession|handover|completion date|ready to move)\b/.test(text) ? 'Possession and completion dates' :
          /\b(availability|available units|vacant|stock)\b/.test(text) ? 'Current unit availability details' : 'Investment returns and guarantees';
    return reply('callback-offer', {
      text: `${subject}${project ? ` for ${project.name}` : ''} need confirmation from our authorized team. Would you like me to help you request a callback?`,
      links: project ? [projectLink(project)] : [link('Contact our team', '/contact#contact-form')],
      choices: [callback, 'Keep exploring projects'],
    });
  }
  if (/\b(joint venture|joint ventures|jv|landowner|land owner|partnership|partner|develop my land|have (a )?land|own (some )?land|plot dimensions)\b/.test(text)) {
    return reply('joint-venture', {
      text: `${jointVentureReply} Would you like me to help you start a landowner enquiry, or would you prefer to read about our approach first?`,
      links: [link('Our joint venture approach', '/joint-venture')],
      choices: [{ label: 'Start a landowner enquiry', action: 'joint-venture' }, 'What services do you offer?'],
    });
  }
  if (archiveProject || /\b(completed|past projects|previous projects|delivered|archive)\b/.test(text)) {
    const all = /\b(all|full|every|list)\b/.test(text);
    const names = (all ? completedProjects : completedProjects.slice(0, 6)).map((item) => item.name).join(', ');
    return reply('completed', {
      text: archiveProject ? `${archiveProject.name} is in our completed-project archive. You can view its photography in the Projects page’s Completed collection.` :
        `Our website’s completed-project archive includes ${names}${all || completedProjects.length <= 6 ? '.' : ', and more.'} Would you like to explore the photography or see our ongoing work?`,
      links: [link('View completed projects', '/projects?status=completed')],
      choices: all ? ['Ongoing projects', callback] : ['List all completed projects', 'Ongoing projects'],
    });
  }
  if (/\b(floor plan|floor plans|floorplan|floorplans|layout|layouts|brochure)\b/.test(text)) {
    const selected = project || (ongoingProjects.length === 1 ? ongoingProjects[0] : null);
    return { ...reply('project', {
      text: selected ? `You can view the floor-plan section for ${selected.name} below. Detailed architectural layouts are available upon consultation. I can help you prepare an enquiry to request them from our team.` : 'Which project would you like the plans for?',
      links: selected ? [projectLink(selected, '#floor-plans')] : [link('Browse ongoing projects', '/projects')],
      choices: selected ? [callback, 'What sizes are available?'] : ongoingProjects.map((item) => item.name),
    }), projectSlug: selected?.slug };
  }
  if (/\b(office|contact details|phone number|phone no|whatsapp|email|reach you|contact you|contact number|directions)\b/.test(text)) {
    return reply('contact', { text: 'You can find our phone, email, office address, and map directions on the Contact page. Would you like to leave an enquiry for our team?', links: [link('Contact details and directions', '/contact')], choices: [callback, 'Ongoing projects'] });
  }
  if (/\b(services|service|what do you do|what you do|construction work|building contract|commercial|land development)\b/.test(text)) {
    return reply('services', { text: `We work across ${services.map((item) => item.title.toLowerCase()).join(', ')}. What are you looking to explore?`, links: [link('Explore our services', '/#services')], choices: ['Ongoing projects', 'Joint venture', callback] });
  }
  if (/\b(about maha constructions|company|who are you|who is maha|mission|history|experience|founder)\b/.test(text) || /^(about|about us)$/.test(text)) {
    return reply('about', { text: `I’m Maha, the website assistant for Maha Constructions. Our mission is: ${companyMission} You can learn more about our story on the About Us page.`, links: [link('About Maha Constructions', '/about-2')], choices: ['What services do you offer?', 'Ongoing projects'] });
  }
  if (/\b(gallery|photos|photographs|pictures|videos|images)\b/.test(text)) {
    return reply('gallery', { text: 'You can explore our company photos and videos in the Gallery, and completed-project photography in the Projects archive.', links: [link('Company gallery', '/gallery'), link('Completed-project photos', '/projects?status=completed')], choices: ['Ongoing projects', callback] });
  }

  const projectDetail = /\b(where|located|location|address|size|sizes|sq ft|sqft|square feet|bhk|configuration|configurations|amenities|features|parking|lift|elevator|cctv|rainwater|it|this|that|more|details)\b/.test(text);
  if (project && (namedProject || projectDetail)) {
    if (/\b(where|location|located|address)\b/.test(text)) {
      return reply('project', { text: `${project.name} is in ${project.location}. The address listed on its project page is ${project.fullAddress} Would you like to see its configurations?`, links: [projectLink(project, '#location')], choices: ['What sizes are available?', callback] });
    }
    if (/\b(size|sizes|sq ft|sqft|square feet|bhk|configuration|configurations)\b/.test(text)) {
      return reply('project', { text: `${project.name}’s page lists ${project.details.slice(0, 3).join(' · ')}. Current unit availability needs confirmation from our team. Would you like to enquire about this project?`, links: [projectLink(project, '#project-details')], choices: [callback, 'What amenities are listed?'] });
    }
    if (/\b(amenities|features|parking|lift|elevator|cctv|rainwater)\b/.test(text)) {
      return reply('project', { text: `The ${project.name} project page lists ${project.amenities.join(', ')}. Our team can confirm the specifications for your enquiry.`, links: [projectLink(project, '#amenities')], choices: [callback, 'Where is it?'] });
    }
    return reply('project', { text: `${project.name} is our listed ongoing residential project in ${project.location}. What would you like to know about it?`, links: [projectLink(project)], choices: projectChoices });
  }
  if (/\b(project|projects|homes|home|apartments|apartment|flat|flats|property|properties|ongoing|residential|exploring|buy|buying)\b/.test(text)) {
    return { ...reply('projects', {
      text: ongoingProjects.length ? `Here’s what we currently have listed on our website: ${ongoingProjects.map((item) => `${item.name} in ${item.location}`).join('; ')}. ${ongoingProjects.length === 1 ? 'Would you like to know about its location, sizes, or amenities?' : 'Which project would you like to explore?'}` : 'Our project directory is the place to see the latest published developments.',
      links: ongoingProjects.map((item) => projectLink(item)),
      choices: ongoingProjects.length === 1 ? projectChoices : ongoingProjects.map((item) => item.name),
    }), projectSlug: ongoingProjects.length === 1 ? ongoingProjects[0].slug : undefined };
  }
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|hi maha|hello maha)$/.test(text)) {
    return reply('menu', { text: 'Hi! I’m Maha. I can help you explore our projects, discuss a land partnership, or prepare a callback enquiry. What do you have in mind?', choices: ['Ongoing projects', 'Joint venture', callback] });
  }
  if (/\b(thank|thanks|bye|goodbye)\b/.test(text)) {
    return reply('menu', { text: 'You’re welcome! I’m here if you’d like to explore anything else.', choices: ['Ongoing projects', 'Joint venture', callback] });
  }
  if (projectDetail && !project) {
    return reply('projects', { text: 'Which project do you mean? These are the ongoing projects listed on our website.', choices: ongoingProjects.map((item) => item.name), links: [link('Browse projects', '/projects')] });
  }
  return reply('unknown', { text: 'I don’t have that information in our website content yet. I can help with ongoing projects, completed projects, services, or landowner partnerships. What would you like to explore?', choices: ['Ongoing projects', 'Joint venture', callback], links: [link('Ask our team', '/contact#contact-form')] });
}
