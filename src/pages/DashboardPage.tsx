import { motion } from 'framer-motion';
import { Calendar, Users, CreditCard, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { AppointmentCard } from '@/components/appointments/AppointmentCard';
import { appointments, getDashboardStats } from '@/data/mockData';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { user } = useAuth();
  const stats = getDashboardStats();
  const todayAppointments = appointments.filter(a => a.status === 'booked').slice(0, 3);

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-semibold text-foreground">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-muted-foreground">
          {format(new Date(), 'EEEE, MMMM d, yyyy')} — Here's your overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Patients" value={stats.totalPatients} change="+12% from last month" changeType="positive" icon={Users} delay={0} />
        <StatCard title="Today's Appointments" value={stats.todayAppointments} icon={Calendar} delay={0.1} />
        <StatCard title="Pending Bills" value={stats.pendingBills} icon={CreditCard} delay={0.2} />
        <StatCard title="Revenue (Month)" value={`LKR${stats.totalRevenue.toFixed(2)}`} change="+8.2% growth" changeType="positive" icon={TrendingUp} delay={0.3} />
      </div>

      {/* Quick Actions & Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2">
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold text-foreground">Upcoming Appointments</h2>
              <a href="/appointments" className="text-sm text-primary hover:underline">View all</a>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {todayAppointments.map(apt => (
                <AppointmentCard key={apt.id} appointment={apt} />
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="card-elevated p-6">
            <h2 className="text-lg font-display font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a href="/appointments" className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Book Appointment</span>
              </a>
              <a href="/patients" className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Register Patient</span>
              </a>
              <a href="/billing" className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                <CreditCard className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Process Billing</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
