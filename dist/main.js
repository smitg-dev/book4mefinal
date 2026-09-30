import { PlanetViewer } from './components/planetViewer.js';
import { BookingWizardManager } from './components/bookingWizard.js';

const BODIES = [
  {
    id: 'mars', name: 'Mars (Ares Hub)', category: 'planet',
    tagline: 'The Red Frontier & Olympus Mons Gateway',
    description: 'Home to the iconic Valles Marineris and humanity’s prime terraforming sector. Features pressurized luxury domes, rover expeditions, and low-g skydiving.',
    distanceFromEarth: '225 Million km', gravity: '0.38g', temperature: '-63°C', atmosphere: '95% CO2', orbitalPeriod: '687 Earth Days',
    color: '#ff5533', secondaryColor: '#aa2200', radius: 22, orbitDistance: 170, orbitSpeed: 0.003, servicesCount: 3,
  },
  {
    id: 'moon', name: 'Luna Gateway (Moon)', category: 'moon',
    tagline: 'Earth’s Orbital Companion & Shackleton Outpost',
    description: 'The closest cosmic destination featuring permanent lunar habitat suites, dark-side observatories, and historical Apollo landing site tours.',
    distanceFromEarth: '384,400 km', gravity: '0.166g', temperature: '-130°C to +120°C', atmosphere: 'Exosphere', orbitalPeriod: '27.3 Earth Days',
    color: '#d0d5dd', secondaryColor: '#88909d', radius: 16, orbitDistance: 110, orbitSpeed: 0.006, servicesCount: 3,
  },
  {
    id: 'europa', name: 'Europa Cryo Terminal', category: 'moon',
    tagline: 'Jupiter’s Ocean Moon & Sub-Surface Habitat',
    description: 'A subterranean liquid ocean beneath 15km of pristine ice. Experience sub-ice submersible explorations and Jupiter’s breathtaking giant horizon.',
    distanceFromEarth: '628 Million km', gravity: '0.134g', temperature: '-160°C', atmosphere: 'Trace Oxygen', orbitalPeriod: '3.5 Earth Days',
    color: '#00ccff', secondaryColor: '#0066aa', radius: 18, orbitDistance: 240, orbitSpeed: 0.002, servicesCount: 2,
  },
  {
    id: 'iss', name: 'ISS Orbital Hotel', category: 'satellite',
    tagline: 'Low Earth Orbit Microgravity Laboratory & Resort',
    description: 'Orbit Earth every 90 minutes with 16 daily sunrises. Features zero-g astronaut training, spacewalk excursions, and panoramic Cupola views.',
    distanceFromEarth: '408 km', gravity: '0.00g (Microgravity)', temperature: 'Station Controlled (21°C)', atmosphere: 'Standard Nitrogen/Oxygen', orbitalPeriod: '92 Minutes',
    color: '#00ffaa', secondaryColor: '#008855', radius: 12, orbitDistance: 70, orbitSpeed: 0.012, servicesCount: 3,
  },
  {
    id: 'titan', name: 'Titan Saturn Outpost', category: 'moon',
    tagline: 'Saturnian Cloud Gliding & Hydrocarbon Seas',
    description: 'Dense golden atmosphere allowing humans to fly with simple mechanical wings! Includes Titan sea cruises on liquid methane lakes.',
    distanceFromEarth: '1.4 Billion km', gravity: '0.138g', temperature: '-179°C', atmosphere: '98% Nitrogen, Methane', orbitalPeriod: '15.9 Earth Days',
    color: '#ffaa00', secondaryColor: '#995500', radius: 20, orbitDistance: 310, orbitSpeed: 0.0015, servicesCount: 2,
  },
  {
    id: 'jwst', name: 'JWST Deep Relayer', category: 'satellite',
    tagline: 'Lagrange Point L2 Quantum Observatory',
    description: 'Positioned 1.5M km behind Earth in deep space. Exclusive access to quantum satellite telemetry, infrared galaxy mapping, and quiet isolation.',
    distanceFromEarth: '1.5 Million km (L2)', gravity: 'Microgravity', temperature: '-233°C (Shielded Side)', atmosphere: 'Vacuum', orbitalPeriod: 'Solar Orbit (L2)',
    color: '#ffd700', secondaryColor: '#b39200', radius: 14, orbitDistance: 370, orbitSpeed: 0.001, servicesCount: 1,
  },
];

