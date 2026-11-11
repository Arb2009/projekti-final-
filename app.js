import { categories, categoryLabels, destinations, getActivityIdeas, getDestinationDescription, getFeaturedDestinations, mapCategories } from "./destinations.js";
import { filterMapMarkers, fitKosovo, focusDestination, initializeMap, replaceNearbyMarkers, showGeocodedPlace } from "./map.js";
import { renderReviews } from "./reviews.js";

const featuredDestinations = getFeaturedDestinations();
const favoritesKey = "explore-kosovo-favorites";
const state = { category: "all", mapCategory: "all", query: "", favoritesOnly: false, selectedId: null, placesRequest: 0, language: "en" };
let favorites = loadFavorites();
let toastTimer;
const photoCache = new Map();

const translations = {
  en: {
    "nav.destinations": "Destinations",
    "nav.map": "Explore the map",
    "nav.about": "About Kosovo",
    "nav.saved": "Saved",
    "hero.eyebrow": "The heart of the Balkans",
    "hero.title": "Discover Kosovo",
    "hero.titleAccent": "– A Hidden Gem of Europe",
    "hero.copy": "Wild mountain mornings, centuries-old streets, and the kind of welcome that stays with you.",
    "search.label": "Search places in Kosovo",
    "search.placeholder": "Try “Prizren” or “waterfalls”",
    "search.button": "Explore",
    "search.status": "17 places to start your journey",
    "surprise.button": "Surprise me",
    "about.eyebrow": "Nature and culture in one place",
    "about.text": "Kosovo blends dramatic mountain landscapes, alpine lakes, deep valleys, and a rich cultural heritage shaped by Ottoman, Balkan, and European influences.",
    "about.link": "Find your way around",
    "destinations.eyebrow": "A good place to begin",
    "destinations.heading": "Places that stay with you",
    "destinations.link": "All destinations",
    "map.eyebrow": "Your next detour",
    "map.heading": "Get to know the place",
    "map.text": "From the high peaks to the lively old towns. Pick a pin, find what’s nearby, and make it your own.",
    "map.filterLabel": "Show me",
    "closing.eyebrow": "Go a little further",
    "closing.heading": "Take the scenic route home.",
    "closing.link": "Find your next stop",
    "footer.note": "Kosovo is in the Balkans; Prishtina is its capital.",
    "footer.made": "Made for curious travellers",
    "search.status.found": "{count} places found",
    "search.status.empty": "No places match this search yet. Try another name or category.",
    "detail.getDirections": "Get directions",
    "detail.morePhotos": "More photos",
    "detail.notRated": "Not rated yet",
    "detail.favoriteAdd": "Add to favourites",
    "detail.favoriteRemove": "Remove from favourites",
    "selected.activityHeading": "What to do here",
    "random.result": "Picked a surprise destination for you",
  },
  sq: {
    "nav.destinations": "Destinacione",
    "nav.map": "Eksploroni hartën",
    "nav.about": "Rreth Kosovës",
    "nav.saved": "Të ruajtura",
    "hero.eyebrow": "Qendra e Ballkanit",
    "hero.title": "Zbuloni Kosovën",
    "hero.titleAccent": "– Një thesar i fshehur në Evropë",
    "hero.copy": "Mëngjeset e larta malore, rrugët e vjetra, dhe mikpritja që mbetet me ju.",
    "search.label": "Kërkoni vende në Kosovë",
    "search.placeholder": "Provojeni “Prizrenin” ose “ujëvarat”",
    "search.button": "Eksploro",
    "search.status": "17 vende për të nisur udhëtimin tuaj",
    "surprise.button": "Çudi mua",
    "about.eyebrow": "Natyra dhe kultura në një vend",
    "about.text": "Kosova kombinon peizazhe dramatike malore, liqene alpine, lugina të thella dhe trashëgimi të pasur kulturore të formuar nga ndikimet osmane, ballkanike dhe evropiane.",
    "about.link": "Gjeni rrugën tuaj",
    "destinations.eyebrow": "Një fillim i mirë",
    "destinations.heading": "Vende që ju mbajnë mend",
    "destinations.link": "Të gjitha destinacionet",
    "map.eyebrow": "Udhëtimi juaj i radhës",
    "map.heading": "Njihuni me vendin",
    "map.text": "Nga majat e larta te qytetet e gjalla. Zgjidhni një pikë dhe bëjeni të tuajën.",
    "map.filterLabel": "Më trego",
    "closing.eyebrow": "Shko një pak më tej",
    "closing.heading": "Shko me rrugën skenike drejt shtëpisë.",
    "closing.link": "Gjejni ndalesën tuaj të radhës",
    "footer.note": "Kosova ndodhet në Ballkan; Prishtina është kryeqyteti.",
    "footer.made": "U bë për udhëtarët kurioz",
    "search.status.found": "{count} vende u gjetën",
    "search.status.empty": "Asnjë vend nuk përputhet me këtë kërkim. Provoni një emër tjetër.",
    "detail.getDirections": "Merr drejtimet",
    "detail.morePhotos": "Më shumë foto",
    "detail.notRated": "Ende nuk ka vlerësim",
    "detail.favoriteAdd": "Shto te të ruajturat",
    "detail.favoriteRemove": "Hiq nga të ruajturat",
    "selected.activityHeading": "Çfarë mund të bëni këtu",
    "random.result": "Zgjodhëm një vend të çuditshëm për ju",
  },
  sr: {
    "nav.destinations": "Destinacije",
    "nav.map": "Istražite mapu",
    "nav.about": "O Kosovu",
    "nav.saved": "Sačuvano",
    "hero.eyebrow": "Srce Balkana",
    "hero.title": "Otkrijte Kosovo",
    "hero.titleAccent": "– Skriveni dragulj Evrope",
    "hero.copy": "Planinski jutarnji pogledi, vekovne ulice i gostoprimstvo koje ostaje u sećanju.",
    "search.label": "Pretražite mesta u Kosovu",
    "search.placeholder": "Probajte “Prizren” ili “vodopadi”",
    "search.button": "Istraži",
    "search.status": "17 mesta za početak putovanja",
    "surprise.button": "Iznenadi me",
    "about.eyebrow": "Priroda i kultura na jednom mestu",
    "about.text": "Kosovo spaja dramatične planinske pejzaže, alpske jezera, duboke doline i bogato kulturno nasleđe oblikovano osmanskim, balkanskim i evropskim uticajima.",
    "about.link": "Pronađite svoj put",
    "destinations.eyebrow": "Dobar početak",
    "destinations.heading": "Mesta koja ostaju s vama",
    "destinations.link": "Sve destinacije",
    "map.eyebrow": "Vaša sledeća avantura",
    "map.heading": "Upoznajte mesto",
    "map.text": "Od visokih vrhova do živih starih gradova. Izaberite oznaku i napravite ga svojim.",
    "map.filterLabel": "Pokaži mi",
    "closing.eyebrow": "Idi malo dalje",
    "closing.heading": "Vratite se kući scenom kroz put.",
    "closing.link": "Pronađite sledeću stanicu",
    "footer.note": "Kosovo je u Balkanu; Priština je glavni grad.",
    "footer.made": "Napravljen za radoznale putnike",
    "search.status.found": "{count} mesta je pronađeno",
    "search.status.empty": "Nijedno mesto ne odgovara ovoj pretrazi. Probajte drugi naziv.",
    "detail.getDirections": "Uputstva za put",
    "detail.morePhotos": "Više fotografija",
    "detail.notRated": "Još nije ocenjeno",
    "detail.favoriteAdd": "Dodaj u omiljene",
    "detail.favoriteRemove": "Ukloni iz omiljenih",
    "selected.activityHeading": "Šta možete raditi ovde",
    "random.result": "Izabrali smo vam iznenađujuću destinaciju",
  }
};

