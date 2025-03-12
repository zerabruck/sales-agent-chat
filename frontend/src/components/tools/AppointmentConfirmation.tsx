import React from 'react';
import { CheckBadgeIcon, CalendarIcon, BuildingOfficeIcon, UserIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import { parseConfirmationData } from '@/util';



interface AppointmentConfirmationProps {
  data: string;
}



export default function AppointmentConfirmation({ data }: AppointmentConfirmationProps) {
  const { appointmentId, date, time, dealership, customerMessage } = parseConfirmationData(data);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 max-w-md">
      <div className="flex items-center space-x-2 mb-4">
        <CheckBadgeIcon className="h-6 w-6 text-green-500" />
        <h3 className="text-lg font-semibold text-gray-800">Appointment Confirmed!</h3>
      </div>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-600">Date & Time</p>
            <p className="font-medium text-gray-800">{date} at {time}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <BuildingOfficeIcon className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-600">Car Model</p>
            <p className="font-medium text-gray-800">{dealership}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <IdentificationIcon className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-600">Confirmation Number</p>
            <p className="font-medium text-gray-800">{appointmentId}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">Message</p>
          <p className="font-mono text-gray-800">{customerMessage}</p>
        </div>
       
      </div>
    </div>
  );
}