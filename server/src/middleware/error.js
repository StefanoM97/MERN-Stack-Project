export function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, _req, res, _next) {
  console.error(error);

  if (error?.name === "ZodError") {
    return res.status(400).json({
      error: "Validation failed",
      details: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }))
    });
  }

  if (error?.code === 11000) {
    return res.status(409).json({ error: "A record with that unique value already exists" });
  }

  if (error?.name === "CastError") {
    return res.status(400).json({ error: "Invalid identifier" });
  }

  const status = Number(error?.status || error?.response?.status || 500);
  const message =
    status >= 500 && process.env.NODE_ENV === "production"
      ? "Internal server error"
      : error?.message || "Internal server error";

  return res.status(status).json({ error: message });
}
