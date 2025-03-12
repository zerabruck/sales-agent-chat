import React from 'react';
import { CheckBadgeIcon, CalendarIcon, BuildingOfficeIcon, UserIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import { parseConfirmationData } from '@/util';



interface AppointmentConfirmationProps {
  data: string;
}



export default function AppointmentConfirmation({ data }: AppointmentConfirmationProps) {
  const { appointmentId, date, time, dealership, customerMessage } = parseConfirmationData(data);

  return (
    <div className="bg-[#212124] rounded-lg shadow-md p-4 max-w-md">
      <div className="flex items-center space-x-2 mb-4">
        <CheckBadgeIcon className="h-6 w-6 text-[#A64D79]" />
        <h3 className="text-lg font-semibold ">Appointment Confirmed!</h3>
      </div>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Date & Time</p>
            <p className="font-medium ">{date} at {time}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <BuildingOfficeIcon className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Car Model</p>
            <p className="font-medium ">{dealership}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <IdentificationIcon className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Confirmation Number</p>
            <p className="font-medium ">{appointmentId}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-[#A64D79]">
          <p className="text-sm text-gray-500">Message</p>
          <p className="font-mono ">{customerMessage}</p>
        </div>
       
      </div>
    </div>
  );
}