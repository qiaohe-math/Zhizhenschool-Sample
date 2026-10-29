'use strict';

const one = (selector) => document.querySelector(selector);
const all = (selector) => [...document.querySelectorAll(selector)];

// Navigation is always visible on all screen sizes. No menu toggle is required.
const mainNavLinks = all('#primary-nav a');
function markCurrentSection() {
  const hash = location.hash.startsWith('#research-') ? '#research' : (location.hash || '#home');
  mainNavLinks.forEach(link => {
    const current = link.getAttribute('href') === hash;
    if (current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
window.addEventListener('hashchange', markCurrentSection);
markCurrentSection();

// Orthographic projection of a torus with major radius 2.2 and minor radius 0.86.
function drawTorus(degrees) {
  const theme = getComputedStyle(document.documentElement);
  const lineColor = theme.getPropertyValue("--figure-line").trim() || "#713978";
  const accentColor = theme.getPropertyValue("--gold").trim() || "#c6a34e";
  const angle = Number(degrees) * Math.PI / 180;
  const tilt = 0.55 + angle * 0.55;
  const project = (u, v) => {
    const ring = 2.2 + 0.86 * Math.cos(v);
    const x = ring * Math.cos(u), y = ring * Math.sin(u), z = 0.86 * Math.sin(v);
    const rx = x * Math.cos(angle) - y * Math.sin(angle);
    const ry = x * Math.sin(angle) + y * Math.cos(angle);
    return { x: 280 + rx * 67, y: 210 + (ry * Math.sin(tilt) - z * Math.cos(tilt)) * 67, depth: ry * Math.cos(tilt) + z * Math.sin(tilt) };
  };
  const paths = [];
  function curve(fixed, longitude, highlighted = false) {
    let d = '', depth = 0;
    for (let j = 0; j <= 96; j++) {
      const t = j / 96 * 2 * Math.PI;
      const p = longitude ? project(fixed, t) : project(t, fixed);
      d += `${j ? 'L' : 'M'}${p.x.toFixed(2)},${p.y.toFixed(2)} `;
      depth += p.depth;
    }
    paths.push({d, depth: depth / 97, highlighted});
  }
  for (let i = 0; i < 34; i++) curve(i / 34 * 2 * Math.PI, true);
  for (let i = 0; i < 19; i++) curve(i / 19 * 2 * Math.PI, false, i === 2);
  paths.sort((a, b) => a.depth - b.depth);
  one('#torus-lines').innerHTML = paths.map(p => `<path d="${p.d}" fill="none" stroke="${p.highlighted ? accentColor : lineColor}" stroke-width="${p.highlighted ? '1.65' : '0.8'}" opacity="${p.highlighted ? '0.95' : Math.max(0.22, Math.min(0.72, 0.46 + p.depth * 0.12)).toFixed(2)}"/>`).join('');
  one('#rotation-value').value = `${degrees}°`;
  one('#rotation').setAttribute('aria-valuetext', `${degrees} degrees`);
}
drawTorus(one('#rotation').value);
one('#rotation').addEventListener('input', event => drawTorus(event.target.value));

function filterPeople() {
  const query = one('#people-search').value.trim().toLocaleLowerCase();
  const area = one('#people-area').value;
  let count = 0;
  all('.person').forEach(person => {
    const match = (area === 'All' || person.dataset.area === area) && person.textContent.toLocaleLowerCase().includes(query);
    person.hidden = !match;
    if (match) count++;
  });
  one('#people-status').textContent = `Showing ${count} sample faculty ${count === 1 ? 'profile' : 'profiles'}`;
  one('#people-empty').hidden = count !== 0;
}
one('#people-search').addEventListener('input', filterPeople);
one('#people-area').addEventListener('change', filterPeople);
all('.research-people').forEach(button => button.addEventListener('click', () => {
  one('#people-area').value = button.dataset.area;
  one('#people-search').value = '';
  filterPeople();
  location.hash = 'people';
  one('#people-search').focus({preventScroll: true});
}));

const people = {
  maya: {name: 'Maya Chen', role: 'Professor', area: 'Algebra & number theory', interests: 'Number theory and arithmetic geometry', about: 'This illustrative profile focuses on the relationship between number systems and geometric structures, and on how geometric ideas can illuminate questions about equations.', teaching: ['Number theory', 'Abstract algebra'], office: 'Room M402'},
  elias: {name: 'Elias Rahman', role: 'Associate professor', area: 'Geometry & topology', interests: 'Differential geometry and geometric analysis', about: 'This illustrative profile explores curved spaces, the geometry of surfaces, and the interplay between geometric structure and analytical methods.', teaching: ['Differential geometry', 'Multivariable calculus'], office: 'Room M408'},
  sofia: {name: 'Sofia Patel', role: 'Assistant professor', area: 'Analysis & applied mathematics', interests: 'Partial differential equations and fluid dynamics', about: 'This illustrative profile studies mathematical models of flow, focusing on how differential equations describe the behaviour of fluids across scales.', teaching: ['Differential equations', 'Mathematical modelling'], office: 'Room M311'},
  daniel: {name: 'Daniel Kim', role: 'Associate professor', area: 'Algebra & number theory', interests: 'Representation theory and combinatorics', about: 'This illustrative profile investigates how algebraic structures act on vector spaces and how discrete patterns reveal their underlying symmetries.', teaching: ['Linear algebra', 'Combinatorics'], office: 'Room M406'},
  amara: {name: 'Amara Okafor', role: 'Assistant professor', area: 'Geometry & topology', interests: 'Topology and knot theory', about: 'This illustrative profile asks how spaces and knots can be distinguished using properties that are preserved by continuous deformation.', teaching: ['Topology', 'Introduction to mathematical proof'], office: 'Room M309'},
  lucas: {name: 'Lucas Meyer', role: 'Professor', area: 'Analysis & applied mathematics', interests: 'Probability and mathematical modelling', about: 'This illustrative profile explores random processes and the mathematical tools that help us reason about uncertainty in complex systems.', teaching: ['Probability', 'Stochastic processes'], office: 'Room M410'}
};



const events = {
  patterns: {title: 'Patterns hiding in prime numbers', type: 'Colloquium', speaker: 'Maya Chen', when: '21 October 2026 · 16:00–17:00 HKT', start: '20261021T080000Z', end: '20261021T090000Z', room: 'Room M201', abstract: 'An illustrative colloquium exploring how simple questions about prime numbers lead to rich patterns and surprising connections across mathematics.', audience: 'Students and researchers across mathematical disciplines.'},
  spaces: {title: 'What can the shape of a space tell us?', type: 'Research seminar', speaker: 'Elias Rahman', when: '3 November 2026 · 14:00–15:00 HKT', start: '20261103T060000Z', end: '20261103T070000Z', room: 'Room M305', abstract: 'An illustrative seminar on how curvature, distance, and other geometric features help describe the global structure of a mathematical space.', audience: 'Readers with some background in geometry and analysis.'},
  fluids: {title: 'From equations to the motion of fluids', type: 'Research seminar', speaker: 'Sofia Patel', when: '12 November 2026 · 15:00–16:00 HKT', start: '20261112T070000Z', end: '20261112T080000Z', room: 'Room M201', abstract: 'An illustrative seminar connecting differential equations with models of fluid flow, with attention to how assumptions affect what a model can tell us.', audience: 'Students and researchers interested in differential equations and applied mathematics.'}
};

const dialog = one('#detail-dialog');
let dialogOpener = null;
function openDialog(content, opener) {
  dialogOpener = opener;
  one('#dialog-content').innerHTML = content;
  dialog.showModal();
  document.body.classList.add('dialog-open');
  one('.dialog-close').focus();
}
one('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  dialogOpener?.focus();
});
all('.profile-button').forEach(button => button.addEventListener('click', () => {
  const p = people[button.dataset.person];
  openDialog(`<p class="dialog-kicker">${p.role} · Sample faculty profile</p><h2 id="dialog-title">${p.name}</h2><p>${p.about}</p><dl class="dialog-facts"><div><dt>Research group</dt><dd>${p.area}</dd></div><div><dt>Sample office</dt><dd>${p.office}</dd></div></dl><h3>Research interests</h3><p>${p.interests}</p><h3>Example teaching</h3><ul>${p.teaching.map(t => `<li>${t}</li>`).join('')}</ul><p class="dialog-note">This person and profile are fictional sample content. A real faculty page can include verified publications, contact details, and office hours.</p>`, button);
}));
all('[data-event]').forEach(button => button.addEventListener('click', () => {
  const id = button.dataset.event, e = events[id];
  openDialog(`<p class="dialog-kicker">${e.type} · Sample event</p><h2 id="dialog-title">${e.title}</h2><p>${e.abstract}</p><dl class="dialog-facts"><div><dt>Sample speaker</dt><dd>${e.speaker}</dd></div><div><dt>Sample venue</dt><dd>${e.room}</dd></div></dl><p><strong>${e.when}</strong></p><h3>Suggested audience</h3><p>${e.audience}</p><button class="button button-dark dialog-calendar" type="button" data-calendar="${id}">Download sample calendar event <span aria-hidden="true">↓</span></button><p class="dialog-note" id="dialog-download-status" role="status">This is an illustrative event, not a real seminar. Its calendar file is labelled DEMO.</p>`, button);
  one('.dialog-calendar').addEventListener('click', () => downloadCalendar(id));
}));
all('[data-event-filter]').forEach(button => button.addEventListener('click', () => {
  all('[data-event-filter]').forEach(item => {
    const selected = item === button;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  let count = 0;
  all('.event').forEach(event => {
    const show = button.dataset.eventFilter === 'All' || event.dataset.eventType === button.dataset.eventFilter;
    event.hidden = !show;
    if (show) count++;
  });
  one('#event-status').textContent = `Showing ${count} sample ${count === 1 ? 'event' : 'events'}`;
}));

function escapeICS(value) { return value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;'); }
function foldICS(line) {
  let current = '', folded = '', bytes = 0;
  for (const char of line) {
    const n = new TextEncoder().encode(char).length;
    if (bytes + n > 75) { folded += current + '\r\n'; current = ' '; bytes = 1; }
    current += char; bytes += n;
  }
  return folded + current;
}
function downloadCalendar(id) {
  const e = events[id];
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Zhizhen School of Interdisciplinary Mathematical Sciences//Sample Seminars//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', `UID:${id}-2026@mathematics-demo.invalid`, `DTSTAMP:${stamp}`, `DTSTART:${e.start}`, `DTEND:${e.end}`, `SUMMARY:${escapeICS('DEMO: ' + e.title)}`, `DESCRIPTION:${escapeICS('Illustrative event only. Not a real seminar. Sample speaker: ' + e.speaker + '. ' + e.abstract)}`, `LOCATION:${escapeICS(e.room + ' (sample venue)')}`, 'TRANSP:TRANSPARENT', 'END:VEVENT', 'END:VCALENDAR'];
  const blob = new Blob([lines.map(foldICS).join('\r\n') + '\r\n'], {type: 'text/calendar;charset=utf-8'});
  const url = URL.createObjectURL(blob), link = document.createElement('a');
  link.href = url; link.download = `demo-${id}.ics`; document.body.appendChild(link); link.click(); link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  const message = `Calendar file prepared for “${e.title}”. It is labelled DEMO and opens in your calendar app.`;
  one('#download-status').textContent = message;
  const dialogStatus = one('#dialog-download-status');
  if (dialog.open && dialogStatus) dialogStatus.textContent = message;
}
all('.event-calendar').forEach(button => button.addEventListener('click', () => downloadCalendar(button.dataset.calendar)));
