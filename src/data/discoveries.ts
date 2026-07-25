export interface Discovery {
  id: string;
  name: string;
  scientificName: string;
  minimumDepth: number;
  maximumDepth: number;
  targetDepth: number;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  description: string;
  xPercent: number; // Horizontal placement (percent from left, 15 to 80)
  symbol: "amphora" | "coral" | "anchor" | "drone" | "squid" | "angler" | "skeleton" | "titanic" | "smoker" | "probe" | "egg" | "fossil";
}

export const DISCOVERIES: Discovery[] = [
  {
    id: "amphora",
    name: "Ancient Amphora",
    scientificName: "Archaeologica amphora",
    minimumDepth: 35,
    maximumDepth: 200,
    targetDepth: 110,
    rarity: "Common",
    description: "A terracotta vessel from a Roman cargo ship shipwrecked centuries ago. Intact, sealed with pine tar, and covered in calcareous marine crust.",
    xPercent: 22,
    symbol: "amphora"
  },
  {
    id: "coral",
    name: "Abyssal Coral",
    scientificName: "Lophelia pertusa",
    minimumDepth: 80,
    maximumDepth: 230,
    targetDepth: 170,
    rarity: "Common",
    description: "A slow-growing cold-water coral cluster. It glows with a faint green bioluminescent shimmer and provides shelter for microscopic larval colonies.",
    xPercent: 68,
    symbol: "coral"
  },
  {
    id: "anchor",
    name: "Lost Galleon Anchor",
    scientificName: "Sideros ancora",
    minimumDepth: 220,
    maximumDepth: 550,
    targetDepth: 380,
    rarity: "Common",
    description: "A heavily oxidized iron anchor from a 17th-century Spanish galleon. Soft anemones have colonized the ring, filtering nutrients from deep currents.",
    xPercent: 18,
    symbol: "anchor"
  },
  {
    id: "drone",
    name: "Lost Survey Drone",
    scientificName: "A.U.V. Sentinel-4",
    minimumDepth: 500,
    maximumDepth: 950,
    targetDepth: 720,
    rarity: "Rare",
    description: "An autonomous underwater vehicle swept away during a storm. Its battery is nearly dead, but its optical sensor continues to blink a yellow telemetry code.",
    xPercent: 75,
    symbol: "drone"
  },
  {
    id: "squid",
    name: "Colossal Squid juvenile",
    scientificName: "Mesonychoteuthis hamiltoni",
    minimumDepth: 950,
    maximumDepth: 1800,
    targetDepth: 1250,
    rarity: "Epic",
    description: "A juvenile colossal squid floating suspended in the water column. Its huge eyes look directly into our spotlight, and its bioluminescent spots cycle slowly.",
    xPercent: 28,
    symbol: "squid"
  },
  {
    id: "angler",
    name: "Deep Anglerfish",
    scientificName: "Melanocetus johnsonii",
    minimumDepth: 1600,
    maximumDepth: 2700,
    targetDepth: 2100,
    rarity: "Rare",
    description: "A black humpback anglerfish. The tip of its modified dorsal spine holds millions of light-emitting bacteria, flashing an inviting beacon in the eternal dark.",
    xPercent: 72,
    symbol: "angler"
  },
  {
    id: "skeleton",
    name: "Whale Fall Ribs",
    scientificName: "Cetacea osseus",
    minimumDepth: 2300,
    maximumDepth: 3600,
    targetDepth: 2850,
    rarity: "Rare",
    description: "A carcass fallen to the deep ocean floor. Only the massive rib cage remains, supporting a specialized community of bone-eating worms and blind decapods.",
    xPercent: 16,
    symbol: "skeleton"
  },
  {
    id: "titanic",
    name: "Titanic Hull Plate",
    scientificName: "S.S. Titanic wreckage",
    minimumDepth: 3100,
    maximumDepth: 4000,
    targetDepth: 3780,
    rarity: "Epic",
    description: "A rusted section of steel hull plate from the Titanic, containing a double-riveted seam and a heavily corroded porthole. Covered in rusticle formations.",
    xPercent: 64,
    symbol: "titanic"
  },
  {
    id: "smoker",
    name: "Hydrothermal Chimney",
    scientificName: "Sulfurica fumare",
    minimumDepth: 4100,
    maximumDepth: 5600,
    targetDepth: 4900,
    rarity: "Common",
    description: "A chimney venting superheated, mineral-rich water at 380°C. Thick mats of sulfur-oxidizing bacteria cover the rock, forming the base of a lightless food chain.",
    xPercent: 25,
    symbol: "smoker"
  },
  {
    id: "probe",
    name: "Research Probe 'Nadir'",
    scientificName: "Probe Nadir-I",
    minimumDepth: 5000,
    maximumDepth: 6200,
    targetDepth: 5700,
    rarity: "Epic",
    description: "A deep-sea lander probe dropped in the late 1980s. Its titanium pressure sphere remains intact, covered in manganese nodule scale.",
    xPercent: 70,
    symbol: "probe"
  },
  {
    id: "egg",
    name: "Translucent Bio-Pod",
    scientificName: "Ovum ignotus",
    minimumDepth: 6500,
    maximumDepth: 8800,
    targetDepth: 7600,
    rarity: "Legendary",
    description: "An unknown egg capsule floating in the trench. It is completely translucent, revealing a segmented embryonic structure inside that shifts position in response to sonar.",
    xPercent: 35,
    symbol: "egg"
  },
  {
    id: "fossil",
    name: "Prehistoric Ammonite",
    scientificName: "Ammonoidea antiquus",
    minimumDepth: 8200,
    maximumDepth: 11000,
    targetDepth: 9800,
    rarity: "Legendary",
    description: "A colossal ammonite fossil embedded in the vertical rock wall of the Mariana Trench. A remnant of a prehistoric sea floor subducted into the deep earth.",
    xPercent: 60,
    symbol: "fossil"
  }
];
