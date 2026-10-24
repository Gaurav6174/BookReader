import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5000/api';

async function req(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  let json = null;
  if (res.status !== 204) {
    try {
      json = await res.json();
    } catch {
      // response without body
    }
  }
  return { status: res.status, ok: res.ok, body: json };
}

test('API Health Check', async () => {
  const res = await req('/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
});

test('Book and Chapter lifecycle with Word duplicate rule & Cascade deletion', async (t) => {
  // 1. Create a Book
  const bookRes = await req('/books', {
    method: 'POST',
    body: JSON.stringify({ title: 'Test Novel', author: 'Jane Doe' }),
  });
  assert.equal(bookRes.status, 201);
  const bookId = bookRes.body.data._id;
  assert.ok(bookId);

  // 2. Create Chapters
  const ch1Res = await req(`/books/${bookId}/chapters`, {
    method: 'POST',
    body: JSON.stringify({ title: 'Chapter 1' }),
  });
  assert.equal(ch1Res.status, 201);
  const ch1Id = ch1Res.body.data._id;
  assert.equal(ch1Res.body.data.order, 1);

  const ch2Res = await req(`/books/${bookId}/chapters`, {
    method: 'POST',
    body: JSON.stringify({ title: 'Chapter 2' }),
  });
  assert.equal(ch2Res.status, 201);
  assert.equal(ch2Res.body.data.order, 2);

  // 3. Create Word in Chapter 1
  const word1Res = await req(`/chapters/${ch1Id}/words`, {
    method: 'POST',
    body: JSON.stringify({
      word: 'Serendipity',
      meaning: 'Finding something good without looking for it',
      exampleSentence: 'It was serendipity that we met.',
    }),
  });
  assert.equal(word1Res.status, 201);
  const word1Id = word1Res.body.data._id;
  assert.equal(word1Res.body.data.wordLower, 'serendipity');

  // 4. Duplicate Word check (case-insensitive: "SERENDIPITY")
  const dupRes = await req(`/chapters/${ch1Id}/words`, {
    method: 'POST',
    body: JSON.stringify({
      word: 'SERENDIPITY',
      meaning: 'Duplicate test',
    }),
  });
  assert.equal(dupRes.status, 409);
  assert.match(dupRes.body.error.message, /already saved in this chapter/i);

  // 5. Create a Note in Chapter 1
  const noteRes = await req(`/chapters/${ch1Id}/notes`, {
    method: 'POST',
    body: JSON.stringify({
      content: 'Important insight about fate and serendipity.',
      pageNumber: 15,
    }),
  });
  assert.equal(noteRes.status, 201);
  const noteId = noteRes.body.data._id;
  assert.ok(noteId);

  // 6. Verify Book listing includes accurate counts
  const booksListRes = await req('/books');
  assert.equal(booksListRes.status, 200);
  const foundBook = booksListRes.body.data.find((b) => b._id === bookId);
  assert.ok(foundBook);
  assert.equal(foundBook.chapterCount, 2);
  assert.equal(foundBook.wordCount, 1);
  assert.equal(foundBook.noteCount, 1);

  // 7. Verify Cascade Deletion when deleting the Book
  const deleteRes = await req(`/books/${bookId}`, { method: 'DELETE' });
  assert.equal(deleteRes.status, 204);

  // 8. Verify Book, Chapter, Word, and Note are all cleaned up
  const verifyBook = await req(`/books/${bookId}`);
  assert.equal(verifyBook.status, 404);

  const verifyCh1 = await req(`/chapters/${ch1Id}`);
  assert.equal(verifyCh1.status, 404);

  const verifyWords = await req(`/chapters/${ch1Id}/words`);
  assert.deepEqual(verifyWords.body.data, []);

  const verifyNotes = await req(`/chapters/${ch1Id}/notes`);
  assert.deepEqual(verifyNotes.body.data, []);
});

test('Chapter deletion cascades to its words and notes', async () => {
  // 1. Create a Book
  const bookRes = await req('/books', {
    method: 'POST',
    body: JSON.stringify({ title: 'Cascade Chapter Book' }),
  });
  const bookId = bookRes.body.data._id;

  // 2. Create Chapter
  const chRes = await req(`/books/${bookId}/chapters`, {
    method: 'POST',
    body: JSON.stringify({ title: 'Standalone Chapter' }),
  });
  const chId = chRes.body.data._id;

  // 3. Add Word & Note
  await req(`/chapters/${chId}/words`, {
    method: 'POST',
    body: JSON.stringify({ word: 'Transient', meaning: 'Passing quickly' }),
  });
  await req(`/chapters/${chId}/notes`, {
    method: 'POST',
    body: JSON.stringify({ content: 'A fleeting note' }),
  });

  // 4. Delete only the Chapter
  const delChRes = await req(`/chapters/${chId}`, { method: 'DELETE' });
  assert.equal(delChRes.status, 204);

  // 5. Verify words and notes of chapter are deleted
  const chWords = await req(`/chapters/${chId}/words`);
  assert.deepEqual(chWords.body.data, []);

  const chNotes = await req(`/chapters/${chId}/notes`);
  assert.deepEqual(chNotes.body.data, []);

  // Cleanup book
  await req(`/books/${bookId}`, { method: 'DELETE' });
});
