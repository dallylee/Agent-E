import { WebglScene } from './webglScene.js';
import { Wormhole } from './wormhole.js';
import { TimeGate, STATES } from './timeGate.js';
import { setOverlay, hideOverlay, renderIncomingMessage, hideIncomingMessage, renderPortalLock, renderStoryLines, hidePortalPanel } from './ui.js';
import { startEngine } from './engine.js';
import { renderInventory } from './inventory.js';
import { PLANET_IMAGES } from './planetAssets.js';

const NIGHT_KEY = 'ELI2025';
const gate = new TimeGate();
const wormhole = new Wormhole('wormhole-container', 'wormhole-canvas');
const scene = new WebglScene('bg-canvas');

function updateOverlayForState(state) {
  if (state === STATES.BEFORE) {
    const countdown = gate.getCountdownTo(19);
    setOverlay(`
      <div class="content">
        <h1>Dolazna poruka…</h1>
        <p>Otvara se za ${countdown}</p>
      </div>
    `);
    hideIncomingMessage();
    scene.setDimmed(false);
  } else if (state === STATES.PLAYABLE) {
    hideOverlay();
    renderIncomingMessage(() => gate.triggerPlayableClick());
    scene.setDimmed(false);
  } else {
    setOverlay(`
      <div class="content">
        <h1>Svjetovi spavaju.</h1>
        <p>Vidimo se sutra u 19:00.</p>
      </div>
    `, { dim: true });
    hideIncomingMessage();
    scene.setDimmed(true);
  }
}

function handlePlayableClick() {
  hideIncomingMessage();
  wormhole.playSequence().then(() => {
    renderPortalLock(validateKey);
    document.getElementById('wormhole-container').style.pointerEvents = 'auto';
  });
}

function validateKey(value) {
  if (value === NIGHT_KEY) {
    renderPortalLock(()=>{}, '');
    hidePortalPanel();
    renderStoryLines([
      'Netko krade snove.',
      'Vijeće Snova treba tvoju pomoć.',
      'Jesi li spremna pomoći, Agentice Eli?'
    ], {
      onYes: startMission,
      onNo: () => {
        setOverlay(`
          <div class="content">
            <p>U redu, Agentice Eli. Odmori se večeras. Vrati se kad budeš spremna.</p>
          </div>
        `, { dim: true });
        wormhole.fadeOut();
      }
    });
  } else {
    renderPortalLock(validateKey, 'Hmm… taj ključ izgleda ne radi. Pokušaj ponovo.');
  }
}

async function startMission() {
  hidePortalPanel();
  wormhole.fadeOut();
  await startEngine();
  renderInventory();
}

function parallaxPlanets() {
  const layer = document.getElementById('planet-layer');
  const handle = (x, y) => {
    layer.style.transform = `translate(${x * 0.01}px, ${y * 0.01}px)`;
  };
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX - window.innerWidth/2);
    const y = (e.clientY - window.innerHeight/2);
    handle(x, y);
  });
  window.addEventListener('deviceorientation', (e) => {
    const x = e.gamma || 0;
    const y = e.beta || 0;
    handle(x*4, y*2);
  });
}

async function init() {
  await scene.init();
  const planetEls = document.querySelectorAll('#planet-layer img');
  planetEls.forEach((img) => {
    const key = img.dataset.key;
    if (PLANET_IMAGES[key]) img.src = PLANET_IMAGES[key];
  });
  parallaxPlanets();
  gate.onStateChange((state) => updateOverlayForState(state));
  gate.onPlayableClick(handlePlayableClick);
  gate.start();
  setInterval(() => {
    if (gate.state === STATES.BEFORE) updateOverlayForState(STATES.BEFORE);
  }, 1000);
}

init();
