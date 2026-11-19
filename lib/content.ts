// Central configuration and content repository for Midhula Farm Hut
// Ready to be linked to an admin dashboard or CMS in the future.

export const BRAND = {
  name: "Midhula Farm Hut",
  malayalamName: "മിഥുല ഫാം ഹട്ട്",
  tagline: "Colour that swims.",
  malayalamTagline: "നീന്തിത്തുടിക്കുന്ന വർണ്ണങ്ങൾ.",
  subtext: "Farm-bred guppies, platies, swordtails, crayfish and shrimp, shipped live across India.",
  malayalamSubtext: "ഗുപ്പികൾ, പ്ലാറ്റികൾ, സ്വോർഡ്ടെയിലുകൾ, ക്രേഫിഷ്, ചെമ്മീൻ - ഇന്ത്യ മുഴുവൻ ജീവനോടെ സുരക്ഷിതമായി എത്തിക്കുന്നു.",
  location: "Nooluvally, Thrissur - Kerala",
  malayalamLocation: "നൂലുവാള്ളി, തൃശ്ശൂർ - കേരളം",
  pincode: "680507",
  whatsappNumber: "+918129120437",
  whatsappRaw: "918129120437",
  instagramHandle: "@midhula_farm_hut",
  instagramUrl: "https://www.instagram.com/midhula_farm_hut/",
  youtubeChannel: "Midhula Farm Hut Malayalam",
  youtubeUrl: "https://www.youtube.com/@midhulafarmhut",
  youtubeTourId: "dQw4w9WgXcQ", // Embed ID / Farm Tour Video
  logoPath: "/logo.png",
  stats: {
    instagramFollowers: "28.7K+",
    youtubeSubscribers: "75K+",
    posts: "1,500+",
    allIndiaShipping: "100% Live Arrival Guarantee",
  },
  colors: {
    oceanDark: "#06222E",
    oceanDeep: "#0B3A4A",
    aqua: "#2DD4E6",
    guppyOrange: "#FF7A33",
    coralPink: "#FF4D6D",
    lime: "#B6F23A",
    warmWhite: "#F5FBFB",
  },
};

/**
 * Builds standard WhatsApp deep-link with pre-filled message
 */
export function getWhatsAppUrl(customMessage?: string): string {
  const defaultMsg = "Hi Midhula Farm Hut, I'm interested in your farm-bred ornamental fishes. Could you please share the current stock list and pricing?";
  const msg = customMessage || defaultMsg;
  return `https://wa.me/${BRAND.whatsappRaw}?text=${encodeURIComponent(msg)}`;
}

export interface NavItem {
  id: string;
  label: string;
  labelMl: string;
  href: string;
}

export const NAV_LINKS: NavItem[] = [
  { id: "fish", label: "Fish", labelMl: "മത്സ്യങ്ങൾ", href: "#species" },
  { id: "farm", label: "Farm", labelMl: "ഫാം കാഴ്ചകൾ", href: "#farm" },
  { id: "shipping", label: "Shipping", labelMl: "ഷിപ്പിംഗ്", href: "#shipping" },
  { id: "contact", label: "Contact", labelMl: "ബന്ധപ്പെടുക", href: "#contact" },
];

export interface SpeciesItem {
  id: string;
  name: string;
  malayalamName: string;
  scientificGroup: string;
  badge: string;
  photo: string;
  colorPalette: string[];
  tagline: string;
  malayalamTagline: string;
  description: string;
  malayalamDescription: string;
  careLevel: "Easy" | "Beginner" | "Intermediate";
  tankSize: string;
  diet: string;
  whatsappMessage: string;
}

