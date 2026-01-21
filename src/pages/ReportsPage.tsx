import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ClipboardList, Download, TrendingUp, Users, Calendar, 
  CreditCard, Package, BarChart3, PieChart, Activity
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { getDashboardStats, appointments, bills, patients, wellnessPackages, branches } from '@/data/mockData';
import { SERVICE_LABELS, ServiceType } from '@/types';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('month');
  const stats = getDashboardStats();

  // Calculate service distribution
  const serviceDistribution = Object.entries(SERVICE_LABELS).map(([key, label]) => {
    const count = appointments.filter(a => a.serviceType === key).length;
    return { service: key as ServiceType, label, count };
  }).filter(s => s.count > 0);

  // Calculate branch performance
  const branchPerformance = branches.map(branch => {
    const branchAppointments = appointments.filter(a => a.branchId === branch.id);
    const branchRevenue = bills
      .filter(b => branchAppointments.some(a => a.id === b.appointmentId))
      .reduce((sum, b) => sum + b.finalAmount, 0);
    return {
      branch,
      appointments: branchAppointments.length,
      revenue: branchRevenue
    };
  });

  // Package popularity
  const packagePopularity = wellnessPackages.map(pkg => {
    const packageBills = bills.filter(b => b.packageId === pkg.id);
    return {
      package: pkg,
      sales: packageBills.length,
      revenue: packageBills.reduce((sum, b) => sum + b.finalAmount, 0)
    };
  }).sort((a, b) => b.sales - a.sales);

  // Appointment status breakdown
  const appointmentStatus = {
    booked: appointments.filter(a => a.status === 'booked').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
    pending: appointments.filter(a => a.status === 'pending').length
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
            <p className="text-muted-foreground">
              Comprehensive insights across all branches and services
            </p>
          </div>
          
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export All
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Patients</p>
                    <p className="text-3xl font-bold">{stats.totalPatients}</p>
                  </div>
                  <Users className="h-10 w-10 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Total Revenue</p>
                    <p className="text-3xl font-bold">LKR{stats.totalRevenue.toFixed(2)}</p>
                  </div>
                  <TrendingUp className="h-10 w-10 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Appointments</p>
                    <p className="text-3xl font-bold">{appointments.length}</p>
                  </div>
                  <Calendar className="h-10 w-10 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Pending Bills</p>
                    <p className="text-3xl font-bold">{stats.pendingBills}</p>
                  </div>
                  <CreditCard className="h-10 w-10 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Detailed Reports */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="branches">Branches</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Appointment Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Appointment Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500" />
                        <span>Booked</span>
                      </div>
                      <span className="font-bold">{appointmentStatus.booked}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                        <span>Completed</span>
                      </div>
                      <span className="font-bold">{appointmentStatus.completed}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                        <span>Cancelled</span>
                      </div>
                      <span className="font-bold">{appointmentStatus.cancelled}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-yellow-500" />
                        <span>Pending</span>
                      </div>
                      <span className="font-bold">{appointmentStatus.pending}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Membership Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Membership Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['none', 'silver', 'gold', 'platinum'].map(type => {
                      const count = patients.filter(p => p.membershipType === type).length;
                      const percentage = (count / patients.length * 100).toFixed(0);
                      return (
                        <div key={type} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{type === 'none' ? 'Standard' : type}</span>
                            <span>{count} ({percentage}%)</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                type === 'platinum' ? 'bg-purple-500' :
                                type === 'gold' ? 'bg-amber-500' :
                                type === 'silver' ? 'bg-slate-400' :
                                'bg-gray-400'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Service Distribution
                </CardTitle>
                <CardDescription>
                  Appointments by service type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceDistribution.map(({ service, label, count }) => {
                    const percentage = (count / appointments.length * 100).toFixed(0);
                    return (
                      <div key={service} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{label}</span>
                          <span className="font-medium">{count} appointments ({percentage}%)</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branches" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {branchPerformance.map((bp, index) => (
                <motion.div
                  key={bp.branch.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{bp.branch.name}</CardTitle>
                      <CardDescription>{bp.branch.address}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                          <p className="text-2xl font-bold">{bp.appointments}</p>
                          <p className="text-xs text-muted-foreground">Appointments</p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
                          <p className="text-2xl font-bold">LKR{bp.revenue.toFixed(0)}</p>
                          <p className="text-xs text-muted-foreground">Revenue</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="packages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Package Performance
                </CardTitle>
                <CardDescription>
                  Sales and revenue by wellness package
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {packagePopularity.map(({ package: pkg, sales, revenue }) => (
                    <div key={pkg.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{pkg.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {SERVICE_LABELS[pkg.serviceType]}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">LKR{revenue.toFixed(2)}</p>
                        <Badge variant="secondary">{sales} sales</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
