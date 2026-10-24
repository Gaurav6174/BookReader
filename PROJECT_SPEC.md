# Book Reading Companion: Project Specification (v1)

> **Instructions for the AI model building this project**
> 1. Read this file fully before writing any code.
> 2. All visual design (layout, colors, typography, spacing, component styling) comes from `design.md`. Do **not** invent your own UI styling. This file defines *behavior, data, and structure only*.
> 3. Where this spec and `design.md` conflict on visuals, `design.md` wins. Where they conflict on behavior or data, this file wins.
> 4. Build in the order given in [Section 12](#12-build-order). Make sure each step runs before moving on.
> 5. If something is ambiguous, choose the simplest option and leave a short `// NOTE:` comment explaining the assumption.

---

## 1. Overview

A simple web app for people who read books and want to:

- Keep track of **words whose meaning they don't know**, saving each word with its meaning.
- Write **notes / important sentences** from what they read.

Everything is organized as **Book → Chapter → (Words, Notes)**.

### v1 Word Lookup Approach

There is **no dictionary or translation API** in v1. The user types a word, clicks **"Look up on Google"**, which opens a Google search in a **new browser tab**. The user reads the meaning there, comes back to the app, types or pastes the meaning into a field, and saves it.

The lookup logic must be isolated in one small module so an API-based lookup can be added later without touching the UI components (see [Section 8](#8-lookup-feature-details)).

---

## 2. Goals and Non-Goals

### Goals (v1)
- Create, view, edit, and delete **Books**.
- Create, view, edit, and delete **Chapters** inside a book.
- Inside a chapter: add, view, edit, and delete **Words** (word + meaning) and **Notes**.
- "Look up on Google" button that opens Google search for the typed word in a new tab.
- Data persisted in MongoDB.
- Responsive UI (works on phone and desktop). Styling follows `design.md`.

### Non-Goals (do NOT build in v1)
- No Google Translate / dictionary / any third-party API calls.
- No scraping Google. No iframes of Google (Google blocks them).
- No spaced repetition, flashcards, quizzes, or AI features.
- No ebook reader or file upload.
- No social features or sharing.
- No authentication (see [Section 3](#3-assumptions)).

---

## 3. Assumptions

- **Single user, no login in v1.** The app is a personal tool. All data belongs to one implicit user.
  - Keep the code structured so adding `userId` to every model later is easy (all DB access goes through the service/controller layer, not scattered in routes).
- Words and meanings are free text (any language, including Hindi, English, etc.). Use UTF-8 everywhere.
- Backend: **Node.js + Express + Mongoose**. (Chosen to keep one language across the stack. If the builder prefers another backend, the REST contract in Section 5 must stay identical.)

---

## 4. Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React (Vite), React Router, plain `fetch` or Axios |
| Styling | As defined in `design.md` |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose ODM |
| Config | `.env` files (never commit secrets) |
| Package manager | npm |

Optional but recommended: ESLint + Prettier, `cors`, `dotenv`, `helmet`, `morgan`.

---

## 5. Data Model (MongoDB / Mongoose)

All schemas use `timestamps: true` (adds `createdAt`, `updatedAt`).

### 5.1 Book
| Field | Type | Rules |
|---|---|---|
| `_id` | ObjectId | auto |
| `title` | String | required, trimmed, 1-200 chars |
| `author` | String | optional, trimmed, max 150 chars |

### 5.2 Chapter
| Field | Type | Rules |
|---|---|---|
| `_id` | ObjectId | auto |
| `bookId` | ObjectId (ref Book) | required, indexed |
| `title` | String | required, trimmed, 1-200 chars (e.g. "Chapter 1", "The Beginning") |
| `order` | Number | required, used for sorting; auto-assigned as (max order in book + 1) on create |

### 5.3 Word
| Field | Type | Rules |
|---|---|---|
| `_id` | ObjectId | auto |
| `bookId` | ObjectId (ref Book) | required, indexed |
| `chapterId` | ObjectId (ref Chapter) | required, indexed |
| `word` | String | required, trimmed, 1-100 chars |
| `meaning` | String | required, trimmed, 1-1000 chars |
| `exampleSentence` | String | optional, max 500 chars (the sentence from the book where the word appeared) |

**Uniqueness:** within one chapter, the same word (case-insensitive) must not be saved twice. Enforce with a compound check on `(chapterId, wordLower)`. Store a hidden `wordLower` field, or use a collation-based unique index. On a duplicate, return HTTP `409` with a clear message.

### 5.4 Note
| Field | Type | Rules |
|---|---|---|
| `_id` | ObjectId | auto |
| `bookId` | ObjectId (ref Book) | required, indexed |
| `chapterId` | ObjectId (ref Chapter) | required, indexed |
| `content` | String | required, trimmed, 1-5000 chars |
| `pageNumber` | Number | optional, integer >= 1 |

### 5.5 Cascade Deletion
- Deleting a **Book** deletes all its Chapters, Words, and Notes.
- Deleting a **Chapter** deletes all its Words and Notes.
- Implement this in the service layer (or with Mongoose middleware). Do not leave orphaned documents.

---

## 6. REST API

Base path: `/api`. All requests and responses are JSON. Use proper HTTP status codes.

### Response Shapes
- Success: `{ "data": <object or array> }`
- Error: `{ "error": { "message": "Human readable message", "details": <optional> } }`

### Endpoints

**Books**
| Method | Path | Description |
|---|---|---|
| GET | `/api/books` | List all books (newest first). Include `chapterCount`, `wordCount`, `noteCount` for each. |
| POST | `/api/books` | Create book. Body: `{ title, author? }` |
| GET | `/api/books/:bookId` | Get one book |
| PATCH | `/api/books/:bookId` | Update title/author |
| DELETE | `/api/books/:bookId` | Delete book + cascade |

**Chapters**
| Method | Path | Description |
|---|---|---|
| GET | `/api/books/:bookId/chapters` | List chapters sorted by `order` ascending. Include `wordCount`, `noteCount`. |
| POST | `/api/books/:bookId/chapters` | Create chapter. Body: `{ title }` |
| GET | `/api/chapters/:chapterId` | Get one chapter (include parent book's `_id` and `title`) |
| PATCH | `/api/chapters/:chapterId` | Update title |
| DELETE | `/api/chapters/:chapterId` | Delete chapter + cascade |

**Words**
| Method | Path | Description |
|---|---|---|
| GET | `/api/chapters/:chapterId/words` | List words, newest first |
| POST | `/api/chapters/:chapterId/words` | Create. Body: `{ word, meaning, exampleSentence? }`. `409` if duplicate. |
| PATCH | `/api/words/:wordId` | Update `word`, `meaning`, `exampleSentence`. `409` if it would create a duplicate. |
| DELETE | `/api/words/:wordId` | Delete |

**Notes**
| Method | Path | Description |
|---|---|---|
| GET | `/api/chapters/:chapterId/notes` | List notes, newest first |
| POST | `/api/chapters/:chapterId/notes` | Create. Body: `{ content, pageNumber? }` |
| PATCH | `/api/notes/:noteId` | Update `content`, `pageNumber` |
| DELETE | `/api/notes/:noteId` | Delete |

### Backend Rules
- Validate all input (use `zod`, `joi`, or `express-validator`). Return `400` with field-level details on invalid input.
- Validate ObjectIds; return `404` for unknown or malformed ids (not `500`).
- `bookId` / `chapterId` on Words and Notes are set by the server from the URL, never trusted from the body.
- Central error-handling middleware. Never leak stack traces in responses.
- Enable CORS for the frontend origin only (configurable via env).

---

## 7. Frontend

### 7.1 Routes

| Route | Page | Purpose |
|---|---|---|
| `/` | Books page | List all books, create a new book |
| `/books/:bookId` | Book page | List chapters of the book, create a new chapter |
| `/chapters/:chapterId` | Chapter page | The main workspace: Words and Notes for this chapter |
| `*` | Not found | Simple 404 with link home |

Every inner page shows **breadcrumb navigation**: `Books > {Book title} > {Chapter title}`, with each part clickable.

### 7.2 Page Behavior

**Books page (`/`)**
- Shows a list or grid of books (title, author, counts of chapters/words/notes).
- "Add book" action: asks for **title** (required) and **author** (optional). On success the new book appears and the user can open it.
- Each book can be edited and deleted (delete requires a confirmation dialog warning that chapters, words, and notes will also be deleted).
- Empty state: friendly message prompting the user to add their first book.

**Book page (`/books/:bookId`)**
- Shows the book title and author, and the list of chapters in order.
- "Add chapter" action: asks for **chapter title** (required).
- Each chapter shows its word and note counts, and can be edited and deleted (with confirmation).
- Clicking a chapter opens the Chapter page.
- Empty state: prompts to add the first chapter.

**Chapter page (`/chapters/:chapterId`)**: *the core of the app.*
Contains two sections, **Words** and **Notes**. Layout (tabs, side by side, stacked) follows `design.md`.

#### Words Section
1. **Add-word area** with:
   - Text input: **Word** (required)
   - Button: **"Look up on Google"** (see [Section 8](#8-lookup-feature-details))
   - Text area/input: **Meaning** (required)
   - Optional input: **Example sentence** (the sentence in the book where the word appeared)
   - Button: **"Save word"**
2. **Words list shown as rows** (a table or row-style list): each row shows `Word | Meaning | (Example sentence if present) | Actions`.
3. Row actions: **Edit** (inline or modal) and **Delete** (with confirmation).
4. A small search/filter box to filter the saved words in this chapter by text (client-side filtering is fine).
5. Empty state: message such as "No words saved yet. Type a word above to start."

#### Notes Section
1. Button: **"Write a note"**: opens an inline editor or modal with:
   - Text area: **Note** (required)
   - Optional number input: **Page number**
   - Buttons: **Save** and **Cancel**
2. **Notes list** as cards, newest first: shows the content (preserve line breaks), page number if present, and created date.
3. Card actions: **Edit** and **Delete** (with confirmation).
4. Empty state: message such as "No notes yet. Write down an important sentence or thought."

### 7.3 UX Requirements (Behavioral)
- Show a **loading state** while fetching and a clear **error state** (with retry) if a request fails.
- Disable the Save buttons while a request is in flight to prevent double submits.
- After saving a word: clear the Word, Meaning, and Example fields and return focus to the **Word** input so the user can quickly add the next word. The new row appears at the top of the list without a full page reload.
- Show inline validation messages (e.g. "Meaning is required").
- Show a non-blocking toast or message on success/failure (style per `design.md`).
- On `409` (duplicate word), show a message such as "This word is already saved in this chapter."
- Keyboard: pressing **Enter** in the Word input triggers the lookup only if the field is non-empty. **Ctrl/Cmd + Enter** in the Meaning field saves the word. (Nice-to-have.)
- Accessibility: all buttons and inputs have labels, visible focus states, and are keyboard reachable. Confirmation dialogs trap focus.

### 7.4 Suggested Frontend Structure

```
client/
  src/
    api/            # thin wrappers around fetch: books.js, chapters.js, words.js, notes.js
    lib/
      lookup.js     # lookup logic isolated here (see Section 8)
    pages/
      BooksPage.jsx
      BookPage.jsx
      ChapterPage.jsx
      NotFoundPage.jsx
    components/
      Breadcrumbs.jsx
      ConfirmDialog.jsx
      EmptyState.jsx
      Toast (or toast provider)
      books/        # BookCard, BookForm
      chapters/     # ChapterItem, ChapterForm
      words/        # WordForm, WordRow, WordList, LookupButton
      notes/        # NoteForm, NoteCard, NoteList
    hooks/          # e.g. useWords, useNotes (fetch + mutate helpers)
    App.jsx
    main.jsx
```

Use `design.md` tokens (colors, fonts, spacing) via CSS variables or the styling approach that file specifies.

---

## 8. Lookup Feature Details

This is the key v1 feature. Implement exactly as follows.

### 8.1 Behavior
- The **"Look up on Google"** button sits next to the Word input.
- The button is **disabled** when the Word input is empty (after trimming).
- On click, open this URL in a **new tab**:

```
https://www.google.com/search?q=define+{encodedWord}
```

where `encodedWord = encodeURIComponent(word.trim())`.

- Open with `window.open(url, "_blank", "noopener,noreferrer")` (or an `<a target="_blank" rel="noopener noreferrer">`).
- The app does **not** read anything back from Google. The user manually types or pastes the meaning into the Meaning field.
- When the user returns to the app tab, the Word input must still hold its value and the Meaning field should be focused if possible (nice-to-have, e.g. via the `visibilitychange` or `focus` event, and only if Meaning is empty).

### 8.2 Isolation (important)
Put the logic in `client/src/lib/lookup.js`:

```js
// lookup.js
export function buildGoogleDefineUrl(word) {
  const w = word.trim();
  if (!w) return null;
  return `https://www.google.com/search?q=define+${encodeURIComponent(w)}`;
}

export function openGoogleLookup(word) {
  const url = buildGoogleDefineUrl(word);
  if (!url) return false;
  window.open(url, "_blank", "noopener,noreferrer");
  return true;
}
```

`LookupButton` must only call `openGoogleLookup`. A future version may add a different provider (e.g. a dictionary API that auto-fills the Meaning field) by changing/adding code in `lookup.js` and `LookupButton` only. No other component should know how lookup works.

### 8.3 Do NOT
- Do not fetch or scrape `google.com` from the frontend or backend.
- Do not try to embed Google in an iframe.
- Do not add any API key requirement in v1.

---

## 9. Project Structure (Monorepo)

```
book-companion/
  client/            # React app (Vite)
  server/
    src/
      config/        # env + db connection
      models/        # Book.js, Chapter.js, Word.js, Note.js
      routes/        # books.routes.js, chapters.routes.js, words.routes.js, notes.routes.js
      controllers/
      services/      # business logic incl. cascade delete
      middleware/    # errorHandler, validate, notFound
      app.js
      server.js
  design.md          # provided by the owner (UI source of truth)
  PROJECT_SPEC.md    # this file
  README.md
```

### Environment Variables

`server/.env`
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/book-companion
CLIENT_ORIGIN=http://localhost:5173
```

`client/.env`
```
VITE_API_BASE_URL=http://localhost:5000/api
```

Commit `.env.example` files (no real secrets). Add `.env` to `.gitignore`.

---

## 10. Quality Requirements

- Clean, readable code with consistent naming. Small, single-purpose components and functions.
- No dead code, no leftover console logs.
- Handle every async call with try/catch (or equivalent) and surface errors in the UI.
- README with: prerequisites, install steps, how to run client and server, env variables, and API summary.
- Provide a `npm run dev` flow that starts both (use `concurrently` at the root, or document two terminals).
- (Nice-to-have) A few backend tests for the word duplicate rule and cascade deletion.

---

## 11. Acceptance Criteria (v1 is done when all are true)

1. I can create a book by entering a title (author optional), and see it on the home page.
2. I can open the book, add a chapter by title, and see it listed in order.
3. I can open the chapter and see the Words and Notes sections.
4. Typing a word and clicking **Look up on Google** opens `google.com/search?q=define+<word>` in a new tab; the button is disabled when the input is empty.
5. After typing a meaning and clicking **Save word**, the word and meaning appear as a row in the chapter's word list, and the form clears and refocuses the Word input.
6. Saving the same word twice in one chapter (any letter case) is rejected with a clear message.
7. I can edit and delete a word row.
8. I can click **Write a note**, write text (optional page number), save it, and see it in the notes list; I can also edit and delete notes.
9. I can add more chapters to the same book and more books.
10. Refreshing the page keeps all data (it is stored in MongoDB).
11. Deleting a chapter or book removes its words and notes (no orphans in the DB).
12. The UI matches `design.md` and works on mobile widths.
13. Loading, empty, and error states exist on every page.

---

## 12. Build Order

1. **Server setup:** Express app, Mongo connection, env config, error middleware, health route (`GET /api/health`).
2. **Models and API:** Books, then Chapters, then Words (with duplicate rule), then Notes; include validation and cascade deletes.
3. **Client setup:** Vite + React Router, API layer, layout and breadcrumbs, applying `design.md` tokens.
4. **Books page** (list, create, edit, delete).
5. **Book page** (chapters list, create, edit, delete).
6. **Chapter page:** Words section with `lookup.js` and `LookupButton`, then the Notes section.
7. **Polish:** loading, empty, and error states, toasts, confirmations, keyboard and focus behavior, accessibility pass.
8. **README** and final manual run-through of the acceptance criteria.

---

## 13. Future Ideas (do NOT build now, but don't block them)

- Auto-fill meaning via a dictionary or translation API (swap in through `lookup.js`).
- Authentication and per-user data (add `userId` to all models).
- Export words and notes (CSV / Markdown / PDF).
- Search across all books.
- Tags on notes, favorite words, "difficult word" marking.
- Review mode (flashcards) for saved words.
