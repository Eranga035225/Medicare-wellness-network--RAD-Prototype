import { useState } from 'react';
import { 
  Settings, Bell, Shield, Globe, Users, Building, 
  Key, Database, Mail, Phone, Save, Lock
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { branches } from '@/data/mockData';

export default function SettingsPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    emailReminders: true,
    smsReminders: true,
    appointmentConfirmations: true,
    billingAlerts: true,
    systemAlerts: true
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    loginNotifications: true,
    dataAccessLogging: true
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">
            Configure system preferences, security, and notifications
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="branches">Branches</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  General Settings
                </CardTitle>
                <CardDescription>
                  Configure basic system settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Organization Name</Label>
                    <Input defaultValue="MediCare Wellness Network" />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Email</Label>
                    <Input type="email" defaultValue="info@mwn.health" />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Phone</Label>
                    <Input defaultValue="+44 20 7123 4567" />
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select defaultValue="europe-london">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="europe-london">Europe/London (GMT)</SelectItem>
                        <SelectItem value="europe-paris">Europe/Paris (CET)</SelectItem>
                        <SelectItem value="america-new-york">America/New York (EST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Business Hours</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Opening Time</Label>
                      <Input type="time" defaultValue="08:00" />
                    </div>
                    <div className="space-y-2">
                      <Label>Closing Time</Label>
                      <Input type="time" defaultValue="18:00" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Peak hours (8-10 AM, 4-6 PM) will be highlighted in the booking system
                  </p>
                </div>

                <Button onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Configure SMS and email notifications for appointments and billing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Send appointment reminders via email
                      </p>
                    </div>
                    <Switch 
                      checked={notifications.emailReminders}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, emailReminders: checked})
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Send appointment reminders via SMS
                      </p>
                    </div>
                    <Switch 
                      checked={notifications.smsReminders}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, smsReminders: checked})
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Appointment Confirmations</Label>
                      <p className="text-sm text-muted-foreground">
                        Send confirmation when appointments are booked
                      </p>
                    </div>
                    <Switch 
                      checked={notifications.appointmentConfirmations}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, appointmentConfirmations: checked})
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Billing Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify patients about pending payments
                      </p>
                    </div>
                    <Switch 
                      checked={notifications.billingAlerts}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, billingAlerts: checked})
                      }
                    />
                  </div>
                </div>

                <Button onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure authentication and data security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA for all staff logins
                      </p>
                    </div>
                    <Switch 
                      checked={security.twoFactorAuth}
                      onCheckedChange={(checked) => 
                        setSecurity({...security, twoFactorAuth: checked})
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Session Timeout</Label>
                      <p className="text-sm text-muted-foreground">
                        Auto-logout after inactivity
                      </p>
                    </div>
                    <Select 
                      value={security.sessionTimeout}
                      onValueChange={(value) => 
                        setSecurity({...security, sessionTimeout: value})
                      }
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Login Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Alert on new device logins
                      </p>
                    </div>
                    <Switch 
                      checked={security.loginNotifications}
                      onCheckedChange={(checked) => 
                        setSecurity({...security, loginNotifications: checked})
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Medical Data Access Logging</Label>
                      <p className="text-sm text-muted-foreground">
                        Log all access to patient medical records
                      </p>
                    </div>
                    <Switch 
                      checked={security.dataAccessLogging}
                      onCheckedChange={(checked) => 
                        setSecurity({...security, dataAccessLogging: checked})
                      }
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800 dark:text-blue-200">
                        Data Encryption Active
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        All patient data is encrypted at rest (AES-256) and in transit (TLS 1.3).
                        Daily automated backups are stored securely.
                      </p>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branches Settings */}
          <TabsContent value="branches" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Branch Management
                </CardTitle>
                <CardDescription>
                  Manage clinic branches and their settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {branches.map(branch => (
                    <Card key={branch.id} className="bg-muted/50">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{branch.name}</h4>
                            <p className="text-sm text-muted-foreground">{branch.address}</p>
                            <div className="flex gap-4 mt-2 text-sm">
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {branch.phone}
                              </span>
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {branch.email}
                              </span>
                            </div>
                          </div>
                          <Switch checked={branch.isActive} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Settings */}
          <TabsContent value="compliance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Compliance
                </CardTitle>
                <CardDescription>
                  Medical data protection and regulatory compliance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <Shield className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">GDPR Compliance</h4>
                        <p className="text-sm text-green-600">Compliant</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Patient data handling follows GDPR requirements including consent management,
                      data portability, and right to erasure.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <Lock className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">NHS Data Security Standards</h4>
                        <p className="text-sm text-green-600">Compliant</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      System meets NHS Data Security and Protection Toolkit requirements.
                      Annual assessment completed.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <Database className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Automated Backups</h4>
                        <p className="text-sm text-blue-600">Active - Daily at 02:00 GMT</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Cloud-based encrypted backups with 30-day retention.
                      Point-in-time recovery available.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                        <Key className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Access Control</h4>
                        <p className="text-sm text-purple-600">Role-Based (RBAC)</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Doctors have full access, staff have partial access, patients have limited viewing.
                      All access is logged and auditable.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
