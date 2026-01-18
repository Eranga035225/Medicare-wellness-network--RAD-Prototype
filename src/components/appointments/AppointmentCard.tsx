import { format } from 'date-fns';
import { Clock, MapPin } from 'lucide-react';
import { Appointment, SERVICE_LABELS } from '@/types';
import { cn } from '@/lib/utils';

interface AppointmentCardProps {
  appointment: Appointment;
  showPatient?: boolean;
  showDoctor?: boolean;
  onClick?: () => void;
}

export function AppointmentCard({ 
  appointment, 
  showPatient = true, 
  showDoctor = true,
  onClick 
}: AppointmentCardProps) {
  const dateTime = new Date(appointment.appointmentDateTime);
  
  const statusStyles = {
    booked: 'status-booked',
    completed: 'status-completed',
    cancelled: 'status-cancelled',
    pending: 'status-pending'
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        "card-elevated p-4 transition-all duration-200",
        onClick && "cursor-pointer hover:shadow-lg hover:-translate-y-0.5"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className={statusStyles[appointment.status]}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </span>
          <p className="text-xs text-muted-foreground mt-1">
            Token: {appointment.tokenNo}
          </p>
        </div>
        <p className="text-lg font-semibold text-foreground">
          {format(dateTime, 'HH:mm')}
        </p>
      </div>

      <h4 className="font-medium text-foreground mb-2">
        {SERVICE_LABELS[appointment.serviceType]}
      </h4>

      <div className="space-y-1.5 text-sm text-muted-foreground">
        {showPatient && appointment.patient && (
          <p>
            Patient: <span className="text-foreground">
              {appointment.patient.firstName} {appointment.patient.lastName}
            </span>
          </p>
        )}
        
        {showDoctor && appointment.doctor && (
          <p>
            Doctor: <span className="text-foreground">
              Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
            </span>
          </p>
        )}

        <div className="flex items-center gap-1 pt-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{format(dateTime, 'MMM d, yyyy')}</span>
        </div>

        {appointment.branch && (
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{appointment.branch.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
