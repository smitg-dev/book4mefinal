import {
  CelestialBody,
  SpaceService,
  LaunchVehicle,
  Spaceport,
  BookingFormData,
  Reservation,
  SpaceWeatherTelemetry,
  BookingAddon,
} from '../types.js';

export class SoundFX {
  private audioCtx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    // Lazily init AudioContext on user interaction
  }

  private initCtx(): void {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
  }

  public toggleSound(): boolean {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  public playBeep(freq: number = 800, durationMs: number = 80): void {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        this.audioCtx.currentTime + durationMs / 1000
      );

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + durationMs / 1000);
    } catch {
      // Audio context silenced or blocked
    }
  }

  public playWarp(): void {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        880,
        this.audioCtx.currentTime + 0.3
      );

      gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioCtx.currentTime + 0.35
      );

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.35);
    } catch {
      // Audio context silenced
    }
  }
}

export class BookingWizardManager {
  private bodies: CelestialBody[];
  private services: SpaceService[];
  private launchVehicles: LaunchVehicle[];
  private spaceports: Spaceport[];
  private addons: BookingAddon[];
  private reservations: Reservation[] = [];
  private soundFX: SoundFX;

  // Active state
  private selectedDestinationId: string = 'mars';
  private selectedCategoryId: string = 'all';
  private searchQuery: string = '';
  private currentStep: number = 1;
  private activeFormData: Partial<BookingFormData> = {
    passengers: 1,
    travelClass: 'Tourist',
    addons: [],
  };

  constructor(
    bodies: CelestialBody[],
    services: SpaceService[],
    launchVehicles: LaunchVehicle[],
    spaceports: Spaceport[],
    addons: BookingAddon[]
  ) {
    this.bodies = bodies;
    this.services = services;
    this.launchVehicles = launchVehicles;
    this.spaceports = spaceports;
    this.addons = addons;
    this.soundFX = new SoundFX();

    this.loadReservations();
  }

  public getSoundFX(): SoundFX {
    return this.soundFX;
  }

  private loadReservations(): void {
    try {
      const saved = localStorage.getItem('bookfromspace_reservations');
      if (saved) {
        this.reservations = JSON.parse(saved);
      }
    } catch {
      this.reservations = [];
    }
  }

  private saveReservations(): void {
    try {
      localStorage.setItem(
        'bookfromspace_reservations',
        JSON.stringify(this.reservations)
      );
    } catch {
      // localStorage quota or disabled
    }
  }

  public getReservations(): Reservation[] {
    return this.reservations;
  }

  public setSelectedDestination(destId: string): void {
    this.selectedDestinationId = destId;
    this.activeFormData.destinationId = destId;
  }

  public filterServices(): SpaceService[] {
    return this.services.filter((svc) => {
      const matchesDest =
        this.selectedDestinationId === 'all' ||
        svc.destinationId === this.selectedDestinationId;
      const matchesCat =
        this.selectedCategoryId === 'all' ||
        svc.category === this.selectedCategoryId;
      const matchesSearch =
        !this.searchQuery ||
        svc.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        svc.description.toLowerCase().includes(this.searchQuery.toLowerCase());

      return matchesDest && matchesCat && matchesSearch;
    });
  }

  public setCategoryFilter(category: string): void {
    this.selectedCategoryId = category;
  }

  public setSearchQuery(query: string): void {
    this.searchQuery = query;
  }

