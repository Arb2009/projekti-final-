export const categories = [
  { id: "all", label: "All places" },
  { id: "nature", label: "Nature" },
  { id: "mountain", label: "Mountains" },
  { id: "lake", label: "Lakes" },
  { id: "city", label: "Cities" },
  { id: "culture", label: "Culture & history" },
  { id: "park", label: "Parks" },
];

export const mapCategories = [...categories];

export const destinations = [
  { id: "rugova-canyon", name: "Rugova Canyon", category: "nature", area: "Peja", lat: 42.6972, lng: 20.0735, icon: "⌁", photo: { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Tunnel_in_Rugova_Canyon_%28WPWTR17%29.jpg?width=1400", page: "https://commons.wikimedia.org/wiki/File:Tunnel_in_Rugova_Canyon_(WPWTR17).jpg", artist: "Albinfo", license: "CC BY 4.0" }, description: "A dramatic limestone gorge west of Peja, with river trails, waterfalls, climbing routes and mountain villages tucked into the slopes." },
  { id: "mirusha-waterfalls", name: "Mirusha Waterfalls", category: "nature", area: "Malisheva", lat: 42.5335, lng: 20.5791, icon: "≋", description: "A string of waterfalls and vivid turquoise pools carved into the Mirusha river canyon. Trails connect the cascades and forested viewpoints." },
  { id: "gazivoda-lake", name: "Gazivoda Lake", category: "lake", area: "Zubin Potok", lat: 42.9615, lng: 20.5738, icon: "◌", photo: { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Ujemani_or_Gazivoda_Lake_as_seen_from_the_Air.jpg?width=1200", page: "https://commons.wikimedia.org/wiki/File:Ujemani_or_Gazivoda_Lake_as_seen_from_the_Air.jpg", artist: "SUHEJLO", license: "CC BY 4.0" }, description: "A broad reservoir set among the green, wooded hills of the north. The quiet shoreline makes a scenic stop for a drive through the Ibar valley." },
  { id: "batllava-lake", name: "Batllava Lake", category: "lake", area: "Mitrovica", lat: 42.8599, lng: 20.8467, icon: "◍", description: "A calm highland lake with forested edges and a relaxed setting for picnics, slow walks and easy scenic drives in the north-east of Kosovo." },
  { id: "ujman-lake", name: "Ujman Lake", category: "lake", area: "Peja", lat: 42.6753, lng: 20.2725, icon: "◍", description: "A striking mountain lake framed by dramatic ridgelines, perfect for a quiet stop surrounded by alpine scenery and fresh air." },
  { id: "liqeni-i-kushtes", name: "Kushte Lake", category: "lake", area: "Klinë", lat: 42.6246, lng: 20.6304, icon: "◍", photo: { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80", page: "https://unsplash.com/s/photos/mountain-lake", artist: "Unsplash", license: "Free use" }, description: "A smaller, peaceful lake tucked into the hills, with clear water, easy viewpoints and a sense of seclusion away from the main routes." },
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

const translatedDescriptions = {
  sq: {
    "rugova-canyon": "Një kanion mbresëlënës gëlqeror në perëndim të Pejës, me shtigje përgjatë lumit, ujëvara, rrugë për ngjitje dhe fshatra malore në shpatet e tij.",
    "mirusha-waterfalls": "Një varg ujëvarash dhe pishinash bruz të formuara nga kanioni i lumit Mirusha. Shtigjet lidhin kaskadat me pikat panoramike mes pyjeve.",
    "gazivoda-lake": "Një rezervuar i gjerë mes kodrave të gjelbra e të pyllëzuara të veriut. Bregu i qetë është ndalesë panoramike gjatë një udhëtimi në luginën e Ibrit.",
    "batllava-lake": "Një liqen i qetë malor, me brigje të pyllëzuara dhe hapësirë të përshtatshme për piknik, shëtitje të qeta dhe udhëtime panoramike në verilindje të Kosovës.",
    "ujman-lake": "Një liqen mbresëlënës malor, i rrethuar nga kreshta të thepisura, ideal për një ndalesë të qetë mes peizazheve alpine dhe ajrit të freskët.",
    "liqeni-i-kushtes": "Një liqen i vogël e paqësor mes kodrave, me ujë të kthjellët, pika të lehta vrojtimi dhe qetësi larg rrugëve kryesore.",
    "brezovica-ski-resort": "Një qendër malore në shpatet e vargmalit të Sharrit, e njohur për skijim në dimër dhe qasje verore në shtigje të larta alpine.",
    "sharri-mountains": "Kreshta të larta, liqene akullnajore dhe livadhe të gjera karakterizojnë këtë peizazh malor të mbrojtur përgjatë kufirit jugor të Kosovës.",
    "germia-park": "Një park i pyllëzuar pranë kryeqytetit, me shtigje të shënuara për ecje, vende pikniku dhe hapësira të gjelbra lehtësisht të arritshme mbi qytet.",
    "white-drin-waterfall": "Drini i Bardhë buron nga një burim karstik në skaj të Radavcit dhe zbret në një grykë të freskët e të pyllëzuar nën shkëmbinj.",
    "radavc-cave": "Një shpellë karstike pranë burimit të Drinit të Bardhë. Qasja dhe orari mund të ndryshojnë, ndaj verifikoni kushtet lokale para vizitës.",
    "gadime-cave": "Një shpellë nëntokësore në jug të Prishtinës, e njohur për formacionet mbresëlënëse të mermerit. Kontrolloni qasjen dhe oraret e vizitave para nisjes.",
    "prizren": "Rrugicat me kalldrëm, kafenetë buzë lumit dhe pamja e qytetit nga periudha osmane e bëjnë Prizrenin një nga shëtitjet më të paharrueshme në vend.",
    "prishtina": "Kryeqyteti i gjallë i Kosovës ndërthur kulturën e kafeneve dhe artin bashkëkohor me historinë e shtresëzuar dhe një qendër të përshtatshme për shëtitje.",
    "peja": "Peja është porta drejt maleve të Rugovës. Shëtisni ngadalë nëpër rrugët e pazarit dhe ndaloni për kafe në qendrën e vjetër.",
    "gjakova": "Një pazar historik i restauruar, punëtori artizanale tradicionale dhe kafene të qeta në ambient të hapur i japin këtij qyteti perëndimor karakterin e tij të veçantë.",
    "novo-brdo-fortress": "Mbetjet e një qendre të fuqishme mesjetare xehetarie dhe tregtie kurorëzojnë një kodër në lindje të Prishtinës, me pamje të gjera mbi fshatrat përreth.",
    "visoki-decani": "Një manastir ortodoks serb i shekullit të 14-të, në një luginë të pyllëzuar pranë Deçanit, i njohur për afresket dhe arkitekturën romane. Kontrolloni udhëzimet aktuale për vizitorët.",
    "gracanica-monastery": "Një manastir mesjetar ortodoks serb në juglindje të Prishtinës, i njohur për arkitekturën e veçantë bizantine dhe brendësinë e pikturuar me pasuri.",
    "ulpiana": "Eksploroni mbetjet e gërmuara të një vendbanimi të lashtë romak dhe bizantin, të vendosur në fushë të hapur në jug të Prishtinës.",
  },
  sr: {
    "rugova-canyon": "Impresivan krečnjački kanjon zapadno od Peći, sa rečnim stazama, vodopadima, penjačkim rutama i planinskim selima na obroncima.",
    "mirusha-waterfalls": "Niz vodopada i tirkiznih bazena koje je usekao kanjon reke Miruše. Staze povezuju kaskade i šumske vidikovce.",
    "gazivoda-lake": "Prostrano jezero okruženo zelenim, šumovitim brdima na severu. Mirna obala je slikovito mesto za predah tokom vožnje dolinom Ibra.",
    "batllava-lake": "Mirno planinsko jezero sa šumovitim obalama, pogodno za piknike, lagane šetnje i panoramske vožnje na severoistoku Kosova.",
    "ujman-lake": "Upečatljivo planinsko jezero okruženo dramatičnim grebenima, idealno za miran predah u alpskom pejzažu i svežem vazduhu.",
    "liqeni-i-kushtes": "Manje, mirno jezero skriveno među brdima, sa bistrom vodom, lako dostupnim vidikovcima i spokojem daleko od glavnih puteva.",
    "brezovica-ski-resort": "Planinsko odmaralište na obroncima Šar-planine, poznato po zimskom skijanju i letnjem pristupu visokim planinskim stazama.",
    "sharri-mountains": "Visoki grebeni, lednička jezera i prostrane livade obeležavaju ovaj zaštićeni planinski predeo uz južnu granicu Kosova.",
    "germia-park": "Šumoviti park nadomak prestonice, sa obeleženim stazama za šetnju, mestima za piknik i lako dostupnim zelenim površinama iznad grada.",
    "white-drin-waterfall": "Beli Drim izvire iz kraškog vrela na rubu Radavca, a zatim se spušta u hladnu, šumovitu klisuru ispod litica.",
    "radavc-cave": "Kraška pećina blizu izvora Belog Drima. Pristup i radno vreme mogu da se menjaju, zato proverite lokalne informacije pre posete.",
    "gadime-cave": "Podzemna pećina južno od Prištine, poznata po upečatljivim mermernim formacijama. Pre puta proverite pristup i termine obilazaka.",
    "prizren": "Kaldrmisane ulice, kafići uz reku i osmanska panorama čine Prizren jednom od najpamtljivijih gradskih šetnji u zemlji.",
    "prishtina": "Živahna prestonica Kosova spaja kulturu kafića i savremenu umetnost sa slojevitom istorijom i pešački pristupačnim centrom.",
    "peja": "Peć je kapija ka planinama Rugove. Prošetajte čaršijskim ulicama bez žurbe i svratite na kafu u starom centru.",
    "gjakova": "Obnovljena istorijska čaršija, tradicionalne zanatske radionice i opušteni kafići na otvorenom daju ovom gradu na zapadu poseban karakter.",
    "novo-brdo-fortress": "Ostaci moćnog srednjovekovnog rudarskog i trgovačkog centra nalaze se na vrhu brda istočno od Prištine, sa širokim pogledom na okolinu.",
    "visoki-decani": "Srpski pravoslavni manastir iz 14. veka u šumovitoj dolini blizu Dečana, poznat po freskama i romaničkoj arhitekturi. Proverite aktuelne smernice za posetioce.",
    "gracanica-monastery": "Srednjovekovni srpski pravoslavni manastir jugoistočno od Prištine, poznat po prepoznatljivoj vizantijskoj arhitekturi i bogato oslikanoj unutrašnjosti.",
    "ulpiana": "Istražite iskopane ostatke antičkog rimskog i vizantijskog naselja u otvorenom predelu južno od Prištine.",
  },
};

export function getDestinationDescription(destination, language = "en") {
  return translatedDescriptions[language]?.[destination.id] || destination.description;
}

export function getActivityIdeas(destination) {
  const baseIdeas = {
    nature: ["Hike scenic trails", "Take photos from viewpoints", "Enjoy a slow walk in the landscape"],
    mountain: ["Walk mountain trails", "Pause at a panoramic viewpoint", "Explore high-country scenery"],
    lake: ["Relax by the water", "Take a scenic stroll around the shore", "Enjoy a quiet picnic or boat ride"],
    city: ["Explore the old centre", "Visit local cafés and streets", "Discover historic landmarks"],
    culture: ["Visit heritage sites", "Learn local history", "Explore traditional architecture"],
    park: ["Picnic in green spaces", "Enjoy a family walk", "Take in the fresh air"],
  };
  const ideas = baseIdeas[destination.category] || ["Explore the surroundings", "Take in the scenery", "Spend time outdoors"];
  const title = destination.name.includes("Lake") ? "Relax by the water" : destination.name.includes("Canyon") ? "Hike and admire the views" : destination.name.includes("Prizren") ? "Wander the old streets" : destination.name.includes("Monastery") ? "Visit the heritage site" : destination.name.includes("Park") ? "Enjoy the outdoors" : destination.name.includes("Fortress") ? "Explore the historic fortifications" : ideas[0];
  return [title, ...ideas.slice(1)];
}

export function getFeaturedDestinations() {
  return [destinations[0], destinations[9], destinations[2], destinations[5], destinations[13], destinations[6]];
}