export const SPECIES_CATALOG: SpeciesItem[] = [
  {
    id: "guppies",
    name: "Show & Exotic Guppies",
    malayalamName: "ഷോ ഗുപ്പികൾ",
    scientificGroup: "Poecilia reticulata",
    badge: "Bestseller Strain",
    photo: "/clay/cards/guppies.webp",
    colorPalette: ["#FF7A33", "#2DD4E6", "#FF4D6D", "#B6F23A"],
    tagline: "Vibrant colours, graceful fins.",
    malayalamTagline: "മനോഹരമായ ചിറകുകളും നിറങ്ങളും.",
    description: "Selective farm-bred strains with dramatic delta, fan, and crown tails. High-vitality lines acclimatised to natural open-air Kerala water conditions.",
    malayalamDescription: "വൈവിധ്യമാർന്ന ഫാൻ, ഡെൽറ്റ വാലുകളോടു കൂടിയ കേരളത്തിലെ സ്വാഭാവിക കാലാവസ്ഥയിൽ വളർത്തിയെടുത്ത ഉന്നത ഗുണനിലവാരമുള്ള ഗപ്പി ഇനങ്ങൾ.",
    careLevel: "Easy",
    tankSize: "10+ Litres",
    diet: "Spirulina flakes, live micro-worms & baby brine shrimp",
    whatsappMessage: "Hi Midhula Farm Hut, I am interested in ordering Show Guppy strains. Please send available pairs and price details.",
  },
  {
    id: "platies",
    name: "High-Fin Platies",
    malayalamName: "പ്ലാറ്റികൾ",
    scientificGroup: "Xiphophorus maculatus",
    badge: "Peaceful Community",
    photo: "/clay/cards/platies.webp",
    colorPalette: ["#FF5722", "#FFC107", "#E91E63"],
    tagline: "Active and hardy.",
    malayalamTagline: "തുടക്കക്കാർക്കും അനുയോജ്യമായവ.",
    description: "Hardy, active livebearers featuring bold red, tuxedo, and sunset colorations. Perfect companions for lush planted nano aquariums.",
    malayalamDescription: "വർണ്ണശബളമായ റെഡ്, ടക്സീഡോ പ്ലാറ്റികൾ. തുടക്കക്കാർക്കും പ്ലാന്റഡ് ടാങ്കുകൾക്കും ഏറ്റവും അനുയോജ്യം.",
    careLevel: "Beginner",
    tankSize: "20+ Litres",
    diet: "Quality pellets, spirulina & fresh vegetable grazing",
    whatsappMessage: "Hi Midhula Farm Hut, I would like to inquire about Platy varieties available in stock.",
  },
  {
    id: "swordtails",
    name: "Red & Koi Swordtails",
    malayalamName: "സ്വോർഡ്ടെയിലുകൾ",
    scientificGroup: "Xiphophorus hellerii",
    badge: "Vibrant & Active",
    photo: "/clay/cards/swordtails.webp",
    colorPalette: ["#FF3D00", "#FF9100", "#D50000"],
    tagline: "Elegant and lively.",
    malayalamTagline: "നീന്തൽ വേഗതയും ഭംഗിയും.",
    description: "Streamlined graceful swimmers with signature caudal sword extensions. Vigorous breeders that bring non-stop movement to community tanks.",
    malayalamDescription: "നീളമേറിയ വാൽമുനയുള്ള അത്യന്തം ഊർജ്ജസ്വലരായ സ്വോർഡ്ടെയിലുകൾ. വലിയ ടാങ്കുകൾക്ക് മികച്ച കാഴ്ച.",
    careLevel: "Easy",
    tankSize: "40+ Litres",
    diet: "Omnivorous flakes, daphnia, floating micro-pellets",
    whatsappMessage: "Hi Midhula Farm Hut, I am looking to purchase Swordtail pairs. Please share details.",
  },
  {
    id: "crayfish",
    name: "Freshwater Dwarf Crayfish",
    malayalamName: "ഫ്രഷ് വാട്ടർ ക്രേഫിഷ്",
    scientificGroup: "Cambarellus / Cherax",
    badge: "Exotic Bottom Dwellers",
    photo: "/clay/cards/crayfish.webp",
    colorPalette: ["#0288D1", "#00B0FF", "#E65100"],
    tagline: "Playful freshwater mini lobsters.",
    malayalamTagline: "ശുദ്ധജലത്തിലെ കുള്ളൻ കൊഞ്ചുകൾ.",
    description: "Fascinating miniature lobster-like crustaceans that explore rocks and substrates. Active scavengers that keep bottom debris meticulously clean.",
    malayalamDescription: "കല്ലുകൾക്കിടയിൽ ചുറ്റിനടക്കുന്ന ആകർഷകമായ ശുദ്ധജല ക്രേഫിഷുകൾ. അടിത്തട്ട് വൃത്തിയാക്കാൻ മിടുക്കർ.",
    careLevel: "Intermediate",
    tankSize: "30+ Litres",
    diet: "Sinking algae wafers, calcium crab pellets & blanched spinach",
    whatsappMessage: "Hi Midhula Farm Hut, I am looking for freshwater Crayfish. Can you share availability and tank compatibility?",
  },
  {
    id: "shrimp",
    name: "Fire Red Cherry Shrimp",
    malayalamName: "റെഡ് ചെറി ചെമ്മീൻ",
    scientificGroup: "Neocaridina davidi",
    badge: "Bio-Cleanup Crew",
    photo: "/clay/cards/shrimp.webp",
    colorPalette: ["#FF1744", "#D50000", "#FF5252"],
    tagline: "Supreme algae-cleaning crew.",
    malayalamTagline: "അക്വേറിയം വൃത്തിയാക്കുന്ന ചെമ്മീൻ.",
    description: "Intense crimson graded neocaridina shrimp. The supreme plant-safe cleanup crew that feeds on biofilm and keeps moss emerald green.",
    malayalamDescription: "അക്വേറിയം സസ്യങ്ങളെയും പായലുകളെയും വൃത്തിയായി സംരക്ഷിക്കുന്ന തിളങ്ങുന്ന ചുവപ്പ് ചെറി ചെമ്മീനുകൾ.",
    careLevel: "Beginner",
    tankSize: "15+ Litres",
    diet: "Biofilm, sinking shrimp crumbles & dried mulberry leaves",
    whatsappMessage: "Hi Midhula Farm Hut, I want to order a colony of Red Cherry Shrimp. What are the package deals?",
  },
];

