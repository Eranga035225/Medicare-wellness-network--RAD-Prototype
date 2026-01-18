import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  FileText, Plus, Search, Upload, Download, Lock, Shield,
  Eye, Edit, Calendar, User, Stethoscope, AlertTriangle
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { patients, appointments, doctors } from '@/data/mockData';
import { ConsultationNote, LabReport, SERVICE_LABELS } from '@/types';

// Mock consultation notes
const mockConsultationNotes: ConsultationNote[] = [
  {
    id: 'note-1',
    appointmentId: 'apt-3',
    doctorId: 'doc-3',
    patientId: 'patient-3',
    notes: 'Patient reports improved energy levels after following the prescribed fitness routine. Continue with current plan.',
    diagnosis: 'General wellness assessment - positive progress',
    prescription: 'Continue with current exercise routine. Increase water intake.',
    createdAt: '2026-01-19T14:30:00'
  },
  {
    id: 'note-2',
    appointmentId: 'apt-1',
    doctorId: 'doc-1',
    patientId: 'patient-1',
    notes: 'Initial wellness consultation. Patient interested in stress management techniques.',
    diagnosis: 'Mild occupational stress',
    prescription: 'Recommended 8 weeks of stress management program.',
    createdAt: '2026-01-17T10:00:00'
  }
];

// Mock lab reports
const mockLabReports: LabReport[] = [
  {
    id: 'report-1',
    patientId: 'patient-1',
    reportName: 'Complete Blood Count',
    reportDate: '2026-01-15',
    fileUrl: '/reports/cbc-patient-1.pdf',
    uploadedBy: 'doc-1',
    createdAt: '2026-01-15T09:00:00'
  },
  {
    id: 'report-2',
    patientId: 'patient-2',
    reportName: 'Nutritional Assessment',
    reportDate: '2026-01-10',
    fileUrl: '/reports/nutrition-patient-2.pdf',
    uploadedBy: 'doc-2',
    createdAt: '2026-01-10T11:30:00'
  }
];

