import { CityData } from '../types/cities';

export const CITIES_DATA: CityData[] = [
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    planetId: 'earth',
    lat: 35.6762,
    lng: 139.6503,
    population: '37.4 Million (Greater Metro)',
    timezone: 'Asia/Tokyo',
    utcOffset: 9,
    elevationM: 40,
    areaKm2: 2194,
    climate: 'Humid Subtropical',
    description: 'The world’s most populous metropolitan area, Tokyo is an ultra-dense marvel of neon-lit skyscraper districts, cutting-edge seismic architecture, efficient transit arteries, and coastal harbor developments along Tokyo Bay.',
    landmarks: [
      { name: 'Tokyo Skytree', type: 'tower', heightM: 634, description: 'Tallest structure in Japan and world’s third-tallest structure with neo-futuristic lattice truss.' },
      { name: 'Tokyo Tower', type: 'tower', heightM: 333, description: 'Iconic red-and-white communications tower inspired by the Eiffel Tower.' },
      { name: 'Roppongi Hills Mori Tower', type: 'building', heightM: 238, description: 'High-density commercial skyscraper with rooftop observation heliport.' },
      { name: 'Rainbow Bridge', type: 'bridge', heightM: 126, description: 'Iconic suspension bridge spanning northern Tokyo Bay to Odaiba.' }
    ],
    architecturalStyle: 'High-Tech Modernist & Seismic Resilient',
    nightLightingColor: '#38BDF8', // Cyan neon
    colorTheme: '#0EA5E9',
    skylineStats: {
      skyscrapersOver150m: 167,
      tallestStructure: 'Tokyo Skytree',
      tallestHeightM: 634
    }
  },
  {
    id: 'new_york',
    name: 'New York City',
    country: 'United States',
    planetId: 'earth',
    lat: 40.7128,
    lng: -74.006,
    population: '19.8 Million (Metro)',
    timezone: 'America/New_York',
    utcOffset: -4, // EDT / -5 EST
    elevationM: 10,
    areaKm2: 783.8,
    climate: 'Humid Continental',
    description: 'The premier global financial capital defined by the soaring granite and glass canyons of Manhattan Island, flanked by the Hudson and East rivers, connected by historic suspension bridges and punctuated by Central Park.',
    landmarks: [
      { name: 'One World Trade Center', type: 'building', heightM: 541, description: 'Tallest building in the Western Hemisphere with chamfered glass spire rising to 1,776 feet.' },
      { name: 'Empire State Building', type: 'building', heightM: 443, description: 'Art Deco legend with illuminated tiered spire and world-famous observation deck.' },
      { name: 'Chrysler Building', type: 'building', heightM: 319, description: 'Masterpiece Art Deco crown with terraced sunburst arches in stainless steel.' },
      { name: 'Brooklyn Bridge', type: 'bridge', heightM: 84, description: 'Neo-Gothic dual stone arch suspension bridge over the East River.' }
    ],
    architecturalStyle: 'Art Deco & Neo-Modernist Glass Towers',
    nightLightingColor: '#F59E0B', // Warm amber / golden
    colorTheme: '#EAB308',
    skylineStats: {
      skyscrapersOver150m: 315,
      tallestStructure: 'One World Trade Center',
      tallestHeightM: 541
    }
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    planetId: 'earth',
    lat: 48.8566,
    lng: 2.3522,
    population: '11.1 Million (Metro)',
    timezone: 'Europe/Paris',
    utcOffset: 2, // CEST
    elevationM: 35,
    areaKm2: 105.4,
    climate: 'Oceanic',
    description: 'The City of Light, celebrated for its Baron Haussmann boulevards, creamy Lutetian limestone façades, the majestic bends of the Seine River, and the commanding silhouette of the wrought-iron Eiffel Tower.',
    landmarks: [
      { name: 'Eiffel Tower', type: 'tower', heightM: 330, description: 'Puddle iron lattice tower constructed for the 1889 Exposition Universelle, globally iconic symbol of France.' },
      { name: 'Tour Montparnasse', type: 'building', heightM: 210, description: 'Prominent modern monolith office tower in southern Paris with sweeping panoramic terrace.' },
      { name: 'Arc de Triomphe', type: 'monument', heightM: 50, description: 'Triumphal arch at the center of Place Charles de Gaulle with 12 radiating grand avenues.' },
      { name: 'La Défense Grande Arche', type: 'monument', heightM: 110, description: 'Hollow monumental cube anchoring Europe’s largest purpose-built business district.' }
    ],
    architecturalStyle: 'Haussmannian Classical & Ironwork Engineering',
    nightLightingColor: '#FBBF24', // Champagne gold
    colorTheme: '#F59E0B',
    skylineStats: {
      skyscrapersOver150m: 28, // La Défense
      tallestStructure: 'Eiffel Tower',
      tallestHeightM: 330
    }
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    planetId: 'earth',
    lat: 51.5074,
    lng: -0.1278,
    population: '14.8 Million (Metro)',
    timezone: 'Europe/London',
    utcOffset: 1, // BST
    elevationM: 25,
    areaKm2: 1572,
    climate: 'Temperate Oceanic',
    description: 'A global crossroads where 2,000 years of Roman and Victorian history intersect with bold contemporary post-modern architecture along the meandering tidal Thames River.',
    landmarks: [
      { name: 'The Shard', type: 'building', heightM: 310, description: 'Renzo Piano designed 72-storey pyramidal glass spire clad in ultra-clear glass shards.' },
      { name: 'The Gherkin (30 St Mary Axe)', type: 'building', heightM: 180, description: 'Norman Foster radial diagrid aerodynamic skyscraper in the City financial core.' },
      { name: 'Big Ben & Palace of Westminster', type: 'tower', heightM: 96, description: 'Perpendicular Gothic revival clock tower with iconic Great Bell overlooking Parliament.' },
      { name: 'Tower Bridge', type: 'bridge', heightM: 65, description: 'Combined bascule and suspension bridge with high-level walkways over the Thames.' }
    ],
    architecturalStyle: 'Victorian Gothic & High-Tech Parametric Glass',
    nightLightingColor: '#60A5FA', // River cobalt
    colorTheme: '#3B82F6',
    skylineStats: {
      skyscrapersOver150m: 39,
      tallestStructure: 'The Shard',
      tallestHeightM: 310
    }
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    planetId: 'earth',
    lat: 25.2048,
    lng: 55.2708,
    population: '3.6 Million',
    timezone: 'Asia/Dubai',
    utcOffset: 4,
    elevationM: 5,
    areaKm2: 4114,
    climate: 'Hot Desert',
    description: 'An audacious hyper-modern metropolis rising out of the Arabian sands, boasting the world’s tallest tower, artificial archipelago islands, opulent marina canals, and gleaming chrome-and-glass supertalls.',
    landmarks: [
      { name: 'Burj Khalifa', type: 'tower', heightM: 828, description: 'The undisputed tallest human-made structure in history, featuring a buttressed core inspired by the Hymenocallis desert flower.' },
      { name: 'Burj Al Arab', type: 'building', heightM: 321, description: 'Sail-shaped luxury hotel positioned on an artificial island offshore from Jumeirah Beach.' },
      { name: 'Marina 101', type: 'building', heightM: 425, description: 'Second tallest residential skyscraper in Dubai soaring above the canal yacht marina.' },
      { name: 'Dubai Frame', type: 'monument', heightM: 150, description: 'Massive gilded picture frame bridging views of old Dubai and futuristic downtown.' }
    ],
    architecturalStyle: 'Futuristic Supertall & Islamic Geometric Glass',
    nightLightingColor: '#EAB308', // Radiant gold
    colorTheme: '#CA8A04',
    skylineStats: {
      skyscrapersOver150m: 251,
      tallestStructure: 'Burj Khalifa',
      tallestHeightM: 828
    }
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    planetId: 'earth',
    lat: 1.3521,
    lng: 103.8198,
    population: '5.9 Million',
    timezone: 'Asia/Singapore',
    utcOffset: 8,
    elevationM: 15,
    areaKm2: 734.3,
    climate: 'Tropical Rainforest',
    description: 'The premier tropical Garden City of Southeast Asia, pioneering vertical biophilic skyscrapers draped in living greenery, world-class shipping port anchorages, and iconic cantilevered sky parks.',
    landmarks: [
      { name: 'Marina Bay Sands', type: 'building', heightM: 207, description: 'Triple 55-story hotel towers crowned by a 340-meter cantilevered SkyPark and infinity pool.' },
      { name: 'Supertree Grove', type: 'monument', heightM: 50, description: 'Solar-powered vertical gardens wrapped in bromeliads, orchids, and kinetic lighting.' },
      { name: 'Guoco Tower', type: 'building', heightM: 284, description: 'Tallest mixed-use skyscraper in Singapore above Tanjong Pagar MRT station.' },
      { name: 'Singapore Flyer', type: 'monument', heightM: 165, description: 'Giant observation wheel with panoramic vistas across the Singapore Strait to Indonesia.' }
    ],
    architecturalStyle: 'Biophilic Vertical Urbanism & Tropical High-Tech',
    nightLightingColor: '#10B981', // Emerald garden glow
    colorTheme: '#059669',
    skylineStats: {
      skyscrapersOver150m: 97,
      tallestStructure: 'Guoco Tower',
      tallestHeightM: 284
    }
  },
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    planetId: 'earth',
    lat: -33.8688,
    lng: 151.2093,
    population: '5.3 Million',
    timezone: 'Australia/Sydney',
    utcOffset: 10, // AEST
    elevationM: 19,
    areaKm2: 12368,
    climate: 'Humid Subtropical',
    description: 'Australia’s emerald harbor gateway, famed for the dramatic precast concrete sail shells of the Sydney Opera House, the iconic steel coat hanger arch of the Harbour Bridge, and glittering waterfront financial towers.',
    landmarks: [
      { name: 'Sydney Opera House', type: 'monument', heightM: 65, description: 'Jørn Utzon masterpiece featuring interlocking vaulted ceramic tile shell roofs.' },
      { name: 'Sydney Harbour Bridge', type: 'bridge', heightM: 134, description: 'World’s tallest steel arch bridge connecting Sydney CBD with the North Shore.' },
      { name: 'Crown Sydney (One Barangaroo)', type: 'building', heightM: 271, description: 'Sculptural twisting glass tower rising above the western harbor precinct.' },
      { name: 'Sydney Tower Eye', type: 'tower', heightM: 309, description: 'Freestanding spire with golden observation turret and double-deck skywalk.' }
    ],
    architecturalStyle: 'Expressionist Marine & Modernist Coastal Glass',
    nightLightingColor: '#38BDF8', // Coastal azure
    colorTheme: '#0284C7',
    skylineStats: {
      skyscrapersOver150m: 54,
      tallestStructure: 'Sydney Tower Eye',
      tallestHeightM: 309
    }
  },
  {
    id: 'san_francisco',
    name: 'San Francisco',
    country: 'United States',
    planetId: 'earth',
    lat: 37.7749,
    lng: -122.4194,
    population: '4.7 Million (Bay Area Metro 7.7M)',
    timezone: 'America/Los_Angeles',
    utcOffset: -7, // PDT
    elevationM: 52,
    areaKm2: 121.4,
    climate: 'Warm-summer Mediterranean',
    description: 'A peninsula jewel nestled between the Pacific Ocean and San Francisco Bay, known for rolling hills, morning coastal fog, historic cable cars, the iconic International Orange Golden Gate Bridge, and the tech skyline.',
    landmarks: [
      { name: 'Golden Gate Bridge', type: 'bridge', heightM: 227, description: 'Art Deco suspension span in signature International Orange crossing the Golden Gate strait.' },
      { name: 'Salesforce Tower', type: 'building', heightM: 326, description: 'Obelisk skyscraper with tapering crown and continuous LED public art screen.' },
      { name: 'Transamerica Pyramid', type: 'building', heightM: 260, description: 'Futuristic 4-sided pyramid with cantilevered aircraft wing elevator shafts.' },
      { name: 'Coit Tower', type: 'tower', heightM: 64, description: 'Art Deco concrete tower perched atop Telegraph Hill with 360-degree bay views.' }
    ],
    architecturalStyle: 'Art Deco Engineering & High-Tech Curvature Glass',
    nightLightingColor: '#FB923C', // Warm bridge orange
    colorTheme: '#F97316',
    skylineStats: {
      skyscrapersOver150m: 29,
      tallestStructure: 'Salesforce Tower',
      tallestHeightM: 326
    }
  },
  {
    id: 'rio_de_janeiro',
    name: 'Rio de Janeiro',
    country: 'Brazil',
    planetId: 'earth',
    lat: -22.9068,
    lng: -43.1729,
    population: '13.6 Million (Metro)',
    timezone: 'America/Sao_Paulo',
    utcOffset: -3,
    elevationM: 11,
    areaKm2: 1200,
    climate: 'Tropical Savanna',
    description: 'The Marvelous City, where dramatic Atlantic rainforest granite peaks drop sheer into crescent ocean beaches, framed by Sugarloaf Mountain and Christ the Redeemer towering above Guanabara Bay.',
    landmarks: [
      { name: 'Christ the Redeemer', type: 'monument', heightM: 38, description: 'Art Deco soapstone statue of Jesus Christ with 28-meter arm span atop Corcovado mountain.' },
      { name: 'Sugarloaf Mountain (Pão de Açúcar)', type: 'monument', heightM: 396, description: 'Granite monolith rising directly from the mouth of Guanabara Bay with glass aerial tramways.' },
      { name: 'Rio Branco Financial Towers', type: 'building', heightM: 165, description: 'Dense commercial financial core lined with modernist Brazilian concrete architecture.' },
      { name: 'Museum of Tomorrow (Santiago Calatrava)', type: 'monument', heightM: 20, description: 'Neofuturistic cantilevered pier museum with dynamic solar wing roof.' }
    ],
    architecturalStyle: 'Brazilian Modernist Concrete & Tropical Coastal High-Rises',
    nightLightingColor: '#22C55E', // Lush Atlantic forest green
    colorTheme: '#16A34A',
    skylineStats: {
      skyscrapersOver150m: 14,
      tallestStructure: 'Sugarloaf Natural Peak (396m) / Torre do Rio Sul (164m)',
      tallestHeightM: 164
    }
  },
  {
    id: 'cairo',
    name: 'Cairo',
    country: 'Egypt',
    planetId: 'earth',
    lat: 30.0444,
    lng: 31.2357,
    population: '22.2 Million (Greater Metro)',
    timezone: 'Africa/Cairo',
    utcOffset: 3,
    elevationM: 23,
    areaKm2: 3085,
    climate: 'Hot Desert',
    description: 'The cradle of civilization on the fertile banks of the Nile, where ancient megalithic wonders of the Pharaohs meet modern riverfront high-rises and the new administrative capital’s Iconic Tower.',
    landmarks: [
      { name: 'Great Pyramid of Giza (Khufu)', type: 'pyramid', heightM: 139, description: 'Oldest of the Seven Wonders of the Ancient World, built from 2.3 million limestone blocks.' },
      { name: 'Cairo Tower', type: 'tower', heightM: 187, description: 'Free-standing concrete lattice tower designed to resemble a Pharaohic lotus plant.' },
      { name: 'Iconic Tower (New Capital)', type: 'building', heightM: 394, description: 'Tallest skyscraper in Africa, evoking an ancient Pharaonic obelisk.' },
      { name: 'Qasr El Nil Bridge', type: 'bridge', heightM: 25, description: 'Historic steel swing bridge flanked by four monumental bronze guardian lions.' }
    ],
    architecturalStyle: 'Pharaonic Monumentalism & Nile River Modernism',
    nightLightingColor: '#F59E0B', // Desert amber
    colorTheme: '#D97706',
    skylineStats: {
      skyscrapersOver150m: 12,
      tallestStructure: 'Iconic Tower',
      tallestHeightM: 394
    }
  },
  {
    id: 'mars_olympus',
    name: 'Olympus City & Jezero Hub',
    country: 'Mars Frontier (Human Colony)',
    planetId: 'mars',
    lat: 18.38,
    lng: 77.58,
    population: '12,500 Colonists (Simulated 2050)',
    timezone: 'Mars Sol Time (MTC)',
    utcOffset: 0,
    elevationM: 3200,
    areaKm2: 85,
    climate: 'Thin CO2 Atmosphere (-60°C avg)',
    description: 'Humanity’s first permanent interplanetary city established at the base of Olympus Mons and Jezero Delta. Pressurized geodesic bio-domes, subsurface lava tube habitats, regolith 3D-printed radiation shields, and oxygen cracking towers.',
    landmarks: [
      { name: 'Olympus Central Bio-Dome', type: 'dome', heightM: 180, description: 'Pressurized graphene-reinforced geodesic dome maintaining 1 atm Earth-normal ecology.' },
      { name: 'Sabatier Fuel Production Plant', type: 'building', heightM: 95, description: 'Atmospheric methane & liquid oxygen chemical synthesis refinery for Earth-return rockets.' },
      { name: 'Mars Starship Launch Complex', type: 'tower', heightM: 145, description: 'Dual orbital capture launch towers with mechanical chopstick arms for heavy transport.' },
      { name: 'Solar Farm Alpha', type: 'monument', heightM: 30, description: 'Sprawling high-efficiency photovoltaic and radioisotope thermoelectric generator fields.' }
    ],
    architecturalStyle: 'In-Situ Resource Utilization (ISRU) Geodesic & Subterranean',
    nightLightingColor: '#EF4444', // Mars crimson glow
    colorTheme: '#DC2626',
    skylineStats: {
      skyscrapersOver150m: 4,
      tallestStructure: 'Olympus Bio-Dome Spine',
      tallestHeightM: 180
    }
  },
  {
    id: 'artemis_base',
    name: 'Artemis Lunar Base Camp',
    country: 'Moon (Shackleton Rim)',
    planetId: 'moon',
    lat: -89.9,
    lng: 0.0,
    population: '450 Lunar Pioneers (Simulated 2035)',
    timezone: 'Coordinated Lunar Time (LTC)',
    utcOffset: 0,
    elevationM: -4200,
    areaKm2: 24,
    climate: 'Hard Vacuum (Peak Sunlight Rim)',
    description: 'Perched on the rim of Shackleton Crater at the lunar South Pole, enjoying near-permanent solar illumination while extracting water ice from permanently shadowed crater regions to sustain a permanent deep space research outpost.',
    landmarks: [
      { name: 'Habitat Module 1 (Alpha Hub)', type: 'dome', heightM: 35, description: 'Multi-level inflatable habitat shielded with 2 meters of sintered lunar regolith bricks.' },
      { name: 'Polar Water Ice Extraction Rig', type: 'building', heightM: 55, description: 'Thermal drilling facility tapping volatile ice traps inside Shackleton Crater darkness.' },
      { name: 'Lunar Far-Side Radio Telescope Dish', type: 'monument', heightM: 120, description: 'Ultra-low frequency cosmic radio observatory shielded from Earth radio noise.' },
      { name: 'Surface Mobility Rover Hangar', type: 'dome', heightM: 25, description: 'Pressurized maintenance depot for pressurized long-range exploration rovers.' }
    ],
    architecturalStyle: 'Sintered Regolith Inflatable Habitat & Solar Pylons',
    nightLightingColor: '#A855F7', // Lunar violet beacon
    colorTheme: '#9333EA',
    skylineStats: {
      skyscrapersOver150m: 0,
      tallestStructure: 'South Pole Solar Pylon Array',
      tallestHeightM: 75
    }
  }
];