export interface ShippingStep {
  step: number;
  title: string;
  malayalamTitle: string;
  description: string;
  malayalamDescription: string;
  iconName: string;
  image: string;
}

export const SHIPPING_STEPS: ShippingStep[] = [
  {
    step: 1,
    title: "1. Hand-Picked Selection",
    malayalamTitle: "1. മികച്ചവ തിരഞ്ഞെടുക്കൽ",
    description: "Each fish is individually inspected for fin symmetry, vibrant scale health, and energetic swimming appetite prior to dispatch.",
    malayalamDescription: "ഓരോ മീനിനെയും ആരോഗ്യവും ചിറകുകളുടെ ഭംഗിയും സൂക്ഷ്മമായി പരിശോധിച്ച ശേഷം വേർതിരിക്കുന്നു.",
    iconName: "SearchCheck",
    image: "/clay/shipping/step-1-tub.webp",
  },
  {
    step: 2,
    // TODO(client): unconfirmed claim: "medical grade oxygen"
    title: "2. Medical Grade Oxygen Packing",
    malayalamTitle: "2. ഓക്സിജൻ പാക്കിംഗ്",
    description: "Double-walled breathable poly bags enriched with pure bottled oxygen and stress-reducing conditioning water.",
    malayalamDescription: "മെഡിക്കൽ ഗ്രേഡ് ഓക്സിജനും ആന്റി-സ്ട്രെസ്സ് മരുന്നുകളും ചേർത്ത സുരക്ഷിത ഡബിൾ ലെയർ പാക്കിംഗ്.",
    iconName: "PackagePlus",
    image: "/clay/shipping/step-2-bag-o2.webp",
  },
  {
    step: 3,
    title: "3. Thermal Insulated Crating",
    malayalamTitle: "3. തെർമോകോൾ ബോക്സ്",
    // TODO(client): unconfirmed claim: "Delhi or Kochi"
    description: "High-density EPS styrofoam thermal boxes shield livestock against temperature extremes whether heading to Delhi or Kochi.",
    malayalamDescription: "കാലാവസ്ഥാ വ്യതിയാനങ്ങളെ പ്രതിരോധിക്കാൻ ഉന്നത നിലവാരമുള്ള ഇൻസുലേറ്റഡ് ബോക്സുകൾ.",
    iconName: "ShieldAlert",
    image: "/clay/shipping/step-3-box.webp",
  },
  {
    step: 4,
    // TODO(client): unconfirmed claim: air and train express couriers
    title: "4. Express Transit & Guarantee",
    malayalamTitle: "4. എക്സ്പ്രസ്സ് ഡെലിവറി",
    description: "Shipped via fast air & train express couriers with full Live Arrival Guarantee. Unbox thriving, active aquatic companions right at your door.",
    malayalamDescription: "ഇന്ത്യയിൽ എവിടെയും അതിവേഗ ഡെലിവറിയും 100% ലൈവ് അറൈവൽ ഗ്യാരണ്ടിയും.",
    iconName: "Truck",
    image: "/clay/shipping/step-4-van.webp",
  },
];