const SERVICES = [
  {
    id: 'srv-mars-1', destinationId: 'mars', category: 'hotel', availability: 'Available',
    title: 'Ares Dome Luxury Hotel & Olympus Base Stay',
    duration: '14 Days (Includes Orbit Transit)', pricePerPersonUSD: 450000,
    description: 'Stay in pressurized transparent habitat domes overlooking the red Martian desert. Includes gourmet freeze-dried & hydroponic dining.',
    highlights: ['Olympus Mons view suite', 'Low-g gym', 'Pressurized Rover Tour'],
  },
  {
    id: 'srv-mars-2', destinationId: 'mars', category: 'expedition', availability: 'High Demand',
    title: 'Valles Marineris Grand Canyon Expedition',
    duration: '5 Days', pricePerPersonUSD: 180000,
    description: 'Guided multi-day electric rover journey through the solar system’s largest canyon system.',
    highlights: ['Geological core sampling', 'Cliffside observation deck', 'Drone photography'],
  },
  {
    id: 'srv-mars-3', destinationId: 'mars', category: 'training', availability: 'Available',
    title: 'Martian Terraforming & Bio-Dome Tech Tour',
    duration: '3 Days', pricePerPersonUSD: 95000,
    description: 'Hands-on engineering workshop with top planetary scientists shaping Mars atmosphere.',
    highlights: ['Algae farm inspection', 'Atmosphere generator controls', 'Certificate'],
  },
  {
    id: 'srv-moon-1', destinationId: 'moon', category: 'hotel', availability: 'Available',
    title: 'Shackleton Crater South Pole Habitat Stay',
    duration: '7 Days', pricePerPersonUSD: 220000,
    description: 'Located on the rim of Shackleton Crater with eternal sunlight solar energy and water-ice mining vistas.',
    highlights: ['Earth-rise viewing lounge', 'Lunar dust sauna', 'Zero-g ice skating'],
  },
  {
    id: 'srv-moon-2', destinationId: 'moon', category: 'expedition', availability: 'Available',
    title: 'Apollo 11 Historic Site & Buggy Safari',
    duration: '2 Days', pricePerPersonUSD: 85000,
    description: 'Visit Tranquility Base from a safe historic preservation distance aboard a glass-canopy lunar buggy.',
    highlights: ['Historic footprint observation', 'Moonwalk photo session', 'Commemorative coin'],
  },
  {
    id: 'srv-moon-3', destinationId: 'moon', category: 'transport', availability: 'Available',
    title: 'Lunar Express Point-to-Point Shuttle',
    duration: '3 Days Transit', pricePerPersonUSD: 150000,
    description: 'Direct rapid transit flight between Earth Orbit and Lunar Gateway with zero-g lounge amenities.',
    highlights: ['Private capsule seat', 'Starlink Deep Space Wi-Fi', 'Complimentary suit fitting'],
  },
  {
    id: 'srv-europa-1', destinationId: 'europa', category: 'expedition', availability: 'Waitlist',
    title: 'Cryo-Ocean Submersible Deep Dive',
    duration: '10 Days', pricePerPersonUSD: 890000,
    description: 'Descend into the dark liquid ocean beneath Europa’s ice crust inside a titanium sub-surface submersible.',
    highlights: ['Thermal vent inspection', 'Bioluminescent life scan', 'Jupiter skyline view'],
  },
  {
    id: 'srv-europa-2', destinationId: 'europa', category: 'hotel', availability: 'High Demand',
    title: 'Jovian Horizon Sky Suite & Ice Spa',
    duration: '12 Days', pricePerPersonUSD: 640000,
    description: 'Watch Jupiter’s Great Red Spot float across the sky from a heated orbital glass habitat station.',
    highlights: ['Jupiter radiation shield room', 'Cryo-massage spa', 'Deep space dining'],
  },
  {
    id: 'srv-iss-1', destinationId: 'iss', category: 'satellite', availability: 'High Demand',
    title: 'Microgravity Spacewalk EVA Experience',
    duration: '4 Hours Active EVA (3 Day Stay)', pricePerPersonUSD: 310000,
    description: 'Tether up, open the airlock, and step into vacuum with Earth spinning beneath your feet.',
    highlights: ['EMU Spacesuit certified', '360 Helmet 8K Recording', 'Certified EVA Patch'],
  },
  {
    id: 'srv-iss-2', destinationId: 'iss', category: 'training', availability: 'Available',
    title: 'Zero-G Astronaut Flight School',
    duration: '5 Days', pricePerPersonUSD: 120000,
    description: 'Complete official orbital flight maneuvers, emergency airlock drills, and microgravity acrobatics.',
    highlights: ['Official Wings Badge', 'Centrifuge flight prep', 'Personalized flight manual'],
  },
  {
    id: 'srv-iss-3', destinationId: 'iss', category: 'hotel', availability: 'Available',
    title: 'Cupola Earth Viewing Lounge Stay',
    duration: '4 Days', pricePerPersonUSD: 195000,
    description: 'Relax in the world-famous 7-window cupola module as Earth rotates under orbital sunlight.',
    highlights: ['16 Sunrises per day', 'Zero-g espresso bar', 'Astronaut meet-and-greet'],
  },
  {
    id: 'srv-titan-1', destinationId: 'titan', category: 'expedition', availability: 'High Demand',
    title: 'Atmospheric Wingsuit Gliding Flight',
    duration: '6 Days', pricePerPersonUSD: 520000,
    description: 'Titan’s thick atmosphere and low gravity mean human arms with wings can fly like a bird!',
    highlights: ['Custom wing-rig', 'Methane cloud soaring', 'Safety drone tether'],
  },
  {
    id: 'srv-titan-2', destinationId: 'titan', category: 'hotel', availability: 'Available',
    title: 'Kraken Mare Liquid Methane Yacht Cruise',
    duration: '8 Days', pricePerPersonUSD: 780000,
    description: 'Sail across Titan’s vast liquid hydrocarbon ocean aboard an insulated luxury hover-yacht.',
    highlights: ['Sub-zero heated cabin', 'Saturn ring viewing deck', 'Hydrocarbon tasting menu'],
  },
  {
    id: 'srv-jwst-1', destinationId: 'jwst', category: 'satellite', availability: 'Waitlist',
    title: 'L2 Quantum Telescope Relayer VIP Observation',
    duration: '3 Days Orbital', pricePerPersonUSD: 390000,
    description: 'Dock alongside the James Webb Observatory at Lagrange Point L2 for silent deep-space stargazing.',
    highlights: ['Infrared telescope access', 'Zero cosmic noise', 'Gold-plated mirror selfie'],
  },
];

