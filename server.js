import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "node:path";
import { fileURLToPath } from "node:url";

const backendDirectory = path.dirname(fileURLToPath(import.meta.url));
const siteDirectory = path.resolve(backendDirectory, "..");
const database = new Low(new JSONFile(path.join(backendDirectory, "reviews.json")), { reviews: [] });
const app = express();
const port = Number(process.env.PORT) || 3000;
const knownDestinations = new Set([
  "rugova-canyon", "mirusha-waterfalls", "gazivoda-lake", "brezovica-ski-resort", "sharri-mountains",
  "germia-park", "white-drin-waterfall", "radavc-cave", "gadime-cave", "prizren", "prishtina", "peja",
  "gjakova", "novo-brdo-fortress", "visoki-decani", "gracanica-monastery", "ulpiana",
]);

await database.read();
database.data ||= { reviews: [] };
database.data.reviews ||= [];

app.disable("x-powered-by");
app.use(express.json({ limit: "8kb" }));
app.use(express.static(siteDirectory));

app.get("/api/health", (_request, response) => response.json({ status: "ok" }));

app.get("/api/reviews", (request, response) => {
  const destinationId = String(request.query.destinationId || "");
  if (!knownDestinations.has(destinationId)) return response.status(400).json({ error: "Choose a valid destination." });
  const reviews = database.data.reviews.filter((review) => review.destinationId === destinationId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const average = reviews.length ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length : null;
  return response.json({ reviews, count: reviews.length, average });
});

app.post("/api/reviews", async (request, response, next) => {
  const destinationId = String(request.body?.destinationId || "").trim();
  const name = normalizeText(request.body?.name, 60);
  const text = normalizeText(request.body?.text, 1000);
  const rating = Number(request.body?.rating);
  if (!knownDestinations.has(destinationId)) return response.status(400).json({ error: "Choose a valid destination." });
  if (!name || name.length < 2) return response.status(400).json({ error: "Enter a name of at least 2 characters." });
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return response.status(400).json({ error: "Choose a rating from 1 to 5 stars." });
  if (!text || text.length < 10) return response.status(400).json({ error: "Write at least 10 characters for your review." });

  try {
    const review = { id: crypto.randomUUID(), destinationId, name, rating, text, createdAt: new Date().toISOString() };
    database.data.reviews.push(review);
    await database.write();
    return response.status(201).json(review);
  } catch (error) {
    return next(error);
  }
});

app.use((error, _request, response, _next) => {
  console.error("Request failed:", error.message);
  if (response.headersSent) return;
  return response.status(error.type === "entity.too.large" ? 413 : 500).json({ error: error.type === "entity.too.large" ? "Review is too large." : "The request could not be completed." });
});

app.listen(port, () => console.log(`Explore Kosovo is running at http://localhost:${port}`));

function normalizeText(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, maxLength);
}