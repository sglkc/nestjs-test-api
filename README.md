# NestJS Test API

This project includes basic auth and database operations using [NestJS](https://nestjs.com/). It integrates [TypeORM](https://typeorm.io/) for database interactions and uses [PostgreSQL](https://www.postgresql.org/) as the primary database. The application is containerized with [Docker](https://www.docker.com/) to facilitate easy development and deployment.

## Technology Stack

- Node.js: JavaScript runtime environment.
- pnpm: Fast, disk space efficient package manager.
- NestJS: Framework for buildingserver-side applications.
- TypeScript: Typed superset of JavaScript.
- TypeORM: ORM for JavaScript.
- PostgreSQL: Open-source relational database.
- Docker: Platform for developing, shipping, and running applications in containers.

## Setup with Docker

To set up the application using Docker:

1. Ensure Docker is installed on your system. Follow the instructions for your opreating system on the [official Docker website](https://docs.docker.com/get-docker/).

2. Clone the repository.
   ```bash
   git clone https://github.com/sglkc/nestjs-test-api.git
   cd nestjs-test-api
   ```

3. Copy `.env.example` file and rename it to `.env`. Update the variables as needed.
   ```bash
   cp .env.example .env
   ```

4. Build `app` container for production. Refer to [](#building-and-running-containers) for detailed guide.
   ```bash
   docker compose up app --build
   ```

5. By default, the API will be accessible at `http://localhost:3000`.

## API Documentation

The API provides endpoints for authentication and user listing. Below is an example of how to interact with the API.

### Example Request/Response

The following is an example for registering a new user on the API:

- Endpoint: `POST /auth/register`
  
- Request Body:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
  
- Success Response:
  ```json
  {
    "status": 200,
    "message": "success",
    "data": {
      "token": "string",
      "user": {
        "id": 0,
        "username": "string",
        "email": "string"
      }
    }
  }
  ```
  
- Error Response:
  ```json
  {
    "status": 422,
    "message": "userDuplicate",
    "errors": [
      "string"
    ]
  }
  ```

For a comprehenisve list of endpoints and their usage, please refer to OpenAPI UI on `/docs` endpoint in the API.

## Environment Variables

Refer to `.env.example` for used environment variables in the application.

## Docker Documentation

### Container Architecture

The application is structured into two main services:

1. app: Runs the NestJS application.
2. db: Runs the PostgreSQL database.

Development version with prefix `-dev` is included for development environment inside a container.

These services are defined in the `docker-compose.yml` file and are configured to communicate with each other within a Docker network.

### Building and Running Containers

#### Development

Development environment enables real-time editing. To build and run the container:

1. Build Docker image
   ```bash
   docker compose build app-dev
   ```

2. Start the container
   ```bash
   docker compose up app-dev
   ```

   To run the containers in detached mode:
   ```bash
   docker compose up app-dev -d
   ```

3. Stopping the container:
   ```bash
   docker compose down app-dev
   ```

#### Production

Production environemnt builds the app for deployment. To build and run the containers:

1. Build Docker image
   ```bash
   docker compose build app
   ```

2. Start the container
   ```bash
   docker compose up app
   ```

   To run the containers in detached mode:
   ```bash
   docker compose up app -d
   ```

3. Stopping the container:
   ```bash
   docker compose down app
   ```

### Volume Management

Docker volumes are used to persist data and manage dependencies:

- `postgres-data` defined in `docker-compose.yml` used to persist PostgreSQL database.

- `pnpm cache` defined in `Dockerfile` to save time and network usage on installing packages.
