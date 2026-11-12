export type ProductType = 'equipment' | 'reagent' | 'consumable';
export type AvailabilityStatus = 'available' | 'unavailable';

export interface Product {
  id: string;
  reference: string;
  name: string;
  type: ProductType;
  brand: string;
  domain: string;
  description: string;
  features: string[];
  image: string;
  status: AvailabilityStatus;
  expectedReturnDate?: string;
  note?: string;
  visible: boolean;
  priceEstimate?: string;
}

export interface Brand {
  id: string;
  name: string;
  logo?: string;
}

export interface Domain {
  id: string;
  name: string;
  image: string;
}

export interface DeliveryOption {
  id: string;
  name: string;
  type: 'own' | 'partner';
  estimatedDays: string;
  coveredWilayas: string[];
  active: boolean;
}

export interface Customer {
  id: string;
  laboratoryName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  wilaya: string;
  commune: string;
}

export type QuoteDetails = Omit<Customer, 'id'> & {
  deliveryOptionId: string;
  comment: string;
};

export interface SubmissionReceipt {
  reference: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  reference: string;
  quantity: number;
  serialNumber?: string;
}

export type OrderStatus = 'New' | 'Contacted' | 'Confirmed' | 'Delivered' | 'Cancelled';

export interface OrderRequest {
  id: string;
  reference: string;
  customerId: string;
  customerName: string;
  laboratoryName: string;
  email: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  deliveryOptionId: string;
  deliveryOptionName: string;
  comment?: string;
  items: OrderItem[];
  status: OrderStatus;
  source: 'website' | 'admin';
  createdAt: string;
}

export type ProblemType = 'breakdown' | 'calibration' | 'error_message' | 'other';
export type UrgencyLevel = 'normal' | 'urgent';
export type ProblemStatus = 'New' | 'In progress' | 'Intervention scheduled' | 'Resolved' | 'Closed';

export interface ProblemReport {
  id: string;
  reference: string;
  customerId: string;
  customerName: string;
  laboratoryName: string;
  equipmentId: string;
  equipmentName: string;
  serialNumber: string;
  problemType: ProblemType;
  description: string;
  urgency: UrgencyLevel;
  photos: string[];
  status: ProblemStatus;
  plannedInterventionDate?: string;
  messageToCustomer?: string;
  internalNote?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminEmail: string;
  action: string;
  productName: string;
  oldValue?: string;
  newValue?: string;
  date: string;
}
