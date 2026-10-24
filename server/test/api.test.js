import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5000/api';

async function req(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
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

test('Authentication and User Isolation', async () => {
  const timestamp = Date.now();
  const emailA = `readerA_${timestamp}@example.com`;
  const emailB = `readerB_${timestamp}@example.com`;
  const password = 'SecretPassword123';

  // 1. Register User A
  const regARes = await req('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name: 'Reader A', email: emailA, password }),
  });
  assert.equal(regARes.status, 201);
  assert.ok(regARes.body.data.token);
  assert.equal(regARes.body.data.user.email, emailA.toLowerCase());
  const tokenA = regARes.body.data.token;

  // 2. Duplicate registration should be 409
  const dupReg = await req('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name: 'Reader A Clone', email: emailA, password }),
  });
  assert.equal(dupReg.status, 409);

  // 3. Register User B
  const regBRes = await req('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name: 'Reader B', email: emailB, password }),
  });
  assert.equal(regBRes.status, 201);
  const tokenB = regBRes.body.data.token;

  // 4. Login User A
  const loginRes = await req('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: emailA, password }),
  });
  assert.equal(loginRes.status, 200);
  assert.ok(loginRes.body.data.token);

  // 5. Invalid login should be 401
  const badLogin = await req('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: emailA, password: 'WrongPassword!' }),
  });
  assert.equal(badLogin.status, 401);

  // 6. Profile check with Bearer token
  const meRes = await req('/auth/me', {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  assert.equal(meRes.status, 200);
  assert.equal(meRes.body.data.email, emailA.toLowerCase());

  // 7. User A creates a private book
  const bookARes = await req('/books', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}` },
    body: JSON.stringify({ title: "User A's Secret Book" }),
  });
  assert.equal(bookARes.status, 201);
  const bookAId = bookARes.body.data._id;

  // 8. User B lists books — should NOT see User A's book
  const listBRes = await req('/books', {
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  assert.equal(listBRes.status, 200);
  const userBHasBookA = listBRes.body.data.some((b) => b._id === bookAId);
  assert.equal(userBHasBookA, false);

  // 9. User A lists books — should see User A's book
  const listARes = await req('/books', {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  assert.equal(listARes.status, 200);
  const userAHasBookA = listARes.body.data.some((b) => b._id === bookAId);
  assert.equal(userAHasBookA, true);

  // Cleanup
  await req(`/books/${bookAId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokenA}` },
  });
});

