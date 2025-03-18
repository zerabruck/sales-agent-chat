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
    <div className="bg-[#212124] rounded-lg shadow-md p-4 max-w-md">
      <div className="flex items-center space-x-2 mb-4">
        <CalendarIcon className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Available Time Slots</h3>
      </div>
      <div className="grid gap-3 md:grid-cols-2 grid-cols-1">
        {slots.map((slot, index) => (
          <div
            key={`${slot.date}-${slot.time}-${index}`}
            className={`flex w-[12rem] items-center shadow shadow-[#3B1C32] border-[#3B1C32] justify-between p-3 rounded-lg border ${
              slot.available
                ? 'cursor-pointer hover:shadow-2xl hover:bg-[#3B1C32]'
                : 'border-red-200 bg-red-50'
            }`}
            onClick={() => slot.available && onSelect?.(slot)}
          >
            <div>
              <p className="font-medium">{slot.date}</p>
              <p className="text-sm">{slot.time}</p>
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