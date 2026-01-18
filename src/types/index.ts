// MediCare Wellness Network Type Definitions
// Based on ERD and Data Dictionary from design documents

export type UserRole = 'admin' | 'doctor' | 'staff' | 'patient';

export type MembershipType = 'none' | 'silver' | 'gold' | 'platinum';

export type AppointmentStatus = 'booked' | 'completed' | 'cancelled' | 'pending';

export type PaymentStatus = 'pending' | 'paid' | 'void' | 'refunded';

export type ServiceType = 
  | 'wellness_consultation' 
  | 'nutrition' 
  | 'fitness' 
  | 'detox' 
  | 'stress_management'
  | 'health_checkup';

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  membershipType: MembershipType;
  membershipExpiry?: string;
  medicalHistory?: string;
  allergies?: string;
  createdAt: string;
}

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: ServiceType[];
  branchId: string;
  isAvailable: boolean;
  consultationFee: number;
}

export interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
  doctorId: string;
  branchId: string;
  date: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patient?: Patient;
  doctorId: string;
  doctor?: Doctor;
  branchId: string;
  branch?: Branch;
  serviceType: ServiceType;
  appointmentDateTime: string;
  tokenNo: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface WellnessPackage {
  id: string;
  name: string;
  description: string;
  serviceType: ServiceType;
  sessionsIncluded: number;
  sessionPrice: number;
  packageDiscount: number; // e.g., 0.1 for 10%
  validityDays: number;
  isActive: boolean;
}

export interface Bill {
  id: string;
  patientId: string;
  patient?: Patient;
  appointmentId?: string;
  packageId?: string;
  package?: WellnessPackage;
  sessionsBooked: number;
  grossAmount: number;
  packageDiscountRate: number;
  membershipDiscountRate: number;
  taxAmount: number; // 8% wellness tax
  finalAmount: number;
  paymentStatus: PaymentStatus;
  billDate: string;
}

export interface ConsultationNote {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  notes: string;
  diagnosis?: string;
  prescription?: string;
  createdAt: string;
}

export interface LabReport {
  id: string;
  patientId: string;
  reportName: string;
  reportDate: string;
  fileUrl: string;
  uploadedBy: string;
  createdAt: string;
}

// Membership discount rates
export const MEMBERSHIP_DISCOUNTS: Record<MembershipType, number> = {
  none: 0,
  silver: 0.05,  // 5%
  gold: 0.10,    // 10%
  platinum: 0.15 // 15%
};

// NHS Wellness Tax Rate
export const WELLNESS_TAX_RATE = 0.08; // 8%

// Service type labels
export const SERVICE_LABELS: Record<ServiceType, string> = {
  wellness_consultation: 'Wellness Consultation',
  nutrition: 'Nutrition Advisory',
  fitness: 'Fitness Training',
  detox: 'Detox Program',
  stress_management: 'Stress Management',
  health_checkup: 'Health Check-up'
};
