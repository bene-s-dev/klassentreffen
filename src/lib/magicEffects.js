// Spatial Caret Tracking & Particle Physics Engine
class MagicEffects {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.isLoopRunning = false;
    this._measureCanvas = null;
    this._measureCtx = null;
    this.burstLoop = this.burstLoop.bind(this);
  }

  initCanvas() {
    if (typeof window === 'undefined') return;

    if (!this.canvas) {
      this.canvas = document.getElementById('confettiCanvas');
    }

    // Auto-create canvas if not present in DOM
    if (!this.canvas && typeof document !== 'undefined') {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'confettiCanvas';
      this.canvas.style.position = 'fixed';
      this.canvas.style.inset = '0';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.zIndex = '100';
      document.body.appendChild(this.canvas);
    }

    if (this.canvas && !this.ctx) {
      this.ctx = this.canvas.getContext('2d');
      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());
    }

    if (!this._measureCanvas && typeof document !== 'undefined') {
      this._measureCanvas = document.createElement('canvas');
      this._measureCtx = this._measureCanvas.getContext('2d');
    }
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    if (this.ctx) {
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  /**
   * Räumliches Caret-Tracking (Spatial Caret Coordinate Estimation)
   * Caret_X = rect.left + paddingLeft + measureText(value).width
   */
  getCaretCoordinates(input) {
    if (!input || typeof window === 'undefined') {
      return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }

    this.initCanvas();
    const rect = input.getBoundingClientRect();
    const style = window.getComputedStyle(input);

    const paddingLeft = parseFloat(style.paddingLeft) || 0;
    const paddingRight = parseFloat(style.paddingRight) || 0;
    const fontSize = style.fontSize || '16px';
    const fontFamily = style.fontFamily || 'sans-serif';
    const fontWeight = style.fontWeight || 'normal';

    if (this._measureCtx) {
      this._measureCtx.font = `${fontWeight} ${fontSize} ${fontFamily}`;
    }

    const cursorPos = input.selectionEnd ?? input.value.length;
    const textUpToCaret = input.value.substring(0, cursorPos);
    const measuredWidth = this._measureCtx
      ? this._measureCtx.measureText(textUpToCaret).width
      : textUpToCaret.length * 9;

    // Clamping: Math.min verhindert visuelles Überlaufen über den rechten Rand
    const maxCaretX = rect.left + rect.width - paddingRight - 6;
    const rawCaretX = rect.left + paddingLeft + measuredWidth;
    const caretX = Math.min(rawCaretX, maxCaretX);

    // Vertikal zentriert im Cursor-Bereich
    const caretY = rect.top + rect.height * 0.48;

    return { x: caretX, y: caretY };
  }

  /**
   * Prozedural berechneter 4-zackiger Stern via Polarkoordinaten
   */
  drawStar(ctx, x, y, outerR, innerR, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    const points = 4;
    const step = Math.PI / points;
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const a = i * step;
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  /**
   * Partikel-Emission & Kinematik (Particle Physics Simulation)
   * Euler-Kinematik mit Gravitation gy = +0.07 und Reibung vx,vy * 0.965
   */
  emitTypingSparkle(x, y) {
    this.initCanvas();
    if (!this.canvas || !this.ctx) return;

    // Harmonische Farbpalette (Fuchsia, Purple, Pink, Sky, Gold, White)
    const sparkleColors = [
      '#e879f9', // fuchsia-400
      '#c084fc', // purple-400
      '#f472b6', // pink-400
      '#38bdf8', // sky-400
      '#fde047', // yellow-300 / gold
      '#ffffff'  // pure white sparkle
    ];

    const particleCount = 8 + Math.floor(Math.random() * 5); // 8-12 Partikel pro Keystroke
    const deltaTheta = Math.PI / 4.2; // Polare Kegelöffnung nach oben (~43 Grad links/rechts)

    for (let i = 0; i < particleCount; i++) {
      // Polarer Kegel nach oben: theta in [-pi/2 - deltaTheta, -pi/2 + deltaTheta]
      const theta = -Math.PI / 2 + (Math.random() * 2 - 1) * deltaTheta;
      // Geschwindigkeit mit stochastischer Geschwindigkeitsvarianz
      const v0 = 2.4 + Math.random() * 3.6;
      const vx = Math.cos(theta) * v0;
      const vy = Math.sin(theta) * v0;

      const isStar = Math.random() > 0.38;
      const size = isStar ? 3.5 + Math.random() * 4.5 : 1.5 + Math.random() * 2.8;

      this.particles.push({
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 4,
        vx,
        vy,
        alpha: 1.0,
        decay: 0.018 + Math.random() * 0.024, // Alpha decay
        color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
        isStar,
        size,
        angle: Math.random() * Math.PI * 2,
        omega: (Math.random() - 0.5) * 0.28 // Eigenrotation dphi/dt für taumelnde Sterngeometrien
      });
    }

    if (!this.isLoopRunning) {
      this.isLoopRunning = true;
      requestAnimationFrame(this.burstLoop);
    }
  }

  /**
   * Render-Loop (requestAnimationFrame) auf #confettiCanvas
   * Zero-CPU-Idle: Loop stoppt automatisch bei leerer Partikel-Queue
   */
  burstLoop() {
    if (!this.ctx || !this.canvas) {
      this.isLoopRunning = false;
      return;
    }

    // Viewport-Canvas leeren
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Diskrete Euler-Integration pro Tick
      p.vy += 0.07; // Gravitation gy = +0.07
      p.vx *= 0.965; // Aerodynamische Reibung / Dämpfung
      p.vy *= 0.965;
      p.x += p.vx;
      p.y += p.vy;
      p.angle += p.omega; // Winkelgeschwindigkeit
      p.alpha -= p.decay; // Alpha Decay

      // In-Place-Splice bei alpha <= 0
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        i--;
        continue;
      }

      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = 8;

      if (p.isStar) {
        this.drawStar(this.ctx, p.x, p.y, p.size, p.size * 0.28, p.angle);
      } else {
        // Zirkuläre Stardust-Partikel
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    this.ctx.shadowBlur = 0;
    this.ctx.globalAlpha = 1.0;

    // Zero-CPU-Idle: Loop stoppt bei leerem Buffer
    if (this.particles.length > 0) {
      requestAnimationFrame(this.burstLoop);
    } else {
      this.isLoopRunning = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

export const magicEffects = new MagicEffects();

if (typeof window !== 'undefined') {
  window.magicEffects = magicEffects;
}
