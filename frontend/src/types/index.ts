export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  toolUse?: ToolUse;
  toolOutput?: ToolOutput;
};

export type ToolUse = {
  name: string;
  arguments: Record<string, any>;
};

export type ToolOutput = {
  name: string;
  output: any;
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

export type SSEEvent = {
  type: 'chunk' | 'tool_use' | 'tool_output' | 'end';
  data: any;
};
export type  ParsedWeather = {
  location: string;
  temperature: string;
  unit: string;
  conditions: string;
}
export type   AppointmentConfirmationData = {
  appointmentId: string;
  date: string;
  time: string;
  dealership: string;
  customerMessage: string;
}