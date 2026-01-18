import { LucideIcon, Calendar, Users, Package, CreditCard, FileText, Settings, Home, Stethoscope, ClipboardList } from 'lucide-react';
import { UserRole } from '@/types';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
}

export const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: ['admin', 'doctor', 'staff', 'patient']
  },
  {
    label: 'Appointments',
    href: '/appointments',
    icon: Calendar,
    roles: ['admin', 'doctor', 'staff', 'patient']
  },
  {
    label: 'Patients',
    href: '/patients',
    icon: Users,
    roles: ['admin', 'doctor', 'staff']
  },
  {
    label: 'Doctors',
    href: '/doctors',
    icon: Stethoscope,
    roles: ['admin', 'staff']
  },
  {
    label: 'Packages',
    href: '/packages',
    icon: Package,
    roles: ['admin', 'staff', 'patient']
  },
  {
    label: 'Billing',
    href: '/billing',
    icon: CreditCard,
    roles: ['admin', 'staff', 'patient']
  },
  {
    label: 'Health Records',
    href: '/records',
    icon: FileText,
    roles: ['doctor', 'patient']
  },
  {
    label: 'Reports',
    href: '/reports',
    icon: ClipboardList,
    roles: ['admin']
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['admin']
  }
];

export const getNavItemsForRole = (role: UserRole): NavItem[] => {
  return navigationItems.filter(item => item.roles.includes(role));
};
