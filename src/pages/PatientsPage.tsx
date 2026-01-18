import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Users, Plus, Search, Filter, Phone, Mail, MapPin, 
  Calendar, Shield, Edit, Eye, FileText, Upload 
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { patients, appointments, bills } from '@/data/mockData';
import { Patient, MembershipType } from '@/types';

const membershipColors: Record<MembershipType, string> = {
  none: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  silver: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
  gold: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  platinum: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
};

export default function PatientsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [membershipFilter, setMembershipFilter] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientsList, setPatientsList] = useState<Patient[]>(patients);

  // New patient form state
  const [newPatient, setNewPatient] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    address: string;
    membershipType: MembershipType;
    medicalHistory: string;
    allergies: string;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male',
    address: '',
    membershipType: 'none',
    medicalHistory: '',
    allergies: ''
  });

  const filteredPatients = patientsList.filter(patient => {
    const matchesSearch = 
      patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMembership = membershipFilter === 'all' || patient.membershipType === membershipFilter;
    return matchesSearch && matchesMembership;
  });

  const handleAddPatient = () => {
    if (!newPatient.firstName || !newPatient.lastName || !newPatient.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const patient: Patient = {
      id: `patient-${Date.now()}`,
      ...newPatient,
      createdAt: format(new Date(), 'yyyy-MM-dd')
    };

    setPatientsList([...patientsList, patient]);
    setIsAddOpen(false);
    setNewPatient({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'male',
      address: '',
      membershipType: 'none',
      medicalHistory: '',
      allergies: ''
    });

    toast({
      title: "Patient Registered",
      description: `${patient.firstName} ${patient.lastName} has been added successfully.`,
    });
  };

  const getPatientAppointments = (patientId: string) => 
    appointments.filter(apt => apt.patientId === patientId);

  const getPatientBills = (patientId: string) => 
    bills.filter(bill => bill.patientId === patientId);

  const canViewMedicalHistory = user?.role === 'doctor' || user?.role === 'admin';
  const canEditPatient = user?.role !== 'patient';

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Patient Management</h1>
            <p className="text-muted-foreground">
              Register and manage patient profiles across all branches
            </p>
          </div>
          
          {canEditPatient && (
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Register Patient
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Register New Patient</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name *</Label>
                      <Input 
                        value={newPatient.firstName}
                        onChange={(e) => setNewPatient({...newPatient, firstName: e.target.value})}
                        placeholder="Enter first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name *</Label>
                      <Input 
                        value={newPatient.lastName}
                        onChange={(e) => setNewPatient({...newPatient, lastName: e.target.value})}
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input 
                        type="email"
                        value={newPatient.email}
                        onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                        placeholder="patient@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input 
                        value={newPatient.phone}
                        onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                        placeholder="+44 7XXX XXXXXX"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input 
                        type="date"
                        value={newPatient.dateOfBirth}
                        onChange={(e) => setNewPatient({...newPatient, dateOfBirth: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select 
                        value={newPatient.gender} 
                        onValueChange={(v: string) => setNewPatient({...newPatient, gender: v as 'male' | 'female' | 'other'})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input 
                      value={newPatient.address}
                      onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
                      placeholder="Full address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Membership Type</Label>
                    <Select 
                      value={newPatient.membershipType} 
                      onValueChange={(v) => setNewPatient({...newPatient, membershipType: v as MembershipType})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="silver">Silver (5% discount)</SelectItem>
                        <SelectItem value="gold">Gold (10% discount)</SelectItem>
                        <SelectItem value="platinum">Platinum (15% discount)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Medical History</Label>
                    <Textarea 
                      value={newPatient.medicalHistory}
                      onChange={(e) => setNewPatient({...newPatient, medicalHistory: e.target.value})}
                      placeholder="Any previous conditions, surgeries, or ongoing treatments..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Allergies</Label>
                    <Input 
                      value={newPatient.allergies}
                      onChange={(e) => setNewPatient({...newPatient, allergies: e.target.value})}
                      placeholder="e.g., Penicillin, Peanuts"
                    />
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Patient data is encrypted and stored securely in compliance with medical data protection regulations.
                    </p>
                  </div>

                  <Button onClick={handleAddPatient} className="w-full">
                    Register Patient
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={membershipFilter} onValueChange={setMembershipFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Membership" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Memberships</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Patients List */}
        {filteredPatients.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No Patients Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || membershipFilter !== 'all' 
                  ? "No patients match your search criteria" 
                  : "Start by registering a new patient"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredPatients.map((patient, index) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {patient.firstName[0]}{patient.lastName[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">
                              {patient.firstName} {patient.lastName}
                            </h3>
                            <Badge className={membershipColors[patient.membershipType]}>
                              {patient.membershipType === 'none' ? 'Standard' : patient.membershipType}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {patient.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {patient.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {patient.dateOfBirth}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedPatient(patient)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Profile
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Patient Profile</DialogTitle>
                            </DialogHeader>
                            {selectedPatient && (
                              <Tabs defaultValue="details" className="pt-4">
                                <TabsList className="grid w-full grid-cols-4">
                                  <TabsTrigger value="details">Details</TabsTrigger>
                                  <TabsTrigger value="history">Medical History</TabsTrigger>
                                  <TabsTrigger value="appointments">Appointments</TabsTrigger>
                                  <TabsTrigger value="billing">Billing</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="details" className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-muted-foreground">Full Name</Label>
                                      <p className="font-medium">{selectedPatient.firstName} {selectedPatient.lastName}</p>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Gender</Label>
                                      <p className="font-medium capitalize">{selectedPatient.gender}</p>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Date of Birth</Label>
                                      <p className="font-medium">{selectedPatient.dateOfBirth}</p>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Membership</Label>
                                      <Badge className={membershipColors[selectedPatient.membershipType]}>
                                        {selectedPatient.membershipType}
                                      </Badge>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Email</Label>
                                      <p className="font-medium">{selectedPatient.email}</p>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Phone</Label>
                                      <p className="font-medium">{selectedPatient.phone}</p>
                                    </div>
                                    <div className="col-span-2">
                                      <Label className="text-muted-foreground">Address</Label>
                                      <p className="font-medium">{selectedPatient.address}</p>
                                    </div>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="history" className="space-y-4">
                                  {canViewMedicalHistory ? (
                                    <>
                                      <div className="space-y-2">
                                        <Label className="text-muted-foreground">Medical History</Label>
                                        <p className="p-3 bg-muted rounded-lg">
                                          {selectedPatient.medicalHistory || 'No medical history recorded'}
                                        </p>
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-muted-foreground">Allergies</Label>
                                        <p className="p-3 bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200 rounded-lg">
                                          {selectedPatient.allergies || 'No allergies recorded'}
                                        </p>
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-muted-foreground">Lab Reports</Label>
                                        <Button variant="outline" className="w-full gap-2">
                                          <Upload className="h-4 w-4" />
                                          Upload Lab Report
                                        </Button>
                                        <p className="text-sm text-muted-foreground text-center">
                                          Securely upload and store lab reports
                                        </p>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="text-center py-8">
                                      <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                      <h3 className="font-semibold mb-2">Access Restricted</h3>
                                      <p className="text-muted-foreground">
                                        Medical history is only accessible to doctors and administrators.
                                      </p>
                                    </div>
                                  )}
                                </TabsContent>
                                
                                <TabsContent value="appointments" className="space-y-4">
                                  {getPatientAppointments(selectedPatient.id).length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                      No appointment history
                                    </p>
                                  ) : (
                                    getPatientAppointments(selectedPatient.id).map(apt => (
                                      <div key={apt.id} className="p-4 border rounded-lg">
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <p className="font-medium">{apt.appointmentDateTime}</p>
                                            <p className="text-sm text-muted-foreground">
                                              Dr. {apt.doctor?.firstName} {apt.doctor?.lastName}
                                            </p>
                                          </div>
                                          <Badge>{apt.status}</Badge>
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </TabsContent>
                                
                                <TabsContent value="billing" className="space-y-4">
                                  {getPatientBills(selectedPatient.id).length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                      No billing history
                                    </p>
                                  ) : (
                                    getPatientBills(selectedPatient.id).map(bill => (
                                      <div key={bill.id} className="p-4 border rounded-lg">
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <p className="font-medium">Bill #{bill.id}</p>
                                            <p className="text-sm text-muted-foreground">
                                              {bill.billDate}
                                            </p>
                                          </div>
                                          <div className="text-right">
                                            <p className="font-bold">£{bill.finalAmount.toFixed(2)}</p>
                                            <Badge variant={bill.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                                              {bill.paymentStatus}
                                            </Badge>
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </TabsContent>
                              </Tabs>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        {canEditPatient && (
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
