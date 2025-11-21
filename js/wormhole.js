export class Wormhole {
  constructor(containerId, canvasId) {
    this.container = document.getElementById(containerId);
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.timeline = null;
    this.active = false;
    window.addEventListener('resize', () => this.resize());
    this.resize();
  }

  resize() {
    this.canvas.width = window.innerWidth * window.devicePixelRatio;
    this.canvas.height = window.innerHeight * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawRing(progress, colorStop=1) {
    const ctx = this.ctx;
    const { innerWidth: w, innerHeight: h } = window;
    const maxR = Math.min(w, h) * 0.45;
    const r = 20 + maxR * progress;
    const x = w/2, y = h/2;
    const grad = ctx.createRadialGradient(x, y, r*0.15, x, y, r);
    grad.addColorStop(0, `rgba(180,140,255,${0.4*colorStop})`);
    grad.addColorStop(0.45, `rgba(120,220,210,${0.25*colorStop})`);
    grad.addColorStop(1, 'rgba(5,5,10,0)');
    ctx.globalCompositeOperation = 'lighter';
    ctx.beginPath();
    ctx.fillStyle = grad;
    ctx.arc(x, y, r, 0, Math.PI*2);
    ctx.fill();
  }

  drawTunnel(progress) {
    const ctx = this.ctx;
    const { innerWidth: w, innerHeight: h } = window;
    ctx.save();
    ctx.translate(w/2, h/2);
    ctx.scale(1+progress*0.5, 1+progress*0.9);
    const layers = 12;
    for (let i=0;i<layers;i++) {
      const p = i/layers;
      const alpha = (1-p) * 0.35 * (1-progress*0.2);
      const radius = 40 + p*200 + progress*220;
      const grad = ctx.createRadialGradient(0,0,radius*0.1, 0,0,radius);
      grad.addColorStop(0, `rgba(180,130,255,${alpha})`);
      grad.addColorStop(1, 'rgba(10,10,20,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0,0,radius,0,Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawStabilized(glow=1) {
    const ctx = this.ctx;
    const { innerWidth: w, innerHeight: h } = window;
    const r = Math.min(w,h)*0.2;
    const x = w/2, y = h/2;
    const grad = ctx.createRadialGradient(x,y,r*0.3,x,y,r);
    grad.addColorStop(0, `rgba(200,230,255,${0.4*glow})`);
    grad.addColorStop(0.6, `rgba(140,200,200,${0.25*glow})`);
    grad.addColorStop(1,'rgba(10,15,25,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fill();
  }

  async playSequence() {
    if (this.active) return;
    this.active = true;
    this.container.classList.remove('hidden');
    this.clear();
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    tl.to({p:0}, {p:1, duration: 2.2, onUpdate: function(){
      const p = this.targets()[0].p;
      const worm = tl.vars.context;
      worm.clear();
      worm.drawRing(p,1);
    }, context:this});

    tl.to({p:0}, {p:1, duration: 2.6, onUpdate: function(){
      const p = this.targets()[0].p;
      const worm = tl.vars.context;
      worm.clear();
      worm.drawTunnel(p);
      worm.drawRing(0.5+p*0.5, 0.6);
    }, context:this}, '-=0.8');

    tl.to({p:0}, {p:1, duration: 1.8, onUpdate: function(){
      const p = this.targets()[0].p;
      const worm = tl.vars.context;
      worm.clear();
      worm.drawTunnel(1);
      worm.drawStabilized(p);
    }, onComplete: ()=>{
      this.stabilized = true;
    }, context:this});

    return new Promise(resolve => tl.eventCallback('onComplete', () => resolve()));
  }

  fadeOut() {
    gsap.to(this.container, { duration: 1, opacity: 0, onComplete: () => {
      this.container.classList.add('hidden');
      this.container.style.opacity = '';
      this.container.style.pointerEvents = 'none';
      this.clear();
      this.active = false;
    }});
  }
}
