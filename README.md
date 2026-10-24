# Book Reading Companion

A personal web app to track words and notes while reading books. Organize by **Book → Chapter → Words & Notes**.

## Prerequisites

- **Node.js** v18+
- **MongoDB** running locally (or a MongoDB Atlas URI)
- **npm** v9+

## Install

```bash
# Install root dev tools (concurrently)
npm install

# Install server + client dependencies
npm run install:all
```

## Configure

1. Copy `.env.example` files:
   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```
2. Edit `server/.env` with your MongoDB URI if different:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/book-companion
   CLIENT_ORIGIN=http://localhost:5173
   ```

## Run (Development)

```bash
# Start both server and client with one command:
npm run dev
```

Or in two separate terminals:
```bash
# Terminal 1
npm run dev:server   # http://localhost:5000

# Terminal 2
npm run dev:client   # http://localhost:5173
```

## Testing

Run the automated backend test suite (validates book & chapter lifecycle, word duplicate rule 409 rejection, and cascade deletion):
```bash
npm test
```

## API Summary

Base URL: `http://localhost:5000/api`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/books` | List all books (with counts) |
| POST | `/books` | Create book `{ title, author? }` |
| GET | `/books/:id` | Get book |
| PATCH | `/books/:id` | Update book |
| DELETE | `/books/:id` | Delete book + cascade |
| GET | `/books/:id/chapters` | List chapters |
| POST | `/books/:id/chapters` | Create chapter `{ title }` |
| GET | `/chapters/:id` | Get chapter |
| PATCH | `/chapters/:id` | Update chapter |
| DELETE | `/chapters/:id` | Delete chapter + cascade |
| GET | `/chapters/:id/words` | List words |
| POST | `/chapters/:id/words` | Create word `{ word, meaning, exampleSentence? }` |
| PATCH | `/words/:id` | Update word |
| DELETE | `/words/:id` | Delete word |
| GET | `/chapters/:id/notes` | List notes |
| POST | `/chapters/:id/notes` | Create note `{ content, pageNumber? }` |
| PATCH | `/notes/:id` | Update note |
| DELETE | `/notes/:id` | Delete note |

## Design

Styled with a hand-drawn SketchUI aesthetic: warm cream background (notebook lines), Patrick Hand font, hand-drawn borders, and pastel color tokens.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Tailwind CSS v3, hand-drawn CSS system |
| Backend | Node.js, Express 4 |
| Database | MongoDB + Mongoose 8 |
| Validation | Zod |
