import { addItem, renderInventory, hasItem } from './inventory.js';
import { showToast } from './ui.js';

const STORAGE_KEYS = {
  current: 'agent-e_currentEpisodeId',
  inventory: 'agent-e_inventory',
  flags: 'agent-e_episodeFlags'
};

let episodes = [];
let currentEpisode = null;
let flags = JSON.parse(localStorage.getItem(STORAGE_KEYS.flags) || '{}');

function saveCurrentEpisode(id) {
  localStorage.setItem(STORAGE_KEYS.current, id);
}

function loadCurrentEpisodeId() {
  return localStorage.getItem(STORAGE_KEYS.current);
}

function saveFlags() {
  localStorage.setItem(STORAGE_KEYS.flags, JSON.stringify(flags));
}

async function loadEpisodes() {
  const res = await fetch('./data/episodes.json');
  const data = await res.json();
  episodes = data.episodes;
}

function getEpisodeById(id) {
  return episodes.find(e => e.id === id);
}

function renderEpisode(episode) {
  const container = document.getElementById('episode-container');
  container.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'episode-card';
  card.innerHTML = `
    <div class="episode-title">${episode.title}</div>
    <div class="episode-text">${episode.introText}</div>
  `;

  const sceneArea = document.createElement('div');

  if (episode.sceneType === 'hiddenObject') {
    const area = document.createElement('div');
    area.className = 'hidden-object-area';
    episode.objects.forEach(obj => {
      const el = document.createElement('div');
      el.className = 'hidden-object';
      el.style.left = obj.x + '%';
      el.style.top = obj.y + '%';
      el.title = obj.label;
      el.addEventListener('click', () => {
        if (obj.isTarget) {
          handleEpisodeSuccess(episode);
        } else {
          showToast('Ova zvijezda nije ta. Pogledaj pažljivije.');
        }
      });
      area.appendChild(el);
    });
    sceneArea.appendChild(area);
  } else if (episode.sceneType === 'sequenceClick') {
    const area = document.createElement('div');
    area.className = 'hidden-object-area';
    let index = 0;
    episode.objects.forEach((obj, idx) => {
      const el = document.createElement('div');
      el.className = 'hidden-object';
      el.style.left = obj.x + '%';
      el.style.top = obj.y + '%';
      el.style.opacity = idx === 0 ? 1 : 0.4;
      el.addEventListener('click', () => {
        if (idx === index) {
          el.style.opacity = 0.3;
          index += 1;
          const next = area.querySelectorAll('.hidden-object')[index];
          if (next) next.style.opacity = 1;
          if (index === episode.objects.length) handleEpisodeSuccess(episode);
        } else {
          showToast('Pogledaj redoslijed svjetlucanja.');
        }
      });
      area.appendChild(el);
    });
    sceneArea.appendChild(area);
  }

  card.appendChild(sceneArea);
  container.appendChild(card);
  container.classList.remove('hidden');
  renderInventory();
}

function handleEpisodeSuccess(ep) {
  const container = document.querySelector('.episode-card');
  const success = document.createElement('div');
  success.className = 'success-text';
  success.innerText = ep.successText;
  container.appendChild(success);
  if (ep.rewardItemId) {
    addItem(ep.rewardItemId);
    showToast('Svjetlo Zvijezde čeka u tvojem inventaru.');
  }
  if (!flags[ep.id]) flags[ep.id] = {};
  flags[ep.id].completed = true;
  saveFlags();
  if (ep.nextEpisodeId) {
    saveCurrentEpisode(ep.nextEpisodeId);
  }
  const cliff = document.createElement('div');
  cliff.className = 'episode-text';
  cliff.innerText = 'Sutra ćeš ga trebati. Iza crvotočine čeka mrak.';
  container.appendChild(cliff);
}

export async function startEngine(startEpisodeId) {
  await loadEpisodes();
  const id = startEpisodeId || loadCurrentEpisodeId() || episodes[0].id;
  currentEpisode = getEpisodeById(id);
  if (currentEpisode) {
    saveCurrentEpisode(currentEpisode.id);
    renderEpisode(currentEpisode);
  }
}

export function getCurrentEpisodeFlags() {
  return flags[currentEpisode?.id] || {};
}

export function getCurrentEpisodeId() {
  return currentEpisode?.id;
}

export function requiresItem(itemId) {
  return hasItem(itemId);
}
