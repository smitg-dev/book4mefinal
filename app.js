// bookfromspace.js
// booking widget for the space tourism site - single file so it's easy to drop in
// NOTE: reservations just live in localStorage for now, swap for a real API later

(function () {
  'use strict';

  // ---- destinations ----
  // TODO: pull this from a CMS/API once we have one, hardcoding for the demo
  const CELESTIAL_BODIES = [
    {
      id: 'mars',
      name: 'Mars (Ares Hub)',
      category: 'planet',
      tagline: 'The Red Frontier & Olympus Mons Gateway',
      description: 'Home to the iconic Valles Marineris and humanity\'s prime terraforming sector. Features pressurized luxury domes, rover expeditions, and low-g skydiving.',
      distanceFromEarth: '225 Million km',
      gravity: '0.38g',
      temperature: '-63°C',
      atmosphere: '95% CO2',
      orbitalPeriod: '687 Earth Days',
      color: '#ff5533',
      secondaryColor: '#aa2200',
      radius: 22,
      orbitDistance: 170,
      orbitSpeed: 0.003,
      servicesCount: 3,
      featuredImgSymbol: '🔴',
    },
    {
      id: 'moon',
      name: 'Luna Gateway (Moon)',
      category: 'moon',
      tagline: "Earth's Orbital Companion & Shackleton Outpost",
      description: 'The closest cosmic destination featuring permanent lunar habitat suites, dark-side observatories, and historical Apollo landing site tours.',
      distanceFromEarth: '384,400 km',
      gravity: '0.166g',
      temperature: '-130°C to +120°C',
      atmosphere: 'Exosphere',
      orbitalPeriod: '27.3 Earth Days',
      color: '#d0d5dd',
      secondaryColor: '#88909d',
      radius: 16,
      orbitDistance: 110,
      orbitSpeed: 0.006,
      servicesCount: 3,
      featuredImgSymbol: '🌕',
    },
    {
      id: 'europa',
      name: 'Europa Cryo Terminal',
      category: 'moon',
      tagline: "Jupiter's Ocean Moon & Sub-Surface Habitat",
      description: 'A subterranean liquid ocean beneath 15km of pristine ice. Experience sub-ice submersible explorations and Jupiter\'s breathtaking giant horizon.',
      distanceFromEarth: '628 Million km',
      gravity: '0.134g',
      temperature: '-160°C',
      atmosphere: 'Trace Oxygen',
      orbitalPeriod: '3.5 Earth Days',
      color: '#00ccff',
      secondaryColor: '#0066aa',
      radius: 18,
      orbitDistance: 240,
      orbitSpeed: 0.002,
      servicesCount: 2,
      featuredImgSymbol: '🧊',
    },
    {
      id: 'iss',
      name: 'ISS Orbital Hotel',
      category: 'satellite',
      tagline: 'Low Earth Orbit Microgravity Laboratory & Resort',
      description: 'Orbit Earth every 90 minutes with 16 daily sunrises. Features zero-g astronaut training, spacewalk excursions, and panoramic Cupola views.',
      distanceFromEarth: '408 km',
      gravity: '0.00g (Microgravity)',
      temperature: 'Station Controlled (21°C)',
      atmosphere: 'Standard Nitrogen/Oxygen',
      orbitalPeriod: '92 Minutes',
      color: '#00ffaa',
      secondaryColor: '#008855',
      radius: 12,
      orbitDistance: 70,
      orbitSpeed: 0.012,
      servicesCount: 3,
      featuredImgSymbol: '🛰️',
    },
    {
      id: 'titan',
      name: 'Titan Saturn Outpost',
      category: 'moon',
      tagline: 'Saturnian Cloud Gliding & Hydrocarbon Seas',
      description: 'Dense golden atmosphere allowing humans to fly with simple mechanical wings! Includes Titan sea cruises on liquid methane lakes.',
      distanceFromEarth: '1.4 Billion km',
      gravity: '0.138g',
      temperature: '-179°C',
      atmosphere: '98% Nitrogen, Methane',
      orbitalPeriod: '15.9 Earth Days',
      color: '#ffaa00',
      secondaryColor: '#995500',
      radius: 20,
      orbitDistance: 310,
      orbitSpeed: 0.0015,
      servicesCount: 2,
      featuredImgSymbol: '🪐',
    },
    {
      id: 'jwst',
      name: 'JWST Deep Relayer',
      category: 'satellite',
      tagline: 'Lagrange Point L2 Quantum Observatory',
      description: 'Positioned 1.5M km behind Earth in deep space. Exclusive access to quantum satellite telemetry, infrared galaxy mapping, and quiet isolation.',
      distanceFromEarth: '1.5 Million km (L2)',
      gravity: 'Microgravity',
      temperature: '-233°C (Shielded Side)',
      atmosphere: 'Vacuum',
      orbitalPeriod: 'Solar Orbit (L2)',
      color: '#ffd700',
      secondaryColor: '#b39200',
      radius: 14,
      orbitDistance: 370,
      orbitSpeed: 0.001,
      servicesCount: 1,
      featuredImgSymbol: '🔭',
    },
  ];

  const SERVICES = [
    { id: 'srv-mars-1', destinationId: 'mars', title: 'Ares Dome Luxury Hotel & Olympus Base Stay', category: 'hotel', duration: '14 Days (Includes Orbit Transit)', pricePerPersonUSD: 450000, description: 'Stay in pressurized transparent habitat domes overlooking the red Martian desert. Includes gourmet freeze-dried & hydroponic dining.', highlights: ['Olympus Mons view suite', 'Low-g gym', 'Pressurized Rover Tour'], icon: '🏨', availability: 'Available' },
    { id: 'srv-mars-2', destinationId: 'mars', title: 'Valles Marineris Grand Canyon Expedition', category: 'expedition', duration: '5 Days', pricePerPersonUSD: 180000, description: "Guided multi-day electric rover journey through the solar system's largest canyon system.", highlights: ['Geological core sampling', 'Cliffside observation deck', 'Drone photography'], icon: '🚙', availability: 'High Demand' },
    { id: 'srv-mars-3', destinationId: 'mars', title: 'Martian Terraforming & Bio-Dome Tech Tour', category: 'training', duration: '3 Days', pricePerPersonUSD: 95000, description: 'Hands-on engineering workshop with top planetary scientists shaping Mars atmosphere.', highlights: ['Algae farm inspection', 'Atmosphere generator controls', 'Certificate'], icon: '🌱', availability: 'Available' },
    { id: 'srv-moon-1', destinationId: 'moon', title: 'Shackleton Crater South Pole Habitat Stay', category: 'hotel', duration: '7 Days', pricePerPersonUSD: 220000, description: 'Located on the rim of Shackleton Crater with eternal sunlight solar energy and water-ice mining vistas.', highlights: ['Earth-rise viewing lounge', 'Lunar dust sauna', 'Zero-g ice skating'], icon: '🏨', availability: 'Available' },
    { id: 'srv-moon-2', destinationId: 'moon', title: 'Apollo 11 Historic Site & Buggy Safari', category: 'expedition', duration: '2 Days', pricePerPersonUSD: 85000, description: 'Visit Tranquility Base from a safe historic preservation distance aboard a glass-canopy lunar buggy.', highlights: ['Historic footprint observation', 'Moonwalk photo session', 'Commemorative coin'], icon: '🏎️', availability: 'Available' },
    { id: 'srv-moon-3', destinationId: 'moon', title: 'Lunar Express Point-to-Point Shuttle', category: 'transport', duration: '3 Days Transit', pricePerPersonUSD: 150000, description: 'Direct rapid transit flight between Earth Orbit and Lunar Gateway with zero-g lounge amenities.', highlights: ['Private capsule seat', 'Starlink Deep Space Wi-Fi', 'Complimentary suit fitting'], icon: '🚀', availability: 'Available' },
    { id: 'srv-europa-1', destinationId: 'europa', title: 'Cryo-Ocean Submersible Deep Dive', category: 'expedition', duration: '10 Days', pricePerPersonUSD: 890000, description: "Descend into the dark liquid ocean beneath Europa's ice crust inside a titanium sub-surface submersible.", highlights: ['Thermal vent inspection', 'Bioluminescent life scan', 'Jupiter skyline view'], icon: '🌊', availability: 'Waitlist' },
    { id: 'srv-europa-2', destinationId: 'europa', title: 'Jovian Horizon Sky Suite & Ice Spa', category: 'hotel', duration: '12 Days', pricePerPersonUSD: 640000, description: "Watch Jupiter's Great Red Spot float across the sky from a heated orbital glass habitat station.", highlights: ['Jupiter radiation shield room', 'Cryo-massage spa', 'Deep space dining'], icon: '✨', availability: 'High Demand' },
    { id: 'srv-iss-1', destinationId: 'iss', title: 'Microgravity Spacewalk EVA Experience', category: 'satellite', duration: '4 Hours Active EVA (3 Day Stay)', pricePerPersonUSD: 310000, description: 'Tether up, open the airlock, and step into vacuum with Earth spinning beneath your feet.', highlights: ['EMU Spacesuit certified', '360 Helmet 8K Recording', 'Certified EVA Patch'], icon: '🧑‍🚀', availability: 'High Demand' },
    { id: 'srv-iss-2', destinationId: 'iss', title: 'Zero-G Astronaut Flight School', category: 'training', duration: '5 Days', pricePerPersonUSD: 120000, description: 'Complete official orbital flight maneuvers, emergency airlock drills, and microgravity acrobatics.', highlights: ['Official Wings Badge', 'Centrifuge flight prep', 'Personalized flight manual'], icon: '🎓', availability: 'Available' },
    { id: 'srv-iss-3', destinationId: 'iss', title: 'Cupola Earth Viewing Lounge Stay', category: 'hotel', duration: '4 Days', pricePerPersonUSD: 195000, description: 'Relax in the world-famous 7-window cupola module as Earth rotates under orbital sunlight.', highlights: ['16 Sunrises per day', 'Zero-g espresso bar', 'Astronaut meet-and-greet'], icon: '🌍', availability: 'Available' },
    { id: 'srv-titan-1', destinationId: 'titan', title: 'Atmospheric Wingsuit Gliding Flight', category: 'expedition', duration: '6 Days', pricePerPersonUSD: 520000, description: "Titan's thick atmosphere and low gravity mean human arms with wings can fly like a bird!", highlights: ['Custom wing-rig', 'Methane cloud soaring', 'Safety drone tether'], icon: '🦅', availability: 'High Demand' },
    { id: 'srv-titan-2', destinationId: 'titan', title: 'Kraken Mare Liquid Methane Yacht Cruise', category: 'hotel', duration: '8 Days', pricePerPersonUSD: 780000, description: "Sail across Titan's vast liquid hydrocarbon ocean aboard an insulated luxury hover-yacht.", highlights: ['Sub-zero heated cabin', 'Saturn ring viewing deck', 'Hydrocarbon tasting menu'], icon: '⛵', availability: 'Available' },
    { id: 'srv-jwst-1', destinationId: 'jwst', title: 'L2 Quantum Telescope Relayer VIP Observation', category: 'satellite', duration: '3 Days Orbital', pricePerPersonUSD: 390000, description: 'Dock alongside the James Webb Observatory at Lagrange Point L2 for silent deep-space stargazing.', highlights: ['Infrared telescope access', 'Zero cosmic noise', 'Gold-plated mirror selfie'], icon: '📡', availability: 'Waitlist' },
  ];

  const LAUNCH_VEHICLES = [
    { id: 'lv-starship', name: 'SpaceX Starship Super Heavy Mk-IV', provider: 'SpaceX Interplanetary', payloadCapacity: '150 Tons', transitTime: 'Optimized Rapid Trajectory', priceMultiplier: 1.0 },
    { id: 'lv-newglenn', name: 'Blue Origin New Glenn Orbital', provider: 'Blue Origin Orbital Systems', payloadCapacity: '45 Tons', transitTime: 'Standard Orbital Transfer', priceMultiplier: 1.15 },
    { id: 'lv-orion', name: 'Orion SLS Deep Space Capsule', provider: 'NASA / Lockheed Martin', payloadCapacity: '27 Tons', transitTime: 'High-Velocity Direct Injection', priceMultiplier: 1.3 },
  ];

  const SPACEPORTS = [
    { id: 'sp-ksc', name: 'Kennedy Spaceport Launch Complex 39A', location: 'Cape Canaveral, FL, USA', code: 'KSC' },
    { id: 'sp-starbase', name: 'Starbase Gateway & Orbital Pad 1', location: 'Boca Chica, TX, USA', code: 'STB' },
    { id: 'sp-tokyo', name: 'Tokyo Pacific Floating Oceanport', location: 'Tokyo Bay, Japan', code: 'TYO-SP' },
    { id: 'sp-guiana', name: 'Guiana Space Centre Equatorial Hub', location: 'Kourou, French Guiana', code: 'CSG' },
  ];

  const ADDONS = [
    { id: 'add-suit', name: 'Custom Tailored Spacesuit (Keep as Souvenir)', priceUSD: 25000, description: 'Bespoke pressurized flight suit made to your exact body measurements.' },
    { id: 'add-training', name: 'Microgravity Acclimatization Simulator Pass', priceUSD: 8500, description: '2-Day parabolic flight & centrifuge simulator prep before launch.' },
    { id: 'add-rad', name: 'Enhanced Electromagnetic Shielding Capsule', priceUSD: 12000, description: 'Medical grade cosmic radiation defense lining in your private cabin.' },
    { id: 'add-quantum', name: 'Quantum Comms Pass (Unlimited Starlink L2)', priceUSD: 4500, description: 'High-speed sub-millisecond video calling back to Earth.' },
  ];

  // little sound effects thing, nothing fancy - just beeps and a warp whoosh
  class SoundFX {
    constructor() {
      this.audioCtx = null;
      this.enabled = true;
    }

    initCtx() {
      if (this.audioCtx || typeof window === 'undefined') return;
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) this.audioCtx = new AudioCtxClass();
    }

    toggleSound() {
      this.enabled = !this.enabled;
      return this.enabled;
    }

    playBeep(freq, durationMs) {
      freq = freq || 800;
      durationMs = durationMs || 80;
      if (!this.enabled) return;
      this.initCtx();
      if (!this.audioCtx) return;
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + durationMs / 1000);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + durationMs / 1000);
      } catch (e) {
        // audio context can throw on some mobile browsers if not user-triggered, just ignore
      }
    }

    playWarp() {
      if (!this.enabled) return;
      this.initCtx();
      if (!this.audioCtx) return;
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.35);
      } catch (e) {}
    }
  }

  // draws the little orbit map with the sun in the middle + planets going around it.
  // basically a fake solar system, distances/speeds are NOT to scale, just made them look nice
  class PlanetViewer {
    constructor(canvasId, bodies, onSelect) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      this.bodies = bodies;
      this.onSelectCallback = onSelect;
      this.stars = [];
      this.meteors = [];
      this.angles = new Map();
      this.selectedBodyId = null;
      this.hoveredBodyId = null;
      this.animId = null;

      this.initCanvasSize();
      this.initStarfield();
      this.initAngles();
      this.attachEvents();
    }

    initCanvasSize() {
      const rect = this.canvas.parentElement ? this.canvas.parentElement.getBoundingClientRect() : null;
      this.canvas.width = rect ? rect.width : window.innerWidth;
      this.canvas.height = rect ? rect.height : 600;
    }

    initStarfield() {
      this.stars = [];
      for (let i = 0; i < 200; i++) {
        this.stars.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          size: Math.random() * 2 + 0.5,
          brightness: Math.random(),
          twinkleSpeed: (Math.random() - 0.5) * 0.02,
        });
      }
    }

    initAngles() {
      this.bodies.forEach((body, idx) => {
        this.angles.set(body.id, (idx * (Math.PI * 2)) / this.bodies.length);
      });
    }

    attachEvents() {
      window.addEventListener('resize', () => {
        this.initCanvasSize();
        this.initStarfield();
      });

      this.canvas.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const hovered = this.getBodyAtPosition(x, y);
        this.hoveredBodyId = hovered ? hovered.id : null;
        this.canvas.style.cursor = hovered ? 'pointer' : 'default';
      });

      this.canvas.addEventListener('click', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const clicked = this.getBodyAtPosition(x, y);
        if (clicked) this.selectBody(clicked.id);
      });
    }

    getBodyAtPosition(x, y) {
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;

      for (const body of this.bodies) {
        const angle = this.angles.get(body.id) || 0;
        const bodyX = centerX + Math.cos(angle) * body.orbitDistance;
        // 0.45 flattens the circle into more of an ellipse so it reads as "orbit" from this angle
        const bodyY = centerY + Math.sin(angle) * (body.orbitDistance * 0.45);
        if (Math.hypot(x - bodyX, y - bodyY) <= body.radius + 10) return body;
      }
      return null;
    }

    selectBody(bodyId) {
      this.selectedBodyId = bodyId;
      const body = this.bodies.find((b) => b.id === bodyId);
      if (body && this.onSelectCallback) this.onSelectCallback(body);
    }

    startAnimation() {
      const render = () => {
        this.update();
        this.draw();
        this.animId = requestAnimationFrame(render);
      };
      render();
    }

    update() {
      this.bodies.forEach((body) => {
        const cur = this.angles.get(body.id) || 0;
        this.angles.set(body.id, cur + body.orbitSpeed);
      });

      this.stars.forEach((s) => {
        s.brightness += s.twinkleSpeed;
        if (s.brightness > 1 || s.brightness < 0.2) s.twinkleSpeed = -s.twinkleSpeed;
      });

      // spawn a meteor every once in a while, cap it at 3 on screen so it doesn't get silly
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

      this.meteors = this.meteors.filter((m) => {
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.opacity -= 0.015;
        return m.opacity > 0;
      });
    }

    draw() {
      const w = this.canvas.width;
      const h = this.canvas.height;
      this.ctx.clearRect(0, 0, w, h);

      // background
      const bgGrad = this.ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, Math.max(w, h) / 1.2);
      bgGrad.addColorStop(0, '#0a0d1e');
      bgGrad.addColorStop(0.5, '#050714');
      bgGrad.addColorStop(1, '#020308');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, h);

      this.stars.forEach((s) => {
        this.ctx.fillStyle = `rgba(255, 255, 255, ${s.brightness})`;
        this.ctx.beginPath();
        this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        this.ctx.fill();
      });

      this.meteors.forEach((m) => {
        const tx = m.x - Math.cos(m.angle) * m.length;
        const ty = m.y - Math.sin(m.angle) * m.length;
        const g = this.ctx.createLinearGradient(m.x, m.y, tx, ty);
        g.addColorStop(0, `rgba(0, 240, 255, ${m.opacity})`);
        g.addColorStop(1, `rgba(0, 240, 255, 0)`);
        this.ctx.strokeStyle = g;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(m.x, m.y);
        this.ctx.lineTo(tx, ty);
        this.ctx.stroke();
      });

      const cx = w / 2;
      const cy = h / 2;

      // sun in the middle
      const sunGrad = this.ctx.createRadialGradient(cx, cy, 5, cx, cy, 35);
      sunGrad.addColorStop(0, '#ffffff');
      sunGrad.addColorStop(0.4, '#00f0ff');
      sunGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
      this.ctx.fillStyle = sunGrad;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, 35, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#050714';
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = '#00f0ff';
      this.ctx.font = 'bold 10px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText('SOL', cx, cy);

      this.bodies.forEach((body) => {
        const angle = this.angles.get(body.id) || 0;
        const bx = cx + Math.cos(angle) * body.orbitDistance;
        const by = cy + Math.sin(angle) * (body.orbitDistance * 0.45);
        const isSel = this.selectedBodyId === body.id;
        const isHov = this.hoveredBodyId === body.id;

        // orbit path
        this.ctx.strokeStyle = isSel ? 'rgba(0, 240, 255, 0.4)' : isHov ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)';
        this.ctx.lineWidth = isSel ? 2 : 1;
        this.ctx.setLineDash(body.category === 'satellite' ? [4, 4] : []);
        this.ctx.beginPath();
        this.ctx.ellipse(cx, cy, body.orbitDistance, body.orbitDistance * 0.45, 0, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // glow behind the planet
        const aura = body.radius * (isSel ? 2.5 : isHov ? 2.0 : 1.5);
        const glow = this.ctx.createRadialGradient(bx, by, body.radius * 0.5, bx, by, aura);
        glow.addColorStop(0, body.color);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        this.ctx.fillStyle = glow;
        this.ctx.beginPath();
        this.ctx.arc(bx, by, aura, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = body.color;
        this.ctx.beginPath();
        this.ctx.arc(bx, by, body.radius, 0, Math.PI * 2);
        this.ctx.fill();

        // cheap fake-3D shading so it doesn't look like a flat circle
        const sh = this.ctx.createRadialGradient(bx - body.radius * 0.4, by - body.radius * 0.4, body.radius * 0.1, bx + body.radius * 0.3, by + body.radius * 0.3, body.radius * 1.2);
        sh.addColorStop(0, 'rgba(255,255,255,0.4)');
        sh.addColorStop(0.5, 'rgba(0,0,0,0.1)');
        sh.addColorStop(1, 'rgba(0,0,0,0.85)');
        this.ctx.fillStyle = sh;
        this.ctx.beginPath();
        this.ctx.arc(bx, by, body.radius, 0, Math.PI * 2);
        this.ctx.fill();

        if (isSel || isHov) {
          this.ctx.strokeStyle = isSel ? '#00f0ff' : '#7000ff';
          this.ctx.lineWidth = 2;
          this.ctx.beginPath();
          this.ctx.arc(bx, by, body.radius + 6, 0, Math.PI * 2);
          this.ctx.stroke();
        }

        this.ctx.fillStyle = isSel ? '#00f0ff' : '#ffffff';
        this.ctx.font = isSel ? 'bold 12px Inter, sans-serif' : '11px Inter, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(body.name, bx, by + body.radius + 16);

        this.ctx.fillStyle = 'rgba(255,255,255,0.7)';
        this.ctx.font = '10px monospace';
        this.ctx.fillText(`${body.featuredImgSymbol} ${body.category.toUpperCase()}`, bx, by + body.radius + 28);
      });
    }
  }

  class BookFromSpaceApp {
    constructor() {
      this.soundFX = new SoundFX();
      this.selectedDest = 'mars';
      this.selectedCat = 'all';
      this.searchQuery = '';
      this.reservations = this.loadReservations();
      this.currentStep = 1;
      this.formData = {
        destinationId: 'mars',
        serviceId: 'srv-mars-1',
        spaceportId: 'sp-ksc',
        launchVehicleId: 'lv-starship',
        departureDate: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
        returnDate: new Date(Date.now() + 86400000 * 21).toISOString().split('T')[0],
        passengers: 1,
        travelClass: 'Tourist',
        passengerName: '',
        passengerEmail: '',
        addons: [],
      };

      this.planetViewer = new PlanetViewer('spaceCanvas', CELESTIAL_BODIES, (b) => this.onSelectPlanet(b));
      this.planetViewer.startAnimation();
      this.planetViewer.selectBody('mars');

      this.bindEvents();
      this.renderTelemetry();
      this.renderServices();
      this.renderReservations();
    }

    loadReservations() {
      try {
        return JSON.parse(localStorage.getItem('bookfromspace_reservations') || '[]');
      } catch (e) {
        console.warn('could not read saved reservations, starting fresh', e);
        return [];
      }
    }

    saveReservations() {
      try {
        localStorage.setItem('bookfromspace_reservations', JSON.stringify(this.reservations));
      } catch (e) {
        console.warn('failed to save reservations to localStorage', e);
      }
    }

    onSelectPlanet(body) {
      this.soundFX.playBeep(900, 60);
      this.selectedDest = body.id;
      this.formData.destinationId = body.id;

      const card = document.getElementById('bodyInfoCard');
      if (card) {
        card.innerHTML = `
          <div class="hud-card-header" style="border-left-color: ${body.color}">
            <div>
              <span class="hud-badge">${body.category.toUpperCase()}</span>
              <h3 style="color: ${body.color}">${body.name}</h3>
              <p class="hud-tagline">${body.tagline}</p>
            </div>
            <span class="hud-symbol">${body.featuredImgSymbol}</span>
          </div>
          <p class="hud-desc">${body.description}</p>
          <div class="hud-grid">
            <div class="hud-metric"><span class="metric-label">Distance</span><span class="metric-val">${body.distanceFromEarth}</span></div>
            <div class="hud-metric"><span class="metric-label">Gravity</span><span class="metric-val">${body.gravity}</span></div>
            <div class="hud-metric"><span class="metric-label">Surface Temp</span><span class="metric-val">${body.temperature}</span></div>
            <div class="hud-metric"><span class="metric-label">Atmosphere</span><span class="metric-val">${body.atmosphere}</span></div>
          </div>
          <div class="hud-actions">
            <button class="btn btn-primary" id="btnBookThisBody">⚡ Reserve Service on ${body.name.split(' ')[0]}</button>
          </div>
        `;

        document.getElementById('btnBookThisBody')?.addEventListener('click', () => this.openBookingModal());
      }

      document.querySelectorAll('.dest-pill').forEach((pill) => {
        pill.classList.toggle('active', pill.getAttribute('data-dest') === body.id);
      });

      this.renderServices();
    }

    renderTelemetry() {
      // this is all fake/decorative for now, just makes the header feel alive
      const bar = document.getElementById('telemetryBar');
      if (!bar) return;
      bar.innerHTML = `
        <div class="t-item"><span class="t-dot dot-green"></span> Solar Flares: <strong>Low</strong></div>
        <div class="t-item"><span class="t-dot dot-blue"></span> Geomagnetic Shield: <strong>94%</strong></div>
        <div class="t-item"><span class="t-dot dot-cyan"></span> Radiation Index: <strong>18 mSv</strong></div>
        <div class="t-item"><span class="t-dot dot-green"></span> Micrometeorite Risk: <strong>Minimal</strong></div>
        <div class="t-item"><span class="t-dot dot-purple"></span> Quantum Relay: <strong>Optimal</strong></div>
      `;
    }

    renderServices() {
      const grid = document.getElementById('servicesGrid');
      if (!grid) return;

      const q = this.searchQuery.toLowerCase();
      const filtered = SERVICES.filter((s) => {
        const mDest = this.selectedDest === 'all' || s.destinationId === this.selectedDest;
        const mCat = this.selectedCat === 'all' || s.category === this.selectedCat;
        const mQ = !q || s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
        return mDest && mCat && mQ;
      });

      if (filtered.length === 0) {
        grid.innerHTML = `<div class="empty-state"><p>📡 No orbital services match your telemetry search criteria.</p></div>`;
        return;
      }

      grid.innerHTML = filtered
        .map((s) => {
          const body = CELESTIAL_BODIES.find((b) => b.id === s.destinationId);
          return `
          <div class="service-card">
            <div class="card-badge-row">
              <span class="badge badge-avail ${s.availability.toLowerCase().replace(' ', '-')}">${s.availability}</span>
              <span class="badge badge-dest">${body ? body.name : s.destinationId}</span>
            </div>
            <div class="card-icon">${s.icon}</div>
            <h4 class="card-title">${s.title}</h4>
            <p class="card-duration">⏱️ ${s.duration}</p>
            <p class="card-desc">${s.description}</p>
            <ul class="card-highlights">${s.highlights.map((h) => `<li>✨ ${h}</li>`).join('')}</ul>
            <div class="card-footer">
              <div class="price-tag">
                <span class="price-lbl">Starting from</span>
                <span class="price-val">$${s.pricePerPersonUSD.toLocaleString()} USD</span>
              </div>
              <button class="btn btn-outline btn-book-svc" data-svc-id="${s.id}">Book Mission</button>
            </div>
          </div>
        `;
        })
        .join('');

      grid.querySelectorAll('.btn-book-svc').forEach((btn) => {
        btn.addEventListener('click', (e) => this.openBookingModal(e.currentTarget.getAttribute('data-svc-id')));
      });
    }

    bindEvents() {
      document.getElementById('btnToggleSound')?.addEventListener('click', (e) => {
        const on = this.soundFX.toggleSound();
        e.currentTarget.textContent = on ? '🔊 Audio FX: ON' : '🔇 Audio FX: OFF';
      });

      document.querySelectorAll('.dest-pill').forEach((pill) => {
        pill.addEventListener('click', (e) => {
          const dest = e.currentTarget.getAttribute('data-dest');
          this.selectedDest = dest;
          if (dest !== 'all') {
            this.planetViewer.selectBody(dest);
          } else {
            this.renderServices();
          }
        });
      });

      document.getElementById('categoryFilter')?.addEventListener('change', (e) => {
        this.selectedCat = e.target.value;
        this.renderServices();
      });

      document.getElementById('searchInput')?.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderServices();
      });

      document.querySelectorAll('.nav-tab').forEach((tab) => {
        tab.addEventListener('click', (e) => {
          const view = e.currentTarget.getAttribute('data-tab');
          document.querySelectorAll('.nav-tab').forEach((t) => t.classList.remove('active'));
          e.currentTarget.classList.add('active');

          const exp = document.getElementById('exploreView');
          const book = document.getElementById('bookingsView');
          const vrView = document.getElementById('vrTourView');

          // just toggling display:block/none between the three main views
          if (view === 'explore') {
            if (exp) exp.style.display = 'block';
            if (book) book.style.display = 'none';
            if (vrView) vrView.style.display = 'none';
          } else if (view === 'vr-tour') {
            if (exp) exp.style.display = 'none';
            if (book) book.style.display = 'none';
            if (vrView) vrView.style.display = 'block';
          } else if (view === 'bookings') {
            if (exp) exp.style.display = 'none';
            if (vrView) vrView.style.display = 'none';
            if (book) book.style.display = 'block';
            this.renderReservations();
          }
        });
      });

      document.getElementById('btnOpenVrModal')?.addEventListener('click', () => {
        const modal = document.getElementById('vrModal');
        if (modal) modal.style.display = 'flex';
        this.soundFX.playWarp();
      });

      document.getElementById('vrModalClose')?.addEventListener('click', () => {
        const modal = document.getElementById('vrModal');
        if (modal) modal.style.display = 'none';
      });

      document.getElementById('btnVrBookNow')?.addEventListener('click', () => {
        this.openBookingModal('srv-iss-1');
      });

      document.getElementById('btnVrModalBook')?.addEventListener('click', () => {
        const modal = document.getElementById('vrModal');
        if (modal) modal.style.display = 'none';
        this.openBookingModal('srv-iss-1');
      });

      // spec sheet data for each craft/gear model in the VR viewer - could move this out
      // to its own JSON file later but it's small enough to leave inline for now
      const CRAFT_SPECS = {
        'Space Shuttle VR': {
          badge: 'ORBITAL SHUTTLE TRANSPORT VR',
          title: 'NASA Space Shuttle Orbiter VR',
          items: [
            { lbl: 'Orbital Velocity', val: '28,000 km/h (Mach 25)' },
            { lbl: 'Payload Capacity', val: '27,500 kg to LEO' },
            { lbl: 'Main Engine Thrust', val: '37,000 kN Total' },
            { lbl: 'Thermal Shielding', val: '30,000 Silica Tiles' },
          ],
        },
        'ACES US Spacesuit VR': {
          badge: 'NASA ACES FLIGHT SUIT VR',
          title: 'ACES US Advanced Crew Escape Suit VR',
          items: [
            { lbl: 'Operating Altitude', val: '100,000 ft (30 km)' },
            { lbl: 'Emergency Oxygen', val: '10 Minutes Hyperbaric' },
            { lbl: 'Suit Weight', val: '43 lbs (19.5 kg)' },
            { lbl: 'Parachute System', val: 'Harness & Survival Pack' },
          ],
        },
        'Sci-Fi Spaceship Interior': {
          badge: 'COMMAND DECK & COCKPIT VR',
          title: 'Sci-Fi Spaceship Cockpit & Flight Deck',
          items: [
            { lbl: 'Pilot Stations', val: '4 Command Seats' },
            { lbl: 'Quantum Avionics', val: 'Generation 7 AI Telemetry' },
            { lbl: 'Sub-Orbital Radar', val: '2,500,000 km Radius' },
            { lbl: 'Shield Matrix', val: '100% Defense Capacity' },
          ],
        },
        'Sci-Fi Spaceship Corridor': {
          badge: 'AIRLOCK & DECK CORRIDOR VR',
          title: 'Sci-Fi Spaceship Deck Corridor',
          items: [
            { lbl: 'Atmospheric Seals', val: 'Dual Stage Air-Lock' },
            { lbl: 'Hull Armor Class', val: 'Titanium-Carbon Composite' },
            { lbl: 'Artificial Gravity', val: '1.0g Centrifugal Core' },
            { lbl: 'Deck Level', val: 'Main Assembly Corridor' },
          ],
        },
        'Space Exploration Vehicle': {
          badge: 'SURFACE & TRANSIT ROVER',
          title: 'Space Exploration Vehicle (SEV)',
          items: [
            { lbl: 'Operating Range', val: '500 km' },
            { lbl: 'Living Volume', val: '24 m³' },
            { lbl: 'Power Generator', val: '4.2 kW Solar Array' },
            { lbl: 'Max Terrain Slope', val: '45° Incline' },
          ],
        },
      };

      const stageGlb = document.getElementById('stageGlbViewer');
      const stageSketchfab = document.getElementById('stageSketchfabViewer');
      const specBadge = document.getElementById('specBadge');
      const specTitle = document.getElementById('specTitle');
      const specGrid = document.getElementById('specGrid');

      document.querySelectorAll('.craft-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const target = e.currentTarget;
          document.querySelectorAll('.craft-btn').forEach((b) => b.classList.remove('active'));
          target.classList.add('active');

          const modelType = target.getAttribute('data-model-type');
          const src = target.getAttribute('data-src');
          const name = target.getAttribute('data-name');

          if (modelType === 'glb') {
            if (stageGlb) {
              stageGlb.setAttribute('src', encodeURI(src));
              stageGlb.style.display = 'block';
            }
            if (stageSketchfab) stageSketchfab.style.display = 'none';
          } else if (modelType === 'sketchfab') {
            if (stageSketchfab) {
              // ui_watermark=0 doesn't actually remove the watermark on free accounts btw,
              // leaving it here anyway in case we upgrade the sketchfab plan later
              stageSketchfab.setAttribute(
                'src',
                `https://sketchfab.com/models/${src}/embed?autostart=1&preload=1&ui_controls=1&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0&ui_theme=dark`
              );
              stageSketchfab.style.display = 'block';
            }
            if (stageGlb) stageGlb.style.display = 'none';
          }

          const specData = CRAFT_SPECS[name];
          if (specData) {
            if (specBadge) specBadge.textContent = specData.badge;
            if (specTitle) specTitle.textContent = specData.title;
            if (specGrid) {
              specGrid.innerHTML = specData.items
                .map((item) => `<div class="spec-item"><span class="lbl">${item.lbl}</span><span class="val">${item.val}</span></div>`)
                .join('');
            }
          }

          this.soundFX.playWarp();
        });
      });

      document.getElementById('modalClose')?.addEventListener('click', () => this.closeBookingModal());
      document.getElementById('wizardPrev')?.addEventListener('click', () => {
        this.currentStep = Math.max(1, this.currentStep - 1);
        this.soundFX.playBeep(600, 50);
        this.renderWizardStep();
      });
      document.getElementById('wizardNext')?.addEventListener('click', () => this.handleWizardNext());
    }

    openBookingModal(serviceId) {
      this.currentStep = 1;
      const defaultSvc = serviceId
        ? SERVICES.find((s) => s.id === serviceId)
        : SERVICES.find((s) => s.destinationId === this.selectedDest) || SERVICES[0];

      this.formData = {
        destinationId: defaultSvc.destinationId,
        serviceId: defaultSvc.id,
        spaceportId: SPACEPORTS[0].id,
        launchVehicleId: LAUNCH_VEHICLES[0].id,
        departureDate: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
        returnDate: new Date(Date.now() + 86400000 * 21).toISOString().split('T')[0],
        passengers: 1,
        travelClass: 'Tourist',
        passengerName: '',
        passengerEmail: '',
        addons: [],
      };

      const modal = document.getElementById('bookingModal');
      if (modal) {
        modal.style.display = 'flex';
        this.renderWizardStep();
      }
    }

    closeBookingModal() {
      const modal = document.getElementById('bookingModal');
      if (modal) modal.style.display = 'none';
    }

    calculateTotalCost() {
      const svc = SERVICES.find((s) => s.id === this.formData.serviceId);
      const vehicle = LAUNCH_VEHICLES.find((v) => v.id === this.formData.launchVehicleId);
      if (!svc) return 0;

      let base = svc.pricePerPersonUSD;
      // pricing multipliers, tweak these once finance actually decides on real numbers
      if (this.formData.travelClass === 'Specialist') base *= 1.35;
      if (this.formData.travelClass === 'VIP Zero-G') base *= 2.1;
      if (vehicle) base *= vehicle.priceMultiplier;

      let total = base * (this.formData.passengers || 1);
      (this.formData.addons || []).forEach((aid) => {
        const item = ADDONS.find((a) => a.id === aid);
        if (item) total += item.priceUSD * (this.formData.passengers || 1);
      });
      return Math.round(total);
    }

    renderWizardStep() {
      const container = document.getElementById('wizardStepContent');
      const stepTitle = document.getElementById('wizardStepTitle');
      const btnPrev = document.getElementById('wizardPrev');
      const btnNext = document.getElementById('wizardNext');
      const totalCostSpan = document.getElementById('wizardTotalCost');

      if (!container) return;

      if (btnPrev) btnPrev.style.visibility = this.currentStep === 1 ? 'hidden' : 'visible';
      if (btnNext) btnNext.textContent = this.currentStep === 4 ? 'Confirm & Launch Reservation 🚀' : 'Next Step ➔';
      if (totalCostSpan) totalCostSpan.textContent = `$${this.calculateTotalCost().toLocaleString()} USD`;

      document.querySelectorAll('.step-dot').forEach((dot, idx) => {
        dot.classList.toggle('active', idx + 1 === this.currentStep);
        dot.classList.toggle('completed', idx + 1 < this.currentStep);
      });

      // yeah this switch is a bit long, could split into separate render methods
      // per step but honestly it's easier to follow the wizard flow keeping it together
      switch (this.currentStep) {
        case 1:
          if (stepTitle) stepTitle.textContent = 'Step 1: Select Destination & Service Package';
          container.innerHTML = `
            <div class="form-group">
              <label>Destination Body</label>
              <select id="wizDestination" class="form-control">
                ${CELESTIAL_BODIES.map(
                  (b) => `<option value="${b.id}" ${b.id === this.formData.destinationId ? 'selected' : ''}>${b.name}</option>`
                ).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Service Package</label>
              <select id="wizService" class="form-control">
                ${SERVICES.filter((s) => s.destinationId === this.formData.destinationId)
                  .map(
                    (s) =>
                      `<option value="${s.id}" ${s.id === this.formData.serviceId ? 'selected' : ''}>${s.title} ($${s.pricePerPersonUSD.toLocaleString()})</option>`
                  )
                  .join('')}
              </select>
            </div>
          `;

          document.getElementById('wizDestination')?.addEventListener('change', (e) => {
            this.formData.destinationId = e.target.value;
            const avail = SERVICES.filter((s) => s.destinationId === e.target.value);
            if (avail.length > 0) this.formData.serviceId = avail[0].id;
            this.renderWizardStep();
          });

          document.getElementById('wizService')?.addEventListener('change', (e) => {
            this.formData.serviceId = e.target.value;
            this.renderWizardStep();
          });
          break;

        case 2:
          if (stepTitle) stepTitle.textContent = 'Step 2: Launch Logistics & Spacecraft';
          container.innerHTML = `
            <div class="form-group">
              <label>Departure Spaceport Hub</label>
              <select id="wizSpaceport" class="form-control">
                ${SPACEPORTS.map(
                  (sp) => `<option value="${sp.id}" ${sp.id === this.formData.spaceportId ? 'selected' : ''}>${sp.name} (${sp.location})</option>`
                ).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Launch Vehicle Class</label>
              <select id="wizVehicle" class="form-control">
                ${LAUNCH_VEHICLES.map(
                  (v) => `<option value="${v.id}" ${v.id === this.formData.launchVehicleId ? 'selected' : ''}>${v.name} [Provider: ${v.provider}]</option>`
                ).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Cabin Class</label>
              <div class="radio-group">
                <label class="radio-label"><input type="radio" name="wizClass" value="Tourist" ${this.formData.travelClass === 'Tourist' ? 'checked' : ''} /><span>Standard Orbital Tourist</span></label>
                <label class="radio-label"><input type="radio" name="wizClass" value="Specialist" ${this.formData.travelClass === 'Specialist' ? 'checked' : ''} /><span>Science Specialist Suite (+35%)</span></label>
                <label class="radio-label"><input type="radio" name="wizClass" value="VIP Zero-G" ${this.formData.travelClass === 'VIP Zero-G' ? 'checked' : ''} /><span>VIP Zero-G Suite (+110%)</span></label>
              </div>
            </div>
          `;

          document.getElementById('wizSpaceport')?.addEventListener('change', (e) => {
            this.formData.spaceportId = e.target.value;
          });
          document.getElementById('wizVehicle')?.addEventListener('change', (e) => {
            this.formData.launchVehicleId = e.target.value;
            this.renderWizardStep();
          });
          document.querySelectorAll('input[name="wizClass"]').forEach((r) => {
            r.addEventListener('change', (e) => {
              this.formData.travelClass = e.target.value;
              this.renderWizardStep();
            });
          });
          break;

        case 3:
          if (stepTitle) stepTitle.textContent = 'Step 3: Stargate Schedule & Passenger Roster';
          container.innerHTML = `
            <div class="form-row">
              <div class="form-group">
                <label>Departure Date</label>
                <input type="date" id="wizDepDate" class="form-control" value="${this.formData.departureDate}" />
              </div>
              <div class="form-group">
                <label>Return Date</label>
                <input type="date" id="wizRetDate" class="form-control" value="${this.formData.returnDate}" />
              </div>
            </div>
            <div class="form-group">
              <label>Number of Passengers</label>
              <input type="number" id="wizPassCount" class="form-control" min="1" max="10" value="${this.formData.passengers}" />
            </div>
            <div class="form-group">
              <label>Primary Passenger Name</label>
              <input type="text" id="wizName" class="form-control" placeholder="Commander John Doe" value="${this.formData.passengerName}" />
            </div>
            <div class="form-group">
              <label>Sub-Orbital Comms Email</label>
              <input type="email" id="wizEmail" class="form-control" placeholder="john.doe@space.orbit" value="${this.formData.passengerEmail}" />
            </div>
          `;

          document.getElementById('wizDepDate')?.addEventListener('change', (e) => (this.formData.departureDate = e.target.value));
          document.getElementById('wizRetDate')?.addEventListener('change', (e) => (this.formData.returnDate = e.target.value));
          document.getElementById('wizPassCount')?.addEventListener('change', (e) => {
            this.formData.passengers = parseInt(e.target.value, 10) || 1;
            this.renderWizardStep();
          });
          document.getElementById('wizName')?.addEventListener('input', (e) => (this.formData.passengerName = e.target.value));
          document.getElementById('wizEmail')?.addEventListener('input', (e) => (this.formData.passengerEmail = e.target.value));
          break;

        case 4:
          if (stepTitle) stepTitle.textContent = 'Step 4: Mission Addons & Radiation Shielding';
          const selectedAddons = this.formData.addons || [];
          container.innerHTML = `
            <div class="form-group">
              <label>Optional Orbital Upgrades</label>
              <div class="addons-list">
                ${ADDONS.map(
                  (a) => `
                  <label class="addon-card ${selectedAddons.includes(a.id) ? 'selected' : ''}">
                    <input type="checkbox" value="${a.id}" ${selectedAddons.includes(a.id) ? 'checked' : ''} class="addon-checkbox" />
                    <div class="addon-info">
                      <span class="addon-name">${a.name} (+$${a.priceUSD.toLocaleString()} USD)</span>
                      <span class="addon-desc">${a.description}</span>
                    </div>
                  </label>
                `
                ).join('')}
              </div>
            </div>
            <div class="form-group">
              <label>Special Medical or Mission Requests</label>
              <textarea id="wizNotes" class="form-control" rows="3" placeholder="Specify zero-g dietary requirements or suit customizations...">${this.formData.notes || ''}</textarea>
            </div>
          `;

          document.querySelectorAll('.addon-checkbox').forEach((box) => {
            box.addEventListener('change', () => {
              const ids = [];
              document.querySelectorAll('.addon-checkbox:checked').forEach((chk) => ids.push(chk.value));
              this.formData.addons = ids;
              this.renderWizardStep();
            });
          });
          document.getElementById('wizNotes')?.addEventListener('input', (e) => (this.formData.notes = e.target.value));
          break;
      }
    }

    handleWizardNext() {
      if (this.currentStep < 4) {
        this.currentStep++;
        this.soundFX.playBeep(600, 50);
        this.renderWizardStep();
        return;
      }

      // final step - lock in the booking
      const total = this.calculateTotalCost();
      const bookingCode = `BFS-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

      const reservation = {
        ...this.formData,
        id: `res-${Date.now()}`,
        passengerName: this.formData.passengerName || 'Space Traveler',
        passengerEmail: this.formData.passengerEmail || 'traveler@space.orbit',
        bookingCode,
        createdAt: new Date().toISOString(),
        totalCostUSD: total,
        status: 'Confirmed',
        // random seat/gate for now - would come from an actual manifest system eventually
        seatNumber: `${Math.floor(Math.random() * 20 + 1)}${['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]}`,
        gateCode: `PAD-${Math.floor(Math.random() * 9 + 1)}B`,
      };

      this.reservations.unshift(reservation);
      this.saveReservations();
      this.soundFX.playWarp();
      this.closeBookingModal();
      this.showBoardingPassModal(reservation);
      this.renderReservations();
    }

    showBoardingPassModal(res) {
      const modal = document.getElementById('ticketModal');
      const body = CELESTIAL_BODIES.find((b) => b.id === res.destinationId);
      const svc = SERVICES.find((s) => s.id === res.serviceId);
      const sp = SPACEPORTS.find((s) => s.id === res.spaceportId);
      const vehicle = LAUNCH_VEHICLES.find((v) => v.id === res.launchVehicleId);

      if (modal) {
        modal.style.display = 'flex';
        const content = document.getElementById('ticketModalContent');
        if (content) {
          content.innerHTML = `
            <div class="ticket-header">
              <div>
                <span class="ticket-badge">CONFIRMED SPACE BOARDING PASS</span>
                <h2>${res.bookingCode}</h2>
              </div>
              <div class="ticket-logo">🚀 BOOKFORSPACE</div>
            </div>
            <div class="ticket-body">
              <div class="ticket-grid">
                <div><span class="lbl">Passenger</span><span class="val">${res.passengerName}</span></div>
                <div><span class="lbl">Destination</span><span class="val" style="color:${body ? body.color : '#00f0ff'}">${body ? body.name : res.destinationId}</span></div>
                <div><span class="lbl">Mission Service</span><span class="val">${svc ? svc.title : res.serviceId}</span></div>
                <div><span class="lbl">Launch Pad / Spaceport</span><span class="val">${sp ? sp.name : res.spaceportId}</span></div>
                <div><span class="lbl">Spacecraft</span><span class="val">${vehicle ? vehicle.name : res.launchVehicleId}</span></div>
                <div><span class="lbl">Class & Seat</span><span class="val">${res.travelClass} / Seat ${res.seatNumber} (Gate ${res.gateCode})</span></div>
                <div><span class="lbl">Departure Window</span><span class="val">${res.departureDate}</span></div>
                <div><span class="lbl">Total Investment</span><span class="val" style="color: #00f0ff;">$${res.totalCostUSD.toLocaleString()} USD</span></div>
              </div>
              <div class="ticket-qr-section">
                <div class="qr-mock"><div class="qr-code-grid"></div></div>
                <div class="qr-info">
                  <p>STATUS: LAUNCH READY</p>
                  <p>SECURITY HASH: 0x${Math.random().toString(16).substring(2, 10).toUpperCase()}</p>
                  <button class="btn btn-outline" id="btnPrintPass">🖨️ Print Ticket</button>
                </div>
              </div>
            </div>
          `;
          document.getElementById('btnPrintPass')?.addEventListener('click', () => window.print());
        }
      }

      document.getElementById('ticketModalClose')?.addEventListener('click', () => {
        if (modal) modal.style.display = 'none';
      });
    }

    renderReservations() {
      const container = document.getElementById('reservationsList');
      if (!container) return;

      if (this.reservations.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <p>🪐 You have no active space flight reservations yet.</p>
            <button class="btn btn-primary" id="btnExploreFromEmpty">Explore Destinations</button>
          </div>
        `;
        document.getElementById('btnExploreFromEmpty')?.addEventListener('click', () => {
          document.querySelector('.nav-tab[data-tab="explore"]')?.dispatchEvent(new Event('click'));
        });
        return;
      }

      container.innerHTML = this.reservations
        .map((res) => {
          const body = CELESTIAL_BODIES.find((b) => b.id === res.destinationId);
          const svc = SERVICES.find((s) => s.id === res.serviceId);
          const isCancelled = res.status === 'Cancelled';

          return `
          <div class="res-card ${isCancelled ? 'cancelled' : ''}">
            <div class="res-header">
              <div>
                <span class="res-code">${res.bookingCode}</span>
                <h4 style="color: ${body ? body.color : '#00f0ff'}">${svc ? svc.title : res.serviceId}</h4>
              </div>
              <span class="badge ${isCancelled ? 'badge-cancelled' : 'badge-confirmed'}">${res.status}</span>
            </div>
            <div class="res-details">
              <p>📍 <strong>Destination:</strong> ${body ? body.name : res.destinationId}</p>
              <p>👤 <strong>Passenger:</strong> ${res.passengerName} (${res.passengers} traveler${res.passengers > 1 ? 's' : ''})</p>
              <p>🗓️ <strong>Flight Window:</strong> ${res.departureDate} ➔ ${res.returnDate}</p>
              <p>💺 <strong>Seat & Gate:</strong> ${res.travelClass} / Seat ${res.seatNumber} (${res.gateCode})</p>
              <p>💰 <strong>Total Cost:</strong> $${res.totalCostUSD.toLocaleString()} USD</p>
            </div>
            <div class="res-actions">
              <button class="btn btn-outline btn-view-pass" data-id="${res.id}">🎟️ View Boarding Pass</button>
              ${!isCancelled ? `<button class="btn btn-danger btn-cancel-res" data-id="${res.id}">Abort / Cancel</button>` : ''}
            </div>
          </div>
        `;
        })
        .join('');

      container.querySelectorAll('.btn-view-pass').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          const res = this.reservations.find((r) => r.id === id);
          if (res) this.showBoardingPassModal(res);
        });
      });

      container.querySelectorAll('.btn-cancel-res').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          if (!id) return;
          if (!confirm('Are you sure you want to cancel this space reservation?')) return;
          const idx = this.reservations.findIndex((r) => r.id === id);
          if (idx !== -1) {
            this.reservations[idx].status = 'Cancelled';
            this.saveReservations();
            this.renderReservations();
          }
        });
      });
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    new BookFromSpaceApp();
  });
})();
