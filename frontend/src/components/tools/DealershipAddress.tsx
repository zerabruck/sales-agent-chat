import React from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';

interface DealershipAddressProps {
  data: string;
}

export default function DealershipAddress({ data }: DealershipAddressProps) {
  return (
    <div className="bg-[#212124] rounded-lg shadow-md p-4 max-w-sm">
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <MapPinIcon className="h-5 w-5 text-[#A64D79] mt-1 flex-shrink-0" />
          <p>{data}</p>
        </div>
      </div>
    </div>
  );
}
