# SuperCar Virtual Sales Assistant - Frontend Engineer Test

## Overview

This repository contains a test for frontend engineers who will be working on AI-related systems. The test focuses on building a chat interface that interacts with an AI agent through a backend API. The AI agent, named Lex, is a virtual sales lead follow-up assistant for SuperCar car dealerships.

The test evaluates your ability to:
1. Consume a Server-Sent Events (SSE) API
2. Handle different types of streaming events
3. Create custom UI components for different tool outputs
4. Implement a responsive and user-friendly chat interface
5. Work with Docker for development

## Project Structure

The repository is organized into two main directories:

- `backend/`: Contains a FastAPI application that serves the AI agent
- `frontend/`: Where you will implement your solution

## Backend API

The backend provides a single endpoint:

- `POST /query`: Accepts a user query and session ID, returns an SSE stream of responses

### SSE Event Types

The backend streams different types of events:

1. `chunk`: Text chunks from the AI assistant
2. `tool_use`: When the AI decides to use a tool (function call)
3. `tool_output`: The result of a tool execution
4. `end`: Signals the end of the response stream

### Available Tools

The AI assistant can use the following tools:

1. `get_weather`: Provides weather information for a city
2. `get_dealership_address`: Returns the address of a dealership
3. `check_appointment_availability`: Checks available appointment slots
4. `schedule_appointment`: Books an appointment for a test drive

## Requirements

### Functional Requirements

1. Create a chat interface where users can send messages to the AI assistant
2. Maintain a session ID for conversation history
3. Display AI responses in real-time as they stream in
4. Create custom UI components for each tool output:
   - Weather information
   - Dealership address
   - Appointment availability (time slots)
   - Appointment confirmation
5. Show visual indicators when tools are being used
6. Handle the complete conversation flow

### Technical Requirements

1. Use a modern JavaScript framework (Next, React, Vue, Angular, etc.)
2. Implement an SSE client to consume the streaming API
3. Create reusable components
4. Implement responsive design
5. Use Docker for development
6. Write clean, maintainable code with appropriate comments

## Getting Started

### Running the Backend

* First go to https://console.groq.com/playground and create an account.
* Then go to https://console.groq.com/keys and create a new key.
* Place the key in the ```backend/.env``` file. There is already a .env.example file that you can use as a template.

You have two options to run the backend:

#### Option 1: Using Docker

```bash
cd backend
docker build -t SuperCar-assistant-backend .
docker run -p 8000:8000 SuperCar-assistant-backend
```

#### Option 2: Using Docker Compose

```bash
cd infrastructure
docker-compose up backend
```

### Setting Up Your Frontend

1. Create your frontend application in the `frontend/` directory
2. Create a Dockerfile similar to the example provided
3. Configure your application to connect to the backend API at `http://localhost:8000`

#### Running with Docker Compose

Once your frontend is ready, you can run the entire stack:

```bash
cd infrastructure
docker-compose up
```

## Evaluation Criteria

Your solution will be evaluated based on:

1. **Functionality**: Does it meet all the requirements?
2. **Code Quality**: Is the code clean, well-organized, and maintainable?
3. **UI/UX Design**: Is the interface intuitive and responsive?
4. **Component Design**: Are the custom components for tool outputs well-designed?
5. **Error Handling**: Does it gracefully handle errors and edge cases?
6. **Performance**: Is the application responsive and efficient?

## Submission

Please submit your solution as a Git repository with:

1. Your complete frontend code
2. A README explaining how to run your solution
3. Any additional documentation you think is relevant

## Tips

- Focus on creating a smooth, intuitive user experience
- Pay special attention to how you handle the different event types
- Create visually distinct components for different tool outputs
- Consider the user flow and how to make the conversation feel natural
- Test your solution thoroughly with different conversation scenarios

Good luck! 