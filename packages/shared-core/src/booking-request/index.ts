import type {
  BookingRequestParsed,
  BookingRequestCreateParsed,
} from "../schemas/booking-request";

export type BookingRequestStatus = BookingRequestParsed["status"];
export type BookingRequest = BookingRequestParsed;
export type BookingRequestCreate = BookingRequestCreateParsed;

export interface AvailabilitySlot {
  time: string;
  employee_name: string;
}

export interface BookingService {
  id: number;
  name: string;
  price: number;
  type: string;
  image_url: string | null;
}

export interface BookingServicesResponse {
  business_name: string;
  services: BookingService[];
  employees: { name: string; available: boolean }[];
  location?: {
    id: number;
    name: string;
    address: string | null;
    phone: string | null;
    maps_link: string | null;
  } | null;
}

export interface AvailabilityResponse {
  date: string;
  slots: AvailabilitySlot[];
}

export interface BookingLocation {
  id: number;
  name: string;
  address: string | null;
  phone: string | null;
  maps_link: string | null;
}

export interface BookingLocationsResponse {
  business_name: string;
  locations: BookingLocation[];
}
