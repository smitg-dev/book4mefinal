export type CelestialCategory = 'planet' | 'moon' | 'satellite';

export interface CelestialBody {
  id: string;
  name: string;
  category: CelestialCategory;
  tagline: string;
  description: string;
  distanceFromEarth: string; // e.g. "225M km"
  gravity: string; // e.g. "0.38g"
  temperature: string; // e.g. "-63°C"
  atmosphere: string; // e.g. "95% CO2"
  orbitalPeriod: string; // e.g. "687 Days"
  color: string; // Primary aesthetic color (hex/hsl)
  secondaryColor: string;
  radius: number; // Render radius on screen canvas
  orbitDistance: number; // Distance from central star in simulation
  orbitSpeed: number; // Orbital rotation speed
  servicesCount: number;
  featuredImgSymbol: string;
}

export interface SpaceService {
  id: string;
  destinationId: string;
  title: string;
  category: 'hotel' | 'transport' | 'training' | 'expedition' | 'satellite';
  duration: string;
  pricePerPersonUSD: number;
  description: string;
  highlights: string[];
  icon: string;
  availability: 'Available' | 'High Demand' | 'Waitlist';
}

export interface LaunchVehicle {
  id: string;
  name: string;
  provider: string;
  payloadCapacity: string;
  transitTime: string;
  priceMultiplier: number;
}

export interface Spaceport {
  id: string;
  name: string;
  location: string;
  code: string;
}

export interface BookingAddon {
  id: string;
  name: string;
  priceUSD: number;
  description: string;
}

export interface BookingFormData {
  destinationId: string;
  serviceId: string;
  spaceportId: string;
  launchVehicleId: string;
  departureDate: string;
  returnDate: string;
  passengers: number;
  travelClass: 'Tourist' | 'Specialist' | 'VIP Zero-G';
  passengerName: string;
  passengerEmail: string;
  addons: string[];
  notes?: string;
}

export interface Reservation extends BookingFormData {
  id: string;
  bookingCode: string;
  createdAt: string;
  totalCostUSD: number;
  status: 'Confirmed' | 'Scheduled' | 'Completed' | 'Cancelled';
  seatNumber: string;
  gateCode: string;
}

export interface SpaceWeatherTelemetry {
  solarFlareLevel: 'Low' | 'Moderate' | 'Severe';
  radiationIndex: number; // 0 - 100
  geomagneticShield: number; // 0 - 100%
  micrometeoriteRisk: 'Minimal' | 'Elevated' | 'High';
  quantumRelayStatus: 'Optimal' | 'Degraded';
}
