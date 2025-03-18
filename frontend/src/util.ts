import { AppointmentConfirmationData, ParsedWeather, TimeSlot } from "./types";

export function parseWeather(data: string): ParsedWeather {
  // This regex will match strings like "The weather in New York is 34°C"
  const regex = /The weather in (.+?) is (\d+)\u00b0([CF])/;
  const match = data.match(regex);

  if (match) {
    return {
      location: match[1],
      temperature: match[2],
      unit: match[3],
      conditions: '',
    };
  }
  return {
    location: 'Unknown',
    temperature: '--',
    unit: '',
    conditions: '',
  };
}

// Helper to parse the data string into an array of time strings,
// then convert to TimeSlot objects.
export function parseTimeSlots(data: string): TimeSlot[] {
  let cleaned = data.trim();

  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.substring(1, cleaned.length - 1);
  }

  if (cleaned.startsWith('```') && cleaned.endsWith('```')) {
    cleaned = cleaned.slice(3, -3).trim();
  }

  const jsonStr = cleaned.replace(/'/g, '"');
  let times: string[] = [];
  try {
    times = JSON.parse(jsonStr);
  } catch (error) {
    console.error('Error parsing time slots JSON:', error);
  }
  return times.map(time => ({
    date: 'Today',
    time,
    available: true
  }));
};
export function parseConfirmationData(data: string): AppointmentConfirmationData {
  let cleaned = data.trim();
  // Remove wrapping quotes if present
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.substring(1, cleaned.length - 1);
  }
  // Remove markdown fences if present
  if (cleaned.startsWith('```') && cleaned.endsWith('```')) {
    cleaned = cleaned.slice(3, -3).trim();
  }
  // Replace single quotes with double quotes
  const jsonStr = cleaned.replace(/'/g, '"');
  let result: unknown = {};
  try {
    result = JSON.parse(jsonStr);
  } catch (error) {
    console.error('Error parsing appointment confirmation JSON:', error);
  }
  if (typeof result !== 'object' || result === null) {
    return {
      appointmentId: 'N/A',
      date: '',
      time: '',
      dealership: '',
      customerMessage: ''
    };
  }

  const dataObj = result as { [key: string]: unknown };

  return {
    appointmentId: typeof dataObj.confirmacion_id === 'string' ? dataObj.confirmacion_id : 'N/A',
    date: typeof dataObj.fecha === 'string' ? dataObj.fecha : '',
    time: typeof dataObj.hora === 'string' ? dataObj.hora : '',
    dealership: typeof dataObj.modelo === 'string' ? dataObj.modelo : '',
    customerMessage: typeof dataObj.mensaje === 'string' ? dataObj.mensaje : ''
  };
}