import { 
  Branch, 
  Patient, 
  Doctor, 
  Appointment, 
  WellnessPackage, 
  Bill,
  TimeSlot 
} from '@/types';

// Mock Branches
export const branches: Branch[] = [
  {
    id: 'branch-1',
    name: 'MWN Central Clinic',
    address: '123 Wellness Avenue, London, EC1A 1BB',
    phone: '+44 20 7123 4567',
    email: 'central@mwn.health',
    isActive: true
  },
  {
    id: 'branch-2',
    name: 'MWN North Branch',
    address: '45 Health Street, Manchester, M1 2AB',
    phone: '+44 161 234 5678',
    email: 'north@mwn.health',
    isActive: true
  },
  {
    id: 'branch-3',
    name: 'MWN South Wellness Center',
    address: '78 Care Road, Brighton, BN1 1AA',
    phone: '+44 1273 456 789',
    email: 'south@mwn.health',
    isActive: true
  }
];

// Mock Doctors
export const doctors: Doctor[] = [
  {
    id: 'doc-1',
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah.williams@mwn.health',
    phone: '+44 7700 900001',
    specialization: ['wellness_consultation', 'stress_management'],
    branchId: 'branch-1',
    isAvailable: true,
    consultationFee: 85
  },
  {
    id: 'doc-2',
    firstName: 'James',
    lastName: 'Chen',
    email: 'james.chen@mwn.health',
    phone: '+44 7700 900002',
    specialization: ['nutrition', 'detox'],
    branchId: 'branch-1',
    isAvailable: true,
    consultationFee: 75
  },
  {
    id: 'doc-3',
    firstName: 'Emily',
    lastName: 'Thompson',
    email: 'emily.thompson@mwn.health',
    phone: '+44 7700 900003',
    specialization: ['fitness', 'health_checkup'],
    branchId: 'branch-2',
    isAvailable: true,
    consultationFee: 80
  },
  {
    id: 'doc-4',
    firstName: 'Michael',
    lastName: 'Patel',
    email: 'michael.patel@mwn.health',
    phone: '+44 7700 900004',
    specialization: ['wellness_consultation', 'nutrition'],
    branchId: 'branch-3',
    isAvailable: false,
    consultationFee: 90
  }
];

// Mock Patients
export const patients: Patient[] = [
  {
    id: 'patient-1',
    firstName: 'Emma',
    lastName: 'Johnson',
    email: 'emma.johnson@email.com',
    phone: '+44 7800 100001',
    dateOfBirth: '1985-03-15',
    gender: 'female',
    address: '10 Oak Street, London, SE1 2AB',
    membershipType: 'gold',
    membershipExpiry: '2026-12-31',
    medicalHistory: 'No significant history',
    allergies: 'Penicillin',
    createdAt: '2024-01-15'
  },
  {
    id: 'patient-2',
    firstName: 'Oliver',
    lastName: 'Smith',
    email: 'oliver.smith@email.com',
    phone: '+44 7800 100002',
    dateOfBirth: '1990-07-22',
    gender: 'male',
    address: '25 Maple Avenue, Manchester, M2 3CD',
    membershipType: 'platinum',
    membershipExpiry: '2027-06-30',
    medicalHistory: 'Mild asthma',
    createdAt: '2024-02-20'
  },
  {
    id: 'patient-3',
    firstName: 'Sophie',
    lastName: 'Brown',
    email: 'sophie.brown@email.com',
    phone: '+44 7800 100003',
    dateOfBirth: '1978-11-08',
    gender: 'female',
    address: '42 Pine Road, Brighton, BN2 4EF',
    membershipType: 'silver',
    membershipExpiry: '2026-03-15',
    createdAt: '2024-03-10'
  },
  {
    id: 'patient-4',
    firstName: 'William',
    lastName: 'Taylor',
    email: 'william.taylor@email.com',
    phone: '+44 7800 100004',
    dateOfBirth: '1995-05-30',
    gender: 'male',
    address: '88 Cedar Lane, London, W1 5GH',
    membershipType: 'none',
    createdAt: '2024-04-05'
  }
];

