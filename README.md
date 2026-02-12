# GameNight Hub 🎲

**A social platform for board game enthusiasts in Spain**

GameNight Hub is a full-stack web application designed for the Spanish board gaming community. It allows users to manage their personal game collections, discover new games, and organize meetups at cafes, specialized stores, or private homes.

## 🎯 Project Purpose

This project is part of my full-stack web development training, with the goal of creating a useful and functional tool for the Spanish gaming community.

The platform integrates data from BoardGameGeek (BGG) - the world's largest board game database - to enrich the information of games imported by users.

## 🛠️ Tech Stack

**Frontend:**

- Angular 21 (standalone components, signals)
- TypeScript 5.9+
- TailwindCSS 4
- RxJS for HTTP calls

**Backend:**

- NestJS 11 (enterprise-grade Node.js framework)
- TypeScript
- MongoDB (Mongoose ODM)
- BoardGameGeek XML API2 integration

**Testing:**

- Vitest (unit tests)
- Behavioral TDD approach

**API Testing:**

- Insomnia (HTTP client)

## ✨ Current Features

### Collection Management

- 🔍 **BGG Search**: Search games in the BoardGameGeek database
- 📥 **Import**: Import games from BGG to your personal collection
- 📋 **Full CRUD**: Create, read, update and delete games from your collection
- 📝 **Personal Fields**: Add notes, mark as "owned", rate complexity (1-5)

### Data Model (BGG-Compatible)

Games store detailed information:

- BGG Data: ID, name, year, players, duration, age, description, categories, mechanics, publisher
- Personal Data: ownership status, notes, personal complexity rating

## 🚀 Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Git

### Installation

**Backend:**

```bash
cd backend
pnpm install  # or npm install
```

**Frontend:**

```bash
cd frontend
bun install   # or npm install
```

## 🧪 Testing

**Backend:**

```bash
cd backend
pnpm test
```

Implemented with behavioral TDD (26 tests passing).

**Frontend:**

```bash
cd frontend
ng test
```

## 📡 API Endpoints

### BoardGameGeek Integration

- `GET /games/bgg/search?query={name}` - Search games in BGG
- `GET /games/bgg/game/{bggId}` - Get details of a specific game

### Collection Management

- `POST /games/import/{bggId}` - Import game from BGG
- `GET /games` - List personal collection
- `GET /games/{id}` - Get game details
- `PATCH /games/{id}` - Update personal fields
- `DELETE /games/{id}` - Remove game from collection

## 🔧 API Testing

We recommend using **Insomnia** to test the endpoints:

1. Download: https://insomnia.rest/download
2. Create collection "GameNight Hub API"
3. Set base URL: `http://localhost:3000`
4. Test endpoints with different HTTP methods

## 🎲 About BoardGameGeek Integration

This project uses the **BGG XML API2** to enhance user experience:

- **Rate Limiting**: Implemented 5-second delay between requests to respect BGG limits
- **XML Parsing**: Automatic conversion from XML to JSON for easier consumption
- **Local Cache**: BGG data is stored in MongoDB after first import

BGG API usage is **strictly non-commercial** and complies with their terms of service.

## 📚 Educational Purpose

This is a learning project focused on:

- Clean and scalable architecture (Screaming Architecture)
- Test-driven development (Behavioral TDD)
- External API integration
- Full-stack development with Angular and NestJS
- Professional development best practices

## 🗺️ Future Features

- 🗺️ **MapBox**: Interactive map of meetup locations (cafes, stores, homes)
- 📅 **FullCalendar**: Event calendar and meetup scheduling
- 📊 **Chart.js**: Collection statistics and data visualization
- 🔐 **Authentication**: User system for personalized management

## 📝 License and Attributions

- Game data sourced from [BoardGameGeek](https://boardgamegeek.com)
- "Powered by BGG" logo required for API usage
- Open source project for educational purposes

## 🤝 Contributions

This project is under active development. Suggestions and improvements are welcome.

---

**Developed with ❤️ for the Spanish gaming community** 🇪🇸🎲
