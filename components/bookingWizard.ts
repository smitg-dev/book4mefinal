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

const STORAGE_KEY = 'bookfromspace_reservations';
const TOTAL_STEPS = 5;
const DAY_MS = 24 * 60 * 60 * 1000;

const CLASS_MULTIPLIERS: Record<string, number> = {
  Tourist: 1,
  Specialist: 1.35,
  'VIP Zero-G': 2.1,
};

export class SoundFX {
  private audioCtx: AudioContext | null = null;
  private enabled = true;

  public toggleSound(): boolean {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  private getCtx(): AudioContext | null {
    if (!this.enabled || typeof window === 'undefined') return null;

    if (!this.audioCtx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return null;
      this.audioCtx = new Ctor();
    }

    if (this.audioCtx.state === 'suspended') {
      void this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public playBeep(freq = 800, durationMs = 80): void {
    const ctx = this.getCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const end = now + durationMs / 1000;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, end);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(end);
    } catch {
    }
  }

  public playWarp(): void {
    const ctx = this.getCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
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
  private soundFX = new SoundFX();

  private selectedDestinationId = 'mars';
  private selectedCategoryId = 'all';
  private searchQuery = '';
  private currentStep = 1;
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

    this.loadReservations();
  }

  public getSoundFX(): SoundFX {
    return this.soundFX;
  }

  

  private loadReservations(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        this.reservations = parsed.filter(
          (r): r is Reservation =>
            r && typeof r.id === 'string' && typeof r.bookingCode === 'string'
        );
      }
    } catch {
      this.reservations = [];
    }
  }

  private saveReservations(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.reservations));
    } catch {
    }
  }

  public getReservations(): Reservation[] {
    return [...this.reservations];
  }

  

  public setSelectedDestination(destId: string): void {
    this.selectedDestinationId = destId;
    this.activeFormData.destinationId = destId;
  }

  public setCategoryFilter(category: string): void {
    this.selectedCategoryId = category;
  }

  public setSearchQuery(query: string): void {
    this.searchQuery = query.trim().toLowerCase();
  }

  public filterServices(): SpaceService[] {
    const q = this.searchQuery;

    return this.services.filter((svc) => {
      const destOk =
        this.selectedDestinationId === 'all' ||
        svc.destinationId === this.selectedDestinationId;
      const catOk =
        this.selectedCategoryId === 'all' ||
        svc.category === this.selectedCategoryId;
      const searchOk =
        !q ||
        svc.title.toLowerCase().includes(q) ||
        svc.description.toLowerCase().includes(q);

      return destOk && catOk && searchOk;
    });
  }

  

  private static isoDateFromNow(days: number): string {
    return new Date(Date.now() + days * DAY_MS).toISOString().split('T')[0];
  }

  public startBookingFlow(serviceId?: string): Partial<BookingFormData> {
    this.currentStep = 1;

    const service = serviceId
      ? this.services.find((s) => s.id === serviceId)
      : this.services.find((s) => s.destinationId === this.selectedDestinationId);

    this.activeFormData = {
      destinationId: service?.destinationId ?? this.selectedDestinationId,
      serviceId: service?.id ?? this.services[0]?.id,
      spaceportId: this.spaceports[0]?.id,
      launchVehicleId: this.launchVehicles[0]?.id,
      departureDate: BookingWizardManager.isoDateFromNow(14),
      returnDate: BookingWizardManager.isoDateFromNow(21),
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
    this.currentStep = Math.max(1, Math.min(TOTAL_STEPS, step));
    this.soundFX.playBeep(600, 50);
  }

  public updateFormData(partial: Partial<BookingFormData>): void {
    this.activeFormData = { ...this.activeFormData, ...partial };
  }

  public validateForm(): string[] {
    const f = this.activeFormData;
    const errors: string[] = [];

    if (!f.passengerName?.trim()) errors.push('Passenger name is required.');
    if (!f.passengerEmail || !/^\S+@\S+\.\S+$/.test(f.passengerEmail)) {
      errors.push('A valid email is required.');
    }
    if (!f.passengers || f.passengers < 1) {
      errors.push('At least one passenger is needed.');
    }
    if (f.departureDate && f.returnDate && f.returnDate <= f.departureDate) {
      errors.push('Return date must be after the departure date.');
    }
    return errors;
  }

  public calculateTotalCost(): number {
    const f = this.activeFormData;
    const service = this.services.find((s) => s.id === f.serviceId);
    if (!service) return 0;

    const vehicle = this.launchVehicles.find((v) => v.id === f.launchVehicleId);
    const passengers = f.passengers || 1;

    const perPerson =
      service.pricePerPersonUSD *
      (CLASS_MULTIPLIERS[f.travelClass ?? 'Tourist'] ?? 1) *
      (vehicle?.priceMultiplier ?? 1);

    const addonsPerPerson = (f.addons ?? []).reduce((sum, id) => {
      const addon = this.addons.find((a) => a.id === id);
      return sum + (addon?.priceUSD ?? 0);
    }, 0);

    return Math.round((perPerson + addonsPerPerson) * passengers);
  }

  

  private generateBookingCode(): string {
    for (let i = 0; i < 10; i++) {
      const code = `BFS-${Math.random()
        .toString(36)
        .substring(2, 7)
        .toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
      if (!this.reservations.some((r) => r.bookingCode === code)) return code;
    }
    return `BFS-${Date.now().toString(36).toUpperCase()}`;
  }

  private assignSeat(departureDate: string): string {
    const taken = new Set(
      this.reservations
        .filter((r) => r.departureDate === departureDate && r.status !== 'Cancelled')
        .map((r) => r.seatNumber)
    );
    const letters = ['A', 'B', 'C', 'D'];

    for (let i = 0; i < 50; i++) {
      const seat = `${Math.floor(Math.random() * 20 + 1)}${
        letters[Math.floor(Math.random() * letters.length)]
      }`;
      if (!taken.has(seat)) return seat;
    }
    return '1A';
  }

  public confirmReservation(): Reservation {
    const errors = this.validateForm();
    if (errors.length > 0) {
      throw new Error(errors.join(' '));
    }

    const f = this.activeFormData;
    const departureDate = f.departureDate ?? '';

    const reservation: Reservation = {
      id: `res-${Date.now()}`,
      destinationId: f.destinationId ?? 'mars',
      serviceId: f.serviceId ?? 'srv-mars-1',
      spaceportId: f.spaceportId ?? 'sp-ksc',
      launchVehicleId: f.launchVehicleId ?? 'lv-starship',
      departureDate,
      returnDate: f.returnDate ?? '',
      passengers: f.passengers ?? 1,
      travelClass: f.travelClass ?? 'Tourist',
      passengerName: f.passengerName!.trim(),
      passengerEmail: f.passengerEmail!.trim(),
      addons: f.addons ?? [],
      notes: f.notes ?? '',
      bookingCode: this.generateBookingCode(),
      createdAt: new Date().toISOString(),
      totalCostUSD: this.calculateTotalCost(),
      status: 'Confirmed',
      seatNumber: this.assignSeat(departureDate),
      gateCode: `PAD-${Math.floor(Math.random() * 9 + 1)}B`,
    };

    this.reservations.unshift(reservation);
    this.saveReservations();
    this.soundFX.playWarp();
    return reservation;
  }

  public cancelReservation(id: string): boolean {
    const res = this.reservations.find((r) => r.id === id);
    if (!res || res.status === 'Cancelled') return false;

    res.status = 'Cancelled';
    this.saveReservations();
    this.soundFX.playBeep(400, 100);
    return true;
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
