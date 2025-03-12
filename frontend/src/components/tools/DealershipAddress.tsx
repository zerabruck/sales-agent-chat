import React from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';

interface DealershipAddressProps {
  data: string;
}

export default function DealershipAddress({ data }: DealershipAddressProps) {

  return (
    <div className="bg-white rounded-lg shadow-md p-4 max-w-sm">
      {/* <h3 className="text-lg font-semibold text-gray-800 mb-4">{name}</h3> */}
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <MapPinIcon className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
          <p className="text-gray-600">{data}</p>
        </div>
        {/* <div className="flex items-center space-x-3">
          <PhoneIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <p className="text-gray-600">{phone}</p>
        </div> */}
      </div>
    </div>
  );
}
