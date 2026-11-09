import { categories, categoryLabels, destinations, getFeaturedDestinations, mapCategories } from "./destinations.js";
import { filterMapMarkers, fitKosovo, focusDestination, initializeMap, replaceNearbyMarkers, showGeocodedPlace, showNearbyPlaces } from "./map.js";
import { renderReviews } from "./reviews.js";

const featuredDestinations = getFeaturedDestinations();
const favoritesKey = "explore-kosovo-favorites";
const state = { category: "all", mapCategory: "all", query: "", favoritesOnly: false, selectedId: null, placesRequest: 0 };
let favorites = loadFavorites();
let toastTimer;

const grid = document.getElementById("destination-grid");
const panel = document.getElementById("place-panel");
const searchInput = document.getElementById("destination-search");
const searchStatus = document.getElementById("search-status");

document.getElementById("year").textContent = new Date().getFullYear();
renderCategoryFilters();
renderMapFilters();
renderDestinationCards();
updateFavoriteCount();
initializeMap(selectDestination);
selectDestination(destinations[0], { moveMap: false });
loadHeroPhoto();

document.getElementById("search-form").addEventListener("submit", searchPlaces);
searchInput.addEventListener("input", () => {
  state.query = searchInput.value.trim();
  renderDestinationCards();
  applyMapFilters();
  const matchCount = getFilteredDestinations().length;
  searchStatus.textContent = state.query ? `${matchCount} ${matchCount === 1 ? "place" : "places"} found` : `${destinations.length} places to start your journey`;
});
document.getElementById("map-reset").addEventListener("click", fitKosovo);
document.getElementById("favourites-toggle").addEventListener("click", toggleFavoritesView);
document.getElementById("menu-toggle").addEventListener("click", toggleNavigation);
document.querySelectorAll(".main-nav a").forEach((link) => link.addEventListener("click", closeNavigation));

function renderCategoryFilters() {
  const container = document.getElementById("category-filters");
  container.innerHTML = categories.map(({ id, label }) => `<button class="category-chip" type="button" data-category="${id}" aria-pressed="${id === state.category}">${label}</button>`).join("");
  container.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.category = button.dataset.category;
    syncFilterButtons();
    renderDestinationCards();
    applyMapFilters();
  });
}

function renderMapFilters() {
  document.getElementById("map-filters").innerHTML = mapCategories.map(({ id, label }) => `<button class="map-filter" type="button" data-category="${id}" aria-pressed="${id === state.mapCategory}">${label}</button>`).join("");
  document.getElementById("map-filters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.mapCategory = button.dataset.category;
    syncFilterButtons();
    applyMapFilters();
  });
}

function syncFilterButtons() {
  document.querySelectorAll("#category-filters [data-category]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.category === state.category));
  });
  document.querySelectorAll("#map-filters [data-category]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.category === state.mapCategory));
  });
}

function getFilteredDestinations() {
  const query = state.query.toLocaleLowerCase();
  return destinations.filter((destination) => {
    const matchesText = !query || `${destination.name} ${destination.area} ${destination.description} ${categoryLabels[destination.category]}`.toLocaleLowerCase().includes(query);
    const matchesCategory = state.category === "all" || destination.category === state.category;
    const matchesFavorites = !state.favoritesOnly || favorites.has(destination.id);
    return matchesText && matchesCategory && matchesFavorites;
  });
}

