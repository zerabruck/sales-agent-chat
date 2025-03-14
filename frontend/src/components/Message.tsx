import React from 'react';
import { Message as MessageType } from '../types';
import Weather from './tools/Weather';
import DealershipAddress from './tools/DealershipAddress';
import AppointmentAvailability from './tools/AppointmentAvailability';
import AppointmentConfirmation from './tools/AppointmentConfirmation';
import { UserIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

interface MessageProps {
  message: MessageType;
  onSelectTimeSlot?: (slot: any) => void;
}

export default function Message({ message, onSelectTimeSlot }: MessageProps) {
  const { role, content, toolOutput } = message;
  const isUser = role === 'user';
  const renderToolOutput = () => {
    if (!toolOutput) return null;

    switch (toolOutput.name) {
      case 'get_weather':
        return <Weather data={toolOutput.output} />;
      case 'get_dealership_address':
        return <DealershipAddress data={toolOutput.output} />;
      case 'check_appointment_availability':
        return <AppointmentAvailability data={toolOutput.output} onSelect={onSelectTimeSlot} />;
      case 'schedule_appointment':
        return <AppointmentConfirmation data={toolOutput.output} />;
      default:
        return null;
    }
  };
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {
      !toolOutput ? 
      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-[#212124]`}>
        {isUser ? (
          <UserIcon className="h-5 w-5  " />
        ) : (
          <ComputerDesktopIcon className="h-5 w-5 text-[#A64D79]" />
        )}
      </div>:<div className='w-8'></div>
      }
      <div className={`flex flex-col gap-2 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-lg px-4 py-2 ${
          isUser ? ' ' : 'bg-[#212124] '
        }`}>
          {content}
        </div>
        {renderToolOutput()}
      </div>
    </div>
  );
}