function t(key, fallback = "") {
  return translations[state.language]?.[key] || translations.en[key] || fallback;
}

function setLanguage(language) {
  state.language = language;
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    const value = translations[language]?.[key] || translations.en[key] || element.textContent;
    element.textContent = value;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    element.placeholder = translations[language]?.[key] || translations.en[key] || element.placeholder;
  });
  document.querySelectorAll(".language-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lang === language);
  });
  renderDestinationCards();
  applyMapFilters();
  updateSearchStatus();
  if (state.selectedId) {
    const selected = destinations.find(({ id }) => id === state.selectedId);
    if (selected) selectDestination(selected, { moveMap: false });
  }
}

function updateSearchStatus() {
  const count = getFilteredDestinations().length;
  const text = state.query
    ? count
      ? translations[state.language]["search.status.found"].replace("{count}", count)
      : translations[state.language]["search.status.empty"]
    : translations[state.language]["search.status"];
  searchStatus.textContent = text;
}

function pickRandomDestination() {
  const pool = destinations.filter(({ id }) => id !== state.selectedId);
  const chosen = pool[Math.floor(Math.random() * pool.length)] || destinations[0];
  selectDestination(chosen);
  document.getElementById("map-section").scrollIntoView({ behavior: "smooth", block: "start" });
  showToast(translations[state.language]["random.result"] || translations.en["random.result"]);
}