export default function HealthRecordsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [consultationNotes, setConsultationNotes] = useState(mockConsultationNotes);
  const [labReports, setLabReports] = useState(mockLabReports);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isUploadReportOpen, setIsUploadReportOpen] = useState(false);

  // New note form
  const [newNote, setNewNote] = useState({
    patientId: '',
    appointmentId: '',
    notes: '',
    diagnosis: '',
    prescription: ''
  });

  const isDoctor = user?.role === 'doctor';
  const isPatient = user?.role === 'patient';

  // Filter records based on role
  const visibleNotes = isPatient 
    ? consultationNotes.filter(n => n.patientId === 'patient-1') // Mock patient ID
    : consultationNotes;

  const visibleReports = isPatient
    ? labReports.filter(r => r.patientId === 'patient-1')
    : labReports;

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown';
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Unknown';
  };

  const handleAddNote = () => {
    if (!newNote.patientId || !newNote.notes) {
      toast({
        title: "Missing Information",
        description: "Please fill in required fields",
        variant: "destructive"
      });
      return;
    }

    const note: ConsultationNote = {
      id: `note-${Date.now()}`,
      ...newNote,
      doctorId: user?.id || 'doc-1',
      createdAt: new Date().toISOString()
    };

    setConsultationNotes([note, ...consultationNotes]);
    setIsAddNoteOpen(false);
    setNewNote({ patientId: '', appointmentId: '', notes: '', diagnosis: '', prescription: '' });

    toast({
      title: "Consultation Note Saved",
      description: "The note has been securely encrypted and stored.",
    });
  };

  const handleUploadReport = () => {
    toast({
      title: "Report Uploaded",
      description: "The lab report has been securely stored.",
    });
    setIsUploadReportOpen(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Health Records</h1>
            <p className="text-muted-foreground">
              {isDoctor ? 'Manage consultation notes and patient records' : 'View your health records and lab reports'}
            </p>
          </div>
          
          {isDoctor && (
            <div className="flex gap-2">
              <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Note
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Consultation Note</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Patient *</Label>
                        <Select 
                          value={newNote.patientId} 
                          onValueChange={(v) => setNewNote({...newNote, patientId: v})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select patient" />
                          </SelectTrigger>
                          <SelectContent>
                            {patients.map(patient => (
                              <SelectItem key={patient.id} value={patient.id}>
                                {patient.firstName} {patient.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Related Appointment</Label>
                        <Select 
                          value={newNote.appointmentId} 
                          onValueChange={(v) => setNewNote({...newNote, appointmentId: v})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select appointment" />
                          </SelectTrigger>
                          <SelectContent>
                            {appointments
                              .filter(a => a.patientId === newNote.patientId)
                              .map(apt => (
                                <SelectItem key={apt.id} value={apt.id}>
                                  {apt.appointmentDateTime} - {SERVICE_LABELS[apt.serviceType]}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Consultation Notes *</Label>
                      <Textarea 
                        value={newNote.notes}
                        onChange={(e) => setNewNote({...newNote, notes: e.target.value})}
                        placeholder="Enter detailed consultation notes..."
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Diagnosis</Label>
                      <Input 
                        value={newNote.diagnosis}
                        onChange={(e) => setNewNote({...newNote, diagnosis: e.target.value})}
                        placeholder="Enter diagnosis"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Prescription / Recommendations</Label>
                      <Textarea 
                        value={newNote.prescription}
                        onChange={(e) => setNewNote({...newNote, prescription: e.target.value})}
                        placeholder="Enter prescriptions or recommendations..."
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        All medical notes are encrypted and access is logged for compliance.
                      </p>
                    </div>

                    <Button onClick={handleAddNote} className="w-full">
                      Save Consultation Note
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isUploadReportOpen} onOpenChange={setIsUploadReportOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Report
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Lab Report</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Patient</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map(patient => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.firstName} {patient.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Report Name</Label>
                      <Input placeholder="e.g., Complete Blood Count" />
                    </div>

                    <div className="space-y-2">
                      <Label>Report Date</Label>
                      <Input type="date" />
                    </div>

                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop your file here, or click to browse
                      </p>
                      <Button variant="outline" size="sm">
                        Browse Files
                      </Button>
                    </div>

                    <Button onClick={handleUploadReport} className="w-full">
                      Upload Report
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30 border-none">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Lock className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Secure Health Records</h3>
                <p className="text-sm text-muted-foreground">
                  All medical data is encrypted at rest and in transit. Access is logged and complies with medical data protection regulations.
                  {isDoctor && ' You have full access to patient records.'}
                  {isPatient && ' You can view your own records only.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="notes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="notes" className="gap-2">
              <FileText className="h-4 w-4" />
              Consultation Notes
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <Upload className="h-4 w-4" />
              Lab Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="space-y-4">
            {visibleNotes.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No Consultation Notes</h3>
                  <p className="text-muted-foreground">
                    {isDoctor ? 'Add consultation notes after patient visits' : 'No consultation notes available'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              visibleNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            {getPatientName(note.patientId)}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1">
                              <Stethoscope className="h-4 w-4" />
                              {getDoctorName(note.doctorId)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {format(new Date(note.createdAt), 'MMM d, yyyy h:mm a')}
                            </span>
                          </CardDescription>
                        </div>
                        <Badge variant="outline">
                          <Lock className="h-3 w-3 mr-1" />
                          Encrypted
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-muted-foreground">Consultation Notes</Label>
                        <p className="mt-1">{note.notes}</p>
                      </div>
                      {note.diagnosis && (
                        <div>
                          <Label className="text-muted-foreground">Diagnosis</Label>
                          <p className="mt-1 font-medium">{note.diagnosis}</p>
                        </div>
                      )}
                      {note.prescription && (
                        <div>
                          <Label className="text-muted-foreground">Prescription / Recommendations</Label>
                          <p className="mt-1">{note.prescription}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            {visibleReports.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No Lab Reports</h3>
                  <p className="text-muted-foreground">
                    {isDoctor ? 'Upload lab reports for patients' : 'No lab reports available'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {visibleReports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{report.reportName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {getPatientName(report.patientId)}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <Calendar className="h-3 w-3" />
                              {report.reportDate}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 gap-1">
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 gap-1">
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
