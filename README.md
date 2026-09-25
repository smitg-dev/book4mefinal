# 🚀 BookFromSpace - Interplanetary Service Booking & Orbital Environment

A self-contained, interactive space-themed web application and TypeScript module built for exploring celestial destinations (planets, moons, and satellites) and booking space services (orbital hotel stays, surface expeditions, zero-g training, spacewalks, and satellite maintenance tours).

---

## 🌌 Key Features

### 1. Planetary & Satellite Visual Environment
- **Canvas Orbit Simulator**: Dynamic starfield engine with twinkling star particles, shooting meteors, deep space atmospheric gradients, and elliptical orbital trajectories.
- **6 Featured Celestial Destinations & Satellites**:
  - 🔴 **Mars (Ares Prime Hub)**: Red atmosphere, Olympus Mons, Valles Marineris canyon rover expeditions.
  - 🌕 **Luna Gateway (The Moon)**: Shackleton crater south pole habitat, historic Apollo 11 buggy safari.
  - 🧊 **Europa Cryo Terminal**: Jovian sky suites, sub-surface liquid ocean submersibles.
  - 🛰️ **ISS Orbital Hotel**: Microgravity spacewalks, 16 sunrises/day Cupola viewing, zero-g astronaut school.
  - 🪐 **Titan Saturn Outpost**: Atmospheric wingsuit gliding, liquid methane yacht cruises.
  - 🔭 **JWST Deep Relayer**: Lagrange Point L2 quantum telescope observation night.
- **Interactive Telemetry HUD**: Click or hover over any celestial body to focus the camera and display live surface specs (Gravity, Distance from Earth, Surface Temp, Atmosphere).

### 2. Space Service Booking System
- **Interactive Service Catalog**: Filter by celestial destination, category (Hotel, Expedition, Training, Transport, Satellite), or keyword search.
- **Multi-Step Space Booking Wizard**:
  - **Step 1**: Select Destination Planet/Satellite & Service Package.
  - **Step 2**: Select Spaceport (Kennedy Spaceport, Starbase Boca Chica, Tokyo Spaceport, Guiana) & Launch Vehicle (SpaceX Starship, Blue Origin New Glenn, Orion SLS).
  - **Step 3**: Launch Window Dates & Passenger Roster details.
  - **Step 4**: Mission Addons (Tailored Spacesuit, Centrifuge Training, Radiation Shielding, Quantum Comms).
  - **Step 5**: Boarding Pass Generator & Confirmation.
- **Futuristic Boarding Pass Generator**: Interactive sci-fi ticket containing QR security hash, seat assignment, pad gate code, flight specs, and print support.
- **Reservation Manager**: View, filter, view boarding passes, or abort/cancel active space missions with `localStorage` persistence.
- **Web Audio Sound Synthesizer**: Atmospheric audio feedback (warp speed pass, click beeps, sci-fi tones) generated entirely in-browser.

---

## 📁 File Structure

```
bookfromspace/
├── index.html               # Standalone entry HTML for the space dashboard & booking system
├── styles.css               # Sci-Fi HUD design system, glassmorphism, orbit animations
├── main.ts                  # Main TypeScript entry point (Canvas engine, state, event listeners)
├── types.ts                 # TypeScript interfaces (CelestialBody, SpaceService, Reservation, etc.)
├── app.js                  # Standalone JS bundle for direct browser execution
├── tsconfig.json            # Isolated TypeScript configuration for bookfromspace
├── README.md                # Architecture, features, and user documentation
└── components/
    ├── planetViewer.ts      # Canvas orbital simulation engine & starfield renderer
    └── bookingWizard.ts     # Booking wizard, reservation manager & Web Audio synth
```

---

## 🛠️ How to Run & Integrate

### Option 1: Standalone Direct Launch
Simply open `bookfromspace/index.html` in any web browser or use a local web server 
