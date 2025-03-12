import React from 'react';
import { CloudIcon, SunIcon } from '@heroicons/react/24/outline';
import { parseWeather } from '@/util';

interface WeatherProps {
  data: string;
}


export default function Weather({ data }: WeatherProps) {
  const { location, temperature, unit, conditions } = parseWeather(data);
  // For the current example, we treat weather as good if the unit is Celsius 
  // and temperature is above a certain threshold or if conditions includes keywords like sunny.
  // Since no conditions are provided, we can use temperature as a rough proxy.
  const tempNumber = parseInt(temperature, 10);
  const isGoodWeather = conditions.toLowerCase().includes('clear') || conditions.toLowerCase().includes('sunny') || tempNumber > 20;

  return (
    <div className="bg-[#212124] rounded-lg shadow-md p-4 max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold pr-2">Weather in {location}</h3>
        {isGoodWeather ? (
          <SunIcon className="h-6 w-6  text-yellow-500" />
        ) : (
          <CloudIcon className="h-6 w-6 text-gray-500" />
        )}
      </div>
      <div className="space-y-2">
        <p className="text-3xl text-center font-bold">
          {temperature} <span className='text-[#A64D79]'>{unit && `\u00b0${unit}`}</span>
        </p>
        {
          conditions &&
        <p className="text-gray-600">{conditions}</p>
        }
      </div>
    </div>
  );
}