function renderDestinationCards() {
  const visible = getFilteredDestinations();
  const visibleIds = new Set(visible.map(({ id }) => id));
  const cards = featuredDestinations.filter(({ id }) => visibleIds.has(id));
  grid.innerHTML = cards.map((destination, index) => `
    <article class="destination-card" data-destination="${destination.id}" style="animation-delay:${index * 55}ms">
      <div class="card-image-wrap"><div class="card-image-placeholder" aria-hidden="true">${destination.icon}</div><a class="photo-credit card-photo-credit" hidden target="_blank" rel="noreferrer" aria-label="Photo credit"></a><span class="card-category">${categoryLabels[destination.category]}</span>
        <button class="save-button ${favorites.has(destination.id) ? "is-saved" : ""}" type="button" data-favorite="${destination.id}" aria-label="${favorites.has(destination.id) ? "Remove" : "Save"} ${escapeHtml(destination.name)} ${favorites.has(destination.id) ? "from" : "to"} favourites" aria-pressed="${favorites.has(destination.id)}">${favorites.has(destination.id) ? "♥" : "♡"}</button></div>
      <div class="card-content"><p class="card-location">${escapeHtml(destination.area)}</p><h3><button class="card-open" type="button">${escapeHtml(destination.name)}</button></h3><p class="card-description">${escapeHtml(destination.description)}</p></div>
    </article>`).join("");
  document.getElementById("destination-empty").hidden = cards.length > 0;
  grid.querySelectorAll(".destination-card").forEach((card) => {
    const destination = destinations.find(({ id }) => id === card.dataset.destination);
    card.querySelector(".card-open").addEventListener("click", () => {
      selectDestination(destination);
      document.getElementById("map-section").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    loadCardPhoto(destination, card);
  });
  grid.querySelectorAll("[data-favorite]").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleFavorite(button.dataset.favorite);
  }));
  if (state.favoritesOnly && visible.length === 0) document.getElementById("destination-empty").textContent = "No saved places match. Save a destination to find it here.";
  else document.getElementById("destination-empty").textContent = "No places match this search yet. Try another name or category.";
}

function applyMapFilters() {
  const visibleIds = new Set(getFilteredDestinations().map(({ id }) => id));
  filterMapMarkers({ category: state.mapCategory, destinationIds: visibleIds });
}

function selectDestination(destination, { moveMap = true } = {}) {
  if (!destination) return;
  state.selectedId = destination.id;
  const requestId = ++state.placesRequest;
  replaceNearbyMarkers([]);
  panel.innerHTML = `
    <article class="place-detail" data-selected="${destination.id}">
      <div class="detail-photo-wrap"><div class="card-image-placeholder" aria-hidden="true">${destination.icon}</div><a class="photo-credit" hidden target="_blank" rel="noreferrer"></a></div>
      <div class="detail-heading"><div class="detail-overline"><span>${categoryLabels[destination.category]}</span><button class="save-button ${favorites.has(destination.id) ? "is-saved" : ""}" type="button" data-detail-favorite aria-label="${favorites.has(destination.id) ? "Remove from" : "Add to"} favourites" aria-pressed="${favorites.has(destination.id)}">${favorites.has(destination.id) ? "♥" : "♡"}</button></div><h3>${escapeHtml(destination.name)}</h3><p class="detail-location">${escapeHtml(destination.area)} · ${destination.lat.toFixed(4)}° N, ${destination.lng.toFixed(4)}° E</p></div>
      <p class="detail-copy">${escapeHtml(destination.description)}</p>
      <div class="detail-actions"><a class="button-primary" href="https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}" target="_blank" rel="noreferrer">Get directions <span aria-hidden="true">↗</span></a><a class="button-secondary more-photos" href="https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=${encodeURIComponent(`${destination.name} Kosovo`)}" target="_blank" rel="noreferrer">More photos <span aria-hidden="true">↗</span></a></div>
      <div class="detail-rating"><span class="rating-stars">☆☆☆☆☆</span><span>Not rated yet</span></div>
      <section class="nearby-section"><div class="panel-section-heading"><h4>Eat & drink nearby</h4><span>OpenStreetMap data</span></div><div class="nearby-list" aria-live="polite"><div class="nearby-status"><span class="loading-spinner"></span> Finding nearby places…</div></div></section>
      <section class="reviews-section" aria-label="Visitor reviews"></section>
    </article>`;
  panel.querySelector("[data-detail-favorite]").addEventListener("click", () => toggleFavorite(destination.id));
  if (destination.photo) displayDetailPhoto(destination, destination.photo);
  if (moveMap) focusDestination(destination);
  loadNearbyPlaces(destination, requestId);
  loadDestinationPhoto(destination, requestId);
  renderReviews(destination);
}

