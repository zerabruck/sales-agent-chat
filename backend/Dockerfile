# Use an official Python image as the base
FROM python:3.12-slim
LABEL authors="santiagomorillosegovia"

# Set environment variables to prevent Python from generating .pyc files and enable unbuffered logging
ENV PYTHONUNBUFFERED=1
ENV POETRY_VERSION=1.8.3

# Install Poetry
RUN pip install "poetry==$POETRY_VERSION"

# Set the working directory in the container
WORKDIR /app

# Copy the poetry files and install dependencies
COPY pyproject.toml poetry.lock /app/

# Install dependencies without virtual environments
RUN poetry config virtualenvs.create false && poetry install --no-root --no-dev

# Copy the rest of the backend code
COPY . /app

# Expose the port FastAPI will run on
EXPOSE 8000

# Command to run the FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
