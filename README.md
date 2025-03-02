# Globetrotter App - Backend

A geography trivia game backend built with Encore.dev and TypeScript, featuring destination guessing challenges and friend challenges.

## Tech Stack

- **Framework**: [Encore](https://encore.dev/) - TypeScript microservices platform
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT-based authentication

## Folder Structure

```plaintext
globetrotter-backend/
├── database.ts                   # Database connection configuration
├── encore.app                    # Encore application configuration
├── package.json                  # Node.js dependencies
├── prisma/
│   └── schema.prisma             # Database schema definition
├── services/                     # Backend microservices
│   ├── destination/              # Destination management service
│   │   ├── destination.ts        # API endpoints
│   │   ├── destination.service.ts # Business logic
│   │   └── types.ts              # Type definitions
│   ├── game/                     # Game functionality service
│   │   ├── game.ts               # API endpoints
│   │   ├── game.service.ts       # Game business logic
│   │   └── game.types.ts         # Game-related types
│   ├── challenge/                # Friend challenge service
│   │   ├── challenge.ts          # API endpoints
│   │   ├── challenge.service.ts  # Challenge business logic
│   │   └── challenge.types.ts    # Challenge-related types
│   ├── user/                     # User management service
│   │   ├── user.ts               # API endpoints
│   │   ├── user.service.ts       # User business logic
│   │   └── types.ts              # User-related types
│   └── shared/                   # Shared utilities
│       ├── auth.ts               # Authentication middleware
│       └── types.ts              # Common types
└── README.md                     # This file
```

## Features

### User Management

- User registration with unique usernames
- Profile retrieval

### Destination Management

- Create, read, update destinations
- Bulk import destinations from JSON
- Random destination selection

### Game Functionality

- Create new game sessions
- Present 1-2 random clues from the chosen destination
- Multiple-choice answers (selecting from several destinations)
- Answer validation with score tracking
- Fun facts and trivia shown after answers
- Track correct and incorrect answers with maximum wrong answer limits

### Challenge System

- Challenge friends via shareable invitation links
- View challenger's score before playing
- Anonymous or registered gameplay
- Time-limited challenge invitations

## API Endpoints

### User Service

- `POST /user/register` - Register a new user
- `GET /user/profile` - Get authenticated user profile

### Destination Service

- `GET /destinations` - Get a destination by ID
- `POST /destinations` - Create a new destination
- `PATCH /destinations/:id` - Update an existing destination
- `GET /destinations/random` - Get a random destination
- `POST /destinations/bulk` - Bulk import destinations

### Game Service

- `POST /game/session` - Create a new game session
- `GET /game/session/:id` - Get details of a game session
- `GET /game/session/:id/clues` - Get clues and multiple-choice answers
- `POST /game/answer` - Submit an answer and get feedback

### Challenge Service

- `POST /challenge` - Create a challenge for friends
- `GET /challenge/:inviteCode` - Get challenge details by invite code
- `POST /challenge/join` - Join a challenge with invite code

## Running the Project

### Prerequisites

- Node.js 14+ installed
- PostgreSQL database
- Encore CLI installed (`bun i -g encore`)

### Setup

```bash
# Clone the repository
git clone https://github.com/luciferro01/globetrotter.git
cd globetrotter/globetrotter-backend

# Install dependencies
bun i

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials
```

### Development

```bash
# Start the development server
encore run
```

### Database Migrations

```bash
# Run database migrations
bunx prisma migrate dev
```

### Seed Sample Data

```bash
# Import sample destinations
curl -X POST http://localhost:4000/destinations/bulk -H "Content-Type: application/json" -d @sample-destinations.json
```

## Authentication

The application uses JWT for authentication. After registering, you'll receive a token that should be included in the `Authorization` header for authenticated endpoints:

```plaintext
Authorization: Bearer <your-token>
```

## License

MIT License