function showToast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.remove(), 2200);
}

const grid = document.getElementById("destination-grid");
const panel = document.getElementById("place-panel");
const searchInput = document.getElementById("destination-search");
const searchStatus = document.getElementById("search-status");

document.getElementById("year").textContent = new Date().getFullYear();
renderCategoryFilters();
renderMapFilters();
setLanguage(state.language);
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
  updateSearchStatus();
});
document.getElementById("map-reset").addEventListener("click", fitKosovo);
document.getElementById("favourites-toggle").addEventListener("click", toggleFavoritesView);
document.getElementById("menu-toggle").addEventListener("click", toggleNavigation);
document.getElementById("surprise-button").addEventListener("click", pickRandomDestination);
document.querySelectorAll(".language-button").forEach((button) => button.addEventListener("click", () => setLanguage(button.dataset.lang)));
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

function getGoogleMapsDirectionsLink(name, lat, lng) {
  const destination = name ? `${name}, Kosovo` : `${lat}, ${lng}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
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
      <div class="card-image-wrap"><div class="card-image-placeholder" aria-hidden="true"></div><a class="photo-credit card-photo-credit" hidden target="_blank" rel="noreferrer" aria-label="Photo credit"></a><span class="card-category">${categoryLabels[destination.category]}</span>
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
  const emptyMessage = translations[state.language]["search.status.empty"] || "No places match this search yet. Try another name or category.";
  document.getElementById("destination-empty").textContent = state.favoritesOnly && visible.length === 0 ? "No saved places match. Save a destination to find it here." : emptyMessage;
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
  const activities = getActivityIdeas(destination).map((activity) => `<li>${escapeHtml(activity)}</li>`).join("");
  panel.innerHTML = `
    <article class="place-detail" data-selected="${destination.id}">
      <div class="detail-photo-wrap"><div class="card-image-placeholder" aria-hidden="true"></div><a class="photo-credit" hidden target="_blank" rel="noreferrer"></a></div>
      <div class="detail-heading"><div class="detail-overline"><span>${categoryLabels[destination.category]}</span><button class="save-button ${favorites.has(destination.id) ? "is-saved" : ""}" type="button" data-detail-favorite aria-label="${favorites.has(destination.id) ? t("detail.favoriteRemove") : t("detail.favoriteAdd")}" aria-pressed="${favorites.has(destination.id)}">${favorites.has(destination.id) ? "♥" : "♡"}</button></div><h3>${escapeHtml(destination.name)}</h3><p class="detail-location">${escapeHtml(destination.area)} · ${destination.lat.toFixed(4)}° N, ${destination.lng.toFixed(4)}° E</p></div>
      <p class="detail-copy">${escapeHtml(getDestinationDescription(destination, state.language))}</p>
      <div class="detail-activities"><h4>${translations[state.language]["selected.activityHeading"] || "What to do here"}</h4><ul>${activities}</ul></div>
      <div class="detail-actions"><a class="button-primary" href="${getGoogleMapsDirectionsLink(destination.name, destination.lat, destination.lng)}" target="_blank" rel="noreferrer">${t("detail.getDirections")} <span aria-hidden="true">↗</span></a><a class="button-secondary more-photos" href="https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=${encodeURIComponent(`${destination.name} Kosovo`)}" target="_blank" rel="noreferrer">${t("detail.morePhotos")} <span aria-hidden="true">↗</span></a></div>
      <div class="detail-rating"><span class="rating-stars">☆☆☆☆☆</span><span>${t("detail.notRated")}</span></div>
      <section class="reviews-section" aria-label="Visitor reviews"></section>
    </article>`;
  panel.querySelector("[data-detail-favorite]").addEventListener("click", () => toggleFavorite(destination.id));
  if (destination.photo) displayDetailPhoto(destination, destination.photo);
  if (moveMap) focusDestination(destination);
  loadDestinationPhoto(destination, requestId);
  renderReviews(destination);
  updateSearchStatus();
}

async function loadDestinationPhoto(destination, requestId) {
  let photo;
  try {
    photo = await getCommonsPhoto(`${destination.name} Kosovo`) || destination.photo;
  } catch { photo = null; }
  if (requestId !== state.placesRequest || state.selectedId !== destination.id) return;
  if (photo) displayDetailPhoto(destination, photo);
}

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