// Mock Appointments
export const appointments: Appointment[] = [
  {
    id: 'apt-1',
    patientId: 'patient-1',
    patient: patients[0],
    doctorId: 'doc-1',
    doctor: doctors[0],
    branchId: 'branch-1',
    branch: branches[0],
    serviceType: 'wellness_consultation',
    appointmentDateTime: '2026-01-20T09:00:00',
    tokenNo: 'MWN-C-20260120-001',
    status: 'booked',
    createdAt: '2026-01-18'
  },
  {
    id: 'apt-2',
    patientId: 'patient-2',
    patient: patients[1],
    doctorId: 'doc-2',
    doctor: doctors[1],
    branchId: 'branch-1',
    branch: branches[0],
    serviceType: 'nutrition',
    appointmentDateTime: '2026-01-20T10:30:00',
    tokenNo: 'MWN-C-20260120-002',
    status: 'booked',
    createdAt: '2026-01-18'
  },
  {
    id: 'apt-3',
    patientId: 'patient-3',
    patient: patients[2],
    doctorId: 'doc-3',
    doctor: doctors[2],
    branchId: 'branch-2',
    branch: branches[1],
    serviceType: 'fitness',
    appointmentDateTime: '2026-01-19T14:00:00',
    tokenNo: 'MWN-N-20260119-001',
    status: 'completed',
    notes: 'Follow-up in 2 weeks recommended',
    createdAt: '2026-01-17'
  },
  {
    id: 'apt-4',
    patientId: 'patient-4',
    patient: patients[3],
    doctorId: 'doc-1',
    doctor: doctors[0],
    branchId: 'branch-1',
    branch: branches[0],
    serviceType: 'stress_management',
    appointmentDateTime: '2026-01-18T16:00:00',
    tokenNo: 'MWN-C-20260118-003',
    status: 'cancelled',
    createdAt: '2026-01-16'
  }
];

// Mock Wellness Packages
export const wellnessPackages: WellnessPackage[] = [
  {
    id: 'pkg-1',
    name: 'Essential Wellness',
    description: 'Basic wellness consultation package with 4 sessions',
    serviceType: 'wellness_consultation',
    sessionsIncluded: 4,
    sessionPrice: 85,
    packageDiscount: 0.10,
    validityDays: 60,
    isActive: true
  },
  {
    id: 'pkg-2',
    name: 'Nutrition Pro',
    description: 'Comprehensive nutrition program with personalized meal plans',
    serviceType: 'nutrition',
    sessionsIncluded: 8,
    sessionPrice: 75,
    packageDiscount: 0.15,
    validityDays: 90,
    isActive: true
  },
  {
    id: 'pkg-3',
    name: 'Fitness Transformation',
    description: 'Intensive fitness training with progress tracking',
    serviceType: 'fitness',
    sessionsIncluded: 12,
    sessionPrice: 65,
    packageDiscount: 0.20,
    validityDays: 120,
    isActive: true
  },
  {
    id: 'pkg-4',
    name: 'Complete Detox',
    description: '21-day guided detox program with supplements',
    serviceType: 'detox',
    sessionsIncluded: 6,
    sessionPrice: 95,
    packageDiscount: 0.12,
    validityDays: 30,
    isActive: true
  },
  {
    id: 'pkg-5',
    name: 'Stress Relief',
    description: 'Mindfulness and stress management sessions',
    serviceType: 'stress_management',
    sessionsIncluded: 10,
    sessionPrice: 70,
    packageDiscount: 0.15,
    validityDays: 90,
    isActive: true
  }
];

// Mock Bills
export const bills: Bill[] = [
  {
    id: 'bill-1',
    patientId: 'patient-1',
    patient: patients[0],
    appointmentId: 'apt-1',
    packageId: 'pkg-1',
    package: wellnessPackages[0],
    sessionsBooked: 4,
    grossAmount: 340,
    packageDiscountRate: 0.10,
    membershipDiscountRate: 0.10, // Gold
    taxAmount: 22.03,
    finalAmount: 297.27,
    paymentStatus: 'paid',
    billDate: '2026-01-18'
  },
  {
    id: 'bill-2',
    patientId: 'patient-2',
    patient: patients[1],
    packageId: 'pkg-2',
    package: wellnessPackages[1],
    sessionsBooked: 8,
    grossAmount: 600,
    packageDiscountRate: 0.15,
    membershipDiscountRate: 0.15, // Platinum
    taxAmount: 34.68,
    finalAmount: 468.18,
    paymentStatus: 'paid',
    billDate: '2026-01-17'
  },
  {
    id: 'bill-3',
    patientId: 'patient-3',
    patient: patients[2],
    appointmentId: 'apt-3',
    sessionsBooked: 1,
    grossAmount: 80,
    packageDiscountRate: 0,
    membershipDiscountRate: 0.05, // Silver
    taxAmount: 6.08,
    finalAmount: 82.08,
    paymentStatus: 'pending',
    billDate: '2026-01-19'
  }
];

// Generate time slots for a date
export const generateTimeSlots = (date: string, doctorId: string, branchId: string): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const times = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];
  
  times.forEach((time, index) => {
    slots.push({
      id: `slot-${date}-${doctorId}-${index}`,
      time,
      isAvailable: Math.random() > 0.3, // 70% availability
      doctorId,
      branchId,
      date
    });
  });
  
  return slots;
};

// Dashboard stats
export const getDashboardStats = () => ({
  totalPatients: patients.length,
  todayAppointments: appointments.filter(a => 
    a.appointmentDateTime.startsWith('2026-01-18') && a.status === 'booked'
  ).length,
  pendingBills: bills.filter(b => b.paymentStatus === 'pending').length,
  totalRevenue: bills
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.finalAmount, 0)
});