  public startBookingFlow(serviceId?: string): Partial<BookingFormData> {
    this.currentStep = 1;
    const defaultSvc = serviceId
      ? this.services.find((s) => s.id === serviceId)
      : this.services.find((s) => s.destinationId === this.selectedDestinationId);

    const destId = defaultSvc
      ? defaultSvc.destinationId
      : this.selectedDestinationId;

    this.activeFormData = {
      destinationId: destId,
      serviceId: defaultSvc ? defaultSvc.id : this.services[0]?.id,
      spaceportId: this.spaceports[0]?.id,
      launchVehicleId: this.launchVehicles[0]?.id,
      departureDate: new Date(Date.now() + 86400000 * 14)
        .toISOString()
        .split('T')[0],
      returnDate: new Date(Date.now() + 86400000 * 21)
        .toISOString()
        .split('T')[0],
      passengers: 1,
      travelClass: 'Tourist',
      passengerName: '',
      passengerEmail: '',
      addons: [],
    };

    return this.activeFormData;
  }

  public getCurrentStep(): number {
    return this.currentStep;
  }

  public setStep(step: number): void {
    this.currentStep = Math.max(1, Math.min(5, step));
    this.soundFX.playBeep(600, 50);
  }

  public updateFormData(partial: Partial<BookingFormData>): void {
    this.activeFormData = { ...this.activeFormData, ...partial };
  }

  public calculateTotalCost(): number {
    const svc = this.services.find((s) => s.id === this.activeFormData.serviceId);
    const vehicle = this.launchVehicles.find(
      (v) => v.id === this.activeFormData.launchVehicleId
    );

    if (!svc) return 0;

    let base = svc.pricePerPersonUSD;

    // Travel class multiplier
    if (this.activeFormData.travelClass === 'Specialist') base *= 1.35;
    if (this.activeFormData.travelClass === 'VIP Zero-G') base *= 2.1;

    // Vehicle multiplier
    if (vehicle) base *= vehicle.priceMultiplier;

    // Passengers
    let total = base * (this.activeFormData.passengers || 1);

    // Addons
    if (this.activeFormData.addons) {
      this.activeFormData.addons.forEach((addonId) => {
        const item = this.addons.find((a) => a.id === addonId);
        if (item) total += item.priceUSD * (this.activeFormData.passengers || 1);
      });
    }

    return Math.round(total);
  }

  public confirmReservation(): Reservation {
    const total = this.calculateTotalCost();
    const bookingCode = `BFS-${Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const reservation: Reservation = {
      id: `res-${Date.now()}`,
      destinationId: this.activeFormData.destinationId || 'mars',
      serviceId: this.activeFormData.serviceId || 'srv-mars-1',
      spaceportId: this.activeFormData.spaceportId || 'sp-ksc',
      launchVehicleId: this.activeFormData.launchVehicleId || 'lv-starship',
      departureDate: this.activeFormData.departureDate || '',
      returnDate: this.activeFormData.returnDate || '',
      passengers: this.activeFormData.passengers || 1,
      travelClass: this.activeFormData.travelClass || 'Tourist',
      passengerName: this.activeFormData.passengerName || 'Space Traveler',
      passengerEmail:
        this.activeFormData.passengerEmail || 'traveler@space.orbit',
      addons: this.activeFormData.addons || [],
      notes: this.activeFormData.notes || '',
      bookingCode,
      createdAt: new Date().toISOString(),
      totalCostUSD: total,
      status: 'Confirmed',
      seatNumber: `${Math.floor(Math.random() * 20 + 1)}${
        ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]
      }`,
      gateCode: `PAD-${Math.floor(Math.random() * 9 + 1)}B`,
    };

    this.reservations.unshift(reservation);
    this.saveReservations();
    this.soundFX.playWarp();
    return reservation;
  }

  public cancelReservation(id: string): boolean {
    const idx = this.reservations.findIndex((r) => r.id === id);
    if (idx !== -1) {
      this.reservations[idx].status = 'Cancelled';
      this.saveReservations();
      this.soundFX.playBeep(400, 100);
      return true;
    }
    return false;
  }

  public getTelemetryData(): SpaceWeatherTelemetry {
    return {
      solarFlareLevel: 'Low',
      radiationIndex: 18,
      geomagneticShield: 94,
      micrometeoriteRisk: 'Minimal',
      quantumRelayStatus: 'Optimal',
    };
  }
}
