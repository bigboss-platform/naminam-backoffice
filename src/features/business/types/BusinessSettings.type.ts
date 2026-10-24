export type OpeningHoursRow = {
  id: string;
  /** "Martes a viernes" */
  label: string;
  /** 24h "HH:MM" */
  opensAt: string;
  closesAt: string;
};

/** Single settings document: everything about the shop that the public site shows. */
export type BusinessSettings = {
  name: string;
  tagline: string;
  /** Digits only, with country code, no "+" (wa.me links). */
  whatsappNumber: string;
  /** Digits only, with country code — the "Llamar" button. */
  phoneNumber: string;
  /** Without "@". */
  instagramHandle: string;
  address: string;
  city: string;
  /** The Google Maps link the admin pasted (coordinates are read from it). */
  mapsUrl: string;
  mapLatitude: number;
  mapLongitude: number;
  hours: OpeningHoursRow[];
  /** Home hero photo link. */
  heroImageUrl: string;
  updatedAt: string;
};

export type ContactInput = Pick<BusinessSettings, 'whatsappNumber' | 'phoneNumber' | 'instagramHandle'>;
export type LocationInput = Pick<BusinessSettings, 'address' | 'city' | 'mapsUrl'>;
export type HoursRowInput = Omit<OpeningHoursRow, 'id'>;
export type BrandInput = Pick<BusinessSettings, 'name' | 'tagline' | 'heroImageUrl'>;

export const EMPTY_HOURS_ROW: HoursRowInput = { label: '', opensAt: '', closesAt: '' };

export const EMPTY_BUSINESS_SETTINGS: BusinessSettings = {
  name: 'Los Antojitos de Santanita',
  tagline: 'Antojitos venezolanos con giros peruanos',
  whatsappNumber: '',
  phoneNumber: '',
  instagramHandle: '',
  address: '',
  city: '',
  mapsUrl: '',
  mapLatitude: 0,
  mapLongitude: 0,
  hours: [],
  heroImageUrl: '',
  updatedAt: '',
};
