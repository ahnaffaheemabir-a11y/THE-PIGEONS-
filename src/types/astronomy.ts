export interface PlanetData {
  id: string;
  name: string;
  tagline: string;
  type: 'star' | 'terrestrial' | 'gas_giant' | 'ice_giant' | 'dwarf';
  color: string;
  ambientColor: string;
  radiusKm: number;
  visualRadius: number; // Scaled for visual orrery
  trueRadiusScale: number; // Relative to Earth = 1
  distanceAU: number; // Real astronomical units from Sun
  visualDistance: number; // Scaled distance for interactive visualization
  trueDistanceScale: number; // Scaled for true log scale
  orbitalPeriodDays: number; // Orbital period in Earth days
  rotationPeriodHours: number; // Day length
  orbitalVelocityKmS: number;
  axialTiltDeg: number;
  eccentricity: number;
  inclinationDeg: number;
  surfaceTempC: { min: number; max: number; avg: number };
  gravityMs2: number;
  moonsCount: number;
  atmosphere: string[];
  description: string;
  keyFeatures: string[];
  explorationHighlights: string[];
  hasRings?: boolean;
  ringsConfig?: {
    innerRadius: number;
    outerRadius: number;
    color: string;
  };
}

export interface CelestialBodyState {
  currentAngle: number;
  x: number;
  y: number;
  z: number;
  rotationAngle: number;
}
