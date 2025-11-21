import { showToast } from './ui.js';

export const ITEMS = {
  starLight: {
    id: 'starLight',
    name: 'Svjetlo Zvijezde',
    description: 'Jedan komadić neba, uhvaćen za kasnije.',
    ability: 'brightenScene'
  }
};

const ABILITIES = {
  brightenScene(context) {
    document.body.classList.add('scene-bright');
    showToast('Svjetlo Zvijezde obasjava prostor.');
    context.flags.brightened = true;
    if (context.saveFlags) context.saveFlags();
  }
};

const STORAGE = 'agent-e_inventory';
let inventory = JSON.parse(localStorage.getItem(STORAGE) || '[]');
let onRender = null;

export function addItem(itemId) {
  if (!inventory.includes(itemId)) {
    inventory.push(itemId);
    localStorage.setItem(STORAGE, JSON.stringify(inventory));
    renderInventory();
  }
}

export function hasItem(itemId) {
  return inventory.includes(itemId);
}

export function setRenderCallback(cb) { onRender = cb; }

export function renderInventory() {
  const container = document.getElementById('inventory');
  if (!container) return;
  container.innerHTML = '';
  if (!inventory.length) {
    container.classList.add('hidden');
    return;
  }
  inventory.forEach(id => {
    const item = ITEMS[id];
    const el = document.createElement('div');
    el.className = 'inventory-item';
    el.innerHTML = `<div>${item.name}</div>`;
    el.title = item.description;
    el.addEventListener('click', () => useItem(id, {}));
    container.appendChild(el);
  });
  container.classList.remove('hidden');
  if (onRender) onRender(inventory);
}

export function useItem(itemId, context) {
  const item = ITEMS[itemId];
  if (!item) return;
  const ability = ABILITIES[item.ability];
  if (ability) ability(context);
}

renderInventory();
