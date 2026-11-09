import { destinations } from "./destinations.js";

const kosovoBounds = L.latLngBounds([41.85, 19.95], [43.25, 21.9]);
const markers = new Map();
let nearbyMarkers = [];
let map;
let onSelectDestination;
let searchMarker;
let activeCategory = "all";
let activeDestinationIds = null;

export function initializeMap(onSelect) {
  onSelectDestination = onSelect;
  map = L.map("map", { scrollWheelZoom: false, zoomControl: true, minZoom: 7, maxZoom: 17 });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
  }).addTo(map);
  map.fitBounds(kosovoBounds, { padding: [12, 12] });
  map.on("focus", () => map.scrollWheelZoom.enable());
  map.on("blur", () => map.scrollWheelZoom.disable());
  buildMarkers();
  window.setTimeout(() => {
    map.invalidateSize();
    document.getElementById("map-loading").classList.add("is-hidden");
  }, 350);
  return map;
}

function buildMarkers() {
  for (const destination of destinations) {
    const icon = L.divIcon({
      className: "",
      html: `<span class="destination-marker marker-${destination.category}" aria-label="${destination.name}"><span>${destination.icon}</span></span>`,
      iconSize: [30, 36],
      iconAnchor: [15, 34],
    });
    const marker = L.marker([destination.lat, destination.lng], { icon, title: destination.name, alt: destination.name });
    marker.on("click", () => onSelectDestination(destination, { moveMap: false }));
    marker.bindTooltip(destination.name, { direction: "top", offset: [0, -27] });
    markers.set(destination.id, marker);
    marker.addTo(map);
  }
}

export function filterMapMarkers({ category = "all", destinationIds = null } = {}) {
  activeCategory = category;
  activeDestinationIds = destinationIds;
  for (const [id, marker] of markers) {
    const destination = destinations.find((place) => place.id === id);
    const visible = (activeCategory === "all" || destination.category === activeCategory)
      && (!activeDestinationIds || activeDestinationIds.has(id));
    setMarkerVisibility(marker, visible);
  }
  nearbyMarkers.forEach(({ marker, category: placeCategory }) => {
    setMarkerVisibility(marker, activeCategory === "all" || activeCategory === placeCategory);
  });
}

export async function getNearbyPlaces(lat, lon, { radius = 5000, signal } = {}) {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) throw new TypeError("Nearby-place coordinates must be numbers.");
  const query = `[out:json][timeout:25];(node["amenity"~"^(restaurant|cafe)$"](around:${radius},${lat},${lon});way["amenity"~"^(restaurant|cafe)$"](around:${radius},${lat},${lon}););out center tags 80;`;
  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: `data=${encodeURIComponent(query)}`,
    signal: signal || AbortSignal.timeout(22000),
  });
  if (!response.ok) throw new Error("Nearby places are temporarily unavailable.");
  const data = await response.json();
  return Array.isArray(data.elements) ? data.elements : [];
}

export async function showNearbyPlaces(lat, lon, { isCurrent = () => true, ...options } = {}) {
  const places = (await getNearbyPlaces(lat, lon, options)).map((element) => {
    const tags = element.tags || {};
    const placeLat = element.lat ?? element.center?.lat;
    const placeLon = element.lon ?? element.center?.lon;
    return {
      id: `${element.type}-${element.id}`,
      name: tags.name || tags["name:en"] || "Unnamed place",
      kind: tags.amenity === "cafe" ? "Café" : "Restaurant",
      lat: placeLat,
      lng: placeLon,
      tags,
      distance: distanceKm(lat, lon, placeLat, placeLon),
    };
  }).filter((place) => Number.isFinite(place.lat) && Number.isFinite(place.lng) && place.name !== "Unnamed place")
    .sort((a, b) => a.distance - b.distance).slice(0, 7);

  if (isCurrent()) replaceNearbyMarkers(places);
  return places;
}

export function replaceNearbyMarkers(places) {
  nearbyMarkers.forEach(({ marker }) => map.removeLayer(marker));
  nearbyMarkers = places.map((place) => {
    const iconCharacter = place.kind === "Café" ? "◷" : "▦";
    const category = place.kind === "Café" ? "cafe" : "restaurant";
    const icon = L.divIcon({
      className: "",
      html: `<span class="nearby-map-marker marker-${category}">${iconCharacter}</span>`,
      iconSize: [27, 27],
      iconAnchor: [13, 13],
    });
    const marker = L.marker([place.lat, place.lng], { icon, title: `${place.kind}: ${place.name}`, alt: `${place.kind}: ${place.name}` });
    const distance = place.distance < 1 ? `${Math.round(place.distance * 1000)} m` : `${place.distance.toFixed(1)} km`;
    marker.bindPopup(`<div class="venue-popup"><strong>${escapeHtml(place.name)}</strong><span>${place.kind} · ${distance}</span><a href="https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}" target="_blank" rel="noreferrer">Directions ↗</a></div>`);
    return { marker, category };
  });
  filterMapMarkers({ category: activeCategory, destinationIds: activeDestinationIds });
}

function setMarkerVisibility(marker, visible) {
  if (!map) return;
  if (visible && !map.hasLayer(marker)) marker.addTo(map);
  if (!visible && map.hasLayer(marker)) map.removeLayer(marker);
}

export function focusDestination(destination, zoom = 12) {
  if (!map || !destination) return;
  if (searchMarker) map.removeLayer(searchMarker);
  map.flyTo([destination.lat, destination.lng], zoom, { duration: 0.65 });
  markers.get(destination.id)?.openTooltip();
}

export function fitKosovo() {
  if (!map) return;
  if (searchMarker) {
    map.removeLayer(searchMarker);
    searchMarker = null;
  }
  map.fitBounds(kosovoBounds, { padding: [12, 12], animate: true });
}

export function showGeocodedPlace(place) {
  if (!map) return;
  if (searchMarker) map.removeLayer(searchMarker);
  const lat = Number(place.lat);
  const lng = Number(place.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) < 41.5 || Math.abs(lat) > 43.5 || lng < 19.5 || lng > 22.2) return false;
  searchMarker = L.marker([lat, lng]).addTo(map).bindPopup(`<strong>${escapeHtml(place.name || place.display_name)}</strong><br>OpenStreetMap search result`);
  searchMarker.openPopup();
  map.flyTo([lat, lng], 12, { duration: 0.65 });
  return true;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function distanceKm(lat1, lon1, lat2, lon2) {
  const radians = (degrees) => degrees * Math.PI / 180;
  const deltaLat = radians(lat2 - lat1);
  const deltaLon = radians(lon2 - lon1);
  const value = Math.sin(deltaLat / 2) ** 2 + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(deltaLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}