export interface Testimonial {
  id: string;
  author: string;
  location: string;
  text: string;
  malayalamText: string;
  rating: number;
  speciesPurchased: string;
  photo: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    author: "Rahul Menon",
    location: "Ernakulam, Kerala",
    text: "Received my Dumbo Ear Mosaic guppy pairs in top condition! Water was crystal clear and the tail spread is simply breathtaking. Ordering more next week.",
    malayalamText: "ഡംബോ ഇയർ മൊസൈക് ഗപ്പികൾ വളരെ സുരക്ഷിതമായി എത്തി. ചിറകുകളുടെ ഭംഗി അതിശയകരമാണ്!",
    rating: 5,
    speciesPurchased: "Show Guppy Trio",
    photo: "/photos/customer-1.jpg",
  },
  {
    id: "t2",
    author: "Dr. Ananya Sharma",
    location: "Bengaluru, Karnataka",
    text: "Superbly packed! Shipped from Thrissur to Bangalore in 24 hours. The red cherry shrimp immediately started grazing on my Christmas moss.",
    malayalamText: "ബാംഗ്ലൂരിലേക്ക് 24 മണിക്കൂറിനുള്ളിൽ കൃത്യമായി എത്തി. പാക്കിംഗ് അത്യുഗ്രൻ!",
    rating: 5,
    speciesPurchased: "20x Cherry Shrimp",
    photo: "/photos/customer-2.jpg",
  },
  {
    id: "t3",
    author: "Anoop Varma",
    location: "Kozhikode, Kerala",
    text: "Watched their Malayalam YouTube farm tour and ordered 2 pairs of Koi Swordtails. Honest breeders with remarkable passion.",
    malayalamText: "യൂട്യൂബ് വീഡിയോ കണ്ടാണ് ഓർഡർ ചെയ്തത്. നേരിട്ട് വാങ്ങിയതുപോലെയുള്ള അനുഭവം.",
    rating: 5,
    speciesPurchased: "Koi Swordtail Pairs",
    photo: "/photos/customer-3.jpg",
  },
  {
    id: "t4",
    author: "Vignesh Sundaram",
    location: "Chennai, Tamil Nadu",
    text: "The blue dwarf crayfish arrived active and fearless. The guidance they give over WhatsApp for water acclimation was priceless.",
    malayalamText: "വാട്സ്ആപ്പിലൂടെ തന്ന നിർദ്ദേശങ്ങൾ വളരെ സഹായകരമായി. മികച്ച കസ്റ്റമർ സപ്പോർട്ട്.",
    rating: 5,
    speciesPurchased: "Dwarf Crayfish Pair",
    photo: "/photos/customer-4.jpg",
  },
];

