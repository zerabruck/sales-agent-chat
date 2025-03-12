import React from 'react';
import { TimeSlot } from '../../types';
import { CalendarIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { parseTimeSlots } from '@/util';

interface AppointmentAvailabilityProps {
  data: string;
  onSelect?: (slot: TimeSlot) => void;
}


export default function AppointmentAvailability({ data, onSelect }: AppointmentAvailabilityProps) {
  const slots = parseTimeSlots(data);
  return (
    <div className="bg-white rounded-lg shadow-md p-4 max-w-md">
      <div className="flex items-center space-x-2 mb-4">
        <CalendarIcon className="h-5 w-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-800">Available Time Slots</h3>
      </div>
      <div className="space-y-3">
        {slots.map((slot, index) => (
          <div
            key={`${slot.date}-${slot.time}-${index}`}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              slot.available
                ? 'border-green-200 bg-green-50 cursor-pointer hover:bg-green-100'
                : 'border-red-200 bg-red-50'
            }`}
            onClick={() => slot.available && onSelect?.(slot)}
          >
            <div>
              <p className="font-medium text-gray-800">{slot.date}</p>
              <p className="text-sm text-gray-600">{slot.time}</p>
            </div>
            {slot.available ? (
              <CheckCircleIcon className="h-6 w-6 text-green-500" />
            ) : (
              <XCircleIcon className="h-6 w-6 text-red-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}