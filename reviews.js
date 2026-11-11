import { manualReviews } from "../data/manual-reviews.js";

const reviewsContainer = document.getElementById("place-panel");
const reviewCache = new Map();
let requestVersion = 0;
const demonstrationReviews = {
  "rugova-canyon": [
    { rating: 5, text: "Fictional sample: the canyon viewpoints make a memorable stop on a mountain drive." },
    { rating: 4, text: "Fictional sample: allow extra time for the scenery, and check local road conditions before setting out." },
  ],
  "prizren": [
    { rating: 5, text: "Fictional sample: the old streets and riverside are lovely to explore on foot." },
  ],
  "mirusha-waterfalls": [
    { rating: 5, text: "Fictional sample: wear shoes suited to uneven paths and check access after wet weather." },
  ],
};

function getLocalSubmittedReviews(destinationId) {
  try {
    const raw = localStorage.getItem("kosovo-user-reviews");
    const all = raw ? JSON.parse(raw) : {};
    return Array.isArray(all[destinationId]) ? all[destinationId] : [];
  } catch {
    return [];
  }
}

function saveLocalSubmittedReviews(destinationId, reviews) {
  try {
    const raw = localStorage.getItem("kosovo-user-reviews");
    const all = raw ? JSON.parse(raw) : {};
    all[destinationId] = reviews;
    localStorage.setItem("kosovo-user-reviews", JSON.stringify(all));
  } catch {
    // Ignore storage errors and keep the in-page review rendering working.
  }
}

function addLocalSubmittedReview(destinationId, review) {
  const reviews = getLocalSubmittedReviews(destinationId);
  reviews.unshift({
    ...review,
    createdAt: review.createdAt || new Date().toISOString(),
    localOnly: true,
  });
  saveLocalSubmittedReviews(destinationId, reviews);
}

export async function renderReviews(destination) {
  const version = ++requestVersion;
  const section = reviewsContainer.querySelector(".reviews-section");
  if (!section) return;
  section.innerHTML = `<div class="panel-section-heading"><h4>Visitor reviews</h4><span class="review-average">Loading…</span></div><p class="review-notice">Reviews are submitted by visitors and are not independently verified.</p>`;
  try {
    const result = await getReviews(destination.id);
    if (version !== requestVersion || !reviewsContainer.querySelector(".reviews-section")) return;
    section.innerHTML = renderReviewList(result, destination, manualReviews);
    attachReviewForm(section, destination);
  } catch {
    if (version !== requestVersion || !reviewsContainer.querySelector(".reviews-section")) return;
    const localReviews = getLocalSubmittedReviews(destination.id);
    const fallbackData = {
      reviews: [],
      count: localReviews.length,
      average: localReviews.length ? localReviews.reduce((sum, review) => sum + Number(review.rating), 0) / localReviews.length : 0,
    };
    section.innerHTML = renderReviewList(fallbackData, destination, manualReviews);
    attachReviewForm(section, destination);
  }
}

async function getReviews(destinationId, force = false) {
  if (!force && reviewCache.has(destinationId)) return reviewCache.get(destinationId);
  const response = await fetch(`/api/reviews?destinationId=${encodeURIComponent(destinationId)}`);
  if (!response.ok) throw new Error("Review service unavailable");
  const data = await response.json();
  reviewCache.set(destinationId, data);
  return data;
}

function renderUserReviewSection(destination) {
  const reviews = getLocalSubmittedReviews(destination.id);
  if (!reviews.length) return "";
  const items = reviews.map((review) => `
    <article class="review-item user-review-item">
      <div class="review-topline"><span class="review-author">${escapeHtml(review.name)}</span><span class="demo-review-badge">MY REVIEW</span><time class="review-date" datetime="${escapeHtml(review.createdAt)}">${formatDate(review.createdAt)}</time></div>
      <span class="rating-stars" aria-label="${review.rating} out of 5 stars">${starText(review.rating)}</span>
      <p>${escapeHtml(review.text)}</p>
    </article>`).join("");
  return `<section class="user-review-section" aria-label="Your submitted reviews">
    <div class="panel-section-heading"><h4>Your review</h4><span>${reviews.length} ${reviews.length === 1 ? "entry" : "entries"}</span></div>
    <div class="reviews-list">${items}</div>
  </section>`;
}

function renderReviewList(data, destination, manualReviews) {
  const backendReviews = Array.isArray(data.reviews) ? data.reviews : [];
  const localReviews = getLocalSubmittedReviews(destination.id);
  const allReviews = [...localReviews, ...backendReviews];
  const averageValue = allReviews.length ? allReviews.reduce((sum, review) => sum + Number(review.rating), 0) / allReviews.length : 0;
  const average = allReviews.length ? `${Number(averageValue).toFixed(1)} <span class="rating-stars">${starText(Math.round(averageValue))}</span> <span>(${allReviews.length})</span>` : "Not rated yet";
  const items = backendReviews.map((review) => `
    <article class="review-item">
      <div class="review-topline"><span class="review-author">${escapeHtml(review.name)}</span><time class="review-date" datetime="${escapeHtml(review.createdAt)}">${formatDate(review.createdAt)}</time></div>
      <span class="rating-stars" aria-label="${review.rating} out of 5 stars">${starText(review.rating)}</span>
      <p>${escapeHtml(review.text)}</p>
    </article>`).join("");
  return `<div class="panel-section-heading"><h4>Visitor reviews</h4><span class="review-average">${average}</span></div>
    <p class="review-notice">Reviews are submitted by visitors and are not independently verified.</p>
    <div class="reviews-list">${items}</div>
    ${renderUserReviewSection(destination)}
    ${renderManualReviews(destination, manualReviews)}
    <div class="review-form-mount"></div>`;
}

