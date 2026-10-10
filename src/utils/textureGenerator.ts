import * as THREE from 'three';

// Cache generated textures so we don't recreate them needlessly
const textureCache: Record<string, THREE.CanvasTexture> = {};

/**
 * Procedural Earth Day Texture with realistic continents, greens, desert sands, and ice caps.
 */
export function createEarthDayTexture(): THREE.CanvasTexture {
  if (textureCache['earth_day']) return textureCache['earth_day'];

  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // 1. Deep Ocean Base with subtle depth gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, '#0a2342'); // Arctic ocean
  oceanGrad.addColorStop(0.3, '#0b3c68'); // North Atlantic / Pacific
  oceanGrad.addColorStop(0.5, '#0c4d80'); // Equatorial deep blue
  oceanGrad.addColorStop(0.7, '#0b3c68'); // South Atlantic
  oceanGrad.addColorStop(1, '#0a2342'); // Antarctic ocean
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  // Shallow coastal shelves
  ctx.fillStyle = '#14689b';
  // Continents drawing using spherical-ish projected polygons and smooth blobs
  // Helper to draw continent shapes
  const drawShape = (points: [number, number][], fill: string) => {
    ctx.fillStyle = fill;
    ctx.beginPath();
    points.forEach(([xPct, yPct], i) => {
      const px = xPct * width;
      const py = yPct * height;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.fill();
  };

  // Eurasia & Africa Landmasses
  // Europe
  drawShape([
    [0.46, 0.22], [0.55, 0.20], [0.58, 0.26], [0.54, 0.35],
    [0.50, 0.38], [0.46, 0.34], [0.44, 0.26]
  ], '#2e5a27');

  // Scandinavia / UK
  drawShape([[0.48, 0.15], [0.54, 0.15], [0.52, 0.23], [0.47, 0.22]], '#3b6e32');
  drawShape([[0.44, 0.22], [0.47, 0.22], [0.46, 0.28], [0.43, 0.26]], '#33662a');

  // Asia / Russia
  drawShape([
    [0.55, 0.16], [0.82, 0.15], [0.88, 0.22], [0.82, 0.35],
    [0.72, 0.42], [0.65, 0.48], [0.58, 0.35], [0.58, 0.22]
  ], '#3d5c2e');

  // India
  drawShape([[0.66, 0.40], [0.72, 0.42], [0.68, 0.55], [0.65, 0.46]], '#4a7c36');

  // Southeast Asia & Indonesia
  drawShape([[0.74, 0.45], [0.78, 0.46], [0.76, 0.58], [0.72, 0.52]], '#295e20');
  drawShape([[0.76, 0.55], [0.82, 0.56], [0.84, 0.60], [0.78, 0.60]], '#22551a');

  // Japan Islands
  drawShape([[0.84, 0.32], [0.87, 0.33], [0.86, 0.42], [0.83, 0.38]], '#3a6930');

  // Middle East / Arabia (Desert Sand)
  drawShape([[0.55, 0.36], [0.62, 0.37], [0.60, 0.48], [0.54, 0.44]], '#c29b62');

  // Africa - North Sahara (Desert)
  drawShape([
    [0.44, 0.35], [0.55, 0.36], [0.58, 0.46], [0.42, 0.46], [0.42, 0.38]
  ], '#bfa168');
  // Africa - Sub-Saharan & Central Rainforest
  drawShape([
    [0.42, 0.46], [0.58, 0.46], [0.54, 0.65], [0.50, 0.72],
    [0.46, 0.65], [0.42, 0.52]
  ], '#32662c');

  // North America
  // Canada / Alaska
  drawShape([
    [0.10, 0.16], [0.28, 0.16], [0.32, 0.28], [0.24, 0.32],
    [0.14, 0.30], [0.08, 0.22]
  ], '#426038');
  // USA (East coast green, midwest, southwest desert)
  drawShape([
    [0.14, 0.30], [0.28, 0.30], [0.26, 0.44], [0.16, 0.44], [0.14, 0.36]
  ], '#3b6a30');
  // US Southwest desert patch
  drawShape([[0.15, 0.36], [0.20, 0.36], [0.19, 0.42], [0.14, 0.42]], '#b8965c');
  // Mexico & Central America
  drawShape([[0.16, 0.42], [0.24, 0.44], [0.22, 0.55], [0.18, 0.52]], '#50753a');

  // South America
  // Amazon Rainforest
  drawShape([
    [0.22, 0.52], [0.32, 0.52], [0.35, 0.62], [0.28, 0.70],
    [0.22, 0.62]
  ], '#265922');
  // Southern South America / Andes
  drawShape([[0.25, 0.68], [0.30, 0.68], [0.28, 0.84], [0.24, 0.80]], '#5a6e4d');

  // Australia (Red outback centre, coastal green)
  drawShape([
    [0.78, 0.66], [0.88, 0.66], [0.89, 0.78], [0.77, 0.78]
  ], '#bf6d3b');
  drawShape([[0.86, 0.68], [0.89, 0.72], [0.88, 0.78], [0.85, 0.78]], '#3a662e');

  // Antarctica Ice Cap
  drawShape([[0.0, 0.88], [1.0, 0.88], [1.0, 1.0], [0.0, 1.0]], '#eaf2f8');
  // Greenland Ice Cap
  drawShape([[0.32, 0.10], [0.38, 0.11], [0.36, 0.20], [0.30, 0.18]], '#e4edf5');

  // Add terrain noise & organic coastlines with thousands of subtle spots
  for (let i = 0; i < 6000; i++) {
    const rx = Math.random() * width;
    const ry = Math.random() * height;
    // Check pixel at this point
    const pixel = ctx.getImageData(rx, ry, 1, 1).data;
    // If not deep ocean, speckle with varied vegetation / mountain tones
    if (pixel[1] > 60) {
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(30,70,25,0.2)' : 'rgba(180,140,80,0.18)';
      ctx.fillRect(rx, ry, Math.random() * 4 + 1, Math.random() * 4 + 1);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  textureCache['earth_day'] = texture;
  return texture;
}

/**
 * Procedural Earth Night City Lights Texture.
 * Real geographic clusters of high-density golden-amber and cyan-white city lights.
 */
export function createEarthNightTexture(): THREE.CanvasTexture {
  if (textureCache['earth_night']) return textureCache['earth_night'];

  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Deep black base for unlit night side
  ctx.fillStyle = '#010204';
  ctx.fillRect(0, 0, width, height);

  // Helper to paint a cluster of city lights
  const paintCityCluster = (
    centerXPct: number,
    centerYPct: number,
    radius: number,
    intensity: number,
    tint = '#ffe89c'
  ) => {
    const cx = centerXPct * width;
    const cy = centerYPct * height;

    const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    radGrad.addColorStop(0, tint);
    radGrad.addColorStop(0.3, 'rgba(255, 200, 100, 0.7)');
    radGrad.addColorStop(0.7, 'rgba(230, 160, 60, 0.3)');
    radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Speckle high-density urban core points
    const count = Math.floor(intensity * 40);
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const dist = Math.pow(Math.random(), 2) * radius * 0.9;
      const px = cx + Math.cos(ang) * dist;
      const py = cy + Math.sin(ang) * dist;
      ctx.fillStyle = Math.random() > 0.4 ? '#ffffff' : '#ffd066';
      ctx.fillRect(px, py, 1.5, 1.5);
    }
  };

  // Real-world Megacity Clusters on night map
  // North America
  paintCityCluster(0.24, 0.35, 24, 3.5); // New York / Boston / DC Corridor
  paintCityCluster(0.20, 0.34, 18, 2.5); // Chicago / Great Lakes
  paintCityCluster(0.14, 0.38, 20, 2.8); // California / LA / SF
  paintCityCluster(0.18, 0.42, 16, 2.0); // Texas / Houston / Dallas
  paintCityCluster(0.22, 0.44, 12, 1.5); // Florida / Miami
  paintCityCluster(0.12, 0.28, 12, 1.8); // Pacific Northwest

  // Europe Megalopolis (Blue Banana)
  paintCityCluster(0.48, 0.26, 32, 4.0); // London / Paris / Benelux / Rhine-Ruhr
  paintCityCluster(0.50, 0.32, 18, 2.2); // Northern Italy / Milan
  paintCityCluster(0.44, 0.34, 14, 1.8); // Madrid / Spain
  paintCityCluster(0.54, 0.28, 16, 2.0); // Berlin / Central Europe
  paintCityCluster(0.58, 0.24, 18, 2.5); // Moscow Metro

  // East Asia (Ultra dense)
  paintCityCluster(0.85, 0.36, 28, 4.5); // Tokyo / Osaka / Nagoya megalopolis
  paintCityCluster(0.80, 0.38, 26, 3.8); // Seoul / Incheon
  paintCityCluster(0.77, 0.36, 30, 4.2); // Beijing / Tianjin
  paintCityCluster(0.78, 0.42, 32, 4.5); // Shanghai / Yangtze River Delta
  paintCityCluster(0.76, 0.47, 28, 4.0); // Pearl River Delta (Guangzhou / HK / Shenzhen)
  paintCityCluster(0.74, 0.56, 16, 2.5); // Singapore / Malaysia

  // South Asia / India
  paintCityCluster(0.67, 0.42, 26, 3.5); // Delhi / Northern Gangetic Plain
  paintCityCluster(0.66, 0.48, 24, 3.2); // Mumbai / Pune
  paintCityCluster(0.69, 0.52, 20, 2.8); // Bangalore / Chennai / South India

  // Middle East
  paintCityCluster(0.57, 0.38, 18, 2.8); // Nile Valley & Delta / Cairo
  paintCityCluster(0.62, 0.42, 18, 3.0); // Persian Gulf / Dubai / Abu Dhabi / Doha
  paintCityCluster(0.55, 0.37, 14, 2.0); // Levant / Tel Aviv / Beirut

  // South America
  paintCityCluster(0.32, 0.67, 20, 2.8); // São Paulo / Rio de Janeiro
  paintCityCluster(0.28, 0.74, 16, 2.2); // Buenos Aires

  // Australia
  paintCityCluster(0.88, 0.75, 14, 2.2); // Sydney / Melbourne

  // Interconnecting Highway / Transit light veins
  ctx.strokeStyle = 'rgba(255, 200, 80, 0.25)';
  ctx.lineWidth = 1;
  const drawVein = (p1: [number, number], p2: [number, number]) => {
    ctx.beginPath();
    ctx.moveTo(p1[0] * width, p1[1] * height);
    ctx.lineTo(p2[0] * width, p2[1] * height);
    ctx.stroke();
  };
  drawVein([0.20, 0.34], [0.24, 0.35]); // Chicago to NY
  drawVein([0.14, 0.38], [0.18, 0.42]); // California to Texas
  drawVein([0.48, 0.26], [0.54, 0.28]); // Paris to Berlin
  drawVein([0.77, 0.36], [0.78, 0.42]); // Beijing to Shanghai

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  textureCache['earth_night'] = texture;
  return texture;
}

/**
 * Procedural Earth Cloud Texture with realistic swirl patterns and transparency.
 */
export function createEarthCloudTexture(): THREE.CanvasTexture {
  if (textureCache['earth_clouds']) return textureCache['earth_clouds'];

  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, width, height);

  // Swirling cloud belts (equatorial ITCZ, mid-latitude cyclonic fronts)
  for (let i = 0; i < 45; i++) {
    const cx = Math.random() * width;
    // Clouds concentrate near equator (y = height/2) and 60 deg lat
    let cy = height * 0.5 + (Math.random() - 0.5) * height * 0.3;
    if (Math.random() > 0.5) {
      cy = Math.random() > 0.5 ? height * 0.25 : height * 0.75;
    }
    const rx = Math.random() * 90 + 30;
    const ry = Math.random() * 30 + 10;
    const rot = (Math.random() - 0.5) * 0.6;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
    grad.addColorStop(0.4, 'rgba(240, 248, 255, 0.5)');
    grad.addColorStop(0.8, 'rgba(230, 240, 250, 0.15)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  textureCache['earth_clouds'] = texture;
  return texture;
}

/**
 * Procedural Sun Photosphere Texture with granulation and glowing flare filaments.
 */
export function createSunTexture(): THREE.CanvasTexture {
  if (textureCache['sun']) return textureCache['sun'];

  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Intense incandescent gradient base
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, '#fff4cc');
  grad.addColorStop(0.3, '#ffcc00');
  grad.addColorStop(0.7, '#ff6600');
  grad.addColorStop(1, '#cc2200');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Solar granulation noise & dark magnetic sunspots
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const rad = Math.random() * 6 + 2;
    ctx.fillStyle = Math.random() > 0.4 ? 'rgba(255, 230, 120, 0.3)' : 'rgba(180, 50, 0, 0.25)';
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // Realistic sunspot clusters
  for (let s = 0; s < 8; s++) {
    const sx = Math.random() * size;
    const sy = size * 0.4 + Math.random() * size * 0.2; // Sunspots appear in equatorial bands
    // Umbra (dark center) + penumbra (brown halo)
    const srad = Math.random() * 12 + 6;
    ctx.fillStyle = 'rgba(60, 15, 0, 0.85)';
    ctx.beginPath();
    ctx.arc(sx, sy, srad * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(160, 60, 10, 0.4)';
    ctx.beginPath();
    ctx.arc(sx, sy, srad, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache['sun'] = texture;
  return texture;
}

/**
 * Procedural Jupiter Banded Atmosphere with Great Red Spot.
 */
export function createJupiterTexture(): THREE.CanvasTexture {
  if (textureCache['jupiter']) return textureCache['jupiter'];

  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Alternating belts and zones (North/South equatorial belts)
  const bandColors = [
    '#d6b07e', '#b87c4c', '#e0c9a6', '#9c5a2b', '#edd3b1',
    '#8f4b23', '#edd8be', '#a66b3d', '#d9be9b', '#945c32',
    '#edd5ba', '#8c4e28', '#c9a87d'
  ];

  const bandHeight = height / bandColors.length;
  bandColors.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, i * bandHeight, width, bandHeight);
  });

  // Atmospheric turbulence & shear wave eddies
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 240, 220, 0.18)' : 'rgba(120, 50, 15, 0.15)';
    ctx.beginPath();
    ctx.ellipse(x, y, Math.random() * 35 + 10, Math.random() * 4 + 2, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // The Great Red Spot (in Southern Tropical Zone)
  const grsX = width * 0.65;
  const grsY = height * 0.68;
  const grsGrad = ctx.createRadialGradient(grsX, grsY, 0, grsX, grsY, 38);
  grsGrad.addColorStop(0, '#c73e1d'); // Rich vermillion core
  grsGrad.addColorStop(0.6, '#b54824');
  grsGrad.addColorStop(1, 'rgba(180, 100, 50, 0)');
  ctx.fillStyle = grsGrad;
  ctx.beginPath();
  ctx.ellipse(grsX, grsY, 38, 22, -0.1, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  textureCache['jupiter'] = texture;
  return texture;
}

/**
 * Procedural Saturn Ring Texture with Cassini Division and translucency.
 */
export function createSaturnRingsTexture(): THREE.CanvasTexture {
  if (textureCache['saturn_rings']) return textureCache['saturn_rings'];

  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, size, 0);
  grad.addColorStop(0.0, 'rgba(0, 0, 0, 0)'); // Inner transparent boundary
  grad.addColorStop(0.15, 'rgba(180, 160, 130, 0.4)'); // C Ring
  grad.addColorStop(0.35, 'rgba(230, 205, 165, 0.95)'); // B Ring (brightest)
  grad.addColorStop(0.62, 'rgba(215, 190, 150, 0.85)');
  grad.addColorStop(0.66, 'rgba(10, 8, 5, 0.05)'); // Cassini Division gap!
  grad.addColorStop(0.71, 'rgba(200, 175, 140, 0.7)'); // A Ring
  grad.addColorStop(0.92, 'rgba(180, 155, 120, 0.5)'); // Encke gap
  grad.addColorStop(0.97, 'rgba(140, 120, 95, 0.2)');
  grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)'); // Outer boundary

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, 64);

  const texture = new THREE.CanvasTexture(canvas);
  textureCache['saturn_rings'] = texture;
  return texture;
}

/**
 * Procedural Mars Texture with red rust regolith, dark basaltic maria, and polar ice.
 */
export function createMarsTexture(): THREE.CanvasTexture {
  if (textureCache['mars']) return textureCache['mars'];

  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Base Martian rust red
  ctx.fillStyle = '#b84c2d';
  ctx.fillRect(0, 0, width, height);

  // Dark basaltic plains (Syrtis Major, Acidalia Planitia)
  ctx.fillStyle = '#6e2b17';
  for (let i = 0; i < 30; i++) {
    const cx = Math.random() * width;
    const cy = height * 0.3 + Math.random() * height * 0.4;
    ctx.beginPath();
    ctx.ellipse(cx, cy, Math.random() * 80 + 30, Math.random() * 40 + 15, Math.random(), 0, Math.PI * 2);
    ctx.fill();
  }

  // Craters and dunes texture
  for (let i = 0; i < 1500; i++) {
    const rx = Math.random() * width;
    const ry = Math.random() * height;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(210, 120, 70, 0.2)' : 'rgba(70, 25, 10, 0.25)';
    ctx.fillRect(rx, ry, Math.random() * 5 + 1, Math.random() * 5 + 1);
  }

  // Polar Ice Caps (White CO2 / water frost)
  // North polar cap
  ctx.fillStyle = '#eef3f7';
  ctx.beginPath();
  ctx.ellipse(width / 2, 15, width * 0.35, 25, 0, 0, Math.PI * 2);
  ctx.fill();
  // South polar cap
  ctx.beginPath();
  ctx.ellipse(width / 2, height - 15, width * 0.3, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  textureCache['mars'] = texture;
  return texture;
}

/**
 * Procedural Starfield Texture / Cubemap backdrop generator.
 */
export function createDeepSpaceBackground(): THREE.Texture {
  if (textureCache['deep_space']) return textureCache['deep_space'];

  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Obsidian space base
  ctx.fillStyle = '#05070c';
  ctx.fillRect(0, 0, size, size);

  // Subtle nebula clouds
  const nebulaGrad = ctx.createRadialGradient(size * 0.7, size * 0.3, 0, size * 0.7, size * 0.3, size * 0.5);
  nebulaGrad.addColorStop(0, 'rgba(30, 20, 60, 0.25)');
  nebulaGrad.addColorStop(0.5, 'rgba(10, 30, 70, 0.15)');
  nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = nebulaGrad;
  ctx.fillRect(0, 0, size, size);

  // 1,800 distant stars of varied spectral classes (white, blue, amber, red)
  for (let i = 0; i < 1800; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random();
    const radius = r > 0.98 ? 1.8 : r > 0.85 ? 1.2 : 0.7;

    const colorType = Math.random();
    let starColor = '#ffffff';
    if (colorType > 0.85) starColor = '#a8c8ff'; // Blue-white O/B type
    else if (colorType > 0.70) starColor = '#ffe3a8'; // Warm G/K type
    else if (colorType > 0.60) starColor = '#ffad99'; // Red M type

    ctx.fillStyle = starColor;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache['deep_space'] = texture;
  return texture;
}
