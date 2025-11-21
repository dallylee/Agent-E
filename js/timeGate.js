const STATES = {
  BEFORE: 'before',
  PLAYABLE: 'playable',
  AFTER: 'after'
};

function getZagrebDate() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('hr-HR', {
    timeZone: 'Europe/Zagreb',
    hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
  const parts = formatter.formatToParts(now).reduce((acc, p) => {
    acc[p.type] = p.value;
    return acc;
  }, {});
  return new Date(`${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`);
}

function determineState(date) {
  const h = date.getHours();
  if (h < 19) return STATES.BEFORE;
  if (h >= 22) return STATES.AFTER;
  return STATES.PLAYABLE;
}

export class TimeGate {
  constructor() {
    this.state = null;
    this.callbacks = { onStateChange: null, onPlayableClick: null };
    this.timer = null;
  }

  onStateChange(cb) { this.callbacks.onStateChange = cb; }
  onPlayableClick(cb) { this.callbacks.onPlayableClick = cb; }

  start() {
    const tick = () => {
      const zagrebNow = getZagrebDate();
      const state = determineState(zagrebNow);
      if (state !== this.state && this.callbacks.onStateChange) {
        this.callbacks.onStateChange(state, zagrebNow);
      }
      this.state = state;
    };
    tick();
    this.timer = setInterval(tick, 1000 * 30);
  }

  triggerPlayableClick() {
    if (this.state !== STATES.PLAYABLE) return;
    if (this.callbacks.onPlayableClick) this.callbacks.onPlayableClick();
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
  }

  getCountdownTo(targetHour = 19) {
    const now = getZagrebDate();
    const target = new Date(now);
    target.setHours(targetHour, 0, 0, 0);
    if (now >= target) target.setDate(target.getDate() + 1);
    const diff = target - now;
    const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }
}

export { STATES, determineState, getZagrebDate };
