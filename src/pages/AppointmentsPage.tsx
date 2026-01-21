import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO, addDays } from 'date-fns';
import { Calendar, Clock, MapPin, User, Plus, Search, Filter, AlertCircle } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { appointments, doctors, patients, branches, generateTimeSlots } from '@/data/mockData';
import { Appointment, TimeSlot, SERVICE_LABELS, ServiceType } from '@/types';

const statusColors: Record<string, string> = {
  booked: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
};

export default function AppointmentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedBranch, setSelectedBranch] = useState('branch-1');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceType | ''>('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>(appointments);

  const timeSlots = selectedDoctor 
    ? generateTimeSlots(selectedDate, selectedDoctor, selectedBranch)
    : [];

  const filteredAppointments = appointmentsList.filter(apt => {
    const matchesSearch = 
      apt.patient?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.patient?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.tokenNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const generateToken = (branchId: string, date: string) => {
    const branch = branches.find(b => b.id === branchId);
    const prefix = branch?.name.includes('Central') ? 'C' : branch?.name.includes('North') ? 'N' : 'S';
    const dateStr = date.replace(/-/g, '');
    const count = appointmentsList.filter(a => 
      a.branchId === branchId && a.appointmentDateTime.startsWith(date)
    ).length + 1;
    return `MWN-${prefix}-${dateStr}-${count.toString().padStart(3, '0')}`;
  };

  const handleBookAppointment = () => {
    if (!selectedPatient || !selectedDoctor || !selectedSlot || !selectedService) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Check for double booking
    const existingBooking = appointmentsList.find(apt => 
      apt.doctorId === selectedDoctor &&
      apt.appointmentDateTime === `${selectedDate}T${selectedSlot.time}:00` &&
      apt.status === 'booked'
    );

    if (existingBooking) {
      toast({
        title: "Double Booking Prevented",
        description: "This time slot is already booked. Please select another slot.",
        variant: "destructive"
      });
      return;
    }

    const patient = patients.find(p => p.id === selectedPatient);
    const doctor = doctors.find(d => d.id === selectedDoctor);
    const branch = branches.find(b => b.id === selectedBranch);

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: selectedPatient,
      patient,
      doctorId: selectedDoctor,
      doctor,
      branchId: selectedBranch,
      branch,
      serviceType: selectedService,
      appointmentDateTime: `${selectedDate}T${selectedSlot.time}:00`,
      tokenNo: generateToken(selectedBranch, selectedDate),
      status: 'booked',
      createdAt: format(new Date(), 'yyyy-MM-dd')
    };

    setAppointmentsList([...appointmentsList, newAppointment]);
    setIsBookingOpen(false);
    resetBookingForm();

    toast({
      title: "Appointment Booked Successfully",
      description: `Token: ${newAppointment.tokenNo}. Reminder will be sent via SMS/Email.`,
    });
  };

  const handleReschedule = (aptId: string) => {
    toast({
      title: "Reschedule Requested",
      description: "Please select a new date and time for this appointment.",
    });
  };

  const handleCancel = (aptId: string) => {
    setAppointmentsList(prev => 
      prev.map(apt => apt.id === aptId ? { ...apt, status: 'cancelled' as const } : apt)
    );
    toast({
      title: "Appointment Cancelled",
      description: "The appointment has been cancelled. Patient will be notified.",
    });
  };

  const resetBookingForm = () => {
    setSelectedDoctor('');
    setSelectedPatient('');
    setSelectedService('');
    setSelectedSlot(null);
  };

  const isPeakHour = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    return (hour >= 8 && hour < 10) || (hour >= 16 && hour < 18);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Appointment Scheduling</h1>
            <p className="text-muted-foreground">
              Manage appointments across all branches
            </p>
          </div>
          
          {user?.role !== 'patient' && (
            <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Book Appointment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Book New Appointment</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                  {/* Branch Selection */}
                  <div className="space-y-2">
                    <Label>Branch</Label>
                    <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map(branch => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Patient Selection */}
                  <div className="space-y-2">
                    <Label>Patient</Label>
                    <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map(patient => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.firstName} {patient.lastName} ({patient.membershipType})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Service Type */}
                  <div className="space-y-2">
                    <Label>Service Type</Label>
                    <Select value={selectedService} onValueChange={(v) => setSelectedService(v as ServiceType)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(SERVICE_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Doctor Selection */}
                  <div className="space-y-2">
                    <Label>Doctor / Consultant</Label>
                    <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors
                          .filter(d => d.branchId === selectedBranch && d.isAvailable)
                          .map(doctor => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              Dr. {doctor.firstName} {doctor.lastName} - LKR{doctor.consultationFee}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Selection */}
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input 
                      type="date" 
                      value={selectedDate}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>

                  {/* Time Slots */}
                  {selectedDoctor && (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Available Time Slots
                        <span className="text-xs text-muted-foreground">(Peak hours highlighted)</span>
                      </Label>
                      <div className="grid grid-cols-4 gap-2">
                        {timeSlots.map(slot => (
                          <Button
                            key={slot.id}
                            variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                            size="sm"
                            disabled={!slot.isAvailable}
                            onClick={() => setSelectedSlot(slot)}
                            className={`${isPeakHour(slot.time) ? 'border-orange-400' : ''}`}
                          >
                            {slot.time}
                            {isPeakHour(slot.time) && <AlertCircle className="h-3 w-3 ml-1 text-orange-500" />}
                          </Button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <AlertCircle className="h-3 w-3 inline mr-1" />
                        Orange border indicates peak hours (8-10 AM, 4-6 PM)
                      </p>
                    </div>
                  )}

                  <Button onClick={handleBookAppointment} className="w-full">
                    Confirm Booking
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
                  placeholder="Search by patient name or token..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No Appointments Found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== 'all' 
                      ? "No appointments match your search criteria" 
                      : "Start by booking a new appointment"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredAppointments.map((apt, index) => (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">
                                  {apt.patient?.firstName} {apt.patient?.lastName}
                                </h3>
                                <Badge className={statusColors[apt.status]}>
                                  {apt.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                Token: <span className="font-mono font-medium">{apt.tokenNo}</span>
                              </p>
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {format(parseISO(apt.appointmentDateTime), 'MMM d, yyyy')}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {format(parseISO(apt.appointmentDateTime), 'h:mm a')}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {apt.branch?.name}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                Dr. {apt.doctor?.firstName} {apt.doctor?.lastName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {SERVICE_LABELS[apt.serviceType]}
                              </p>
                            </div>
                            
                            {apt.status === 'booked' && user?.role !== 'patient' && (
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleReschedule(apt.id)}
                                >
                                  Reschedule
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleCancel(apt.id)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardContent className="py-10 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Calendar View</h3>
                <p className="text-muted-foreground">
                  Visual calendar showing appointments across branches
                </p>
                <div className="grid grid-cols-7 gap-2 mt-6">
                  {Array.from({ length: 7 }, (_, i) => {
                    const date = addDays(new Date(), i);
                    const dayAppointments = filteredAppointments.filter(apt =>
                      apt.appointmentDateTime.startsWith(format(date, 'yyyy-MM-dd'))
                    );
                    return (
                      <div key={i} className="p-3 border rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">
                          {format(date, 'EEE')}
                        </p>
                        <p className="font-semibold">{format(date, 'd')}</p>
                        <Badge variant="secondary" className="mt-2">
                          {dayAppointments.length} apt
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
