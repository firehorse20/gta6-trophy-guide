// Vice City Trophy Guide — GTA VI (PS5): tracker + guide for the 55 official trophies.
// Plain static files, no network after first load: trophies.json is fetched from this
// folder, progress lives in localStorage, and export/import move it as a JSON file.
const KEY = 'vice-city-trophy-guide-v1';
const SPOILER_KEY = 'vice-city-trophy-guide-spoiler';
const listEl = document.getElementById('list');
const qEl = document.getElementById('q');
const gradeEl = document.getElementById('grade');
const kindEl = document.getElementById('kind');
const statusEl = document.getElementById('status');
const spoilerEl = document.getElementById('spoiler');
const missableEl = document.getElementById('missable-only');
const showingEl = document.getElementById('showing');

let earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
let spoiler = localStorage.getItem(SPOILER_KEY) === '1';
spoilerEl.checked = spoiler;
let openId = null;

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const byId = new Map(trophies.map((t) => [t.id, t]));
const KIND_LABELS = {
  story: 'Story', mission: 'Side missions', activity: 'Activities', collection: 'Collections',
  combat: 'Combat', robbery: 'Robberies', exploration: 'Exploration', money: 'Money',
  completion: 'Completion', platinum: 'Platinum', misc: 'Everything else',
};
const GRADE_LETTER = { platinum: 'P', gold: 'G', silver: 'S', bronze: 'B' };

function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned]));
  localStorage.setItem(SPOILER_KEY, spoiler ? '1' : '0');
}

function hidden(t) {
  return t.story && spoiler && !earned.has(t.id);
}

function visible(t) {
  const q = qEl.value.trim().toLowerCase();
  if (q) {
    const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
  if (kindEl.value !== 'all' && t.kind !== kindEl.value) return false;
  if (statusEl.value === 'earned' && !earned.has(t.id)) return false;
  if (statusEl.value === 'remaining' && earned.has(t.id)) return false;
  if (missableEl.checked && !t.missable) return false;
  return true;
}

function renderProgress() {
  const total = trophies.length;
  const n = earned.size;
  document.getElementById('earned-count').textContent = n;
  document.getElementById('progress-fill').style.width = `${Math.round((n / total) * 100)}%`;
  document.getElementById('progress-note').textContent = `${Math.round((n / total) * 100)}% to the Platinum`;
  const counts = {};
  for (const t of trophies) counts[t.grade] = (counts[t.grade] ?? 0) + (earned.has(t.id) ? 1 : 0);
  document.getElementById('grade-counts').textContent =
    `Platinum ${counts.platinum ?? 0}/1 · Gold ${counts.gold ?? 0}/2 · Silver ${counts.silver ?? 0}/6 · Bronze ${counts.bronze ?? 0}/46`;
}

function render() {
  renderProgress();
  listEl.replaceChildren();
  let shown = 0;
  for (const t of trophies) {
    if (!visible(t)) continue;
    shown += 1;
    const card = document.createElement('article');
    card.className = 'card' + (earned.has(t.id) ? ' earned' : '');
    card.id = `trophy-${t.id}`;

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', `Mark ${t.name} earned`);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.id);
      else earned.delete(t.id);
      save();
      render();
    });
    card.append(box);

    const medal = document.createElement('div');
    medal.className = `medal ${t.grade}`;
    medal.textContent = GRADE_LETTER[t.grade];
    medal.title = t.grade;
    card.append(medal);

    const body = document.createElement('div');
    const h = document.createElement('h3');
    h.textContent = hidden(t) ? 'Hidden story trophy' : t.name;
    if (hidden(t)) h.className = 'hidden-name';
    body.append(h);
    const desc = document.createElement('p');
    desc.className = 'desc';
    desc.textContent = hidden(t) ? 'Complete this story step to reveal it.' : `“${t.description}”`;
    body.append(desc);
    const meta = document.createElement('div');
    meta.className = 'meta';
    const g = document.createElement('span');
    g.className = `chip grade-${t.grade}`;
    g.textContent = t.grade;
    meta.append(g);
    const k = document.createElement('span');
    k.className = 'chip kind';
    k.textContent = KIND_LABELS[t.kind] ?? t.kind;
    meta.append(k);
    if (t.missable) {
      const m = document.createElement('span');
      m.className = 'chip missable';
      m.textContent = 'Possibly missable';
      meta.append(m);
    }
    body.append(meta);
    card.append(body);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'guide-btn';
    btn.textContent = openId === t.id ? 'Hide guide' : 'Show guide';
    btn.addEventListener('click', () => {
      openId = openId === t.id ? null : t.id;
      render();
      if (openId) document.getElementById(`trophy-${t.id}`)?.scrollIntoView({ block: 'nearest' });
    });
    card.append(btn);

    if (openId === t.id && !hidden(t)) {
      const guide = document.createElement('div');
      guide.className = 'guide';
      const p = document.createElement('p');
      p.textContent = t.guide;
      guide.append(p);
      const s = document.createElement('p');
      s.className = 'sources';
      const strong = document.createElement('strong');
      strong.textContent = 'Sources: ';
      s.append(strong);
      s.append(t.sources.map((key) => doc.sources[key] ?? key).join(' · '));
      guide.append(s);
      card.append(guide);
    }
    listEl.append(card);
  }
  showingEl.textContent = `Showing ${shown} of ${trophies.length} trophies · ${earned.size} earned`;
}

document.getElementById('export').addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned].sort((a, b) => a - b) }, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
});
document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data) ? data : data.earned ?? [];
    earned = new Set(ids.filter((id) => byId.has(id)));
    save();
    render();
  } catch {
    alert('That file is not a progress export from this guide.');
  }
});
document.getElementById('reset').addEventListener('click', () => {
  if (confirm('Clear all earned trophies?')) {
    earned = new Set();
    save();
    render();
  }
});
for (const el of [qEl, gradeEl, kindEl, statusEl, missableEl]) el.addEventListener('input', render);
spoilerEl.addEventListener('change', () => {
  spoiler = spoilerEl.checked;
  save();
  render();
});

// Demo states for the screenshots (same states a reader reaches by clicking):
// ?shot=cover opens the 100% trophy's guide with a few trophies checked;
// ?shot=roadmap scrolls to the roadmap; ?shot=spoiler turns spoiler hiding on;
// ?shot=silver filters to Silver trophies.
const shot = new URLSearchParams(location.search).get('shot');
if (shot === 'cover') {
  for (const id of [1, 2, 3]) earned.add(id);
  save();
  openId = 1;
  document.getElementById('roadmap').open = false;
} else if (shot === 'spoiler') {
  spoiler = true;
  spoilerEl.checked = true;
  save();
} else if (shot === 'silver') {
  gradeEl.value = 'silver';
}
render();
if (shot === 'roadmap') document.getElementById('roadmap').scrollIntoView();
const hash = location.hash.match(/^#trophy-(\d+)$/);
if (hash && byId.has(Number(hash[1]))) {
  openId = Number(hash[1]);
  render();
  document.getElementById(`trophy-${openId}`)?.scrollIntoView({ block: 'center' });
}