async function loadNearbyPlaces(destination, requestId) {
  const area = panel.querySelector(".nearby-list");
  if (!area) return;
  try {
    const places = await showNearbyPlaces(destination.lat, destination.lng, { isCurrent: () => requestId === state.placesRequest && panel.contains(area) });
    if (requestId !== state.placesRequest || !panel.contains(area)) return;
    renderNearbyPlaces(area, places, destination);
  } catch {
    if (requestId !== state.placesRequest || !panel.contains(area)) return;
    area.innerHTML = `<p class="nearby-empty">Nearby listings are unavailable right now. Try again later; places are supplied by OpenStreetMap contributors.</p>`;
  }
}

function renderNearbyPlaces(container, places, destination) {
  if (!places.length) {
    container.innerHTML = `<p class="nearby-empty">No named cafés or restaurants were found within 8 km in OpenStreetMap data.</p>`;
    return;
  }
  container.innerHTML = places.map((place) => {
    const hours = place.tags.opening_hours ? `<span>Hours: ${escapeHtml(place.tags.opening_hours)}</span>` : "";
    const address = [place.tags["addr:street"], place.tags["addr:housenumber"], place.tags["addr:city"]].filter(Boolean).join(" ") || `${place.lat.toFixed(4)}° N, ${place.lng.toFixed(4)}° E`;
    const stars = place.tags.stars ? `<span>OSM classification: ${escapeHtml(place.tags.stars)} stars</span>` : "<span>Customer ratings and reviews are not listed in OpenStreetMap.</span>";
    const photoUrl = getVenuePhotoUrl(place.tags);
    const photo = photoUrl ? `<img class="nearby-photo" src="${escapeHtml(photoUrl)}" alt="" loading="lazy" onerror="this.hidden=true">` : "";
    return `<article class="nearby-item" tabindex="0" role="button" aria-expanded="false" data-place="${escapeHtml(place.id)}"><div class="nearby-main">${photo}<div class="nearby-copy"><p class="nearby-name">${escapeHtml(place.name)}</p><span class="nearby-meta">${place.kind} · ${place.distance < 1 ? `${Math.round(place.distance * 1000)} m` : `${place.distance.toFixed(1)} km`}</span></div><span class="nearby-icon" aria-hidden="true">${place.kind === "Café" ? "◷" : "⌂"}</span></div>
      <div class="nearby-extra"><span>${escapeHtml(address)}</span>${hours ? `<br>${hours}` : ""}<br>${stars}<br><a href="https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}" target="_blank" rel="noreferrer">Directions ↗</a></div></article>`;
  }).join("");
  container.querySelectorAll(".nearby-item").forEach((item) => {
    const toggle = () => {
      const expanded = item.classList.toggle("is-expanded");
      item.setAttribute("aria-expanded", String(expanded));
    };
    item.addEventListener("click", (event) => { if (!event.target.closest("a")) toggle(); });
    item.addEventListener("keydown", (event) => { if ((event.key === "Enter" || event.key === " ") && !event.target.closest("a")) { event.preventDefault(); toggle(); } });
  });
}

async function loadDestinationPhoto(destination, requestId) {
  let photo;
  try {
    photo = await getCommonsPhoto(`${destination.name} Kosovo`) || destination.photo;
  } catch { photo = null; }
  if (requestId !== state.placesRequest || state.selectedId !== destination.id) return;
  if (photo) displayDetailPhoto(destination, photo);
}

const photoCache = new Map();
async function getCommonsPhoto(searchQuery) {
  if (!photoCache.has(searchQuery)) {
    const request = (async () => {
      const params = new URLSearchParams({ action: "query", generator: "search", gsrsearch: searchQuery, gsrnamespace: "6", gsrlimit: "1", prop: "imageinfo", iiprop: "url|extmetadata", iiurlwidth: "1200", format: "json", origin: "*" });
      const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, { signal: AbortSignal.timeout(9000) });
      if (!response.ok) throw new Error("Photo search unavailable");
      const data = await response.json();
      const page = Object.values(data.query?.pages || {})[0];
      const image = page?.imageinfo?.[0];
      return image ? { url: image.thumburl || image.url, page: image.descriptionurl, artist: image.extmetadata?.Artist?.value || "Wikimedia Commons contributors", license: image.extmetadata?.LicenseShortName?.value || "Wikimedia Commons" } : null;
    })();
    photoCache.set(searchQuery, request);
  }
  try { return await photoCache.get(searchQuery); }
  catch { photoCache.delete(searchQuery); return null; }
}

