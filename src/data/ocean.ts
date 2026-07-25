import { OceanObject } from '../types/ocean';

export const oceanObjects: OceanObject[] = [
  // --- SURFACE (0m) ---
  {
    id: 'sargassum-weed',
    name: 'Floating Sargassum Weed',
    zone: 'Surface',
    depth: 0,
    description: 'A genus of brown macroalgae that floats in massive, island-like mats across the open ocean, providing a critical nursery and shelter for young sea creatures.',
    interestingFacts: [
      'It never attaches to the seafloor, living out its entire lifecycle floating on the water surface.',
      'Sargassum mats act as rafts that transport marine organisms thousands of miles across current systems.',
      'The Sargasso Sea is named after this weed and is the only sea on Earth without land boundaries.'
    ],
    sampleQuestions: [
      'How does Sargassum float without any roots?',
      'What kinds of animals seek shelter in these floating mats?',
      'Is the accumulation of Sargassum weed harmful to coastal areas?'
    ],
    imagePlaceholder: 'Golden-brown floating seaweed mats on the sunlit blue ocean surface'
  },
  {
    id: 'loggerhead-turtle',
    name: 'Loggerhead Sea Turtle',
    zone: 'Surface',
    depth: 0,
    description: 'A large sea turtle recognized by its massive head and powerful jaws, spending its early years drifting along currents in surface seaweed habitats.',
    interestingFacts: [
      'They possess an internal magnetic map, navigating across entire oceans by sensing the Earth’s magnetic field.',
      'Young loggerheads live in floating Sargassum mats for shelter and warmth during their developmental years.',
      'They feed primarily on hard-shelled organisms like crabs, conchs, and whelks.'
    ],
    sampleQuestions: [
      'How do loggerhead turtles navigate the open ocean?',
      'Why do young loggerheads live in floating seaweed?',
      'How long can a loggerhead turtle hold its breath under water?'
    ],
    imagePlaceholder: 'A loggerhead sea turtle swimming near the surface under bright sunlight'
  },
  {
    id: 'portuguese-man-o-war',
    name: 'Portuguese Man o\' War',
    zone: 'Surface',
    depth: 0,
    description: 'A highly venomous marine organism that resembles a jellyfish but is actually a siphonophore—a colony of specialized genetically identical individuals.',
    interestingFacts: [
      'It is not a single animal, but rather a colonial organism made of four specialized types of polyps.',
      'It floats via a gas-filled bladder (pneumatophore) that acts as a sail, leaving it at the mercy of winds and currents.',
      'Its stinging tentacles can extend up to 30 meters (100 feet) below the surface.'
    ],
    sampleQuestions: [
      'How is the Portuguese Man o\' War different from a true jellyfish?',
      'How does it float, and can it deflate its sail to submerge?',
      'What should you do if stung by a Portuguese Man o\' War?'
    ],
    imagePlaceholder: 'A translucent blue-purple Portuguese Man o\' War floating with long tentacles dangling below'
  },
  {
    id: 'garbage-patch',
    name: 'Great Pacific Garbage Patch',
    zone: 'Surface',
    depth: 0,
    description: 'A massive accumulation of marine debris and microplastics trapped by the swirling currents of the North Pacific Subtropical Gyre.',
    interestingFacts: [
      'It is not a solid island of trash, but rather a thick soup of microplastics that are almost invisible to the naked eye.',
      'Plastics in the patch break down through photodegradation into smaller pieces without ever fully decomposing.',
      'Marine life often mistakes these microplastics for food, introducing toxins into the global food chain.'
    ],
    sampleQuestions: [
      'How did the Great Pacific Garbage Patch form?',
      'Why is it so difficult to clean up this debris?',
      'How does microplastic pollution affect surface-feeding sea birds?'
    ],
    imagePlaceholder: 'Microplastics and debris floating suspended near the surface of ocean water'
  },

  // --- SUNLIGHT ZONE (0m - 200m) ---
  {
    id: 'coral-reef',
    name: 'Shallow Coral Reef',
    zone: 'Sunlight Zone',
    depth: 20,
    description: 'A diverse marine ecosystem constructed by calcium carbonate structures deposited by colonies of tiny living coral polyps.',
    interestingFacts: [
      'Reefs cover less than 0.1% of the ocean floor but support over 25% of all marine life.',
      'Corals share a symbiotic relationship with zooxanthellae (microalgae) which provide food via photosynthesis.',
      'They are highly sensitive to temperature changes; a rise of just 1-2 degrees can lead to coral bleaching.'
    ],
    sampleQuestions: [
      'Why are coral reefs called the rainforests of the sea?',
      'What causes coral bleaching and can bleached coral recover?',
      'How do coral polyps build these massive stone-like structures?'
    ],
    imagePlaceholder: 'A vibrant shallow coral reef teeming with colorful tropical fish and sunlight'
  },
  {
    id: 'giant-kelp-forest',
    name: 'Giant Kelp Forest',
    zone: 'Sunlight Zone',
    depth: 30,
    description: 'Towering underwater forests formed by giant kelp, creating a highly productive ecosystem that shelters diverse fish, invertebrates, and marine mammals.',
    interestingFacts: [
      'Giant kelp is one of the fastest-growing organisms on Earth, growing up to 60 cm (2 feet) per day under ideal conditions.',
      'They rely on gas-filled bladders called pneumatocysts to keep their blades floating upward toward the sunlight.',
      'Sea otters serve as a keystone species by eating sea urchins, which would otherwise devour and destroy the kelp.'
    ],
    sampleQuestions: [
      'How does giant kelp grow so quickly without true roots?',
      'What is a keystone species and why are sea otters vital to kelp?',
      'How do kelp forests buffer coastlines against wave action?'
    ],
    imagePlaceholder: 'Sunlight filtering through a towering green kelp forest with fish swimming between stalks'
  },
  {
    id: 'great-white-shark',
    name: 'Great White Shark',
    zone: 'Sunlight Zone',
    depth: 50,
    description: 'An apex predator of the coastal ocean, renowned for its size, speed, powerful bite, and highly developed sensory navigation systems.',
    interestingFacts: [
      'They possess ampullae of Lorenzini—electroreceptors that detect the faint electrical fields of living prey.',
      'Great whites are warm-blooded (endothermic), allowing them to maintain active muscle temperatures in cold waters.',
      'They do not have bones; their skeleton is made entirely of lightweight, flexible cartilage.'
    ],
    sampleQuestions: [
      'How do great white sharks sense their prey from miles away?',
      'Why is being warm-blooded an advantage for a marine predator?',
      'How do sharks breathe while swimming and do they ever sleep?'
    ],
    imagePlaceholder: 'A powerful great white shark cruising through clear blue ocean water'
  },
  {
    id: 'blue-whale',
    name: 'Blue Whale',
    zone: 'Sunlight Zone',
    depth: 100,
    description: 'The largest animal ever known to live on Earth, a majestic mammal that filter-feeds on tiny krill using baleen plates.',
    interestingFacts: [
      'A blue whale’s tongue can weigh as much as an entire adult elephant.',
      'Their vocalizations can reach 188 decibels, traveling hundreds of miles through deep ocean water.',
      'Despite their colossal size, they feed almost exclusively on krill, consuming up to 4 tons per day.'
    ],
    sampleQuestions: [
      'How does the largest animal on Earth survive on tiny krill?',
      'How do blue whales communicate across vast ocean basins?',
      'What are the physiological adaptations that let blue whales grow so large?'
    ],
    imagePlaceholder: 'A massive blue whale swimming gracefully in the deep blue sunlight zone'
  },
  {
    id: 'brain-coral',
    name: 'Brain Coral',
    zone: 'Sunlight Zone',
    depth: 15,
    description: 'A slow-growing hard coral characterized by its spheroid shape and grooved surface patterns that resemble a human brain.',
    interestingFacts: [
      'A single brain coral head is actually a colony of thousands of genetically identical polyps.',
      'They are extremely long-lived, with some large colonies estimated to be over 900 years old.',
      'They use their tentacles to catch passing zooplankton at night, supplementing their photosynthetic diet.'
    ],
    sampleQuestions: [
      'How do thousands of tiny polyps coordinate to grow in a brain-like shape?',
      'How do brain corals defend their territory from neighboring corals?',
      'What is the growth rate of brain coral colonies?'
    ],
    imagePlaceholder: 'A close-up of a rounded brain coral with intricate grooved patterns underwater'
  },

  // --- TWILIGHT ZONE (200m - 1000m) ---
  {
    id: 'coelacanth',
    name: 'Coelacanth',
    zone: 'Twilight Zone',
    depth: 250,
    description: 'An ancient, deep-water lobe-finned fish once thought to have gone extinct alongside the dinosaurs 66 million years ago.',
    interestingFacts: [
      'They were rediscovered alive in 1938 off the coast of South Africa, shocking the scientific community.',
      'They have lobed fins supported by bones, resembling the limbs of early land-dwelling tetrapods.',
      'Coelacanths possess a unique rostral organ in their snout that functions as an electroreception compass.'
    ],
    sampleQuestions: [
      'Why is the coelacanth referred to as a "living fossil"?',
      'How does the lobe-finned structure connect fish to land animals?',
      'What kind of habitat does the coelacanth occupy in the twilight zone?'
    ],
    imagePlaceholder: 'A prehistoric-looking coelacanth fish with flecked white spots swimming in a dark cave'
  },
  {
    id: 'lanternfish',
    name: 'Lanternfish',
    zone: 'Twilight Zone',
    depth: 400,
    description: 'Small, bioluminescent deep-sea fish that make up one of the largest biomass groups in the entire ocean.',
    interestingFacts: [
      'They account for up to 65% of the total deep-sea fish biomass on Earth.',
      'Every night, they migrate hundreds of meters to the surface to feed under the cover of darkness (vertical migration).',
      'They use light-emitting organs called photophores for mating signals and counterillumination camouflage.'
    ],
    sampleQuestions: [
      'Why do lanternfish migrate to the surface every night?',
      'What is counterillumination, and how does it hide lanternfish from predators?',
      'How do lanternfish produce light without generating heat?'
    ],
    imagePlaceholder: 'A swarm of tiny glowing lanternfish with luminous spots in dark blue water'
  },
  {
    id: 'barreleye-fish',
    name: 'Barreleye Fish',
    zone: 'Twilight Zone',
    depth: 600,
    description: 'A highly unusual deep-sea fish with a transparent, fluid-filled dome on its head housing green, tubular eyes.',
    interestingFacts: [
      'The green circles inside its clear head are its eyes; the two small pits on its face are actually nostrils.',
      'Its eyes point upward to scan for prey silhouettes against the faint sunlight but can rotate forward to watch food.',
      'Its transparent dome is fragile and was only discovered intact when scientists captured specimens using deep-sea ROVs.'
    ],
    sampleQuestions: [
      'Why does the barreleye fish have a transparent, fluid-filled head?',
      'How do its tubular eyes help it survive in near-darkness?',
      'What does the barreleye fish eat, and how does it steal food?'
    ],
    imagePlaceholder: 'A bizarre barreleye fish with a clear dome-like head and upward-facing green eyes'
  },
  {
    id: 'vampire-squid',
    name: 'Vampire Squid',
    zone: 'Twilight Zone',
    depth: 900,
    description: 'A small, deep-sea cephalopod that represents a unique evolutionary transition, sharing traits of both squid and octopuses.',
    interestingFacts: [
      'Its scientific name, Vampyroteuthis infernalis, literally translates to "vampire squid from hell."',
      'Instead of hunting live prey, it collects falling organic debris (marine snow) using retractable sensory filaments.',
      'It can turn inside out, covering itself with its webbed arms in a defensive posture called the "pineapple posture."'
    ],
    sampleQuestions: [
      'Why is it named the vampire squid if it only eats marine snow?',
      'How does the vampire squid survive in oxygen minimum zones?',
      'What bioluminescent defenses does the vampire squid use instead of ink?'
    ],
    imagePlaceholder: 'A reddish-black vampire squid displaying its webbed cloak and glowing photophores'
  },
  {
    id: 'sperm-whale',
    name: 'Sperm Whale (Diving)',
    zone: 'Twilight Zone',
    depth: 800,
    description: 'A giant marine mammal that regularly makes deep, prolonged dives into the twilight and midnight zones to hunt prey.',
    interestingFacts: [
      'They dive to depths of up to 2,000 meters and can hold their breath for over 90 minutes.',
      'Sperm whales have the largest brain of any animal species to have ever existed.',
      'They hunt in absolute darkness using echolocation clicks that are the loudest sounds produced by any animal.'
    ],
    sampleQuestions: [
      'How do sperm whales withstand the crushing pressure of deep dives?',
      'How does echolocation work in the pitch-black ocean?',
      'What happens when a sperm whale battles a giant squid?'
    ],
    imagePlaceholder: 'A sperm whale diving vertically down into the dark blue-grey twilight zone'
  },

  // --- MIDNIGHT ZONE (1000m - 4000m) ---
  {
    id: 'giant-squid',
    name: 'Giant Squid',
    zone: 'Midnight Zone',
    depth: 1500,
    description: 'A legendary deep-ocean predator that can grow to gargantuan lengths, living in the cold, dark depths of the bathypipelagic zone.',
    interestingFacts: [
      'They possess eyes the size of dinner plates (up to 30 cm) to capture faint light and silhouettes in the dark.',
      'For centuries, sightings of giant squids inspired tales of the legendary sea monster, the Kraken.',
      'Their tentacles are lined with sharp, serrated suckers that leave circular scars on the skin of sperm whales.'
    ],
    sampleQuestions: [
      'How large can a giant squid grow, and what is its maximum length?',
      'Why are giant squid eyes so large compared to other animals?',
      'How did scientists manage to capture the first video of a live giant squid?'
    ],
    imagePlaceholder: 'A colossal giant squid with long tentacles drifting in the pitch-black midnight zone'
  },
  {
    id: 'anglerfish',
    name: 'Humpback Anglerfish',
    zone: 'Midnight Zone',
    depth: 2000,
    description: 'An iconic deep-sea fish equipped with a bioluminescent fishing pole that attracts prey in the absolute darkness of the midnight zone.',
    interestingFacts: [
      'The glowing lure (esca) is filled with symbiotic, light-producing bacteria.',
      'They exhibit extreme sexual dimorphism: the tiny male bites and fuses into the female, becoming a permanent parasite.',
      'Their expandible jaws and stomach allow them to swallow prey twice their own size.'
    ],
    sampleQuestions: [
      'How does the anglerfish lure produce light without electricity?',
      'What is sexual parasitism in anglerfish and why did it evolve?',
      'How can the anglerfish survive months without finding food?'
    ],
    imagePlaceholder: 'A menacing female anglerfish with needle-like teeth and a glowing blue-green lure'
  },
  {
    id: 'gulper-eel',
    name: 'Gulper Eel',
    zone: 'Midnight Zone',
    depth: 2500,
    description: 'A deep-sea fish with an enormously oversized mouth and a long, whip-like tail ending in a glowing organ.',
    interestingFacts: [
      'Its jaw is loosely hinged, allowing it to stretch its mouth wide to engulf prey much larger than itself.',
      'The glowing tip on its tail is used as a bioluminescent decoy to attract curious prey.',
      'Despite its massive mouth, its teeth are very small, indicating it feeds primarily on crustaceans and small fish.'
    ],
    sampleQuestions: [
      'How does the gulper eel swim with such a massive mouth structure?',
      'What is the purpose of the glowing tip on the gulper eel\'s tail?',
      'How does its stomach stretch to accommodate massive meals?'
    ],
    imagePlaceholder: 'A black gulper eel with its massive balloon-like jaw open in the dark deep sea'
  },
  {
    id: 'dumbo-octopus',
    name: 'Dumbo Octopus',
    zone: 'Midnight Zone',
    depth: 3000,
    description: 'A deep-sea octopus with ear-like fins resting just above its eyes, resembling the classic animated character.',
    interestingFacts: [
      'They are the deepest-living of all known octopus species, inhabiting depths below 3,000 meters.',
      'Instead of crawling, they swim by flapping their ear-like fins and using their webbed arms for steering.',
      'They lack ink sacs because ink is useless in the absolute darkness of the midnight zone.'
    ],
    sampleQuestions: [
      'How does the Dumbo octopus move, and how does it differ from shallow-water octopuses?',
      'Why doesn\'t the Dumbo octopus have an ink sac?',
      'What do Dumbo octopuses eat at these extreme depths?'
    ],
    imagePlaceholder: 'A small, pale pink dumbo octopus flapping its ear-like fins in the pitch black'
  },
  {
    id: 'titanic-shipwreck',
    name: 'RMS Titanic Shipwreck',
    zone: 'Midnight Zone',
    depth: 3800,
    description: 'The rusting wreckage of the famous ocean liner that sank in 1912, resting in two main pieces on the abyssal plain of the North Atlantic.',
    interestingFacts: [
      'The wreck lies at a depth of 3,800 meters, where the pressure is about 380 times atmospheric pressure.',
      'It is slowly being consumed by a unique species of rust-eating bacteria called Halomonas titanicae.',
      'Scientists estimate that the bacteria will fully dissolve the remaining iron structure within a few decades.'
    ],
    sampleQuestions: [
      'What happens to iron shipwrecks at 3,800 meters under the sea?',
      'What is the rust-eating bacteria consuming the Titanic?',
      'How did explorers first locate the Titanic wreck in 1985?'
    ],
    imagePlaceholder: 'The rusted bow of the RMS Titanic resting on the dark ocean floor'
  },

  // --- ABYSSAL ZONE (4000m - 6000m) ---
  {
    id: 'hydrothermal-vent',
    name: 'Hydrothermal Vent (Black Smoker)',
    zone: 'Abyssal Zone',
    depth: 4500,
    description: 'Geothermal geysers on the volcanic seafloor that spew superheated, mineral-rich water into the freezing ocean depths.',
    interestingFacts: [
      'The fluids exit the vents at temperatures exceeding 400°C (750°F) but do not boil due to the extreme pressure.',
      'They form the basis of a non-photosynthetic ecosystem, fueled by chemosynthetic bacteria oxidizing hydrogen sulfide.',
      'Vents are surrounded by dense colonies of giant tube worms that have no mouth, gut, or digestive tract.'
    ],
    sampleQuestions: [
      'How does chemosynthesis differ from photosynthesis?',
      'Why doesn\'t the superheated 400°C water boil?',
      'How do giant tube worms survive without mouths or stomachs?'
    ],
    imagePlaceholder: 'A towering hydrothermal vent spewing dark mineral-rich water surrounded by white tube worms'
  },
  {
    id: 'tripod-fish',
    name: 'Tripod Fish',
    zone: 'Abyssal Zone',
    depth: 4800,
    description: 'A bizarre bottom-dwelling fish that stands on three long, wire-like pelvic and caudal fin extensions.',
    interestingFacts: [
      'It stands stationary on the seafloor mud, facing into the current to catch tiny prey drifting by.',
      'Its fin extensions can grow up to 1 meter long, raising the fish above the muddy boundary layer.',
      'It is a hermaphrodite, containing both male and female organs to reproduce easily when mates are scarce.'
    ],
    sampleQuestions: [
      'Why does the tripod fish stand on the seafloor rather than swimming?',
      'Are the tripod fins stiff or flexible?',
      'How does the tripod fish detect prey in absolute darkness without looking?'
    ],
    imagePlaceholder: 'A tripod fish standing elevated on its long fin rays on the soft mud of the abyssal plain'
  },
  {
    id: 'sea-pig',
    name: 'Sea Pig (Abyssal Sea Cucumber)',
    zone: 'Abyssal Zone',
    depth: 5000,
    description: 'A deep-sea sea cucumber with a bloated, translucent pink body and leg-like tube feet that marches along the ocean mud.',
    interestingFacts: [
      'They walk on the seabed using water-filled tube feet that expand and contract.',
      'Sea pigs gather in massive herds of hundreds, aligning themselves to face the current for falling food.',
      'They play a vital role in recycling organic material that sinks to the seafloor from the sunlit waters.'
    ],
    sampleQuestions: [
      'What are sea pigs, and how do they walk on the seafloor?',
      'Why do sea pigs gather in massive herds?',
      'How do sea pigs defend themselves from deep-sea predators?'
    ],
    imagePlaceholder: 'A group of translucent pink, balloon-like sea pigs walking on the dark mud'
  },
  {
    id: 'giant-isopod',
    name: 'Giant Isopod',
    zone: 'Abyssal Zone',
    depth: 5500,
    description: 'A massive, armored scavenger related to land pillbugs, adapted to survive on scarce food fall on the abyssal seafloor.',
    interestingFacts: [
      'They exhibit deep-sea gigantism, growing up to 30 cm long compared to their tiny terrestrial relatives.',
      'They have an extremely slow metabolism, allowing them to survive for up to five years without eating a meal.',
      'Their thick, calcified exoskeleton protects them from predators and the massive pressure of the deep sea.'
    ],
    sampleQuestions: [
      'What is deep-sea gigantism, and why are giant isopods so large?',
      'How can a giant isopod survive for years without eating?',
      'What do giant isopods feed on when they find a carcass?'
    ],
    imagePlaceholder: 'A large, segmented pale-blue giant isopod scavenging on the dark seabed'
  },
  {
    id: 'abyssal-plain',
    name: 'Abyssal Plain Mud',
    zone: 'Abyssal Zone',
    depth: 5200,
    description: 'The vast, flat, silent sediment desert covering over 50% of the Earth\'s surface, composed of thick clay and skeletal remains.',
    interestingFacts: [
      'The sediment layer consists of "marine snow"—accumulated plankton shells, dust, and organic debris over millions of years.',
      'It is one of the most stable habitats on Earth, experiencing no seasons, wind, or sunlight.',
      'Despite appearing barren, the mud is home to thousands of species of microscopic worms, bacteria, and benthos.'
    ],
    sampleQuestions: [
      'How deep is the mud on the abyssal plain, and what is it made of?',
      'What kind of life thrives inside the freezing mud of the abyssal plain?',
      'Why is the abyssal plain so incredibly flat?'
    ],
    imagePlaceholder: 'An endless flat landscape of dark grey-brown sediment in the deep sea'
  },

  // --- HADAL ZONE (6000m+) ---
  {
    id: 'mariana-snailfish',
    name: 'Mariana Snailfish',
    zone: 'Hadal Zone',
    depth: 8000,
    description: 'The deepest-living vertebrate ever recorded, surviving in the extreme conditions of the Mariana Trench.',
    interestingFacts: [
      'They live at a depth of 8,000 meters, where the hydrostatic pressure is about 800 times greater than at sea level.',
      'Their body is translucent, lacking scales, and their bones are made of soft, highly flexible cartilage.',
      'They have high levels of trimethylamine N-oxide (TMAO), a chemical that prevents their proteins from folding incorrectly under pressure.'
    ],
    sampleQuestions: [
      'How does the Mariana snailfish survive pressures that would crush a human skeleton?',
      'What does the snailfish look like, and why does it lack skin pigments?',
      'What is TMAO and how does it protect proteins from deep sea pressure?'
    ],
    imagePlaceholder: 'A pale, translucent, scale-free Mariana snailfish swimming in the pitch-black Hadal Zone'
  },
  {
    id: 'challenger-deep-lander',
    name: 'Challenger Deep Lander',
    zone: 'Hadal Zone',
    depth: 10900,
    description: 'A heavy-duty titanium-framed scientific probe deployed to document the physical and biological properties of the deepest spot on Earth.',
    interestingFacts: [
      'At the bottom of Challenger Deep, the pressure is an astounding 1,100 atmospheres (16,000 psi).',
      'It takes about 4 hours for a lander to drop from the surface to the trench floor and another 4 hours to ascend.',
      'Landers have discovered active microbial communities and microplastics at the very bottom of the trench.'
    ],
    sampleQuestions: [
      'How do engineers build equipment that doesn\'t implode at 11,000 meters?',
      'How do scientists communicate with probes at the bottom of the world?',
      'What did the lander discover at the bottom of Challenger Deep?'
    ],
    imagePlaceholder: 'A high-tech scientific lander with bright LED lights resting on the silty bottom of Challenger Deep'
  },
  {
    id: 'hadal-amphipod',
    name: 'Hadal Amphipod (Hirondellea gigas)',
    zone: 'Hadal Zone',
    depth: 9000,
    description: 'A tiny, shrimp-like crustacean that thrives in massive swarms at the bottom of oceanic trenches.',
    interestingFacts: [
      'They have evolved enzymes that can digest wood and plant debris that rolls down into trenches from land slides.',
      'To build their shells under high acidity and pressure, they secrete a protective aluminum hydroxide gel coat.',
      'They act as the primary clean-up crew of the hadal zone, consuming any organic matter that reaches the trench floor.'
    ],
    sampleQuestions: [
      'How do these amphipods build shells without calcium carbonate at depth?',
      'How did these creatures evolve to digest wood in the deep ocean?',
      'What role do they play in the food chain of the deep trenches?'
    ],
    imagePlaceholder: 'Small, translucent, shrimp-like amphipods swarming on the seafloor'
  },
  {
    id: 'hadal-trench-floor',
    name: 'Hadal Trench Floor',
    zone: 'Hadal Zone',
    depth: 10000,
    description: 'The narrow, V-shaped floor of deep oceanic trenches formed by tectonic subduction zones.',
    interestingFacts: [
      'Oceanic trenches are formed where one tectonic plate is forced beneath another into the Earth\'s mantle.',
      'Water temperature on the trench floor is barely above freezing, ranging from 1°C to 4°C.',
      'Trench floors collect organic detritus that slides down the steep canyon walls, making them hotspots of microbial life.'
    ],
    sampleQuestions: [
      'How are ocean trenches formed by plate tectonics?',
      'Why is there more microbial life in trenches than on the shallower abyssal plains?',
      'What is the temperature and chemical composition of water on the trench floor?'
    ],
    imagePlaceholder: 'A steep, rocky, sediment-strewn canyon wall dropping into pitch darkness'
  }
];