export const FARM_STORY = {
  title: "Bred with Care in Nooluvally, Thrissur",
  malayalamTitle: "നൂലുവാള്ളിയുടെ മണ്ണിൽ നിന്നും നിങ്ങളുടെ ടാങ്കിലേക്ക്",
  subtitle: "Natural Open-Air Mineral Water Tubs",
  malayalamSubtitle: "പ്രകൃതിദത്ത കാലാവസ്ഥയിൽ വളർത്തുന്ന ശുദ്ധജല മത്സ്യങ്ങൾ",
  paragraphs: [
    "Nestled in the lush, verdant heartland of Nooluvally near Thrissur, Midhula Farm Hut began with a singular obsession: raising hardy, disease-resistant ornamental fish in open-air circular tubs nourished by Kerala's gentle monsoon rains and mineral-rich groundwater.",
    "Unlike sterile laboratory tanks, our outdoor breeding eco-system allows guppies, platies, and crustaceans to thrive on natural micro-fauna, duckweed, and sunlight. The result? Unrivalled color saturation, resilient immune systems, and zero shock when transitioning to home aquariums.",
    "Through our Malayalam YouTube channel and Instagram family, we share open, unfiltered farm tours, breeding secrets, and genuine care guides for every fish enthusiast.",
  ],
  malayalamParagraphs: [
    "തൃശ്ശൂർ നൂലുവാള്ളിയിലെ പ്രകൃതിരമണീയമായ അന്തരീക്ഷത്തിലാണ് മിഥുല ഫാം ഹട്ട് സ്ഥിതി ചെയ്യുന്നത്. നാച്വറൽ ടബ്ബുകളിലും തനതു കാലാവസ്ഥയിലും വളരുന്നതിനാൽ രോഗപ്രതിരോധശേഷി കൂടിയ മത്സ്യങ്ങളാണ് ഞങ്ങളുടെ പ്രത്യേകത.",
    "ലാബ് സാഹചര്യങ്ങളിലല്ലാതെ, പ്രകൃതിദത്ത സൂര്യപ്രകാശത്തിലും ജീവനുള്ള ആഹാരത്തിലും വളരുന്നതിനാൽ നിറപ്പകിട്ടും ആരോഗ്യവും ദീർഘായുസ്സും ഇവ ഉറപ്പുനൽകുന്നു.",
    "ഞങ്ങളുടെ മലയാളം യൂട്യൂബ് ചാനലിലൂടെയും ഇൻസ്റ്റാഗ്രാമിലൂടെയും ഫാമിന്റെ പ്രവർത്തനങ്ങൾ ഞങ്ങൾ സുതാര്യമായി പങ്കുവെക്കുന്നു.",
  ],
  gallery: [
    { src: "/photos/farm-tubs-1.jpg", alt: "Open-air breeding tubs at Midhula Farm Hut" },
    { src: "/photos/farm-tubs-2.jpg", alt: "High vitality broodstock maintenance" },
    { src: "/photos/farm-breeding.jpg", alt: "Natural plants and sorting tubs" },
  ],
};

// TODO: Client to confirm founder's exact bio, personal journey quote and registration details
export const FOUNDER_NOTE = {
  quote: "Every fish we ship carries the soul of Nooluvally's clear waters. Our mission is to make the joy of thriving, colorful aquariums accessible to every home in India.",
  malayalamQuote: "ഓരോ മീനിലും നൂലുവാള്ളിയുടെ പ്രകൃതിഭംഗിയുണ്ട്. ഇന്ത്യയിലെ ഏതൊരു വീടുകളിലും വർണ്ണമത്സ്യങ്ങളുടെ ആനന്ദം എത്തിക്കുകയാണ് ഞങ്ങളുടെ ലക്ഷ്യം.",
  author: "Midhula Farm Hut Family",
  role: "Founders & Culturists",
  location: "Nooluvally, Thrissur, Kerala",
};
