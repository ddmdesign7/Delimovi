export type ParcelStatus = 
  | 'Order Registered' 
  | 'In Transit' 
  | 'Customs Clearance' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Exception / Delayed';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  status: string;
  location: string;
  description: string;
  completed: boolean;
  is_current: boolean;
  coordinates?: [number, number];
}

export interface CourierInfo {
  name: string;
  id: string;
  phone: string;
  vehicle: string;
  rating: number;
  current_zone: string;
  avatar?: string;
}

export interface SenderInfo {
  name: string;
  city: string;
  country: string;
  hub: string;
}

export interface RecipientInfo {
  name: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  phone?: string;
}

export interface PackageDetails {
  weight: string;
  dimensions: string;
  items: string;
  pieces: number;
  declared_value: string;
  signature_required: boolean;
  insured: boolean;
}

export interface Parcel {
  tracking_number: string;
  status: ParcelStatus;
  progress_percent: number;
  service_tier: string;
  carrier: string;
  sender: SenderInfo;
  recipient: RecipientInfo;
  package_details: PackageDetails;
  courier: CourierInfo;
  eta: string;
  created_at: string;
  history: TimelineEvent[];
}
