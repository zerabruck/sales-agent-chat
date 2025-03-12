import { SSEEvent } from '../types';

export class SSEClient {
  private eventSource: EventSource | null = null;
  private messageCallback: (event: SSEEvent) => void;
  private abortController: AbortController | null = null;

  constructor(callback: (event: SSEEvent) => void) {
    this.messageCallback = callback;
  }

  connect(query: string, sessionId: string) {
    if (this.abortController) {
      this.abortController.abort();
    }

    this.abortController = new AbortController();

    fetch('http://localhost:8000/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        session_id: sessionId
      }),
      signal: this.abortController.signal
    }).then(response => {
      console.log("this is the resp", response)
      // const reader = response.body?.getReader();
      // const decoder = new TextDecoder();
      // let buffer = '';

      const processText = (lines: string[]) => {
        let event = '';
        let data = '';
        

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            event = line.slice(7);
          } else if (line.startsWith('data: ')) {
            data = line.slice(6);
          }
          if (event && data) {
            switch (event.trim()) {
              case 'chunk':
                
                this.messageCallback({ type: 'chunk', data });
                break;
              case 'tool_use':
                try {
                  const toolUse = data;
                  this.messageCallback({ type: 'tool_use', data: toolUse });
                } catch (error) {
                  console.error('Error parsing tool_use data:', error);
                }
                break;
              case 'tool_output':
                try {
                  const toolOutput = JSON.parse(data);
                  this.messageCallback({ type: 'tool_output', data: toolOutput });
                } catch (error) {
                  console.error('Error parsing tool_output data:', error);
                }
                break;
              case 'end':
                this.messageCallback({ type: 'end', data: null });
                break;
            }
            event = '';
            data = '';
  
          }
        }
        
      };

    
      console.log("this is the resp", response)
  
      // Remove getReader() since we are using pipeThrough.
      const decoderStream = new TextDecoderStream();
      const stream = response.body?.pipeThrough(decoderStream);
      if (!stream) return;
    
      const pumpSec = async () => {
        for await (const chunk of stream) {
          const lines = chunk.split('\n');
          processText(lines)
          
        }
      };
      pumpSec();
    }).catch(error => {
      console.error('Error connecting to SSE:', error);
    });
  }

  disconnect() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}