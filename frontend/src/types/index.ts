export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  toolUse?: string;
  toolOutput?: ToolOutput;
};



export type ToolOutput = {
  name: string;
  output: string;
};

export type WeatherInfo = {
  temperature: number;
  conditions: string;
  location: string;
};

export type DealershipAddress = {
  name: string;
  address: string;
  phone: string;
};

export type TimeSlot = {
  date: string;
  time: string;
  available: boolean;
};

export type AppointmentConfirmation = {
  appointmentId: string;
  date: string;
  time: string;
  dealership: string;
  customerName: string;
};
export type   AppointmentConfirmationData = {
  appointmentId: string;
  date: string;
  time: string;
  dealership: string;
  customerMessage: string;
}
export type ChunkEvent = { type: 'chunk'; data: string };
export type ToolUseEvent = { type: 'tool_use'; data: string }; 
export type ToolOutputEvent = { type: 'tool_output'; data: string };
export type EndEvent = { type: 'end'; data: null };

export type SSEEvent = ChunkEvent | ToolUseEvent | ToolOutputEvent | EndEvent;
export type  ParsedWeather = {
  location: string;
  temperature: string;
  unit: string;
  conditions: string;
}