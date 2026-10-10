export interface CityData {
  id: string;
  name: string;
  country: string;
  planetId: 'earth' | 'mars' | 'moon';
  lat: number;
  lng: number;
  population: string;
  timezone: string;
  utcOffset: number; // in hours
  elevationM: number;
  areaKm2: number;
  climate: string;
  description: string;
  landmarks: {
    name: string;
    type: 'tower' | 'bridge' | 'building' | 'monument' | 'pyramid' | 'dome';
    heightM: number;
    description: string;
  }[];
  architecturalStyle: string;
  nightLightingColor: string; // Hex color for city glow
  colorTheme: string;
  skylineStats: {
    skyscrapersOver150m: number;
    tallestStructure: string;
    tallestHeightM: number;
  };
}

export type CameraPreset = 'cinematic_orbit' | 'rooftop' | 'street_cruise' | 'top_down';