async function loadCardPhoto(destination, card) {
  if (destination.photo) displayCardPhoto(destination, card, destination.photo);
  const photo = await getCommonsPhoto(`${destination.name} Kosovo`);
  if (photo) displayCardPhoto(destination, card, photo);
}

function displayCardPhoto(destination, card, photo) {
  if (!card.isConnected || card.dataset.photoPage === photo.page) return;
  card.dataset.photoPage = photo.page;
  let image = card.querySelector(".card-image");
  if (!image) {
    image = document.createElement("img");
    image.className = "card-image";
    image.alt = `${destination.name}, Kosovo`;
    image.loading = "lazy";
    image.addEventListener("load", () => card.querySelector(".card-image-placeholder")?.remove(), { once: true });
    image.addEventListener("error", () => { card.dataset.photoPage = ""; image.remove(); }, { once: true });
    card.querySelector(".card-image-wrap").prepend(image);
  }
  image.src = photo.url;
  const credit = card.querySelector(".card-photo-credit");
  credit.textContent = `Photo: ${stripHtml(photo.artist)} · ${stripHtml(photo.license)}`;
  credit.href = photo.page;
  credit.hidden = false;
}

function displayDetailPhoto(destination, photo) {
  const photoWrap = panel.querySelector(".detail-photo-wrap");
  if (!photoWrap || photoWrap.dataset.photoPage === photo.page) return;
  photoWrap.dataset.photoPage = photo.page;
  let image = photoWrap.querySelector(".detail-photo");
  if (!image) {
    image = document.createElement("img");
    image.className = "detail-photo";
    image.alt = `${destination.name}, Kosovo`;
    image.loading = "lazy";
    image.addEventListener("error", () => { photoWrap.dataset.photoPage = ""; image.remove(); }, { once: true });
    photoWrap.prepend(image);
  }
  image.src = photo.url;
  const credit = photoWrap.querySelector(".photo-credit");
  credit.textContent = `Photo: ${stripHtml(photo.artist)} · ${stripHtml(photo.license)}`;
  credit.href = photo.page;
  credit.hidden = false;
}

async function loadHeroPhoto() {
  try {
    const fallback = destinations.find(({ id }) => id === "rugova-canyon").photo;
    const hero = document.getElementById("hero-image");
    const credit = document.getElementById("hero-credit");
    if (fallback) {
      hero.style.backgroundImage = `url("${fallback.url}")`;
      credit.textContent = `Photo: ${fallback.artist} · ${fallback.license}`;
      credit.href = fallback.page;
      credit.hidden = false;
    }
    const photo = await getCommonsPhoto("Rugova Canyon Kosovo landscape");
    if (!photo) return;
    hero.style.backgroundImage = `url("${photo.url}")`;
    credit.textContent = `Photo: ${stripHtml(photo.artist)} · ${stripHtml(photo.license)}`;
    credit.href = photo.page;
    credit.hidden = false;
  } catch { /* The styled fallback remains in place when Commons is unavailable. */ }
}

