## Getting Started

This project can be run in two ways:

1. **Using Docker Compose:**  
   Run the provided `docker-compose.yml` under infrastructure folder to start both the backend and frontend services simultaneously.  
   ```bash
   docker-compose up
   ```

2. **Using the Frontend Dockerfile:**  
   You can also run the frontend as a standalone service by building and running the Docker image defined in the frontend's Dockerfile.  
   ```bash
   # Build the image
   docker build -t my-frontend .
   # Run the container
   docker run -p 3000:3000 my-frontend
   ```

Refer to the `.env.example` file for the required environment variables for the backend connection.