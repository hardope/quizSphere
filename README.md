# QuizSphere

API for a quiz application using NestJs, Prisma ORM, and PostgreSQL.

## Architecture

The application follows a microservices architecture using NestJs within a monorepo setup. It leverages RabbitMQ for message brokering and communication between services. Each microservice is responsible for a specific domain and communicates asynchronously with other services through RabbitMQ.

### Components

- **API Gateway**: Handles incoming HTTP requests and routes them to the appropriate microservice.
- **Auth Service**: Manages authentication and authorization.
- **Quiz Service**: Handles quiz creation, management, and retrieval.
- **User Service**: Manages user data and profiles.
- **Results Service**: Processes and stores quiz results.

### Communication

- **RabbitMQ**: Used for inter-service communication, ensuring loose coupling and scalability.
- **HTTP**: Used by the API Gateway to communicate with external clients.

### Database

- **PostgreSQL**: Used as the primary database, managed by Prisma ORM for data persistence.

### Technologies

- **NestJs**: Framework for building efficient, reliable, and scalable server-side applications.
- **Prisma ORM**: Next-generation ORM for Node.js and TypeScript.
- **RabbitMQ**: Message broker for handling communication between microservices.
- **PostgreSQL**: Relational database for storing application data.

## Setup

1. Clone the repository:

```bash
git clone https://github.com/hardope/quizSphere.git
```

2. Install dependencies:

```bash
cd quizSphere
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory and add the following environment variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/quizSphere"
```

4. Run the application:

```bash
npm run start:dev # To start the API Gateway
npm run start:dev: notifications # To start the notifications service
npm run start:dev: user # To start the user service
```

The application should now be running locally.

## File Structure

The project is structured as follows:

```
.
|-- README.md
|-- apps
|   |-- authentication
|   |   |-- src
|   |   |   |-- authentication.controller.spec.ts
|   |   |   |-- authentication.controller.ts
|   |   |   |-- authentication.module.ts
|   |   |   |-- authentication.service.ts
|   |   |   `-- main.ts
|   |   |-- test
|   |   |   |-- app.e2e-spec.ts
|   |   |   `-- jest-e2e.json
|   |   `-- tsconfig.app.json
|   |-- gateway
|   |   |-- src
|   |   |   |-- auth
|   |   |   |   |-- auth.controller.spec.ts
|   |   |   |   |-- auth.controller.ts
|   |   |   |   |-- auth.module.ts
|   |   |   |   |-- auth.service.spec.ts
|   |   |   |   |-- auth.service.ts
|   |   |   |   |-- dto
|   |   |   |   |   |-- create-auth.dto.ts
|   |   |   |   |   `-- update-auth.dto.ts
|   |   |   |   `-- entities
|   |   |   |       `-- auth.entity.ts
|   |   |   |-- gateway.controller.ts
|   |   |   |-- gateway.module.ts
|   |   |   |-- gateway.service.ts
|   |   |   |-- main.ts
|   |   |   `-- users
|   |   |       |-- dto
|   |   |       |   |-- create-user.dto.ts
|   |   |       |   `-- update-user.dto.ts
|   |   |       |-- entities
|   |   |       |   `-- user.entity.ts
|   |   |       |-- users.controller.ts
|   |   |       |-- users.module.ts
|   |   |       `-- users.service.ts
|   |   |-- test
|   |   |   |-- app.e2e-spec.ts
|   |   |   `-- jest-e2e.json
|   |   `-- tsconfig.app.json
|   |-- notification
|   |   |-- src
|   |   |   |-- mail
|   |   |   |   `-- mail.service.ts
|   |   |   |-- main.ts
|   |   |   |-- notification.controller.ts
|   |   |   |-- notification.module.ts
|   |   |   |-- notification.service.ts
|   |   |   `-- user.dto.ts
|   |   |-- test
|   |   |   |-- app.e2e-spec.ts
|   |   |   `-- jest-e2e.json
|   |   `-- tsconfig.app.json
|   `-- user
|       |-- src
|       |   |-- app.controller.ts
|       |   |-- app.module.ts
|       |   |-- app.service.ts
|       |   |-- main.ts
|       |   `-- user.dto.ts
|       |-- test
|       |   |-- app.e2e-spec.ts
|       |   `-- jest-e2e.json
|       `-- tsconfig.app.json
|-- dist
|   `-- apps
|       |-- gateway
|       |   `-- main.js
|       |-- notification
|       |   `-- main.js
|       `-- user
|           `-- main.js
|-- libs
|   |-- common
|   |   |-- src
|   |   |   |-- dto
|   |   |   |   `-- auth.dto.ts
|   |   |   |-- index.ts
|   |   |   |-- prisma.module.ts
|   |   |   `-- prisma.service.ts
|   |   `-- tsconfig.lib.json
|   `-- prisma
|       |-- migrations
|       |   |-- 20250108223539_user
|       |   |   `-- migration.sql
|       |   |-- 20250111182634_verify
|       |   |   `-- migration.sql
|       |   `-- migration_lock.toml
|       |-- schema.prisma
|       `-- tsconfig.lib.json
|-- nest-cli.json
|-- package-lock.json
|-- package.json
|-- tsconfig.build.json
`-- tsconfig.json
```