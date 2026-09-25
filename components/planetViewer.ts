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
  private onSelectCallback?: (body: CelestialBody) => void;

  constructor(
    canvasId: string,
    bodies: CelestialBody[],
    onSelect?: (body: CelestialBody) => void
  ) {
    const el = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!el) {
      throw new Error(`Canvas with id ${canvasId} not found`);
    }
    this.canvas = el;
    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not acquire 2D canvas context');
    }
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
    this.canvas.width = rect ? rect.width : window.innerWidth;
    this.canvas.height = rect ? rect.height : 600;
  }

  private initStarfield(): void {
    this.stars = [];
    const starCount = 200;
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 0.5,
        brightness: Math.random(),
        twinkleSpeed: (Math.random() - 0.5) * 0.02,
      });
    }
  }

  private initAngles(): void {
    this.bodies.forEach((body, idx) => {
      // Offset initial angles so planets are distributed around orbit
      this.angles.set(body.id, (idx * (Math.PI * 2)) / this.bodies.length);
    });
  }

  private attachEventListeners(): void {
    window.addEventListener('resize', () => {
      this.initCanvasSize();
      this.initStarfield();
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      this.checkHover(mouseX, mouseY);
    });

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const clickedBody = this.getBodyAtPosition(mouseX, mouseY);
      if (clickedBody) {
        this.selectBody(clickedBody.id);
      }
    });
  }

  private getBodyAtPosition(x: number, y: number): CelestialBody | null {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    for (const body of this.bodies) {
      const angle = this.angles.get(body.id) || 0;
      const bodyX = centerX + Math.cos(angle) * body.orbitDistance;
      const bodyY = centerY + Math.sin(angle) * (body.orbitDistance * 0.45); // Elliptical perspective
      const dist = Math.hypot(x - bodyX, y - bodyY);

      if (dist <= body.radius + 10) {
        return body;
      }
    }
    return null;
  }

  private checkHover(x: number, y: number): void {
    const hovered = this.getBodyAtPosition(x, y);
    this.hoveredBodyId = hovered ? hovered.id : null;
    this.canvas.style.cursor = hovered ? 'pointer' : 'default';
  }

  public selectBody(bodyId: string): void {
    this.selectedBodyId = bodyId;
    const body = this.bodies.find((b) => b.id === bodyId);
    if (body && this.onSelectCallback) {
      this.onSelectCallback(body);
    }
  }

  public startAnimation(): void {
    const render = () => {
      this.updateState();
      this.draw();
      this.animationFrameId = requestAnimationFrame(render);
    };
    render();
  }

  public stopAnimation(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private updateState(): void {
    // Update planet angles
    this.bodies.forEach((body) => {
      const current = this.angles.get(body.id) || 0;
      this.angles.set(body.id, current + body.orbitSpeed);
    });

    // Update star twinkle
    this.stars.forEach((star) => {
      star.brightness += star.twinkleSpeed;
      if (star.brightness > 1 || star.brightness < 0.2) {
        star.twinkleSpeed = -star.twinkleSpeed;
      }
    });

    // Random meteor spawn
    if (Math.random() < 0.02 && this.meteors.length < 3) {
      this.meteors.push({
        x: Math.random() * this.canvas.width * 0.8,
        y: Math.random() * this.canvas.height * 0.3,
        length: Math.random() * 80 + 40,
        speed: Math.random() * 8 + 6,
        opacity: 1,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
      });
    }

    // Update meteors
    this.meteors = this.meteors.filter((meteor) => {
      meteor.x += Math.cos(meteor.angle) * meteor.speed;
      meteor.y += Math.sin(meteor.angle) * meteor.speed;
      meteor.opacity -= 0.015;
      return meteor.opacity > 0;
    });
  }

  private draw(): void {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);

    // 1. Deep Space Gradient Background
    const bgGrad = this.ctx.createRadialGradient(
      width / 2,
      height / 2,
      50,
      width / 2,
      height / 2,
      Math.max(width, height) / 1.2
    );
    bgGrad.addColorStop(0, '#0a0d1e');
    bgGrad.addColorStop(0.5, '#050714');
    bgGrad.addColorStop(1, '#020308');
    this.ctx.fillStyle = bgGrad;
    this.ctx.fillRect(0, 0, width, height);

    // 2. Render Starfield
    this.stars.forEach((star) => {
      this.ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // 3. Render Meteors
    this.meteors.forEach((m) => {
      const tailX = m.x - Math.cos(m.angle) * m.length;
      const tailY = m.y - Math.sin(m.angle) * m.length;

      const grad = this.ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      grad.addColorStop(0, `rgba(0, 240, 255, ${m.opacity})`);
      grad.addColorStop(1, `rgba(0, 240, 255, 0)`);

      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(m.x, m.y);
      this.ctx.lineTo(tailX, tailY);
      this.ctx.stroke();
    });

    const centerX = width / 2;
    const centerY = height / 2;

    // 4. Render Central Star / Space Station Gateway Core
    const sunGrad = this.ctx.createRadialGradient(
      centerX,
      centerY,
      5,
      centerX,
      centerY,
      35
    );
    sunGrad.addColorStop(0, '#ffffff');
    sunGrad.addColorStop(0.4, '#00f0ff');
    sunGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');

    this.ctx.fillStyle = sunGrad;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, 35, 0, Math.PI * 2);
    this.ctx.fill();

    // Core icon/text
    this.ctx.fillStyle = '#050714';
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = '#00f0ff';
    this.ctx.font = 'bold 10px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('SOL', centerX, centerY);

    // 5. Render Orbits & Bodies
    this.bodies.forEach((body) => {
      const angle = this.angles.get(body.id) || 0;
      const bodyX = centerX + Math.cos(angle) * body.orbitDistance;
      const bodyY = centerY + Math.sin(angle) * (body.orbitDistance * 0.45);

      const isSelected = this.selectedBodyId === body.id;
      const isHovered = this.hoveredBodyId === body.id;

      // Draw Orbit Path
      this.ctx.strokeStyle = isSelected
        ? 'rgba(0, 240, 255, 0.4)'
        : isHovered
        ? 'rgba(255, 255, 255, 0.25)'
        : 'rgba(255, 255, 255, 0.08)';
      this.ctx.lineWidth = isSelected ? 2 : 1;
      this.ctx.setLineDash(body.category === 'satellite' ? [4, 4] : []);
      this.ctx.beginPath();
      this.ctx.ellipse(
        centerX,
        centerY,
        body.orbitDistance,
        body.orbitDistance * 0.45,
        0,
        0,
        Math.PI * 2
      );
      this.ctx.stroke();
      this.ctx.setLineDash([]);

      // Body Glow
      const auraRad = body.radius * (isSelected ? 2.5 : isHovered ? 2.0 : 1.5);
      const glowGrad = this.ctx.createRadialGradient(
        bodyX,
        bodyY,
        body.radius * 0.5,
        bodyX,
        bodyY,
        auraRad
      );
      glowGrad.addColorStop(0, body.color);
      glowGrad.addColorStop(1, 'rgba(0,0,0,0)');

      this.ctx.fillStyle = glowGrad;
      this.ctx.beginPath();
      this.ctx.arc(bodyX, bodyY, auraRad, 0, Math.PI * 2);
      this.ctx.fill();

      // Body Solid Core
      this.ctx.fillStyle = body.color;
      this.ctx.beginPath();
      this.ctx.arc(bodyX, bodyY, body.radius, 0, Math.PI * 2);
      this.ctx.fill();

      // Shadow overlay for 3D sphere feel
      const shadowGrad = this.ctx.createRadialGradient(
        bodyX - body.radius * 0.4,
        bodyY - body.radius * 0.4,
        body.radius * 0.1,
        bodyX + body.radius * 0.3,
        bodyY + body.radius * 0.3,
        body.radius * 1.2
      );
      shadowGrad.addColorStop(0, 'rgba(255,255,255,0.4)');
      shadowGrad.addColorStop(0.5, 'rgba(0,0,0,0.1)');
      shadowGrad.addColorStop(1, 'rgba(0,0,0,0.85)');

      this.ctx.fillStyle = shadowGrad;
      this.ctx.beginPath();
      this.ctx.arc(bodyX, bodyY, body.radius, 0, Math.PI * 2);
      this.ctx.fill();

      // Selection Ring HUD
      if (isSelected || isHovered) {
        this.ctx.strokeStyle = isSelected ? '#00f0ff' : '#7000ff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(bodyX, bodyY, body.radius + 6, 0, Math.PI * 2);
        this.ctx.stroke();

        // HUD crosshairs
        this.ctx.strokeStyle = '#00f0ff';
        this.ctx.lineWidth = 1;
        const offset = body.radius + 10;
        this.ctx.beginPath();
        // Top-Left corner tick
        this.ctx.moveTo(bodyX - offset, bodyY - offset + 4);
        this.ctx.lineTo(bodyX - offset, bodyY - offset);
        this.ctx.lineTo(bodyX - offset + 4, bodyY - offset);
        // Bottom-Right corner tick
        this.ctx.moveTo(bodyX + offset, bodyY + offset - 4);
        this.ctx.lineTo(bodyX + offset, bodyY + offset);
        this.ctx.lineTo(bodyX + offset - 4, bodyY + offset);
        this.ctx.stroke();
      }

      // Label & Icon Symbol
      this.ctx.fillStyle = isSelected ? '#00f0ff' : '#ffffff';
      this.ctx.font = isSelected
        ? 'bold 12px Inter, sans-serif'
        : '11px Inter, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(body.name, bodyX, bodyY + body.radius + 16);

      // Symbol
      this.ctx.fillStyle = 'rgba(255,255,255,0.7)';
      this.ctx.font = '10px monospace';
      this.ctx.fillText(
        `${body.featuredImgSymbol} ${body.category.toUpperCase()}`,
        bodyX,
        bodyY + body.radius + 28
      );
    });
  }
}
