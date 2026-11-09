export const categories = [
  { id: "all", label: "All places" },
  { id: "nature", label: "Nature" },
  { id: "mountain", label: "Mountains" },
  { id: "lake", label: "Lakes" },
  { id: "city", label: "Cities" },
  { id: "culture", label: "Culture & history" },
  { id: "park", label: "Parks" },
];

export const mapCategories = [
  ...categories,
  { id: "restaurant", label: "Restaurants" },
  { id: "cafe", label: "Cafés" },
];

export const destinations = [
  { id: "rugova-canyon", name: "Rugova Canyon", category: "nature", area: "Peja", lat: 42.6972, lng: 20.0735, icon: "⌁", photo: { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Tunnel_in_Rugova_Canyon_%28WPWTR17%29.jpg?width=1400", page: "https://commons.wikimedia.org/wiki/File:Tunnel_in_Rugova_Canyon_(WPWTR17).jpg", artist: "Albinfo", license: "CC BY 4.0" }, description: "A dramatic limestone gorge west of Peja, with river trails, waterfalls, climbing routes and mountain villages tucked into the slopes." },
  { id: "mirusha-waterfalls", name: "Mirusha Waterfalls", category: "nature", area: "Malisheva", lat: 42.5335, lng: 20.5791, icon: "≋", description: "A string of waterfalls and vivid turquoise pools carved into the Mirusha river canyon. Trails connect the cascades and forested viewpoints." },
  { id: "gazivoda-lake", name: "Gazivoda Lake", category: "lake", area: "Zubin Potok", lat: 42.9615, lng: 20.5738, icon: "◌", photo: { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Ujemani_or_Gazivoda_Lake_as_seen_from_the_Air.jpg?width=1200", page: "https://commons.wikimedia.org/wiki/File:Ujemani_or_Gazivoda_Lake_as_seen_from_the_Air.jpg", artist: "SUHEJLO", license: "CC BY 4.0" }, description: "A broad reservoir set among the green, wooded hills of the north. The quiet shoreline makes a scenic stop for a drive through the Ibar valley." },
  { id: "brezovica-ski-resort", name: "Brezovica Ski Resort", category: "mountain", area: "Shtërpcë", lat: 42.2117, lng: 21.0231, icon: "△", description: "A mountain resort on the slopes of the Šar range, known for winter skiing and summer access to high-altitude trails and open alpine country." },
  { id: "sharri-mountains", name: "Sharri Mountains", category: "mountain", area: "Southern Kosovo", lat: 42.1198, lng: 20.9365, icon: "△", description: "High ridgelines, glacier lakes and wide-open meadows define this protected mountain landscape along Kosovo’s southern border." },
  { id: "germia-park", name: "Germia Park", category: "park", area: "Prishtina", lat: 42.6884, lng: 21.2359, icon: "♧", photo: { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f4/Germia_park_snowed_in2.webm/1280px--Germia_park_snowed_in2.webm.jpg", page: "https://commons.wikimedia.org/wiki/File:Germia_park_snowed_in2.webm", artist: "Arianit", license: "CC BY-SA 4.0" }, description: "A forested park just beyond the capital, with marked walking paths, picnic spots and easy-to-reach green space above the city." },
  { id: "white-drin-waterfall", name: "White Drin Waterfall", category: "nature", area: "Radavc, Peja", lat: 42.7557, lng: 20.3347, icon: "≋", photo: { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Drin_source_waterfalls_%28OSCAL19_trip%29.jpg?width=1200", page: "https://commons.wikimedia.org/wiki/File:Drin_source_waterfalls_(OSCAL19_trip).jpg", artist: "albinfo", license: "CC0" }, description: "The White Drin emerges from a karst spring at the edge of Radavc before dropping into a cool, wooded gorge beneath the cliffs." },
  { id: "radavc-cave", name: "Radavc Cave", category: "nature", area: "Radavc, Peja", lat: 42.755, lng: 20.3296, icon: "⌂", description: "A karst cave near the source of the White Drin. Access and opening times can vary, so check locally before planning a visit." },
  { id: "gadime-cave", name: "Gadime Cave", category: "nature", area: "Gadime e Ulët", lat: 42.4844, lng: 21.1947, icon: "⌂", description: "An underground cave south of Prishtina, known for its striking marble formations. Check current visitor access and tour times before travelling." },
  { id: "prizren", name: "Prizren", category: "city", area: "Prizren", lat: 42.2139, lng: 20.7397, icon: "⌂", photo: { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Puente_de_Piedra%2C_Prizren%2C_Kosovo%2C_2014-04-16%2C_DD_11.JPG?width=1200", page: "https://commons.wikimedia.org/wiki/File:Puente_de_Piedra,_Prizren,_Kosovo,_2014-04-16,_DD_11.JPG", artist: "Diego Delso", license: "CC BY-SA 3.0" }, description: "Cobblestone lanes, riverside cafés and an Ottoman-era skyline make Prizren one of the country’s most memorable city walks." },
  { id: "prishtina", name: "Prishtina", category: "city", area: "Prishtina", lat: 42.6629, lng: 21.1655, icon: "⌂", description: "Kosovo’s lively capital pairs a young café culture and contemporary art with layered history and a walkable central neighbourhood." },
  { id: "peja", name: "Peja", category: "city", area: "Peja", lat: 42.6591, lng: 20.2883, icon: "⌂", description: "The gateway to the Rugova mountains, Peja rewards a slow wander through its bazaar streets and a stop for coffee in the old centre." },
  { id: "gjakova", name: "Gjakova", category: "city", area: "Gjakova", lat: 42.3803, lng: 20.4308, icon: "⌂", description: "A restored historic bazaar, traditional craft workshops and relaxed outdoor cafés give this western city its distinctive character." },
  { id: "novo-brdo-fortress", name: "Novo Brdo Fortress", category: "culture", area: "Novo Brdo", lat: 42.613, lng: 21.4192, icon: "▧", photo: { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Novo_Brdo_Fortress_%28OSCAL19_trip%29.jpg?width=1200", page: "https://commons.wikimedia.org/wiki/File:Novo_Brdo_Fortress_(OSCAL19_trip).jpg", artist: "albinfo", license: "CC0" }, description: "The remains of a powerful medieval mining and trading centre crown a hilltop east of Prishtina, with sweeping views across the countryside." },
  { id: "visoki-decani", name: "Visoki Dečani Monastery", category: "culture", area: "Deçan", lat: 42.5478, lng: 20.289, icon: "▧", description: "A 14th-century Serbian Orthodox monastery set in a wooded valley near Deçan, celebrated for its frescoes and Romanesque architecture. Visitors should check current access guidance." },
  { id: "gracanica-monastery", name: "Gračanica Monastery", category: "culture", area: "Gračanica", lat: 42.6022, lng: 21.1959, icon: "▧", description: "A medieval Serbian Orthodox monastery south-east of Prishtina, noted for its distinctive Byzantine architecture and richly painted interior." },
  { id: "ulpiana", name: "Ulpiana Archaeological Site", category: "culture", area: "Gračanica", lat: 42.5906, lng: 21.1597, icon: "▧", description: "Explore the excavated remains of an ancient Roman and Byzantine settlement set in open countryside south of Prishtina." },
];

export const categoryLabels = Object.fromEntries(categories.map(({ id, label }) => [id, label]));

export function getFeaturedDestinations() {
  return [destinations[0], destinations[9], destinations[2], destinations[5], destinations[13], destinations[6]];
}