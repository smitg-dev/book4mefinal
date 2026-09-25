import {
  CelestialBody,
  SpaceService,
  LaunchVehicle,
  Spaceport,
  BookingAddon,
  BookingFormData,
  Reservation,
} from './types.js';
import { PlanetViewer } from './components/planetViewer.js';
import { BookingWizardManager } from './components/bookingWizard.js';

// Seed Celestial Destinations
const CELESTIAL_BODIES: CelestialBody[] = [
  {
    id: 'mars',
    name: 'Mars (Ares Hub)',
    category: 'planet',
    tagline: 'The Red Frontier & Olympus Mons Gateway',
    description:
      'Home to the iconic Valles Marineris and humanity’s prime terraforming sector. Features pressurized luxury domes, rover expeditions, and low-g skydiving.',
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
    tagline: 'Earth’s Orbital Companion & Shackleton Outpost',
    description:
      'The closest cosmic destination featuring permanent lunar habitat suites, dark-side observatories, and historical Apollo landing site tours.',
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
    tagline: 'Jupiter’s Ocean Moon & Sub-Surface Habitat',
    description:
      'A subterranean liquid ocean beneath 15km of pristine ice. Experience sub-ice submersible explorations and Jupiter’s breathtaking giant horizon.',
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
    description:
      'Orbit Earth every 90 minutes with 16 daily sunrises. Features zero-g astronaut training, spacewalk excursions, and panoramic Cupola views.',
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
    description:
      'Dense golden atmosphere allowing humans to fly with simple mechanical wings! Includes Titan sea cruises on liquid methane lakes.',
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
    description:
      'Positioned 1.5M km behind Earth in deep space. Exclusive access to quantum satellite telemetry, infrared galaxy mapping, and quiet isolation.',
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

// Seed Services
const SERVICES: SpaceService[] = [
  {
    id: 'srv-mars-1',
    destinationId: 'mars',
    title: 'Ares Dome Luxury Hotel & Olympus Base Stay',
    category: 'hotel',
    duration: '14 Days (Includes Orbit Transit)',
    pricePerPersonUSD: 450000,
    description:
      'Stay in pressurized transparent habitat domes overlooking the red Martian desert. Includes gourmet freeze-dried & hydroponic dining.',
    highlights: ['Olympus Mons view suite', 'Low-g gym', 'Pressurized Rover Tour'],
    icon: '🏨',
    availability: 'Available',
  },
  {
    id: 'srv-mars-2',
    destinationId: 'mars',
    title: 'Valles Marineris Grand Canyon Expedition',
    category: 'expedition',
    duration: '5 Days',
    pricePerPersonUSD: 180000,
    description:
      'Guided multi-day electric rover journey through the solar system’s largest canyon system.',
    highlights: ['Geological core sampling', 'Cliffside observation deck', 'Drone photography'],
    icon: '🚙',
    availability: 'High Demand',
  },
  {
    id: 'srv-mars-3',
    destinationId: 'mars',
    title: 'Martian Terraforming & Bio-Dome Tech Tour',
    category: 'training',
    duration: '3 Days',
    pricePerPersonUSD: 95000,
    description:
      'Hands-on engineering workshop with top planetary scientists shaping Mars atmosphere.',
    highlights: ['Algae farm inspection', 'Atmosphere generator controls', 'Certificate'],
    icon: '🌱',
    availability: 'Available',
  },
  {
    id: 'srv-moon-1',
    destinationId: 'moon',
    title: 'Shackleton Crater South Pole Habitat Stay',
    category: 'hotel',
    duration: '7 Days',
    pricePerPersonUSD: 220000,
    description:
      'Located on the rim of Shackleton Crater with eternal sunlight solar energy and water-ice mining vistas.',
    highlights: ['Earth-rise viewing lounge', 'Lunar dust sauna', 'Zero-g ice skating'],
    icon: '🏨',
    availability: 'Available',
  },
  {
    id: 'srv-moon-2',
    destinationId: 'moon',
    title: 'Apollo 11 Historic Site & Buggy Safari',
    category: 'expedition',
    duration: '2 Days',
    pricePerPersonUSD: 85000,
    description:
      'Visit Tranquility Base from a safe historic preservation distance aboard a glass-canopy lunar buggy.',
    highlights: ['Historic footprint observation', 'Moonwalk photo session', 'Commemorative coin'],
    icon: '🏎️',
    availability: 'Available',
  },
  {
    id: 'srv-moon-3',
    destinationId: 'moon',
    title: 'Lunar Express Point-to-Point Shuttle',
    category: 'transport',
    duration: '3 Days Transit',
    pricePerPersonUSD: 150000,
    description:
      'Direct rapid transit flight between Earth Orbit and Lunar Gateway with zero-g lounge amenities.',
    highlights: ['Private capsule seat', 'Starlink Deep Space Wi-Fi', 'Complimentary suit fitting'],
    icon: '🚀',
    availability: 'Available',
  },
  {
    id: 'srv-europa-1',
    destinationId: 'europa',
    title: 'Cryo-Ocean Submersible Deep Dive',
    category: 'expedition',
    duration: '10 Days',
    pricePerPersonUSD: 890000,
    description:
      'Descend into the dark liquid ocean beneath Europa’s ice crust inside a titanium sub-surface submersible.',
    highlights: ['Thermal vent inspection', 'Bioluminescent life scan', 'Jupiter skyline view'],
    icon: '🌊',
    availability: 'Waitlist',
  },
  {
    id: 'srv-europa-2',
    destinationId: 'europa',
    title: 'Jovian Horizon Sky Suite & Ice Spa',
    category: 'hotel',
    duration: '12 Days',
    pricePerPersonUSD: 640000,
    description:
      'Watch Jupiter’s Great Red Spot float across the sky from a heated orbital glass habitat station.',
    highlights: ['Jupiter radiation shield room', 'Cryo-massage spa', 'Deep space dining'],
    icon: '✨',
    availability: 'High Demand',
  },
  {
    id: 'srv-iss-1',
    destinationId: 'iss',
    title: 'Microgravity Spacewalk EVA Experience',
    category: 'satellite',
    duration: '4 Hours Active EVA (3 Day Stay)',
    pricePerPersonUSD: 310000,
    description:
      'Tether up, open the airlock, and step into vacuum with Earth spinning beneath your feet.',
    highlights: ['EMU Spacesuit certified', '360 Helmet 8K Recording', 'Certified EVA Patch'],
    icon: '🧑‍🚀',
    availability: 'High Demand',
  },
  {
    id: 'srv-iss-2',
    destinationId: 'iss',
    title: 'Zero-G Astronaut Flight School',
    category: 'training',
    duration: '5 Days',
    pricePerPersonUSD: 120000,
    description:
      'Complete official orbital flight maneuvers, emergency airlock drills, and microgravity acrobatics.',
    highlights: ['Official Wings Badge', 'Centrifuge flight prep', 'Personalized flight manual'],
    icon: '🎓',
    availability: 'Available',
  },
  {
    id: 'srv-iss-3',
    destinationId: 'iss',
    title: 'Cupola Earth Viewing Lounge Stay',
    category: 'hotel',
    duration: '4 Days',
    pricePerPersonUSD: 195000,
    description:
      'Relax in the world-famous 7-window cupola module as Earth rotates under orbital sunlight.',
    highlights: ['16 Sunrises per day', 'Zero-g espresso bar', 'Astronaut meet-and-greet'],
    icon: '🌍',
    availability: 'Available',
  },
  {
    id: 'srv-titan-1',
    destinationId: 'titan',
    title: 'Atmospheric Wingsuit Gliding Flight',
    category: 'expedition',
    duration: '6 Days',
    pricePerPersonUSD: 520000,
    description:
      'Titan’s thick atmosphere and low gravity mean human arms with wings can fly like a bird!',
    highlights: ['Custom wing-rig', 'Methane cloud soaring', 'Safety drone tether'],
    icon: '🦅',
    availability: 'High Demand',
  },
  {
    id: 'srv-titan-2',
    destinationId: 'titan',
    title: 'Kraken Mare Liquid Methane Yacht Cruise',
    category: 'hotel',
    duration: '8 Days',
    pricePerPersonUSD: 780000,
    description:
      'Sail across Titan’s vast liquid hydrocarbon ocean aboard an insulated luxury hover-yacht.',
    highlights: ['Sub-zero heated cabin', 'Saturn ring viewing deck', 'Hydrocarbon tasting menu'],
    icon: '⛵',
    availability: 'Available',
  },
  {
    id: 'srv-jwst-1',
    destinationId: 'jwst',
    title: 'L2 Quantum Telescope Relayer VIP Observation',
    category: 'satellite',
    duration: '3 Days Orbital',
    pricePerPersonUSD: 390000,
    description:
      'Dock alongside the James Webb Observatory at Lagrange Point L2 for silent deep-space stargazing.',
    highlights: ['Infrared telescope access', 'Zero cosmic noise', 'Gold-plated mirror selfie'],
    icon: '📡',
    availability: 'Waitlist',
  },
];

const LAUNCH_VEHICLES: LaunchVehicle[] = [
  {
    id: 'lv-starship',
    name: 'SpaceX Starship Super Heavy Mk-IV',
    provider: 'SpaceX Interplanetary',
    payloadCapacity: '150 Tons',
    transitTime: 'Optimized Rapid Trajectory',
    priceMultiplier: 1.0,
  },
  {
    id: 'lv-newglenn',
    name: 'Blue Origin New Glenn Orbital',
    provider: 'Blue Origin Orbital Systems',
    payloadCapacity: '45 Tons',
    transitTime: 'Standard Orbital Transfer',
    priceMultiplier: 1.15,
  },
  {
    id: 'lv-orion',
    name: 'Orion SLS Deep Space Capsule',
    provider: 'NASA / Lockheed Martin',
    payloadCapacity: '27 Tons',
    transitTime: 'High-Velocity Direct Injection',
    priceMultiplier: 1.3,
  },
];

const SPACEPORTS: Spaceport[] = [
  { id: 'sp-ksc', name: 'Kennedy Spaceport Launch Complex 39A', location: 'Cape Canaveral, FL, USA', code: 'KSC' },
  { id: 'sp-starbase', name: 'Starbase Gateway & Orbital Pad 1', location: 'Boca Chica, TX, USA', code: 'STB' },
  { id: 'sp-tokyo', name: 'Tokyo Pacific Floating Oceanport', location: 'Tokyo Bay, Japan', code: 'TYO-SP' },
  { id: 'sp-guiana', name: 'Guiana Space Centre Equatorial Hub', location: 'Kourou, French Guiana', code: 'CSG' },
];

const ADDONS: BookingAddon[] = [
  { id: 'add-suit', name: 'Custom Tailored Spacesuit (Keep as Souvenir)', priceUSD: 25000, description: 'Bespoke pressurized flight suit made to your exact body measurements.' },
  { id: 'add-training', name: 'Microgravity Acclimatization Simulator Pass', priceUSD: 8500, description: '2-Day parabolic flight & centrifuge simulator prep before launch.' },
  { id: 'add-rad', name: 'Enhanced Electromagnetic Shielding Capsule', priceUSD: 12000, description: 'Medical grade cosmic radiation defense lining in your private cabin.' },
  { id: 'add-quantum', name: 'Quantum Comms Pass (Unlimited Starlink L2)', priceUSD: 4500, description: 'High-speed sub-millisecond video calling back to Earth.' },
];

class BookFromSpaceApp {
  private planetViewer!: PlanetViewer;
  private manager!: BookingWizardManager;

  constructor() {
    this.init();
  }

  private init(): void {
    this.manager = new BookingWizardManager(
      CELESTIAL_BODIES,
      SERVICES,
      LAUNCH_VEHICLES,
      SPACEPORTS,
      ADDONS
    );

    // Initialize 2D/3D Canvas Orbit Simulator
    this.planetViewer = new PlanetViewer('spaceCanvas', CELESTIAL_BODIES, (body) => {
      this.onPlanetSelected(body);
    });

    this.planetViewer.startAnimation();

    // Select default planet (Mars)
    const initialBody = CELESTIAL_BODIES[0];
    this.planetViewer.selectBody(initialBody.id);

    // Bind DOM Listeners
    this.bindDOMEvents();
    this.renderTelemetry();
    this.renderServices();
    this.renderReservations();
  }

  private onPlanetSelected(body: CelestialBody): void {
    this.manager.getSoundFX().playBeep(900, 60);
    this.manager.setSelectedDestination(body.id);

    // Update Telemetry Card
    const cardEl = document.getElementById('bodyInfoCard');
    if (cardEl) {
      cardEl.innerHTML = `
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
          <div class="hud-metric">
            <span class="metric-label">Distance from Earth</span>
            <span class="metric-val">${body.distanceFromEarth}</span>
          </div>
          <div class="hud-metric">
            <span class="metric-label">Gravity</span>
            <span class="metric-val">${body.gravity}</span>
          </div>
          <div class="hud-metric">
            <span class="metric-label">Surface Temp</span>
            <span class="metric-val">${body.temperature}</span>
          </div>
          <div class="hud-metric">
            <span class="metric-label">Atmosphere</span>
            <span class="metric-val">${body.atmosphere}</span>
          </div>
        </div>
        <div class="hud-actions">
          <button class="btn btn-primary" id="btnBookThisBody" data-id="${body.id}">
            ⚡ Reserve Service on ${body.name.split(' ')[0]}
          </button>
        </div>
      `;

      const btnBook = document.getElementById('btnBookThisBody');
      if (btnBook) {
        btnBook.addEventListener('click', () => {
          this.openBookingModal();
        });
      }
    }

    // Update destination filter pills
    document.querySelectorAll('.dest-pill').forEach((pill) => {
      const dest = pill.getAttribute('data-dest');
      if (dest === body.id) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    this.renderServices();
  }

  private renderTelemetry(): void {
    const telemetry = this.manager.getTelemetryData();
    const bar = document.getElementById('telemetryBar');
    if (bar) {
      bar.innerHTML = `
        <div class="t-item"><span class="t-dot dot-green"></span> Solar Flares: <strong>${telemetry.solarFlareLevel}</strong></div>
        <div class="t-item"><span class="t-dot dot-blue"></span> Geomagnetic Shield: <strong>${telemetry.geomagneticShield}%</strong></div>
        <div class="t-item"><span class="t-dot dot-cyan"></span> Radiation Index: <strong>${telemetry.radiationIndex} mSv</strong></div>
        <div class="t-item"><span class="t-dot dot-green"></span> Micrometeorite Risk: <strong>${telemetry.micrometeoriteRisk}</strong></div>
        <div class="t-item"><span class="t-dot dot-purple"></span> Quantum Relay: <strong>${telemetry.quantumRelayStatus}</strong></div>
      `;
    }
  }

  private renderServices(): void {
    const services = this.manager.filterServices();
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;

    if (services.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <p>📡 No orbital services match your telemetry search criteria.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = services
      .map((svc) => {
        const body = CELESTIAL_BODIES.find((b) => b.id === svc.destinationId);
        return `
        <div class="service-card">
          <div class="card-badge-row">
            <span class="badge badge-avail ${svc.availability.toLowerCase().replace(' ', '-')}">${svc.availability}</span>
            <span class="badge badge-dest">${body ? body.name : svc.destinationId}</span>
          </div>
          <div class="card-icon">${svc.icon}</div>
          <h4 class="card-title">${svc.title}</h4>
          <p class="card-duration">⏱️ ${svc.duration}</p>
          <p class="card-desc">${svc.description}</p>
          
          <ul class="card-highlights">
            ${svc.highlights.map((h) => `<li>✨ ${h}</li>`).join('')}
          </ul>
          
          <div class="card-footer">
            <div class="price-tag">
              <span class="price-lbl">Starting from</span>
              <span class="price-val">$${svc.pricePerPersonUSD.toLocaleString()} USD</span>
            </div>
            <button class="btn btn-outline btn-book-svc" data-svc-id="${svc.id}">
              Book Mission
            </button>
          </div>
        </div>
      `;
      })
      .join('');

    // Attach book buttons
    grid.querySelectorAll('.btn-book-svc').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const svcId = target.getAttribute('data-svc-id');
        if (svcId) {
          this.openBookingModal(svcId);
        }
      });
    });
  }

  private bindDOMEvents(): void {
    // Sound FX Toggle
    const soundBtn = document.getElementById('btnToggleSound');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const isEnabled = this.manager.getSoundFX().toggleSound();
        soundBtn.textContent = isEnabled ? '🔊 Audio FX: ON' : '🔇 Audio FX: OFF';
      });
    }

    // Destination Pill Filters
    document.querySelectorAll('.dest-pill').forEach((pill) => {
      pill.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const dest = target.getAttribute('data-dest');
        if (dest) {
          this.manager.setSelectedDestination(dest);
          if (dest !== 'all') {
            this.planetViewer.selectBody(dest);
          } else {
            this.renderServices();
          }
        }
      });
    });

    // Category Filter Select
    const catSelect = document.getElementById('categoryFilter') as HTMLSelectElement;
    if (catSelect) {
      catSelect.addEventListener('change', (e) => {
        const val = (e.target as HTMLSelectElement).value;
        this.manager.setCategoryFilter(val);
        this.renderServices();
      });
    }

    // Search Input
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const val = (e.target as HTMLInputElement).value;
        this.manager.setSearchQuery(val);
        this.renderServices();
      });
    }

    // Tab switcher (Explore Services vs VR Spaceship Tour vs My Bookings)
    document.querySelectorAll('.nav-tab').forEach((tab) => {
      tab.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const targetView = target.getAttribute('data-tab');

        document.querySelectorAll('.nav-tab').forEach((t) => t.classList.remove('active'));
        target.classList.add('active');

        const exploreView = document.getElementById('exploreView');
        const bookingsView = document.getElementById('bookingsView');
        const vrView = document.getElementById('vrTourView');

        if (targetView === 'explore') {
          if (exploreView) exploreView.style.display = 'block';
          if (bookingsView) bookingsView.style.display = 'none';
          if (vrView) vrView.style.display = 'none';
        } else if (targetView === 'vr-tour') {
          if (exploreView) exploreView.style.display = 'none';
          if (bookingsView) bookingsView.style.display = 'none';
          if (vrView) vrView.style.display = 'block';
        } else if (targetView === 'bookings') {
          if (exploreView) exploreView.style.display = 'none';
          if (vrView) vrView.style.display = 'none';
          if (bookingsView) bookingsView.style.display = 'block';
          this.renderReservations();
        }
      });
    });

    // VR Modal Event Listeners
    document.getElementById('btnOpenVrModal')?.addEventListener('click', () => {
      const modal = document.getElementById('vrModal');
      if (modal) modal.style.display = 'flex';
      this.manager.getSoundFX().playWarp();
    });

    document.getElementById('vrModalClose')?.addEventListener('click', () => {
      const modal = document.getElementById('vrModal');
      if (modal) modal.style.display = 'none';
    });

    // Craft & Gear Selector Handler
    const CRAFT_SPECS: Record<string, { badge: string; title: string; items: { lbl: string; val: string }[] }> = {
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
    const stageSketchfab = document.getElementById('stageSketchfabViewer') as HTMLIFrameElement;
    const specBadge = document.getElementById('specBadge');
    const specTitle = document.getElementById('specTitle');
    const specGrid = document.getElementById('specGrid');

    document.querySelectorAll('.craft-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        document.querySelectorAll('.craft-btn').forEach((b) => b.classList.remove('active'));
        target.classList.add('active');

        const modelType = target.getAttribute('data-model-type');
        const src = target.getAttribute('data-src') || '';
        const name = target.getAttribute('data-name') || '';

        if (modelType === 'glb') {
          if (stageGlb) {
            stageGlb.setAttribute('src', encodeURI(src));
            stageGlb.style.display = 'block';
          }
          if (stageSketchfab) stageSketchfab.style.display = 'none';
        } else if (modelType === 'sketchfab') {
          if (stageSketchfab) {
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

        this.manager.getSoundFX().playWarp();
      });
    });

    document.getElementById('btnVrBookNow')?.addEventListener('click', () => {
      this.openBookingModal('srv-iss-1');
    });

    document.getElementById('btnVrModalBook')?.addEventListener('click', () => {
      const modal = document.getElementById('vrModal');
      if (modal) modal.style.display = 'none';
      this.openBookingModal('srv-iss-1');
    });

    // Modal Close
    const modalCloseBtn = document.getElementById('modalClose');
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => {
        this.closeBookingModal();
      });
    }

    // Modal Next/Prev Steps
    const btnNext = document.getElementById('wizardNext');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        this.handleWizardNext();
      });
    }

    const btnPrev = document.getElementById('wizardPrev');
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        const current = this.manager.getCurrentStep();
        this.manager.setStep(current - 1);
        this.renderWizardStep();
      });
    }
  }

  private openBookingModal(serviceId?: string): void {
    this.manager.startBookingFlow(serviceId);
    const modal = document.getElementById('bookingModal');
    if (modal) {
      modal.style.display = 'flex';
      this.renderWizardStep();
    }
  }

  private closeBookingModal(): void {
    const modal = document.getElementById('bookingModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  private renderWizardStep(): void {
    const step = this.manager.getCurrentStep();
    const stepContainer = document.getElementById('wizardStepContent');
    const stepTitle = document.getElementById('wizardStepTitle');
    const btnPrev = document.getElementById('wizardPrev') as HTMLButtonElement;
    const btnNext = document.getElementById('wizardNext') as HTMLButtonElement;
    const totalCostSpan = document.getElementById('wizardTotalCost');

    if (!stepContainer) return;

    if (btnPrev) btnPrev.style.visibility = step === 1 ? 'hidden' : 'visible';
    if (btnNext) btnNext.textContent = step === 4 ? 'Confirm & Launch Reservation 🚀' : 'Next Step ➔';

    if (totalCostSpan) {
      totalCostSpan.textContent = `$${this.manager.calculateTotalCost().toLocaleString()} USD`;
    }

    // Step indicators
    document.querySelectorAll('.step-dot').forEach((dot, idx) => {
      if (idx + 1 === step) {
        dot.classList.add('active');
        dot.classList.remove('completed');
      } else if (idx + 1 < step) {
        dot.classList.add('completed');
        dot.classList.remove('active');
      } else {
        dot.classList.remove('active', 'completed');
      }
    });

    const activeData = this.manager.startBookingFlow(
      (this.manager as unknown as { activeFormData: { serviceId?: string } }).activeFormData?.serviceId
    );
    // Maintain form selections across steps
    const currentForm = (this.manager as unknown as { activeFormData: Partial<BookingFormData> }).activeFormData;

    switch (step) {
      case 1:
        if (stepTitle) stepTitle.textContent = 'Step 1: Select Destination & Service Package';
        stepContainer.innerHTML = `
          <div class="form-group">
            <label>Destination Body</label>
            <select id="wizDestination" class="form-control">
              ${CELESTIAL_BODIES.map(
                (b) => `<option value="${b.id}" ${b.id === currentForm.destinationId ? 'selected' : ''}>${b.name}</option>`
              ).join('')}
            </select>
          </div>

          <div class="form-group">
            <label>Service Package</label>
            <select id="wizService" class="form-control">
              ${SERVICES.filter(s => s.destinationId === currentForm.destinationId)
                .map(s => `<option value="${s.id}" ${s.id === currentForm.serviceId ? 'selected' : ''}>${s.title} ($${s.pricePerPersonUSD.toLocaleString()})</option>`)
                .join('')}
            </select>
          </div>
        `;

        const destSelect = document.getElementById('wizDestination') as HTMLSelectElement;
        destSelect?.addEventListener('change', (e) => {
          const val = (e.target as HTMLSelectElement).value;
          this.manager.updateFormData({ destinationId: val });
          const availSvcs = SERVICES.filter(s => s.destinationId === val);
          if (availSvcs.length > 0) {
            this.manager.updateFormData({ serviceId: availSvcs[0].id });
          }
          this.renderWizardStep();
        });

        const svcSelect = document.getElementById('wizService') as HTMLSelectElement;
        svcSelect?.addEventListener('change', (e) => {
          const val = (e.target as HTMLSelectElement).value;
          this.manager.updateFormData({ serviceId: val });
          this.renderWizardStep();
        });
        break;

      case 2:
        if (stepTitle) stepTitle.textContent = 'Step 2: Launch Logistics & Spacecraft';
        stepContainer.innerHTML = `
          <div class="form-group">
            <label>Departure Spaceport Hub</label>
            <select id="wizSpaceport" class="form-control">
              ${SPACEPORTS.map(
                (sp) => `<option value="${sp.id}" ${sp.id === currentForm.spaceportId ? 'selected' : ''}>${sp.name} (${sp.location})</option>`
              ).join('')}
            </select>
          </div>

          <div class="form-group">
            <label>Launch Vehicle Class</label>
            <select id="wizVehicle" class="form-control">
              ${LAUNCH_VEHICLES.map(
                (v) => `<option value="${v.id}" ${v.id === currentForm.launchVehicleId ? 'selected' : ''}>${v.name} [Provider: ${v.provider}]</option>`
              ).join('')}
            </select>
          </div>

          <div class="form-group">
            <label>Cabin Class</label>
            <div class="radio-group">
              <label class="radio-label">
                <input type="radio" name="wizClass" value="Tourist" ${currentForm.travelClass === 'Tourist' ? 'checked' : ''} />
                <span>Standard Orbital Tourist</span>
              </label>
              <label class="radio-label">
                <input type="radio" name="wizClass" value="Specialist" ${currentForm.travelClass === 'Specialist' ? 'checked' : ''} />
                <span>Science Specialist Suite (+35%)</span>
              </label>
              <label class="radio-label">
                <input type="radio" name="wizClass" value="VIP Zero-G" ${currentForm.travelClass === 'VIP Zero-G' ? 'checked' : ''} />
                <span>VIP Zero-G Suite (+110%)</span>
              </label>
            </div>
          </div>
        `;

        document.getElementById('wizSpaceport')?.addEventListener('change', (e) => {
          this.manager.updateFormData({ spaceportId: (e.target as HTMLSelectElement).value });
        });

        document.getElementById('wizVehicle')?.addEventListener('change', (e) => {
          this.manager.updateFormData({ launchVehicleId: (e.target as HTMLSelectElement).value });
          this.renderWizardStep();
        });

        document.querySelectorAll('input[name="wizClass"]').forEach((rad) => {
          rad.addEventListener('change', (e) => {
            this.manager.updateFormData({
              travelClass: (e.target as HTMLInputElement).value as 'Tourist' | 'Specialist' | 'VIP Zero-G',
            });
            this.renderWizardStep();
          });
        });
        break;

      case 3:
        if (stepTitle) stepTitle.textContent = 'Step 3: Stargate Schedule & Passenger Roster';
        stepContainer.innerHTML = `
          <div class="form-row">
            <div class="form-group">
              <label>Departure Date</label>
              <input type="date" id="wizDepDate" class="form-control" value="${currentForm.departureDate || ''}" />
            </div>
            <div class="form-group">
              <label>Return Date</label>
              <input type="date" id="wizRetDate" class="form-control" value="${currentForm.returnDate || ''}" />
            </div>
          </div>

          <div class="form-group">
            <label>Number of Passengers</label>
            <input type="number" id="wizPassCount" class="form-control" min="1" max="10" value="${currentForm.passengers || 1}" />
          </div>

          <div class="form-group">
            <label>Primary Passenger Name</label>
            <input type="text" id="wizName" class="form-control" placeholder="Commander John Doe" value="${currentForm.passengerName || ''}" />
          </div>

          <div class="form-group">
            <label>Sub-Orbital Comms Email</label>
            <input type="email" id="wizEmail" class="form-control" placeholder="john.doe@space.orbit" value="${currentForm.passengerEmail || ''}" />
          </div>
        `;

        document.getElementById('wizDepDate')?.addEventListener('change', (e) => {
          this.manager.updateFormData({ departureDate: (e.target as HTMLInputElement).value });
        });
        document.getElementById('wizRetDate')?.addEventListener('change', (e) => {
          this.manager.updateFormData({ returnDate: (e.target as HTMLInputElement).value });
        });
        document.getElementById('wizPassCount')?.addEventListener('change', (e) => {
          this.manager.updateFormData({ passengers: parseInt((e.target as HTMLInputElement).value) || 1 });
          this.renderWizardStep();
        });
        document.getElementById('wizName')?.addEventListener('input', (e) => {
          this.manager.updateFormData({ passengerName: (e.target as HTMLInputElement).value });
        });
        document.getElementById('wizEmail')?.addEventListener('input', (e) => {
          this.manager.updateFormData({ passengerEmail: (e.target as HTMLInputElement).value });
        });
        break;

      case 4:
        if (stepTitle) stepTitle.textContent = 'Step 4: Mission Addons & Radiation Shielding';
        const currentAddons = currentForm.addons || [];

        stepContainer.innerHTML = `
          <div class="form-group">
            <label>Optional Orbital Upgrades</label>
            <div class="addons-list">
              ${ADDONS.map(
                (a) => `
                <label class="addon-card ${currentAddons.includes(a.id) ? 'selected' : ''}">
                  <input type="checkbox" value="${a.id}" ${currentAddons.includes(a.id) ? 'checked' : ''} class="addon-checkbox" />
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
            <textarea id="wizNotes" class="form-control" rows="3" placeholder="Specify zero-g dietary requirements, mobility assistance, or orbital suit customizations...">${currentForm.notes || ''}</textarea>
          </div>
        `;

        document.querySelectorAll('.addon-checkbox').forEach((box) => {
          box.addEventListener('change', () => {
            const selectedIds: string[] = [];
            document.querySelectorAll('.addon-checkbox:checked').forEach((chk) => {
              selectedIds.push((chk as HTMLInputElement).value);
            });
            this.manager.updateFormData({ addons: selectedIds });
            this.renderWizardStep();
          });
        });

        document.getElementById('wizNotes')?.addEventListener('input', (e) => {
          this.manager.updateFormData({ notes: (e.target as HTMLTextAreaElement).value });
        });
        break;
    }
  }

  private handleWizardNext(): void {
    const step = this.manager.getCurrentStep();
    if (step < 4) {
      this.manager.setStep(step + 1);
      this.renderWizardStep();
    } else {
      // Confirm & generate reservation
      const res = this.manager.confirmReservation();
      this.closeBookingModal();
      this.showBoardingPassModal(res);
      this.renderReservations();
    }
  }

  private showBoardingPassModal(res: Reservation): void {
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
              <div>
                <span class="lbl">Passenger</span>
                <span class="val">${res.passengerName}</span>
              </div>
              <div>
                <span class="lbl">Destination</span>
                <span class="val" style="color:${body?.color}">${body ? body.name : res.destinationId}</span>
              </div>
              <div>
                <span class="lbl">Mission Service</span>
                <span class="val">${svc ? svc.title : res.serviceId}</span>
              </div>
              <div>
                <span class="lbl">Launch Pad / Spaceport</span>
                <span class="val">${sp ? sp.name : res.spaceportId}</span>
              </div>
              <div>
                <span class="lbl">Spacecraft</span>
                <span class="val">${vehicle ? vehicle.name : res.launchVehicleId}</span>
              </div>
              <div>
                <span class="lbl">Class & Seat</span>
                <span class="val">${res.travelClass} / Seat ${res.seatNumber} (Gate ${res.gateCode})</span>
              </div>
              <div>
                <span class="lbl">Departure Window</span>
                <span class="val">${res.departureDate}</span>
              </div>
              <div>
                <span class="lbl">Total Investment</span>
                <span class="val" style="color: #00f0ff;">$${res.totalCostUSD.toLocaleString()} USD</span>
              </div>
            </div>

            <div class="ticket-qr-section">
              <div class="qr-mock">
                <div class="qr-code-grid"></div>
              </div>
              <div class="qr-info">
                <p>STATUS: LAUNCH READY</p>
                <p>SECURITY HASH: 0x${Math.random().toString(16).substring(2, 10).toUpperCase()}</p>
                <button class="btn btn-outline" id="btnPrintPass">🖨️ Print Ticket</button>
              </div>
            </div>
          </div>
        `;

        document.getElementById('btnPrintPass')?.addEventListener('click', () => {
          window.print();
        });
      }
    }

    document.getElementById('ticketModalClose')?.addEventListener('click', () => {
      if (modal) modal.style.display = 'none';
    });
  }

  private renderReservations(): void {
    const list = this.manager.getReservations();
    const container = document.getElementById('reservationsList');
    if (!container) return;

    if (list.length === 0) {
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

    container.innerHTML = list
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
            ${
              !isCancelled
                ? `<button class="btn btn-danger btn-cancel-res" data-id="${res.id}">Abort / Cancel</button>`
                : ''
            }
          </div>
        </div>
      `;
      })
      .join('');

    container.querySelectorAll('.btn-view-pass').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        const res = list.find((r) => r.id === id);
        if (res) this.showBoardingPassModal(res);
      });
    });

    container.querySelectorAll('.btn-cancel-res').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (id && confirm('Are you sure you want to cancel this space reservation?')) {
          this.manager.cancelReservation(id);
          this.renderReservations();
        }
      });
    });
  }
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new BookFromSpaceApp();
});
