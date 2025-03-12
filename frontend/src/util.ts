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
      // You could derive conditions from additional data in the future.
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

  let result: any = {};
  try {
    result = JSON.parse(jsonStr);
  } catch (error) {
    console.error('Error parsing appointment confirmation JSON:', error);
  }
  // Map Spanish keys to our expected keys:
  return {
    appointmentId: result.confirmacion_id || 'N/A',
    date: result.fecha || '',
    time: result.hora || '',
    dealership: result.modelo || '',
    customerMessage: result.mensaje || ''
  };
};