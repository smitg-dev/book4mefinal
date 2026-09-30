import { CelestialBody } from '../types.js';

export interface StarParticle {
  x: number;
  y: number;
  size: number;
  brightness: number;
  twinkleSpeed: number;
}

export interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  angle: number;
}

const STAR_COUNT = 200;
const ORBIT_TILT = 0.45;
const HIT_PADDING = 10;
const MAX_METEORS = 3;
const METEOR_SPAWN_CHANCE = 0.02;
const FRAME_MS = 1000 / 60;
const MAX_FRAME_SCALE = 3;

export class PlanetViewer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private bodies: CelestialBody[];
  private stars: StarParticle[] = [];
  private meteors: Meteor[] = [];
  private angles: Map<string, number> = new Map();
  private selectedBodyId: string | null = null;
  private hoveredBodyId: string | null = null;
  private animationFrameId: number | null = null;
  private lastFrameTime = 0;
  private onSelectCallback?: (body: CelestialBody) => void;

  private width = 0;
  private height = 0;

  private handleResize = (): void => {
    const oldW = this.width;
    const oldH = this.height;
    this.initCanvasSize();
    if (oldW > 0 && oldH > 0) {
      const sx = this.width / oldW;
      const sy = this.height / oldH;
      this.stars.forEach((star) => {
        star.x *= sx;
        star.y *= sy;
      });
    } else {
      this.initStarfield();
    }
  };

  private handleMouseMove = (e: MouseEvent): void => {
    const { x, y } = this.toCanvasPoint(e);
    const hovered = this.getBodyAtPosition(x, y);
    this.hoveredBodyId = hovered ? hovered.id : null;
    this.canvas.style.cursor = hovered ? 'pointer' : 'default';
  };

  private handleMouseLeave = (): void => {
    this.hoveredBodyId = null;
    this.canvas.style.cursor = 'default';
  };

  private handleClick = (e: MouseEvent): void => {
    const { x, y } = this.toCanvasPoint(e);
    const clicked = this.getBodyAtPosition(x, y);
    if (clicked) {
      this.selectBody(clicked.id);
    }
  };

  constructor(
    canvasId: string,
    bodies: CelestialBody[],
    onSelect?: (body: CelestialBody) => void
  ) {
    const el = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (!el) {
      throw new Error(`Canvas with id ${canvasId} not found`);
    }
    const context = el.getContext('2d');
    if (!context) {
      throw new Error('Could not acquire 2D canvas context');
    }

    this.canvas = el;
    this.ctx = context;
    this.bodies = bodies;
    this.onSelectCallback = onSelect;

    this.initCanvasSize();
    this.initStarfield();
    this.initAngles();
    this.attachEventListeners();
  }

  private initCanvasSize(): void {
    const rect = this.canvas.parentElement?.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    this.width = rect && rect.width > 0 ? rect.width : window.innerWidth;
    this.height = rect && rect.height > 0 ? rect.height : 600;

    this.canvas.width = Math.floor(this.width * dpr);
    this.canvas.height = Math.floor(this.height * dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  private initStarfield(): void {
    this.stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2 + 0.5,
        brightness: 0.2 + Math.random() * 0.8,
        twinkleSpeed: (Math.random() - 0.5) * 0.02,
      });
    }
  }

  private initAngles(): void {
    this.bodies.forEach((body, idx) => {
      this.angles.set(body.id, (idx * (Math.PI * 2)) / this.bodies.length);
    });
  }

  private attachEventListeners(): void {
    window.addEventListener('resize', this.handleResize);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mouseleave', this.handleMouseLeave);
    this.canvas.addEventListener('click', this.handleClick);
  }

  private toCanvasPoint(e: MouseEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  private getBodyPosition(body: CelestialBody): { x: number; y: number } {
    const angle = this.angles.get(body.id) ?? 0;
    return {
      x: this.width / 2 + Math.cos(angle) * body.orbitDistance,
      y: this.height / 2 + Math.sin(angle) * body.orbitDistance * ORBIT_TILT,
    };
  }

  private getBodyAtPosition(x: number, y: number): CelestialBody | null {
    let closest: CelestialBody | null = null;
    let closestDist = Infinity;

    for (const body of this.bodies) {
      const pos = this.getBodyPosition(body);
      const dist = Math.hypot(x - pos.x, y - pos.y);
      if (dist <= body.radius + HIT_PADDING && dist < closestDist) {
        closest = body;
        closestDist = dist;
      }
    }
    return closest;
  }

  public selectBody(bodyId: string): void {
    const body = this.bodies.find((b) => b.id === bodyId);
    if (!body) return;

    this.selectedBodyId = bodyId;
    this.onSelectCallback?.(body);
  }

  public startAnimation(): void {
    if (this.animationFrameId !== null) return;

    this.lastFrameTime = performance.now();
    const render = (now: number): void => {
      const scale = Math.min((now - this.lastFrameTime) / FRAME_MS, MAX_FRAME_SCALE);
      this.lastFrameTime = now;

      this.updateState(scale);
      this.draw();
      this.animationFrameId = requestAnimationFrame(render);
    };
    this.animationFrameId = requestAnimationFrame(render);
  }

  public stopAnimation(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public destroy(): void {
    this.stopAnimation();
    window.removeEventListener('resize', this.handleResize);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
    this.canvas.removeEventListener('click', this.handleClick);
  }

  private updateState(scale: number): void {
    this.bodies.forEach((body) => {
      const current = this.angles.get(body.id) ?? 0;
      this.angles.set(body.id, current + body.orbitSpeed * scale);
    });

    this.stars.forEach((star) => {
      star.brightness += star.twinkleSpeed * scale;
      if (star.brightness >= 1) {
        star.brightness = 1;
        star.twinkleSpeed = -Math.abs(star.twinkleSpeed);
      } else if (star.brightness <= 0.2) {
        star.brightness = 0.2;
        star.twinkleSpeed = Math.abs(star.twinkleSpeed);
      }
    });

    if (Math.random() < METEOR_SPAWN_CHANCE * scale && this.meteors.length < MAX_METEORS) {
      this.meteors.push({
        x: Math.random() * this.width * 0.8,
        y: Math.random() * this.height * 0.3,
        length: Math.random() * 80 + 40,
        speed: Math.random() * 8 + 6,
        opacity: 1,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
      });
    }

    this.meteors = this.meteors.filter((meteor) => {
      meteor.x += Math.cos(meteor.angle) * meteor.speed * scale;
      meteor.y += Math.sin(meteor.angle) * meteor.speed * scale;
      meteor.opacity -= 0.015 * scale;
      return meteor.opacity > 0;
    });
  }

  private draw(): void {
    const { ctx, width, height } = this;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    const bgGrad = ctx.createRadialGradient(
      centerX,
      centerY,
      50,
      centerX,
      centerY,
      Math.max(width, height) / 1.2
    );
    bgGrad.addColorStop(0, '#0a0d1e');
    bgGrad.addColorStop(0.5, '#050714');
    bgGrad.addColorStop(1, '#020308');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    this.stars.forEach((star) => {
      ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    this.meteors.forEach((m) => {
      const tailX = m.x - Math.cos(m.angle) * m.length;
      const tailY = m.y - Math.sin(m.angle) * m.length;

      const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      grad.addColorStop(0, `rgba(0, 240, 255, ${Math.max(m.opacity, 0)})`);
      grad.addColorStop(1, 'rgba(0, 240, 255, 0)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();
    });

    const coreGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 35);
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.4, '#00f0ff');
    coreGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 35, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#050714';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SOL', centerX, centerY);

    this.bodies.forEach((body) => this.drawBody(body, centerX, centerY));
  }

  private drawBody(body: CelestialBody, centerX: number, centerY: number): void {
    const { ctx } = this;
    const { x: bodyX, y: bodyY } = this.getBodyPosition(body);
    const r = body.radius;

    const isSelected = this.selectedBodyId === body.id;
    const isHovered = this.hoveredBodyId === body.id;

    ctx.strokeStyle = isSelected
      ? 'rgba(0, 240, 255, 0.4)'
      : isHovered
      ? 'rgba(255, 255, 255, 0.25)'
      : 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = isSelected ? 2 : 1;
    ctx.setLineDash(body.category === 'satellite' ? [4, 4] : []);
    ctx.beginPath();
    ctx.ellipse(
      centerX,
      centerY,
      body.orbitDistance,
      body.orbitDistance * ORBIT_TILT,
      0,
      0,
      Math.PI * 2
    );
    ctx.stroke();
    ctx.setLineDash([]);

    const auraRad = r * (isSelected ? 2.5 : isHovered ? 2.0 : 1.5);
    const glowGrad = ctx.createRadialGradient(bodyX, bodyY, r * 0.5, bodyX, bodyY, auraRad);
    glowGrad.addColorStop(0, body.color);
    glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(bodyX, bodyY, auraRad, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = body.color;
    ctx.beginPath();
    ctx.arc(bodyX, bodyY, r, 0, Math.PI * 2);
    ctx.fill();

    const shadowGrad = ctx.createRadialGradient(
      bodyX - r * 0.4,
      bodyY - r * 0.4,
      r * 0.1,
      bodyX + r * 0.3,
      bodyY + r * 0.3,
      r * 1.2
    );
    shadowGrad.addColorStop(0, 'rgba(255,255,255,0.4)');
    shadowGrad.addColorStop(0.5, 'rgba(0,0,0,0.1)');
    shadowGrad.addColorStop(1, 'rgba(0,0,0,0.85)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.arc(bodyX, bodyY, r, 0, Math.PI * 2);
    ctx.fill();

    if (isSelected || isHovered) {
      ctx.strokeStyle = isSelected ? '#00f0ff' : '#7000ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(bodyX, bodyY, r + 6, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1;
      const offset = r + 10;
      ctx.beginPath();
      ctx.moveTo(bodyX - offset, bodyY - offset + 4);
      ctx.lineTo(bodyX - offset, bodyY - offset);
      ctx.lineTo(bodyX - offset + 4, bodyY - offset);
      ctx.moveTo(bodyX + offset, bodyY + offset - 4);
      ctx.lineTo(bodyX + offset, bodyY + offset);
      ctx.lineTo(bodyX + offset - 4, bodyY + offset);
      ctx.stroke();
    }

    ctx.fillStyle = isSelected ? '#00f0ff' : '#ffffff';
    ctx.font = isSelected ? 'bold 12px Inter, sans-serif' : '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(body.name, bodyX, bodyY + r + 16);

    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '10px monospace';
    ctx.fillText(
      `${body.featuredImgSymbol} ${body.category.toUpperCase()}`,
      bodyX,
      bodyY + r + 28
    );
  }
}
