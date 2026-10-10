export interface Booking {
  id: string;
  trackingCode: string;
  clientName: string;
  clientLastName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  phone: string;
  email: string;
  eventType: string;
  guests?: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  source: 'web' | 'phone' | 'manual';
  createdAt: string;
  adminNotes?: string;
}

export interface BlockedSlot {
  id: string;
  date: string; // YYYY-MM-DD
  isFullDay: boolean;
  startTime?: string;
  endTime?: string;
  reason: string;
  createdAt: string;
}

export interface PublicAvailabilitySlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'pending' | 'blocked';
  isFullDay?: boolean;
}

export interface BusinessRate {
  id: string;
  title: string;
  hours: string;
  price: string;
  description: string;
  isPopular?: boolean;
}

export interface BusinessService {
  id: string;
  title: string;
  description: string;
  icon: string;
  included: boolean;
}

export interface CelebrationType {
  id: string;
  title: string;
  description: string;
  recommendedHours: string;
  badge: string;
  icon: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
}

export interface BusinessConfig {
  name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  googleMapsUrl: string;
  hoursDescription: string;
  howToArrive: string;
  capacityMax: number;
  rates: BusinessRate[];
  services: BusinessService[];
  celebrationTypes: CelebrationType[];
  gallery: GalleryItem[];
}