const VEHICLES = [
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

const CRAFT_SPECS = {
  'Space Shuttle VR': {
    badge: 'ORBITAL SHUTTLE TRANSPORT VR',
    title: 'NASA Space Shuttle Orbiter VR',
    items: [
      ['Orbital Velocity', '28,000 km/h (Mach 25)'],
      ['Payload Capacity', '27,500 kg to LEO'],
      ['Main Engine Thrust', '37,000 kN Total'],
      ['Thermal Shielding', '30,000 Silica Tiles'],
    ],
  },
  'ACES US Spacesuit VR': {
    badge: 'NASA ACES FLIGHT SUIT VR',
    title: 'ACES US Advanced Crew Escape Suit VR',
    items: [
      ['Operating Altitude', '100,000 ft (30 km)'],
      ['Emergency Oxygen', '10 Minutes Hyperbaric'],
      ['Suit Weight', '43 lbs (19.5 kg)'],
      ['Parachute System', 'Harness & Survival Pack'],
    ],
  },
  'Sci-Fi Spaceship Interior': {
    badge: 'COMMAND DECK & COCKPIT VR',
    title: 'Sci-Fi Spaceship Cockpit & Flight Deck',
    items: [
      ['Pilot Stations', '4 Command Seats'],
      ['Quantum Avionics', 'Generation 7 AI Telemetry'],
      ['Sub-Orbital Radar', '2,500,000 km Radius'],
      ['Shield Matrix', '100% Defense Capacity'],
    ],
  },
  'Sci-Fi Spaceship Corridor': {
    badge: 'AIRLOCK & DECK CORRIDOR VR',
    title: 'Sci-Fi Spaceship Deck Corridor',
    items: [
      ['Atmospheric Seals', 'Dual Stage Air-Lock'],
      ['Hull Armor Class', 'Titanium-Carbon Composite'],
      ['Artificial Gravity', '1.0g Centrifugal Core'],
      ['Deck Level', 'Main Assembly Corridor'],
    ],
  },
  'Space Exploration Vehicle': {
    badge: 'SURFACE & TRANSIT ROVER',
    title: 'Space Exploration Vehicle (SEV)',
    items: [
      ['Operating Range', '500 km'],
      ['Living Volume', '24 m³'],
      ['Power Generator', '4.2 kW Solar Array'],
      ['Max Terrain Slope', '45° Incline'],
    ],
  },
};

const $ = (id) => document.getElementById(id);
const money = (n) => `$${n.toLocaleString()} USD`;
const findById = (list, id) => list.find((item) => item.id === id);
const setDisplay = (id, value) => {
  const el = $(id);
  if (el) el.style.display = value;
};
const listen = (id, event, handler) => $(id)?.addEventListener(event, handler);

const VIEWS = { explore: 'exploreView', 'vr-tour': 'vrTourView', bookings: 'bookingsView' };

class BookFromSpaceApp {
  constructor() {
    this.manager = new BookingWizardManager(BODIES, SERVICES, VEHICLES, SPACEPORTS, ADDONS);
    this.viewer = new PlanetViewer('spaceCanvas', BODIES, (body) => this.onPlanetSelected(body));
    this.viewer.startAnimation();
    this.viewer.selectBody(BODIES[0].id);

    this.bindFilters();
    this.bindTabs();
    this.bindVr();
    this.bindWizard();

    this.renderTelemetry();
    this.renderServices();
    this.renderReservations();
  }

  get sound() {
    return this.manager.getSoundFX();
  }

  onPlanetSelected(body) {
    this.sound.playBeep(900, 60);
    this.manager.setSelectedDestination(body.id);

    const card = $('bodyInfoCard');
    if (card) {
      const metrics = [
        ['Distance from Earth', body.distanceFromEarth],
        ['Gravity', body.gravity],
        ['Surface Temp', body.temperature],
        ['Atmosphere', body.atmosphere],
      ];
      card.innerHTML = `
        <div class="hud-card-header">
          <div>
            <span class="hud-badge">${body.category.toUpperCase()}</span>
            <h3 style="color: ${body.color}">${body.name}</h3>
            <p class="hud-tagline">${body.tagline}</p>
          </div>
        </div>
        <p class="hud-desc">${body.description}</p>
        <div class="hud-grid">
          ${metrics.map(([label, value]) => `
            <div class="hud-metric">
              <span class="metric-label">${label}</span>
              <span class="metric-val">${value}</span>
            </div>`).join('')}
        </div>
        <div class="hud-actions">
          <button class="btn btn-primary" id="btnBookThisBody">
            ⚡ Reserve Service on ${body.name.split(' ')[0]}
          </button>
        </div>
      `;
      listen('btnBookThisBody', 'click', () => this.openBookingModal());
    }

    document.querySelectorAll('.dest-pill').forEach((pill) => {
      pill.classList.toggle('active', pill.dataset.dest === body.id);
    });

    this.renderServices();
  }

  renderTelemetry() {
    const bar = $('telemetryBar');
    if (!bar) return;
    const t = this.manager.getTelemetryData();
    bar.innerHTML = `
      <div class="t-item"><span class="t-dot dot-green"></span> Solar Flares: <strong>${t.solarFlareLevel}</strong></div>
      <div class="t-item"><span class="t-dot dot-blue"></span> Geomagnetic Shield: <strong>${t.geomagneticShield}%</strong></div>
      <div class="t-item"><span class="t-dot dot-cyan"></span> Radiation Index: <strong>${t.radiationIndex} mSv</strong></div>
      <div class="t-item"><span class="t-dot dot-green"></span> Micrometeorite Risk: <strong>${t.micrometeoriteRisk}</strong></div>
      <div class="t-item"><span class="t-dot dot-purple"></span> Quantum Relay: <strong>${t.quantumRelayStatus}</strong></div>
    `;
  }

  renderServices() {
    const grid = $('servicesGrid');
    if (!grid) return;

    const services = this.manager.filterServices();
    if (!services.length) {
      grid.innerHTML = `<div class="empty-state"><p>📡 No orbital services match your telemetry search criteria.</p></div>`;
      return;
    }

    grid.innerHTML = services.map((svc) => {
      const body = findById(BODIES, svc.destinationId);
      const availClass = svc.availability.toLowerCase().replace(' ', '-');
      return `
        <div class="service-card">
          <div class="card-badge-row">
            <span class="badge badge-avail ${availClass}">${svc.availability}</span>
            <span class="badge badge-dest">${body ? body.name : svc.destinationId}</span>
          </div>
          <h4 class="card-title">${svc.title}</h4>
          <p class="card-duration">⏱️ ${svc.duration}</p>
          <p class="card-desc">${svc.description}</p>
          <ul class="card-highlights">
            ${svc.highlights.map((h) => `<li>✨ ${h}</li>`).join('')}
          </ul>
          <div class="card-footer">
            <div class="price-tag">
              <span class="price-lbl">Starting from</span>
              <span class="price-val">${money(svc.pricePerPersonUSD)}</span>
            </div>
            <button class="btn btn-outline btn-book-svc" data-svc-id="${svc.id}">Book Mission</button>
          </div>
        </div>`;
    }).join('');

    grid.querySelectorAll('.btn-book-svc').forEach((btn) => {
      btn.addEventListener('click', () => this.openBookingModal(btn.dataset.svcId));
    });
  }

  bindFilters() {
    const soundBtn = $('btnToggleSound');
    soundBtn?.addEventListener('click', () => {
      const on = this.sound.toggleSound();
      soundBtn.textContent = on ? '🔊 Audio FX: ON' : '🔇 Audio FX: OFF';
    });

    document.querySelectorAll('.dest-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        const dest = pill.dataset.dest;
        if (!dest) return;
        this.manager.setSelectedDestination(dest);
        if (dest === 'all') this.renderServices();
        else this.viewer.selectBody(dest);
      });
    });

    listen('categoryFilter', 'change', (e) => {
      this.manager.setCategoryFilter(e.target.value);
      this.renderServices();
    });

    listen('searchInput', 'input', (e) => {
      this.manager.setSearchQuery(e.target.value);
      this.renderServices();
    });
  }

  bindTabs() {
    document.querySelectorAll('.nav-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.nav-tab').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const target = tab.dataset.tab;
        Object.entries(VIEWS).forEach(([name, id]) => {
          setDisplay(id, name === target ? 'block' : 'none');
        });
        if (target === 'bookings') this.renderReservations();
      });
    });
  }

  bindVr() {
    listen('btnOpenVrModal', 'click', () => {
      setDisplay('vrModal', 'flex');
      this.sound.playWarp();
    });
    listen('vrModalClose', 'click', () => setDisplay('vrModal', 'none'));

    const glbViewer = $('stageGlbViewer');
    const sketchfabViewer = $('stageSketchfabViewer');

    document.querySelectorAll('.craft-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.craft-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const { modelType, src = '', name = '' } = btn.dataset;

        if (modelType === 'glb' && glbViewer) {
          glbViewer.setAttribute('src', encodeURI(src));
          glbViewer.style.display = 'block';
          if (sketchfabViewer) sketchfabViewer.style.display = 'none';
        } else if (modelType === 'sketchfab' && sketchfabViewer) {
          sketchfabViewer.setAttribute(
            'src',
            `https://sketchfab.com/models/${src}/embed?autostart=1&preload=1&ui_controls=1&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0&ui_theme=dark`
          );
          sketchfabViewer.style.display = 'block';
          if (glbViewer) glbViewer.style.display = 'none';
        }

        const spec = CRAFT_SPECS[name];
        if (spec) {
          $('specBadge').textContent = spec.badge;
          $('specTitle').textContent = spec.title;
          $('specGrid').innerHTML = spec.items
            .map(([label, value]) => `<div class="spec-item"><span class="lbl">${label}</span><span class="val">${value}</span></div>`)
            .join('');
        }

        this.sound.playWarp();
      });
    });

    listen('btnVrBookNow', 'click', () => this.openBookingModal('srv-iss-1'));
    listen('btnVrModalBook', 'click', () => {
      setDisplay('vrModal', 'none');
      this.openBookingModal('srv-iss-1');
    });
  }

  bindWizard() {
    listen('modalClose', 'click', () => this.closeBookingModal());
    listen('wizardNext', 'click', () => this.nextStep());
    listen('wizardPrev', 'click', () => {
      this.manager.setStep(this.manager.getCurrentStep() - 1);
      this.renderWizardStep();
    });
    listen('ticketModalClose', 'click', () => setDisplay('ticketModal', 'none'));
  }

  openBookingModal(serviceId) {
    this.manager.startBookingFlow(serviceId);
    setDisplay('bookingModal', 'flex');
    this.renderWizardStep();
  }

  closeBookingModal() {
    setDisplay('bookingModal', 'none');
  }

  renderWizardStep() {
    const container = $('wizardStepContent');
    if (!container) return;

    const step = this.manager.getCurrentStep();
    const form = this.manager.activeFormData;
    const update = (data, redraw = false) => {
      this.manager.updateFormData(data);
      if (redraw) this.renderWizardStep();
    };

    const prev = $('wizardPrev');
    const next = $('wizardNext');
    if (prev) prev.style.visibility = step === 1 ? 'hidden' : 'visible';
    if (next) next.textContent = step === 4 ? 'Confirm & Launch Reservation' : 'Next Step';

    const total = $('wizardTotalCost');
    if (total) total.textContent = money(this.manager.calculateTotalCost());

    document.querySelectorAll('.step-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i + 1 === step);
      dot.classList.toggle('completed', i + 1 < step);
    });

    const steps = {
      1: () => this.stepDestination(form, update),
      2: () => this.stepLogistics(form, update),
      3: () => this.stepSchedule(form, update),
      4: () => this.stepAddons(form, update),
    };
    const { title, html, bind } = steps[step]();

    const titleEl = $('wizardStepTitle');
    if (titleEl) titleEl.textContent = `Step ${step}: ${title}`;
    container.innerHTML = html;
    bind();
  }

  stepDestination(form, update) {
    const selected = (cond) => (cond ? 'selected' : '');
    const services = SERVICES.filter((s) => s.destinationId === form.destinationId);

    return {
      title: 'Select Destination & Service Package',
      html: `
        <div class="form-group">
          <label>Destination Body</label>
          <select id="wizDestination" class="form-control">
            ${BODIES.map((b) => `<option value="${b.id}" ${selected(b.id === form.destinationId)}>${b.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Service Package</label>
          <select id="wizService" class="form-control">
            ${services.map((s) => `<option value="${s.id}" ${selected(s.id === form.serviceId)}>${s.title} ($${s.pricePerPersonUSD.toLocaleString()})</option>`).join('')}
          </select>
        </div>`,
      bind: () => {
        listen('wizDestination', 'change', (e) => {
          const destinationId = e.target.value;
          const first = SERVICES.find((s) => s.destinationId === destinationId);
          update(first ? { destinationId, serviceId: first.id } : { destinationId }, true);
        });
        listen('wizService', 'change', (e) => update({ serviceId: e.target.value }, true));
      },
    };
  }

  stepLogistics(form, update) {
    const selected = (cond) => (cond ? 'selected' : '');
    const checked = (cond) => (cond ? 'checked' : '');
    const classes = [
      ['Tourist', 'Standard Orbital Tourist'],
      ['Specialist', 'Science Specialist Suite (+35%)'],
      ['VIP Zero-G', 'VIP Zero-G Suite (+110%)'],
    ];

    return {
      title: 'Launch Logistics & Spacecraft',
      html: `
        <div class="form-group">
          <label>Departure Spaceport Hub</label>
          <select id="wizSpaceport" class="form-control">
            ${SPACEPORTS.map((sp) => `<option value="${sp.id}" ${selected(sp.id === form.spaceportId)}>${sp.name} (${sp.location})</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Launch Vehicle Class</label>
          <select id="wizVehicle" class="form-control">
            ${VEHICLES.map((v) => `<option value="${v.id}" ${selected(v.id === form.launchVehicleId)}>${v.name} [Provider: ${v.provider}]</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Cabin Class</label>
          <div class="radio-group">
            ${classes.map(([value, label]) => `
              <label class="radio-label">
                <input type="radio" name="wizClass" value="${value}" ${checked(form.travelClass === value)} />
                <span>${label}</span>
              </label>`).join('')}
          </div>
        </div>`,
      bind: () => {
        listen('wizSpaceport', 'change', (e) => update({ spaceportId: e.target.value }));
        listen('wizVehicle', 'change', (e) => update({ launchVehicleId: e.target.value }, true));
        document.querySelectorAll('input[name="wizClass"]').forEach((radio) => {
          radio.addEventListener('change', (e) => update({ travelClass: e.target.value }, true));
        });
      },
    };
  }

  stepSchedule(form, update) {
    return {
      title: 'Stargate Schedule & Passenger Roster',
      html: `
        <div class="form-row">
          <div class="form-group">
            <label>Departure Date</label>
            <input type="date" id="wizDepDate" class="form-control" value="${form.departureDate || ''}" />
          </div>
          <div class="form-group">
            <label>Return Date</label>
            <input type="date" id="wizRetDate" class="form-control" value="${form.returnDate || ''}" />
          </div>
        </div>
        <div class="form-group">
          <label>Number of Passengers</label>
          <input type="number" id="wizPassCount" class="form-control" min="1" max="10" value="${form.passengers || 1}" />
        </div>
        <div class="form-group">
          <label>Primary Passenger Name</label>
          <input type="text" id="wizName" class="form-control" placeholder="Commander John Doe" value="${form.passengerName || ''}" />
        </div>
        <div class="form-group">
          <label>Sub-Orbital Comms Email</label>
          <input type="email" id="wizEmail" class="form-control" placeholder="john.doe@space.orbit" value="${form.passengerEmail || ''}" />
        </div>`,
      bind: () => {
        listen('wizDepDate', 'change', (e) => update({ departureDate: e.target.value }));
        listen('wizRetDate', 'change', (e) => update({ returnDate: e.target.value }));
        listen('wizPassCount', 'change', (e) => update({ passengers: parseInt(e.target.value, 10) || 1 }, true));
        listen('wizName', 'input', (e) => update({ passengerName: e.target.value }));
        listen('wizEmail', 'input', (e) => update({ passengerEmail: e.target.value }));
      },
    };
  }

  stepAddons(form, update) {
    const chosen = form.addons || [];

    return {
      title: 'Mission Addons & Radiation Shielding',
      html: `
        <div class="form-group">
          <label>Optional Orbital Upgrades</label>
          <div class="addons-list">
            ${ADDONS.map((a) => `
              <label class="addon-card ${chosen.includes(a.id) ? 'selected' : ''}">
                <input type="checkbox" value="${a.id}" ${chosen.includes(a.id) ? 'checked' : ''} class="addon-checkbox" />
                <div class="addon-info">
                  <span class="addon-name">${a.name} (+${money(a.priceUSD)})</span>
                  <span class="addon-desc">${a.description}</span>
                </div>
              </label>`).join('')}
          </div>
        </div>
        <div class="form-group">
          <label>Special Medical or Mission Requests</label>
          <textarea id="wizNotes" class="form-control" rows="3" placeholder="Specify zero-g dietary requirements, mobility assistance, or orbital suit customizations...">${form.notes || ''}</textarea>
        </div>`,
      bind: () => {
        document.querySelectorAll('.addon-checkbox').forEach((box) => {
          box.addEventListener('change', () => {
            const ids = [...document.querySelectorAll('.addon-checkbox:checked')].map((c) => c.value);
            update({ addons: ids }, true);
          });
        });
        listen('wizNotes', 'input', (e) => update({ notes: e.target.value }));
      },
    };
  }

  nextStep() {
    const step = this.manager.getCurrentStep();
    if (step < 4) {
      this.manager.setStep(step + 1);
      this.renderWizardStep();
      return;
    }
    const reservation = this.manager.confirmReservation();
    this.closeBookingModal();
    this.showBoardingPass(reservation);
    this.renderReservations();
  }

  showBoardingPass(res) {
    const modal = $('ticketModal');
    const content = $('ticketModalContent');
    if (!modal || !content) return;

    const body = findById(BODIES, res.destinationId);
    const service = findById(SERVICES, res.serviceId);
    const port = findById(SPACEPORTS, res.spaceportId);
    const vehicle = findById(VEHICLES, res.launchVehicleId);
    const hash = Math.random().toString(16).substring(2, 10).toUpperCase();

    const fields = [
      ['Passenger', res.passengerName],
      ['Destination', `<span style="color: #14171f">${body ? body.name : res.destinationId}</span>`],
      ['Mission Service', service ? service.title : res.serviceId],
      ['Launch Pad / Spaceport', port ? port.name : res.spaceportId],
      ['Spacecraft', vehicle ? vehicle.name : res.launchVehicleId],
      ['Class & Seat', `${res.travelClass} / Seat ${res.seatNumber} (Gate ${res.gateCode})`],
      ['Departure Window', res.departureDate],
      ['Total Investment', `<span style="color: #00f0ff;">${money(res.totalCostUSD)}</span>`],
    ];

    modal.style.display = 'flex';
    content.innerHTML = `
      <div class="ticket-header">
        <div>
          <span class="ticket-badge">CONFIRMED SPACE BOARDING PASS</span>
          <h2>${res.bookingCode}</h2>
        </div>
        <div class="ticket-logo">BOOKFORSPACE</div>
      </div>
      <div class="ticket-body">
        <div class="ticket-grid">
          ${fields.map(([label, value]) => `
            <div>
              <span class="lbl">${label}</span>
              <span class="val">${value}</span>
            </div>`).join('')}
        </div>
        <div class="ticket-qr-section">
          <div class="qr-mock"><div class="qr-code-grid"></div></div>
          <div class="qr-info">
            <p>STATUS: LAUNCH READY</p>
            <p>SECURITY HASH: 0x${hash}</p>
            <button class="btn btn-outline" id="btnPrintPass">Print Ticket</button>
          </div>
        </div>
      </div>
    `;
    listen('btnPrintPass', 'click', () => window.print());
  }

  renderReservations() {
    const container = $('reservationsList');
    if (!container) return;

    const reservations = this.manager.getReservations();

    if (!reservations.length) {
      container.innerHTML = `
        <div class="empty-state">
          <p>You have no active space flight reservations yet.</p>
          <button class="btn btn-primary" id="btnExploreFromEmpty">Explore Destinations</button>
        </div>`;
      listen('btnExploreFromEmpty', 'click', () => {
        document.querySelector('.nav-tab[data-tab="explore"]')?.dispatchEvent(new Event('click'));
      });
      return;
    }

    container.innerHTML = reservations.map((res) => {
      const body = findById(BODIES, res.destinationId);
      const service = findById(SERVICES, res.serviceId);
      const cancelled = res.status === 'Cancelled';
      return `
        <div class="res-card ${cancelled ? 'cancelled' : ''}">
          <div class="res-header">
            <div>
              <span class="res-code">${res.bookingCode}</span>
              <h4 style="color: #14171f">${service ? service.title : res.serviceId}</h4>
            </div>
            <span class="badge ${cancelled ? 'badge-cancelled' : 'badge-confirmed'}">${res.status}</span>
          </div>
          <div class="res-details">
            <p><strong>Destination:</strong> ${body ? body.name : res.destinationId}</p>
            <p><strong>Passenger:</strong> ${res.passengerName} (${res.passengers} traveler${res.passengers > 1 ? 's' : ''})</p>
            <p><strong>Flight Window:</strong> ${res.departureDate} - ${res.returnDate}</p>
            <p><strong>Seat & Gate:</strong> ${res.travelClass} / Seat ${res.seatNumber} (${res.gateCode})</p>
            <p><strong>Total Cost:</strong> ${money(res.totalCostUSD)}</p>
          </div>
          <div class="res-actions">
            <button class="btn btn-outline btn-view-pass" data-id="${res.id}">View Boarding Pass</button>
            ${cancelled ? '' : `<button class="btn btn-danger btn-cancel-res" data-id="${res.id}">Abort / Cancel</button>`}
          </div>
        </div>`;
    }).join('');

    container.querySelectorAll('.btn-view-pass').forEach((btn) => {
      btn.addEventListener('click', () => {
        const res = findById(reservations, btn.dataset.id);
        if (res) this.showBoardingPass(res);
      });
    });

    container.querySelectorAll('.btn-cancel-res').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (confirm('Are you sure you want to cancel this space reservation?')) {
          this.manager.cancelReservation(btn.dataset.id);
          this.renderReservations();
        }
      });
    });
  }
}

window.addEventListener('DOMContentLoaded', () => new BookFromSpaceApp());
