import { PlanetData } from '../types/astronomy';

export const PLANETS_DATA: PlanetData[] = [
  {
    id: 'sun',
    name: 'Sun',
    tagline: 'Yellow Dwarf G-Type Main-Sequence Star (G2V)',
    type: 'star',
    color: '#FDB813',
    ambientColor: '#FF6200',
    radiusKm: 696340,
    visualRadius: 16,
    trueRadiusScale: 109.2,
    distanceAU: 0,
    visualDistance: 0,
    trueDistanceScale: 0,
    orbitalPeriodDays: 0,
    rotationPeriodHours: 609.12, // ~25.38 Earth days
    orbitalVelocityKmS: 0,
    axialTiltDeg: 7.25,
    eccentricity: 0,
    inclinationDeg: 0,
    surfaceTempC: { min: 5500, max: 15000000, avg: 5505 },
    gravityMs2: 274.0,
    moonsCount: 0,
    atmosphere: ['73.4% Hydrogen', '25.0% Helium', '0.9% Oxygen', '0.3% Carbon', '0.2% Iron'],
    description: 'The gravitational anchor of our solar system, containing 99.86% of all system mass. Its core fuses approximately 600 million tons of hydrogen into helium every second, generating radiant energy that sustains planetary biospheres.',
    keyFeatures: [
      'Photosphere with dynamic solar granulation & sunspots',
      'Coronal mass ejections extending millions of kilometers',
      'Solar magnetic cycle reversing every 11 years',
      'Heliosphere extending beyond 120 AU into interstellar space'
    ],
    explorationHighlights: [
      'Parker Solar Probe: Closest human-made approach to a stellar corona',
      'SOHO & SDO: 24/7 continuous multi-spectral solar flare observation'
    ]
  },
  {
    id: 'mercury',
    name: 'Mercury',
    tagline: 'Innermost Cratered Rocky World',
    type: 'terrestrial',
    color: '#A09890',
    ambientColor: '#706860',
    radiusKm: 2439.7,
    visualRadius: 2.2,
    trueRadiusScale: 0.383,
    distanceAU: 0.387,
    visualDistance: 28,
    trueDistanceScale: 18,
    orbitalPeriodDays: 87.97,
    rotationPeriodHours: 1407.6, // 58.6 days (3:2 spin-orbit resonance)
    orbitalVelocityKmS: 47.36,
    axialTiltDeg: 0.034,
    eccentricity: 0.2056,
    inclinationDeg: 7.005,
    surfaceTempC: { min: -180, max: 430, avg: 167 },
    gravityMs2: 3.7,
    moonsCount: 0,
    atmosphere: ['42% Molecular Oxygen', '29% Sodium', '22% Hydrogen', '6% Helium', '0.5% Potassium'],
    description: 'The smallest planet in the solar system and closest to the Sun. Mercury experiences extreme thermal swings between scorching daytime heat and deep freezing nights due to its lack of a substantial heat-retaining atmosphere.',
    keyFeatures: [
      '3:2 spin-orbit resonance: 3 rotations for every 2 solar orbits',
      'Enormous metallic iron core occupying ~85% of planetary radius',
      'Caloris Basin: 1,550 km impact basin created in early solar system'
    ],
    explorationHighlights: [
      'Mariner 10: First dual-flyby mission (1974-1975)',
      'MESSENGER: First orbital survey uncovering water ice in polar craters',
      'BepiColombo: Dual-orbiter mission en route for 2026 science operations'
    ]
  },
  {
    id: 'venus',
    name: 'Venus',
    tagline: 'Runaway Greenhouse Volcanic Twin',
    type: 'terrestrial',
    color: '#E3BB76',
    ambientColor: '#C49147',
    radiusKm: 6051.8,
    visualRadius: 3.8,
    trueRadiusScale: 0.949,
    distanceAU: 0.723,
    visualDistance: 44,
    trueDistanceScale: 32,
    orbitalPeriodDays: 224.7,
    rotationPeriodHours: -5832.5, // Retrograde rotation
    orbitalVelocityKmS: 35.02,
    axialTiltDeg: 177.36, // Rotates clockwise (retrograde)
    eccentricity: 0.0067,
    inclinationDeg: 3.394,
    surfaceTempC: { min: 438, max: 482, avg: 464 },
    gravityMs2: 8.87,
    moonsCount: 0,
    atmosphere: ['96.5% Carbon Dioxide', '3.5% Nitrogen', 'Sulfuric Acid Clouds', '0.015% Sulfur Dioxide'],
    description: 'Often called Earth’s twin due to similar size and mass, Venus underwent runaway greenhouse warming. Its crushing carbon dioxide atmosphere produces surface pressures 92 times greater than Earth’s—equivalent to 900 meters ocean depth.',
    keyFeatures: [
      'Hottest surface of any planet, exceeding lead melting temperature',
      'Retrograde rotation: The Sun rises in the west and sets in the east',
      'Super-rotating atmosphere: Cloud decks orbit the planet in just 4 Earth days',
      'Over 1,600 major volcanoes and extensive basaltic lava plains'
    ],
    explorationHighlights: [
      'Venera 13 & 14: Historic Soviet landers transmitting color surface photos',
      'Magellan: Global radar mapping revealing tectonic fractures and lava canals',
      'DAVINCI & VERITAS: Upcoming NASA atmospheric probe and radar orbiters'
    ]
  },
  {
    id: 'earth',
    name: 'Earth',
    tagline: 'Dynamic Blue Marble & Oasis of Life',
    type: 'terrestrial',
    color: '#2B82C9',
    ambientColor: '#1A4D7C',
    radiusKm: 6371.0,
    visualRadius: 4.0,
    trueRadiusScale: 1.0,
    distanceAU: 1.0,
    visualDistance: 62,
    trueDistanceScale: 46,
    orbitalPeriodDays: 365.256,
    rotationPeriodHours: 23.934,
    orbitalVelocityKmS: 29.78,
    axialTiltDeg: 23.44,
    eccentricity: 0.0167,
    inclinationDeg: 0.0,
    surfaceTempC: { min: -89.2, max: 56.7, avg: 15 },
    gravityMs2: 9.807,
    moonsCount: 1,
    atmosphere: ['78.08% Nitrogen', '20.95% Oxygen', '0.93% Argon', '0.04% Carbon Dioxide', 'Water Vapor'],
    description: 'The only known world harboring life and liquid surface oceans. Earth maintains a dynamic geodynamo magnetic shield, active plate tectonics, oxygen-rich atmosphere, and a thriving global civilization connected across interconnected continents and megacities.',
    keyFeatures: [
      '71% liquid water ocean coverage sustaining complex biosphere',
      'Protective magnetosphere deflecting solar wind and cosmic rays',
      'Thriving human civilization across hundreds of illuminated metropolis centers',
      'Large natural satellite (Moon) stabilizing orbital axial tilt and driving tides'
    ],
    explorationHighlights: [
      'Continuous orbital monitoring via Landsat, Sentinel, and Earth observation fleets',
      'International Space Station: 25+ years of continuous human space habitation',
      'Artemis program: Returning humanity to lunar orbit and establishing permanent bases'
    ]
  },
  {
    id: 'mars',
    name: 'Mars',
    tagline: 'The Red Planet & Frontier of Exploration',
    type: 'terrestrial',
    color: '#D15838',
    ambientColor: '#8C311E',
    radiusKm: 3389.5,
    visualRadius: 2.8,
    trueRadiusScale: 0.532,
    distanceAU: 1.524,
    visualDistance: 82,
    trueDistanceScale: 64,
    orbitalPeriodDays: 686.98,
    rotationPeriodHours: 24.623,
    orbitalVelocityKmS: 24.07,
    axialTiltDeg: 25.19,
    eccentricity: 0.0934,
    inclinationDeg: 1.85,
    surfaceTempC: { min: -140, max: 20, avg: -63 },
    gravityMs2: 3.72,
    moonsCount: 2,
    atmosphere: ['95.3% Carbon Dioxide', '2.6% Nitrogen', '1.9% Argon', '0.13% Oxygen', '0.08% Carbon Monoxide'],
    description: 'A rust-colored world of colossal volcanoes, ancient river channels, and dry lakebeds. Mars possesses the solar system’s largest volcano, Olympus Mons, and a canyon system, Valles Marineris, that stretches across the breadth of North America.',
    keyFeatures: [
      'Olympus Mons: Shield volcano standing 21.9 km high (nearly 3x Mount Everest)',
      'Valles Marineris: 4,000 km long rift valley up to 7 km deep',
      'Polar ice caps composed of water ice capped by seasonal frozen CO2',
      'Subsurface brine deposits and evidence of ancient habitable river deltas'
    ],
    explorationHighlights: [
      'Curiosity & Perseverance: Autonomous nuclear-powered rovers seeking biosignatures',
      'Ingenuity: First powered controlled aerodynamic flight on another planet',
      'Future Mars Human Outposts: Geodesic colonies targeted for 2030s exploration'
    ]
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    tagline: 'King of Planets & Gas Giant Behemoth',
    type: 'gas_giant',
    color: '#C88B3A',
    ambientColor: '#8A561E',
    radiusKm: 69911,
    visualRadius: 9.2,
    trueRadiusScale: 10.97,
    distanceAU: 5.204,
    visualDistance: 114,
    trueDistanceScale: 96,
    orbitalPeriodDays: 4332.59, // 11.86 years
    rotationPeriodHours: 9.925, // Fastest rotator
    orbitalVelocityKmS: 13.07,
    axialTiltDeg: 3.13,
    eccentricity: 0.0489,
    inclinationDeg: 1.304,
    surfaceTempC: { min: -145, max: -110, avg: -110 },
    gravityMs2: 24.79,
    moonsCount: 95,
    atmosphere: ['89.8% Hydrogen', '10.2% Helium', 'Methane', 'Ammonia', 'Hydrogen Deuteride'],
    description: 'More massive than all other solar system planets combined, Jupiter acts as a cosmic gravitational vacuum cleaner. Its high-speed differential rotation powers bands of counter-flowing atmospheric jet streams and ancient cyclonic vortices.',
    keyFeatures: [
      'Great Red Spot: Persistent anticyclonic storm larger than Earth, raging for 300+ years',
      'Fastest planetary rotation: Completes a day in less than 10 hours',
      'Four Galilean Moons: Volcanic Io, icy oceanic Europa, Ganymede, and Callisto',
      'Colossal magnetosphere extending past Saturn’s orbit'
    ],
    explorationHighlights: [
      'Voyager 1 & 2: First close-up imaging of the Great Red Spot and Jovian rings',
      'Galileo: Dropped first atmospheric probe directly into Jupiter’s cloud deck',
      'Juno: Polar orbiter revealing deep atmospheric ammonia roots and cyclonic clusters',
      'JUICE & Europa Clipper: Next-gen missions probing sub-surface oceans for habitability'
    ]
  },
  {
    id: 'saturn',
    name: 'Saturn',
    tagline: 'Jewel of the Solar System & Ringed Masterpiece',
    type: 'gas_giant',
    color: '#E2BF7D',
    ambientColor: '#A38446',
    radiusKm: 58232,
    visualRadius: 8.0,
    trueRadiusScale: 9.14,
    distanceAU: 9.582,
    visualDistance: 148,
    trueDistanceScale: 128,
    orbitalPeriodDays: 10759.22, // 29.45 years
    rotationPeriodHours: 10.56,
    orbitalVelocityKmS: 9.68,
    axialTiltDeg: 26.73,
    eccentricity: 0.0565,
    inclinationDeg: 2.485,
    surfaceTempC: { min: -178, max: -130, avg: -140 },
    gravityMs2: 10.44,
    moonsCount: 146,
    atmosphere: ['96.3% Hydrogen', '3.25% Helium', '0.45% Methane', '0.01% Ammonia'],
    description: 'Distinguished by the most extensive and brilliant planetary ring system in our solar system, composed of billions of pieces of water ice ranging from dust specks to house-sized boulders. Saturn is also the least dense planet—it would float in water.',
    hasRings: true,
    ringsConfig: {
      innerRadius: 10.5,
      outerRadius: 19.5,
      color: '#D8C29D'
    },
    keyFeatures: [
      'Majestic ring system spanning 282,000 km across but only ~10 meters thick',
      'Cassini Division: 4,800 km gap swept clean by gravitational resonance with moon Mimas',
      'Hexagonal storm jet stream permanently circling Saturn’s north pole',
      'Titan: Only moon in the solar system with a dense atmosphere and liquid methane lakes'
    ],
    explorationHighlights: [
      'Pioneer 11 & Voyager: Revealed intricate fine ringlet structures',
      'Cassini-Huygens: 13-year landmark orbital tour landing Huygens probe on Titan',
      'Cassini Grand Finale: 22 dives through the unexplored gap between Saturn and its rings'
    ]
  },
  {
    id: 'uranus',
    name: 'Uranus',
    tagline: 'Tilted Ice Giant of Pale Cyan',
    type: 'ice_giant',
    color: '#82C8D2',
    ambientColor: '#45858F',
    radiusKm: 25362,
    visualRadius: 5.6,
    trueRadiusScale: 3.98,
    distanceAU: 19.201,
    visualDistance: 184,
    trueDistanceScale: 165,
    orbitalPeriodDays: 30685.4, // 84.01 years
    rotationPeriodHours: -17.24, // Retrograde
    orbitalVelocityKmS: 6.80,
    axialTiltDeg: 97.77, // Rotates on its side!
    eccentricity: 0.0463,
    inclinationDeg: 0.772,
    surfaceTempC: { min: -224, max: -197, avg: -195 },
    gravityMs2: 8.69,
    moonsCount: 28,
    atmosphere: ['82.5% Hydrogen', '15.2% Helium', '2.3% Methane', 'Water, Ammonia & Methane Ices'],
    description: 'An ice giant tilted sideways at 97.8 degrees, likely knocked over by an ancient planetary collision. Uranus orbits the Sun almost like a rolling ball, producing radical 42-year long periods of unbroken polar day and unbroken polar night.',
    hasRings: true,
    ringsConfig: {
      innerRadius: 6.8,
      outerRadius: 9.5,
      color: '#65959C'
    },
    keyFeatures: [
      '97.8-degree axial tilt causing extreme seasonal variation',
      'Methane in upper atmosphere absorbs red light, giving the planet its cyan hue',
      'Coldest planetary atmosphere in the solar system, plunging to -224 °C (49 K)',
      'Faint system of 13 narrow dark rings made of dark organic-rich boulder debris'
    ],
    explorationHighlights: [
      'Voyager 2: Historic 1986 flyby discovering 10 new moons and complex magnetic dipole tilt',
      'James Webb Space Telescope: Infrared imaging resolving high-contrast dynamic storm bands'
    ]
  },
  {
    id: 'neptune',
    name: 'Neptune',
    tagline: 'Supersonic Winds & Deep Azure Abyss',
    type: 'ice_giant',
    color: '#4169E1',
    ambientColor: '#1A3382',
    radiusKm: 24622,
    visualRadius: 5.4,
    trueRadiusScale: 3.86,
    distanceAU: 30.047,
    visualDistance: 220,
    trueDistanceScale: 200,
    orbitalPeriodDays: 60189.0, // 164.8 years
    rotationPeriodHours: 16.11,
    orbitalVelocityKmS: 5.43,
    axialTiltDeg: 28.32,
    eccentricity: 0.0095,
    inclinationDeg: 1.769,
    surfaceTempC: { min: -218, max: -201, avg: -201 },
    gravityMs2: 11.15,
    moonsCount: 16,
    atmosphere: ['80.0% Hydrogen', '19.0% Helium', '1.5% Methane', 'Ammonia & Water Ices'],
    description: 'The most distant major planet in the solar system, located 30 times farther from the Sun than Earth. Neptune radiates 2.6 times more internal heat than it receives from the weak distant Sun, driving the fastest atmospheric winds in the solar system.',
    keyFeatures: [
      'Supersonic wind speeds reaching 2,100 km/h (1,300 mph)',
      'Deep azure coloration from high-altitude methane ice crystal scattering',
      'Triton: Retrograde icy moon with active cryovolcanic nitrogen geysers',
      'Predicted mathematically by Urbain Le Verrier before ever being seen by telescope'
    ],
    explorationHighlights: [
      'Voyager 2: 1989 encounter discovering Great Dark Spot and geysers on moon Triton',
      'Hubble Space Telescope: Decades-long tracking of shifting dark vortices'
    ]
  },
  {
    id: 'pluto',
    name: 'Pluto',
    tagline: 'Heart of the Kuiper Belt',
    type: 'dwarf',
    color: '#C4A482',
    ambientColor: '#7A5E44',
    radiusKm: 1188.3,
    visualRadius: 1.6,
    trueRadiusScale: 0.186,
    distanceAU: 39.482,
    visualDistance: 254,
    trueDistanceScale: 236,
    orbitalPeriodDays: 90560.0, // 248 Earth years
    rotationPeriodHours: -153.3, // Retrograde
    orbitalVelocityKmS: 4.74,
    axialTiltDeg: 122.53,
    eccentricity: 0.2488,
    inclinationDeg: 17.16,
    surfaceTempC: { min: -240, max: -218, avg: -229 },
    gravityMs2: 0.62,
    moonsCount: 5,
    atmosphere: ['Nitrogen', 'Methane', 'Carbon Monoxide (Thin seasonal exosphere)'],
    description: 'A geologically active dwarf planet featuring towering water-ice mountains, rolling nitrogen glaciers, and a vast heart-shaped basin known as Tombaugh Regio. Pluto orbits in a resonant gravitational lockstep with giant moon Charon.',
    keyFeatures: [
      'Sputnik Planitia: Vast 1,000-km convecting sea of nitrogen and carbon monoxide ice',
      'Tidally locked binary system: Pluto and Charon always face each other',
      'Cryovolcanic ice peaks like Wright Mons rising 4 km above frozen plains'
    ],
    explorationHighlights: [
      'New Horizons: Landmark 2015 flyby unveiling youthful geology and complex hazes'
    ]
  }
];
