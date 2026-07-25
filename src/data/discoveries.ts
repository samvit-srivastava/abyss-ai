export interface Discovery {
  id: string;
  name: string;
  scientificName: string;
  minimumDepth: number;
  maximumDepth: number;
  targetDepth: number;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  description: string;
  xPercent: number; // Horizontal placement (15% to 80%)
  yPercent: number; // Vertical placement on screen (20% to 75%)
  symbol: "amphora" | "coral" | "anchor" | "drone" | "squid" | "angler" | "skeleton" | "titanic" | "smoker" | "probe" | "egg" | "fossil";
}

export const DISCOVERIES: Discovery[] = [
  // ─── SUNLIGHT ZONE (0m - 200m) ───
  {
    id: "amphora",
    name: "Ancient Amphora",
    scientificName: "Archaeologica amphora",
    minimumDepth: 80,
    maximumDepth: 180,
    targetDepth: 120,
    rarity: "Common",
    description: "A terracotta vessel from a Roman cargo ship shipwrecked centuries ago. Intact, sealed with pine tar, and covered in calcareous marine crust.",
    xPercent: 22,
    yPercent: 45,
    symbol: "amphora"
  },
  {
    id: "coral",
    name: "Abyssal Coral",
    scientificName: "Lophelia pertusa",
    minimumDepth: 130,
    maximumDepth: 230,
    targetDepth: 175,
    rarity: "Common",
    description: "A slow-growing cold-water coral cluster. It glows with a faint green bioluminescent shimmer and provides shelter for microscopic larval colonies.",
    xPercent: 72,
    yPercent: 65,
    symbol: "coral"
  },

  // ─── TWILIGHT ZONE (200m - 1,000m) ───
  {
    id: "scuba_record",
    name: "Deepest Scuba Dive Record",
    scientificName: "Ahmed Gabr · 332.35m (2014)",
    minimumDepth: 280,
    maximumDepth: 380,
    targetDepth: 332,
    rarity: "Rare",
    description: "The absolute limit of human scuba diving achieved using specialized trimix gas blends. Beyond this depth, water pressure exerts 34 times atmospheric pressure on lungs.",
    xPercent: 78,
    yPercent: 30,
    symbol: "anchor"
  },
  {
    id: "anchor",
    name: "Lost Galleon Anchor",
    scientificName: "Sideros ancora",
    minimumDepth: 350,
    maximumDepth: 480,
    targetDepth: 410,
    rarity: "Common",
    description: "A heavily oxidized iron anchor from a 17th-century Spanish galleon. Soft anemones have colonized the ring, filtering nutrients from deep currents.",
    xPercent: 25,
    yPercent: 60,
    symbol: "anchor"
  },
  {
    id: "drone",
    name: "Lost Survey Drone",
    scientificName: "A.U.V. Sentinel-4",
    minimumDepth: 650,
    maximumDepth: 800,
    targetDepth: 720,
    rarity: "Rare",
    description: "An autonomous underwater vehicle swept away during a storm. Its battery is nearly dead, but its optical sensor continues to blink a yellow telemetry code.",
    xPercent: 75,
    yPercent: 35,
    symbol: "drone"
  },
  {
    id: "burj_khalifa",
    name: "Burj Khalifa Submerged Marker",
    scientificName: "Height Equivalent · 828m",
    minimumDepth: 780,
    maximumDepth: 920,
    targetDepth: 828,
    rarity: "Rare",
    description: "At 828 meters, you have descended a depth equal to the height of the world's tallest skyscraper submerged underwater.",
    xPercent: 20,
    yPercent: 65,
    symbol: "probe"
  },

  // ─── MIDNIGHT ZONE (1,000m - 4,000m) ───
  {
    id: "squid",
    name: "Colossal Squid juvenile",
    scientificName: "Mesonychoteuthis hamiltoni",
    minimumDepth: 1150,
    maximumDepth: 1400,
    targetDepth: 1250,
    rarity: "Epic",
    description: "A juvenile colossal squid floating suspended in the water column. Its huge eyes look directly into our spotlight, and its bioluminescent spots cycle slowly.",
    xPercent: 30,
    yPercent: 40,
    symbol: "squid"
  },
  {
    id: "angler",
    name: "Deep Anglerfish",
    scientificName: "Melanocetus johnsonii",
    minimumDepth: 1950,
    maximumDepth: 2250,
    targetDepth: 2100,
    rarity: "Rare",
    description: "A black humpback anglerfish. The tip of its modified dorsal spine holds millions of light-emitting bacteria, flashing an inviting beacon in the eternal dark.",
    xPercent: 70,
    yPercent: 55,
    symbol: "angler"
  },
  {
    id: "skeleton",
    name: "Whale Fall Ribs",
    scientificName: "Cetacea osseus",
    minimumDepth: 2700,
    maximumDepth: 3000,
    targetDepth: 2850,
    rarity: "Rare",
    description: "A carcass fallen to the deep ocean floor. Only the massive rib cage remains, supporting a specialized community of bone-eating worms and blind decapods.",
    xPercent: 22,
    yPercent: 60,
    symbol: "skeleton"
  },
  {
    id: "titanic",
    name: "Titanic Hull Plate",
    scientificName: "S.S. Titanic wreckage · 3,780m",
    minimumDepth: 3650,
    maximumDepth: 3900,
    targetDepth: 3780,
    rarity: "Epic",
    description: "A rusted section of steel hull plate from the Titanic, containing a double-riveted seam and a heavily corroded porthole. Covered in rusticle formations.",
    xPercent: 68,
    yPercent: 42,
    symbol: "titanic"
  },

  // ─── ABYSSAL ZONE (4,000m - 6,000m) ───
  {
    id: "smoker",
    name: "Hydrothermal Chimney",
    scientificName: "Sulfurica fumare · 4,900m",
    minimumDepth: 4750,
    maximumDepth: 5050,
    targetDepth: 4900,
    rarity: "Common",
    description: "A chimney venting superheated, mineral-rich water at 380°C. Thick mats of sulfur-oxidizing bacteria cover the rock, forming the base of a lightless food chain.",
    xPercent: 25,
    yPercent: 50,
    symbol: "smoker"
  },
  {
    id: "probe",
    name: "Research Probe 'Nadir'",
    scientificName: "Probe Nadir-I",
    minimumDepth: 5550,
    maximumDepth: 5850,
    targetDepth: 5700,
    rarity: "Epic",
    description: "A deep-sea lander probe dropped in the late 1980s. Its titanium pressure sphere remains intact, covered in manganese nodule scale.",
    xPercent: 72,
    yPercent: 65,
    symbol: "probe"
  },

  // ─── HADAL ZONE (6,000m - 11,000m) ───
  {
    id: "uss_johnston",
    name: "USS Johnston Wreckage",
    scientificName: "Deepest Shipwreck · 6,460m",
    minimumDepth: 6300,
    maximumDepth: 6600,
    targetDepth: 6460,
    rarity: "Epic",
    description: "The wreckage of the WWII destroyer USS Johnston, discovered in 2021 off the Philippines. Resting at 6,460 meters, it is one of the deepest identified shipwrecks in human history.",
    xPercent: 20,
    yPercent: 40,
    symbol: "anchor"
  },
  {
    id: "egg",
    name: "Translucent Bio-Pod",
    scientificName: "Ovum ignotus",
    minimumDepth: 7450,
    maximumDepth: 7750,
    targetDepth: 7600,
    rarity: "Legendary",
    description: "An unknown egg capsule floating in the trench. It is completely translucent, revealing a segmented embryonic structure inside that shifts position in response to sonar.",
    xPercent: 75,
    yPercent: 58,
    symbol: "egg"
  },
  {
    id: "trieste_lander",
    name: "Bathyscaphe Trieste Record",
    scientificName: "Piccard & Walsh · 10,700m (1960)",
    minimumDepth: 10550,
    maximumDepth: 10800,
    targetDepth: 10700,
    rarity: "Legendary",
    description: "On January 23, 1960, Jacques Piccard and Don Walsh descended inside the Swiss-built bathyscaphe Trieste to 10,911 meters, becoming the first humans to touch the bottom of the Mariana Trench.",
    xPercent: 25,
    yPercent: 35,
    symbol: "probe"
  },
  {
    id: "challenger_deep",
    name: "Challenger Deep Bottom Floor",
    scientificName: "Lowest Point on Earth · 10,928m",
    minimumDepth: 10850,
    maximumDepth: 11000,
    targetDepth: 10928,
    rarity: "Legendary",
    description: "The absolute lowest point on Planet Earth. The water pressure here exerts over 1,086 atmospheres (15,700 psi), equivalent to eight tons per square inch.",
    xPercent: 70,
    yPercent: 65,
    symbol: "fossil"
  }
];