async function searchPlaces(event) {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (!query) { searchInput.focus(); return; }
  state.query = query;
  state.favoritesOnly = false;
  document.getElementById("favourites-toggle").classList.remove("is-active");
  renderDestinationCards();
  applyMapFilters();
  const match = getFilteredDestinations().find((destination) => destination.name.toLocaleLowerCase() === query.toLocaleLowerCase()) || getFilteredDestinations()[0];
  if (match) {
    selectDestination(match);
    searchStatus.textContent = `Showing ${match.name}`;
    document.getElementById("map-section").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  searchStatus.textContent = "Searching OpenStreetMap…";
  try {
    const params = new URLSearchParams({ q: `${query}, Kosovo`, format: "jsonv2", limit: "1", countrycodes: "xk", viewbox: "19.5,43.5,22.2,41.5", bounded: "1" });
    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, { headers: { "Accept-Language": "en" }, signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error("Search is temporarily unavailable.");
    const [place] = await response.json();
    if (!place || !showGeocodedPlace(place)) throw new Error("No matching place found in Kosovo. Try a destination name instead.");
    searchStatus.textContent = `OpenStreetMap result: ${place.display_name.split(",").slice(0, 2).join(",")}`;
    document.getElementById("map-section").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    searchStatus.textContent = error.message === "Failed to fetch" ? "Search is unavailable. Check your connection and try again." : error.message;
  }
}

function toggleFavorite(id) {
  if (favorites.has(id)) favorites.delete(id);
  else favorites.add(id);
  try { localStorage.setItem(favoritesKey, JSON.stringify([...favorites])); } catch { showToast("Favourites can’t be saved in this browser session."); }
  updateFavoriteCount();
  renderDestinationCards();
  const detailButton = panel.querySelector("[data-detail-favorite]");
  if (detailButton && state.selectedId === id) {
    detailButton.classList.toggle("is-saved", favorites.has(id));
    detailButton.setAttribute("aria-pressed", String(favorites.has(id)));
    detailButton.setAttribute("aria-label", `${favorites.has(id) ? "Remove from" : "Add to"} favourites`);
    detailButton.textContent = favorites.has(id) ? "♥" : "♡";
  }
  applyMapFilters();
  if (state.favoritesOnly) renderDestinationCards();
}

function toggleFavoritesView() {
  state.favoritesOnly = !state.favoritesOnly;
  const button = document.getElementById("favourites-toggle");
  button.classList.toggle("is-active", state.favoritesOnly);
  button.setAttribute("aria-pressed", String(state.favoritesOnly));
  if (state.favoritesOnly) {
    state.category = "all";
    syncFilterButtons();
    showToast(favorites.size ? `Showing ${favorites.size} saved ${favorites.size === 1 ? "place" : "places"}.` : "No saved places yet. Tap the heart on a destination to save it.");
  }
  renderDestinationCards();
  applyMapFilters();
  document.getElementById("destinations").scrollIntoView({ behavior: "smooth", block: "start" });
}

function updateFavoriteCount() { document.getElementById("favourite-count").textContent = favorites.size; }
function loadFavorites() {
  try { return new Set(JSON.parse(localStorage.getItem(favoritesKey) || "[]").filter((id) => destinations.some((destination) => destination.id === id))); }
  catch { return new Set(); }
}
function toggleNavigation() {
  const button = document.getElementById("menu-toggle");
  const expanded = button.getAttribute("aria-expanded") !== "true";
  button.setAttribute("aria-expanded", String(expanded));
  button.setAttribute("aria-label", expanded ? "Close navigation" : "Open navigation");
  document.getElementById("main-nav").classList.toggle("is-open", expanded);
}
function closeNavigation() {
  document.getElementById("menu-toggle").setAttribute("aria-expanded", "false");
  document.getElementById("menu-toggle").setAttribute("aria-label", "Open navigation");
  document.getElementById("main-nav").classList.remove("is-open");
}
function showToast(message) {
  document.querySelector(".toast")?.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.textContent = message;
  document.body.append(toast);
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.remove(), 3400);
}
function getVenuePhotoUrl(tags) {
  if (tags.image) {
    try {
      const imageUrl = new URL(tags.image);
      if (imageUrl.protocol === "https:") return imageUrl.href;
    } catch { /* Ignore malformed image tags. */ }
  }
  if (tags.wikimedia_commons?.startsWith("File:")) {
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(tags.wikimedia_commons.slice(5))}`;
  }
  return null;
}
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]); }
function stripHtml(value) { const element = document.createElement("span"); element.innerHTML = value || ""; return element.textContent.trim(); }