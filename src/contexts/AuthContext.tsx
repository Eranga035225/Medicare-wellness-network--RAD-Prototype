import { useState, createContext, useContext, ReactNode } from 'react';
import { UserRole, Patient, Doctor } from '@/types';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  branchId?: string;
  patientData?: Patient;
  doctorData?: Doctor;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for prototype
const demoUsers: Record<string, User> = {
  'admin@mwn.health': {
    id: 'admin-1',
    email: 'admin@mwn.health',
    name: 'Admin User',
    role: 'admin',
    branchId: 'branch-1'
  },
  'doctor@mwn.health': {
    id: 'doc-1',
    email: 'doctor@mwn.health',
    name: 'Dr. Sarah Williams',
    role: 'doctor',
    branchId: 'branch-1'
  },
  'staff@mwn.health': {
    id: 'staff-1',
    email: 'staff@mwn.health',
    name: 'Reception Staff',
    role: 'staff',
    branchId: 'branch-1'
  },
  'patient@example.com': {
    id: 'patient-1',
    email: 'patient@example.com',
    name: 'Emma Johnson',
    role: 'patient'
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For prototype, accept any password
    const demoUser = demoUsers[email];
    if (demoUser && demoUser.role === role) {
      setUser(demoUser);
      return true;
    }
    
    // Allow any login for demo
    setUser({
      id: `user-${Date.now()}`,
      email,
      name: email.split('@')[0],
      role
    });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
