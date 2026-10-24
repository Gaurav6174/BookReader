export function notFound(req, res) {
  res.status(404).json({ error: { message: `Route ${req.method} ${req.path} not found.` } });
}