function renderManualReviews(destination, reviews) {
  const entries = reviews.filter((review) => review.destinationId === destination.id)
    .filter((review) => typeof review.name === "string" && typeof review.text === "string" && Number.isInteger(review.rating) && review.rating >= 1 && review.rating <= 5 && safeExternalUrl(review.sourceUrl));
  if (!entries.length) return "";
  const items = entries.map((review) => {
    const sourceUrl = safeExternalUrl(review.sourceUrl);
    const date = review.date ? `<time class="review-date" datetime="${escapeHtml(review.date)}">${formatDate(review.date)}</time>` : "";
    return `<article class="review-item manual-review-item">
      <div class="review-topline"><span class="review-author">${escapeHtml(review.name)}</span><span class="manual-review-badge">MANUALLY ADDED</span>${date}</div>
      <span class="rating-stars" aria-label="${review.rating} out of 5 stars">${starText(review.rating)}</span>
      <p>${escapeHtml(review.text)}</p>
      <a class="manual-review-source" href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">Source: ${escapeHtml(review.source || "External review")} ↗</a>
    </article>`;
  }).join("");
  return `<section class="manual-review-section" aria-label="Manually added source-linked reviews">
    <div class="panel-section-heading"><h4>Manually added reviews</h4><span>${entries.length} ${entries.length === 1 ? "entry" : "entries"}</span></div>
    <p class="manual-review-disclaimer">Source-linked entries added by the site owner; not included in visitor ratings.</p>
    <div class="reviews-list">${items}</div>
  </section>`;
}

function attachReviewForm(section, destination) {
  const mount = section.querySelector(".review-form-mount");
  if (!mount) return;
  mount.innerHTML = `<form class="review-form">
    <label for="review-name">Your name</label><input id="review-name" name="name" type="text" maxlength="60" required autocomplete="name" placeholder="e.g. Alex">
    <fieldset style="margin:0;padding:0;border:0"><legend class="visually-hidden">Your rating</legend><div class="star-picker" role="radiogroup" aria-label="Choose a rating from 1 to 5 stars">
      ${[5, 4, 3, 2, 1].map((rating) => `<input id="rating-${rating}" name="rating" type="radio" value="${rating}" required><label for="rating-${rating}" title="${rating} out of 5 stars" aria-label="${rating} out of 5 stars">★</label>`).join("")}
    </div></fieldset>
    <label for="review-text">Your review</label><textarea id="review-text" name="text" maxlength="1000" required placeholder="What should another traveller know?"></textarea>
    <p class="review-notice">Your review will be publicly visible.</p><p class="review-error" role="alert" hidden></p>
    <button class="button-primary" type="submit">Submit review <span aria-hidden="true">↗</span></button>
  </form>`;
  mount.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const submit = form.querySelector("button[type='submit']");
    const error = form.querySelector(".review-error");
    const data = new FormData(form);
    submit.disabled = true;
    submit.textContent = "Submitting…";
    error.hidden = true;
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinationId: destination.id, name: data.get("name"), rating: Number(data.get("rating")), text: data.get("text") }),
      });
      let result = {};
      try { result = await response.json(); } catch { /* A missing API can return an HTML error page. */ }
      if (!response.ok) throw new Error(result.error || "The review service is unavailable. Please try again later.");
      form.reset();
      reviewCache.delete(destination.id);
      await renderReviews(destination);
    } catch (submissionError) {
      const submittedReview = {
        name: data.get("name") || "You",
        rating: Number(data.get("rating")) || 5,
        text: String(data.get("text") || ""),
        createdAt: new Date().toISOString(),
      };
      if (submittedReview.text.trim()) {
        addLocalSubmittedReview(destination.id, submittedReview);
        await renderReviews(destination);
      }
      error.textContent = submissionError.message === "Failed to fetch" ? "The review service is unavailable, but your review has been saved locally for this browser." : submissionError.message;
      error.hidden = false;
      submit.disabled = false;
      submit.innerHTML = 'Submit review <span aria-hidden="true">↗</span>';
    }
  });
}

function starText(rating) { return `${"★".repeat(Math.min(5, Math.max(0, Math.round(rating)) ))}${"☆".repeat(Math.max(0, 5 - Math.round(rating)))}`; }
function safeExternalUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch { return null; }
}
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]); }
function formatDate(value) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "numeric" }).format(date); }