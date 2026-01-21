import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Stethoscope, Plus, Search, Filter, Phone, Mail, 
  MapPin, Clock, Calendar, Edit, ToggleLeft, ToggleRight 
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { doctors, branches, generateTimeSlots } from '@/data/mockData';
import { Doctor, SERVICE_LABELS, ServiceType } from '@/types';
import { format, addDays } from 'date-fns';

export default function DoctorsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [doctorsList, setDoctorsList] = useState<Doctor[]>(doctors);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const filteredDoctors = doctorsList.filter(doctor => {
    const matchesSearch = 
      doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = branchFilter === 'all' || doctor.branchId === branchFilter;
    const matchesService = serviceFilter === 'all' || 
      doctor.specialization.includes(serviceFilter as ServiceType);
    return matchesSearch && matchesBranch && matchesService;
  });

  const toggleAvailability = (doctorId: string) => {
    setDoctorsList(prev => 
      prev.map(doc => 
        doc.id === doctorId ? { ...doc, isAvailable: !doc.isAvailable } : doc
      )
    );
    const doctor = doctorsList.find(d => d.id === doctorId);
    toast({
      title: "Availability Updated",
      description: `Dr. ${doctor?.firstName} ${doctor?.lastName} is now ${doctor?.isAvailable ? 'unavailable' : 'available'}.`,
    });
  };

  const getBranchName = (branchId: string) => 
    branches.find(b => b.id === branchId)?.name || 'Unknown';

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Doctor & Consultant Management</h1>
            <p className="text-muted-foreground">
              Manage availability and schedules across all branches
            </p>
          </div>
          
          {user?.role === 'admin' && (
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Doctor
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Stethoscope className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{doctorsList.length}</p>
                  <p className="text-sm text-muted-foreground">Total Doctors</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <ToggleRight className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{doctorsList.filter(d => d.isAvailable).length}</p>
                  <p className="text-sm text-muted-foreground">Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <ToggleLeft className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{doctorsList.filter(d => !d.isAvailable).length}</p>
                  <p className="text-sm text-muted-foreground">Unavailable</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{branches.length}</p>
                  <p className="text-sm text-muted-foreground">Branches</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger className="w-[200px]">
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches.map(branch => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {Object.entries(SERVICE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Doctors List */}
        {filteredDoctors.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No Doctors Found</h3>
              <p className="text-muted-foreground">
                No doctors match your search criteria
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredDoctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <Stethoscope className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">
                              Dr. {doctor.firstName} {doctor.lastName}
                            </h3>
                            <Badge variant={doctor.isAvailable ? 'default' : 'secondary'}>
                              {doctor.isAvailable ? 'Available' : 'Unavailable'}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {doctor.specialization.map(spec => (
                              <Badge key={spec} variant="outline" className="text-xs">
                                {SERVICE_LABELS[spec]}
                              </Badge>
                            ))}
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {getBranchName(doctor.branchId)}
                            </p>
                            <p className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {doctor.email}
                            </p>
                            <p className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {doctor.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-3">
                        <p className="text-2xl font-bold text-primary">
                          LKR{doctor.consultationFee}
                        </p>
                        <p className="text-xs text-muted-foreground">per session</p>
                        
                        {user?.role === 'admin' && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Available</span>
                            <Switch 
                              checked={doctor.isAvailable}
                              onCheckedChange={() => toggleAvailability(doctor.id)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t flex gap-2">
                      <Dialog open={isScheduleOpen && selectedDoctor?.id === doctor.id} onOpenChange={(open) => {
                        setIsScheduleOpen(open);
                        if (open) setSelectedDoctor(doctor);
                      }}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1 gap-2">
                            <Calendar className="h-4 w-4" />
                            View Schedule
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>
                              Dr. {doctor.firstName} {doctor.lastName}'s Schedule
                            </DialogTitle>
                          </DialogHeader>
                          <div className="pt-4">
                            <div className="grid grid-cols-7 gap-2 mb-4">
                              {weekDays.map((day, i) => (
                                <div key={i} className="text-center p-2 bg-muted rounded-lg">
                                  <p className="text-xs text-muted-foreground">{format(day, 'EEE')}</p>
                                  <p className="font-semibold">{format(day, 'd')}</p>
                                </div>
                              ))}
                            </div>
                            <div className="space-y-2">
                              <Label>Available Slots for {format(new Date(), 'MMM d, yyyy')}</Label>
                              <div className="grid grid-cols-4 gap-2">
                                {generateTimeSlots(format(new Date(), 'yyyy-MM-dd'), doctor.id, doctor.branchId)
                                  .filter(s => s.isAvailable)
                                  .map(slot => (
                                    <Badge key={slot.id} variant="outline" className="justify-center py-2">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {slot.time}
                                    </Badge>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      {user?.role === 'admin' && (
                        <Button variant="outline" size="sm" className="gap-2">
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      )}
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
