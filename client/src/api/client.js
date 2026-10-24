const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request(method, path, body) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('book-reader-token') : null;
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const opts = { method, headers };
  if (body !== undefined) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);
  if (res.status === 204) return null;

  const json = await res.json();
  if (!res.ok) {
    const message = json?.error?.message || `HTTP ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.details = json?.error?.details;
    throw err;
  }
  return json.data;
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  patch: (path, body) => request('PATCH', path, body),
  delete: (path) => request('DELETE', path),
};
