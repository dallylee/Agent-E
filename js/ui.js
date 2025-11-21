export function showToast(message, duration = 2600) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.remove('show'), duration);
}

export function setOverlay(content, options = {}) {
  const overlay = document.getElementById('overlay');
  overlay.innerHTML = '';
  const box = document.createElement('div');
  box.className = 'content';
  box.innerHTML = content;
  overlay.appendChild(box);
  overlay.classList.toggle('dim', !!options.dim);
  overlay.classList.remove('hidden');
}

export function hideOverlay() {
  const overlay = document.getElementById('overlay');
  overlay.classList.add('hidden');
}

export function renderIncomingMessage(onClick) {
  const messageArea = document.getElementById('message-area');
  messageArea.innerHTML = '';
  const wrapper = document.createElement('div');
  wrapper.className = 'message-wrapper';
  const pulse = document.createElement('div');
  pulse.className = 'message-pulse';
  pulse.innerText = 'Dolazna poruka. Klikni da je primiš.';
  const target = document.createElement('div');
  target.className = 'message-target';
  pulse.appendChild(target);
  pulse.addEventListener('click', onClick);
  wrapper.appendChild(pulse);
  messageArea.appendChild(wrapper);
  messageArea.classList.remove('hidden');
}

export function hideIncomingMessage() {
  const messageArea = document.getElementById('message-area');
  messageArea.classList.add('hidden');
}

export function renderPortalLock(onSubmit, errorText = '') {
  const panel = document.getElementById('portal-panel');
  panel.innerHTML = `
    <h2>Poruka iz Vijeća Snova</h2>
    <p>Poruka je zaključana. Unesi večerašnji ključ.</p>
    <input id="portal-key" type="text" placeholder="KLJUČ" aria-label="Večernji ključ" />
    ${errorText ? `<div class="error" style="margin-bottom:8px;color:#ffc7d9;">${errorText}</div>` : ''}
    <button id="unlock-btn">OTKLJUČAJ</button>
  `;
  panel.classList.remove('hidden');
  document.getElementById('unlock-btn').onclick = () => {
    const value = document.getElementById('portal-key').value.trim();
    onSubmit(value);
  };
}

export function renderStoryLines(lines, actions) {
  const panel = document.getElementById('portal-panel');
  panel.innerHTML = '';
  const container = document.createElement('div');
  container.className = 'story-lines';
  lines.forEach(text => {
    const p = document.createElement('div');
    p.textContent = text;
    container.appendChild(p);
  });
  panel.appendChild(container);
  const buttons = document.createElement('div');
  buttons.className = 'episode-actions';
  const yes = document.createElement('button');
  yes.textContent = 'DA, spremna sam';
  yes.addEventListener('click', actions.onYes);
  const no = document.createElement('button');
  no.textContent = 'NE, večeras ne';
  no.className = 'secondary';
  no.addEventListener('click', actions.onNo);
  buttons.appendChild(yes);
  buttons.appendChild(no);
  panel.appendChild(buttons);
  panel.classList.remove('hidden');
}

export function hidePortalPanel() {
  const panel = document.getElementById('portal-panel');
  panel.classList.add('hidden');
}

export function showEpisodeIntro(title, text) {
  const container = document.getElementById('episode-container');
  container.innerHTML = `
    <div class="episode-card">
      <div class="episode-title">${title}</div>
      <div class="episode-text">${text}</div>
    </div>
  `;
  container.classList.remove('hidden');
}
