import * as THREE from 'three';
import { CityData } from '../types/cities';

export interface CityEnvironment {
  cityGroup: THREE.Group;
  trafficMesh: THREE.Points;
  landmarksGroup: THREE.Group;
  waterMesh: THREE.Mesh | null;
  updateTraffic: (delta: number) => void;
  dispose: () => void;
}

/**
 * Creates realistic procedural window texture for building facades
 */
function createBuildingTexture(windowColor: string = '#ffe9a0'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#161922'; // Dark facade material
  ctx.fillRect(0, 0, 256, 512);

  const cols = 8;
  const rows = 32;
  const cellW = 256 / cols;
  const cellH = 512 / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isLit = Math.random() > 0.35;
      if (isLit) {
        ctx.fillStyle = Math.random() > 0.8 ? '#ffffff' : windowColor;
      } else {
        ctx.fillStyle = '#0a0d14'; // Dark unlit office
      }
      ctx.fillRect(c * cellW + 4, r * cellH + 3, cellW - 8, cellH - 6);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Generates the full 3D procedural city with instanced skyscrapers, landmarks, traffic, and water.
 */
export function generate3DCity(city: CityData): CityEnvironment {
  const cityGroup = new THREE.Group();
  const landmarksGroup = new THREE.Group();
  cityGroup.add(landmarksGroup);

  const windowTexture = createBuildingTexture(city.nightLightingColor);
  windowTexture.repeat.set(1, 2);

  // Materials
  const buildingMat = new THREE.MeshStandardMaterial({
    color: 0x9098a5,
    roughness: 0.25,
    metalness: 0.7,
    map: windowTexture,
    bumpScale: 0.05
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x6a8db5,
    metalness: 0.9,
    roughness: 0.1,
    transmission: 0.3,
    transparent: true,
    opacity: 0.9
  });

  const roofMat = new THREE.MeshStandardMaterial({
    color: 0x1f242d,
    roughness: 0.8,
    metalness: 0.2
  });

  const roadMat = new THREE.MeshStandardMaterial({
    color: 0x111418,
    roughness: 0.9,
    metalness: 0.1
  });

  const groundSize = 1200;

  // 1. Ground Plane (Road network grid)
  const groundGeo = new THREE.PlaneGeometry(groundSize, groundSize);
  const ground = new THREE.Mesh(groundGeo, roadMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  cityGroup.add(ground);

  // 2. Water / Bay / River (for coastal cities)
  let waterMesh: THREE.Mesh | null = null;
  const hasWater = city.id !== 'cairo' && city.planetId === 'earth';
  if (hasWater) {
    const waterGeo = new THREE.PlaneGeometry(groundSize, groundSize * 0.45);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x071e3d,
      roughness: 0.08,
      metalness: 0.85,
      transparent: true,
      opacity: 0.92
    });
    waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.set(0, 0.4, groundSize * 0.28);
    cityGroup.add(waterMesh);
  }

  // 3. Procedural Skyscrapers using InstancedMesh for top-tier 60 FPS performance
  const blockSize = 28;
  const streetWidth = 14;
  const gridCells = 20; // 20x20 blocks = 400 building lots
  const startOffset = -((gridCells * (blockSize + streetWidth)) / 2);

  const maxBuildings = gridCells * gridCells;
  const boxGeo = new THREE.BoxGeometry(1, 1, 1);
  const instancedBuildings = new THREE.InstancedMesh(boxGeo, buildingMat, maxBuildings);
  instancedBuildings.castShadow = true;
  instancedBuildings.receiveShadow = true;

  const dummy = new THREE.Object3D();
  let buildingCount = 0;

  // Obstacle warning beacon lights on top of tall skyscrapers
  const beaconPositions: number[] = [];

  for (let gx = 0; gx < gridCells; gx++) {
    for (let gz = 0; gz < gridCells; gz++) {
      // Leave space in center for custom signature landmarks!
      const isCenter = Math.abs(gx - gridCells / 2) < 2 && Math.abs(gz - gridCells / 2) < 2;
      // Also leave space for waterfront if coastal
      const isWaterfront = hasWater && gz > gridCells * 0.72;

      if (isCenter || isWaterfront) continue;

      const posX = startOffset + gx * (blockSize + streetWidth) + (Math.random() - 0.5) * 4;
      const posZ = startOffset + gz * (blockSize + streetWidth) + (Math.random() - 0.5) * 4;

      // Distance from center dictates height falloff (central business core is highest)
      const distFromCenter = Math.sqrt(posX * posX + posZ * posZ);
      const coreFactor = Math.max(0.15, 1 - distFromCenter / 450);

      // Building footprint and height
      const width = blockSize * (0.65 + Math.random() * 0.35);
      const depth = blockSize * (0.65 + Math.random() * 0.35);
      const baseHeight = 35 + Math.pow(Math.random(), 1.6) * 180 * coreFactor;
      const height = Math.max(20, baseHeight);

      dummy.position.set(posX, height / 2, posZ);
      dummy.scale.set(width, height, depth);
      dummy.rotation.y = (Math.floor(Math.random() * 4) * Math.PI) / 2;
      dummy.updateMatrix();

      instancedBuildings.setMatrixAt(buildingCount, dummy.matrix);

      // Add aviation beacon to very tall skyscrapers (>100m)
      if (height > 90) {
        beaconPositions.push(posX, height + 1.5, posZ);
      }

      buildingCount++;
    }
  }

  instancedBuildings.count = buildingCount;
  instancedBuildings.instanceMatrix.needsUpdate = true;
  cityGroup.add(instancedBuildings);

  // Red Aviation Obstacle Warning Beacons on skyscraper roofs
  if (beaconPositions.length > 0) {
    const beaconGeo = new THREE.BufferGeometry();
    beaconGeo.setAttribute('position', new THREE.Float32BufferAttribute(beaconPositions, 3));
    const beaconMat = new THREE.PointsMaterial({
      color: 0xff2222,
      size: 4,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9
    });
    const beacons = new THREE.Points(beaconGeo, beaconMat);
    cityGroup.add(beacons);
  }

  // 4. Build Signature City Landmark Models
  buildCityLandmarks(city, landmarksGroup, roofMat, glassMat);

  // 5. Dynamic Moving Traffic System (Dual-way traffic streams)
  const trafficPoints = 800;
  const trafficPositions = new Float32Array(trafficPoints * 3);
  const trafficColors = new Float32Array(trafficPoints * 3);
  const trafficVelocities: number[] = [];

  for (let i = 0; i < trafficPoints; i++) {
    const isNorthSouth = Math.random() > 0.5;
    const streetIndex = Math.floor(Math.random() * gridCells);
    const laneDir = Math.random() > 0.5 ? 1 : -1;

    let x = 0;
    let z = 0;
    if (isNorthSouth) {
      x = startOffset + streetIndex * (blockSize + streetWidth) + (laneDir * 3);
      z = (Math.random() - 0.5) * 700;
    } else {
      z = startOffset + streetIndex * (blockSize + streetWidth) + (laneDir * 3);
      x = (Math.random() - 0.5) * 700;
    }

    trafficPositions[i * 3] = x;
    trafficPositions[i * 3 + 1] = 0.8; // Just above road
    trafficPositions[i * 3 + 2] = z;

    // Headlight (white/amber) vs Taillight (red) based on lane direction
    const isTaillight = laneDir > 0;
    if (isTaillight) {
      trafficColors[i * 3] = 1.0;
      trafficColors[i * 3 + 1] = 0.15;
      trafficColors[i * 3 + 2] = 0.1;
    } else {
      trafficColors[i * 3] = 1.0;
      trafficColors[i * 3 + 1] = 0.95;
      trafficColors[i * 3 + 2] = 0.7;
    }

    trafficVelocities.push(laneDir * (25 + Math.random() * 20) * (isNorthSouth ? 1 : -1));
  }

  const trafficGeo = new THREE.BufferGeometry();
  trafficGeo.setAttribute('position', new THREE.BufferAttribute(trafficPositions, 3));
  trafficGeo.setAttribute('color', new THREE.BufferAttribute(trafficColors, 3));

  const trafficMat = new THREE.PointsMaterial({
    size: 2.8,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });

  const trafficMesh = new THREE.Points(trafficGeo, trafficMat);
  cityGroup.add(trafficMesh);

  // Traffic animation tick
  const updateTraffic = (delta: number) => {
    const pos = trafficGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < trafficPoints; i++) {
      const idx = i * 3;
      // Move along Z or X
      const vel = trafficVelocities[i] * delta;
      pos[idx + 2] += vel;

      // Wrap around bounds
      if (pos[idx + 2] > 350) pos[idx + 2] = -350;
      if (pos[idx + 2] < -350) pos[idx + 2] = 350;
    }
    trafficGeo.attributes.position.needsUpdate = true;
  };

  const dispose = () => {
    windowTexture.dispose();
    boxGeo.dispose();
    buildingMat.dispose();
    glassMat.dispose();
    roofMat.dispose();
    roadMat.dispose();
    groundGeo.dispose();
    trafficGeo.dispose();
    trafficMat.dispose();
  };

  return {
    cityGroup,
    trafficMesh,
    landmarksGroup,
    waterMesh,
    updateTraffic,
    dispose
  };
}

/**
 * Builds authentic parametric 3D models of signature landmarks for each city
 */
function buildCityLandmarks(
  city: CityData,
  group: THREE.Group,
  darkMat: THREE.Material,
  glassMat: THREE.Material
) {
  const steelMat = new THREE.MeshStandardMaterial({
    color: 0x88909c,
    metalness: 0.9,
    roughness: 0.2
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xdeb887,
    metalness: 0.85,
    roughness: 0.3
  });

  if (city.id === 'paris') {
    // ----------------- EIFFEL TOWER -----------------
    const eiffel = new THREE.Group();
    // 4 Flared Pylons Base
    for (let i = 0; i < 4; i++) {
      const legGeo = new THREE.CylinderGeometry(1.5, 4.5, 24, 6);
      const leg = new THREE.Mesh(legGeo, steelMat);
      const ang = (i * Math.PI) / 2 + Math.PI / 4;
      leg.position.set(Math.cos(ang) * 14, 12, Math.sin(ang) * 14);
      leg.rotation.z = -Math.cos(ang) * 0.18;
      leg.rotation.x = Math.sin(ang) * 0.18;
      eiffel.add(leg);
    }
    // 1st Floor Platform
    const plat1Geo = new THREE.BoxGeometry(24, 2, 24);
    const plat1 = new THREE.Mesh(plat1Geo, steelMat);
    plat1.position.y = 24;
    eiffel.add(plat1);

    // 2nd Tier
    const tier2Geo = new THREE.CylinderGeometry(4, 9, 35, 8);
    const tier2 = new THREE.Mesh(tier2Geo, steelMat);
    tier2.position.y = 42;
    eiffel.add(tier2);

    // 2nd Floor Platform
    const plat2Geo = new THREE.BoxGeometry(14, 2, 14);
    const plat2 = new THREE.Mesh(plat2Geo, steelMat);
    plat2.position.y = 60;
    eiffel.add(plat2);

    // Main Spire
    const spireGeo = new THREE.CylinderGeometry(0.8, 3.5, 65, 8);
    const spire = new THREE.Mesh(spireGeo, steelMat);
    spire.position.y = 93;
    eiffel.add(spire);

    // Top Lantern & Beacon
    const topGeo = new THREE.CylinderGeometry(0.2, 0.8, 12, 6);
    const top = new THREE.Mesh(topGeo, goldMat);
    top.position.y = 130;
    eiffel.add(top);

    // Luminous top searchlight
    const beaconLight = new THREE.PointLight(0xfff5cc, 3, 200);
    beaconLight.position.y = 135;
    eiffel.add(beaconLight);

    eiffel.scale.set(1.4, 1.4, 1.4);
    eiffel.position.set(0, 0, 0);
    group.add(eiffel);

  } else if (city.id === 'dubai') {
    // ----------------- BURJ KHALIFA -----------------
    const burj = new THREE.Group();
    // Y-shaped stepped buttressed core
    const tiers = 12;
    for (let t = 0; t < tiers; t++) {
      const radius = 16 * Math.pow(0.82, t);
      const height = 18;
      const tierGeo = new THREE.CylinderGeometry(radius * 0.9, radius, height, 6);
      const tier = new THREE.Mesh(tierGeo, glassMat);
      tier.position.y = t * height + height / 2;
      burj.add(tier);
    }
    // Pinnacle Spire
    const spireGeo = new THREE.CylinderGeometry(0.3, 2, 45, 6);
    const spire = new THREE.Mesh(spireGeo, steelMat);
    spire.position.y = tiers * 18 + 22.5;
    burj.add(spire);

    burj.scale.set(1.5, 1.6, 1.5);
    group.add(burj);

  } else if (city.id === 'new_york') {
    // ----------------- ONE WORLD TRADE & EMPIRE STATE -----------------
    // 1 WTC
    const wtc = new THREE.Group();
    const wtcBaseGeo = new THREE.CylinderGeometry(9, 13, 140, 8);
    const wtcTower = new THREE.Mesh(wtcBaseGeo, glassMat);
    wtcTower.position.y = 70;
    wtc.add(wtcTower);

    const wtcSpireGeo = new THREE.CylinderGeometry(0.3, 1.2, 40, 6);
    const wtcSpire = new THREE.Mesh(wtcSpireGeo, steelMat);
    wtcSpire.position.y = 160;
    wtc.add(wtcSpire);
    wtc.position.set(-25, 0, 10);
    group.add(wtc);

    // Empire State Building
    const esb = new THREE.Group();
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(22, 50, 18), darkMat);
    b1.position.y = 25;
    esb.add(b1);
    const b2 = new THREE.Mesh(new THREE.BoxGeometry(16, 40, 13), darkMat);
    b2.position.y = 70;
    esb.add(b2);
    const b3 = new THREE.Mesh(new THREE.BoxGeometry(10, 30, 9), darkMat);
    b3.position.y = 105;
    esb.add(b3);
    const esbSpire = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 1.5, 30, 8), steelMat);
    esbSpire.position.y = 135;
    esb.add(esbSpire);
    esb.position.set(30, 0, -20);
    group.add(esb);

  } else if (city.id === 'tokyo') {
    // ----------------- TOKYO SKYTREE -----------------
    const skytree = new THREE.Group();
    // Lattice tripod trunk
    const trunkGeo = new THREE.CylinderGeometry(3, 14, 130, 6);
    const trunk = new THREE.Mesh(trunkGeo, steelMat);
    trunk.position.y = 65;
    skytree.add(trunk);

    // Lower observatory deck
    const deck1Geo = new THREE.CylinderGeometry(11, 10, 12, 16);
    const deck1 = new THREE.Mesh(deck1Geo, glassMat);
    deck1.position.y = 85;
    skytree.add(deck1);

    // Upper observatory deck
    const deck2Geo = new THREE.CylinderGeometry(8, 7, 10, 16);
    const deck2 = new THREE.Mesh(deck2Geo, glassMat);
    deck2.position.y = 115;
    skytree.add(deck2);

    // Mast
    const mastGeo = new THREE.CylinderGeometry(0.4, 1.8, 55, 6);
    const mast = new THREE.Mesh(mastGeo, steelMat);
    mast.position.y = 155;
    skytree.add(mast);

    skytree.scale.set(1.4, 1.4, 1.4);
    group.add(skytree);

  } else if (city.id === 'singapore') {
    // ----------------- MARINA BAY SANDS -----------------
    const mbs = new THREE.Group();
    // 3 Curved Towers
    for (let i = -1; i <= 1; i++) {
      const towerGeo = new THREE.BoxGeometry(10, 85, 14);
      const tower = new THREE.Mesh(towerGeo, glassMat);
      tower.position.set(i * 26, 42.5, 0);
      mbs.add(tower);
    }
    // Cantilevered Ship SkyPark across all 3 towers!
    const skyParkGeo = new THREE.BoxGeometry(90, 6, 22);
    const skyPark = new THREE.Mesh(skyParkGeo, steelMat);
    skyPark.position.set(4, 88, 0);
    mbs.add(skyPark);
    group.add(mbs);

  } else if (city.id === 'sydney') {
    // ----------------- SYDNEY OPERA HOUSE -----------------
    const opera = new THREE.Group();
    const whiteShellMat = new THREE.MeshStandardMaterial({
      color: 0xf5f2eb,
      roughness: 0.3,
      metalness: 0.1
    });
    // Multi-shell sails
    for (let i = 0; i < 4; i++) {
      const shellGeo = new THREE.ConeGeometry(12 - i * 1.5, 26 - i * 3, 4);
      const shell = new THREE.Mesh(shellGeo, whiteShellMat);
      shell.position.set(i * 14 - 20, 12 - i * 1.2, 0);
      shell.rotation.z = 0.3;
      opera.add(shell);
    }
    opera.position.set(0, 0, 40);
    group.add(opera);

  } else if (city.id === 'cairo') {
    // ----------------- GREAT PYRAMID OF GIZA -----------------
    const pyr = new THREE.Group();
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0xd4a373,
      roughness: 0.9,
      metalness: 0.1
    });
    const pyrGeo = new THREE.ConeGeometry(45, 60, 4);
    const pyramid = new THREE.Mesh(pyrGeo, stoneMat);
    pyramid.position.y = 30;
    pyramid.rotation.y = Math.PI / 4;
    pyr.add(pyramid);
    pyr.position.set(0, 0, 0);
    group.add(pyr);

  } else if (city.id === 'san_francisco') {
    // ----------------- GOLDEN GATE BRIDGE TOWER -----------------
    const bridge = new THREE.Group();
    const orangeMat = new THREE.MeshStandardMaterial({
      color: 0xc0362c, // International Orange
      roughness: 0.4,
      metalness: 0.6
    });
    // Two twin legs
    const leg1 = new THREE.Mesh(new THREE.BoxGeometry(4, 95, 5), orangeMat);
    leg1.position.set(-10, 47.5, 0);
    bridge.add(leg1);
    const leg2 = new THREE.Mesh(new THREE.BoxGeometry(4, 95, 5), orangeMat);
    leg2.position.set(10, 47.5, 0);
    bridge.add(leg2);
    // Cross-struts
    for (let c = 1; c <= 4; c++) {
      const strut = new THREE.Mesh(new THREE.BoxGeometry(22, 2.5, 3), orangeMat);
      strut.position.set(0, c * 20, 0);
      bridge.add(strut);
    }
    bridge.position.set(0, 0, 60);
    group.add(bridge);

  } else if (city.id === 'mars_olympus') {
    // ----------------- MARS COLONY BIO-DOMES -----------------
    const domeGroup = new THREE.Group();
    const domeMat = new THREE.MeshPhysicalMaterial({
      color: 0x90e0ef,
      transmission: 0.85,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.75
    });
    // Central Geodesic Dome
    const domeGeo = new THREE.SphereGeometry(35, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, domeMat);
    domeGroup.add(dome);

    // Subsidiary Domes
    for (let i = 0; i < 3; i++) {
      const ang = (i * Math.PI * 2) / 3;
      const subDomeGeo = new THREE.SphereGeometry(18, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
      const subDome = new THREE.Mesh(subDomeGeo, domeMat);
      subDome.position.set(Math.cos(ang) * 45, 0, Math.sin(ang) * 45);
      domeGroup.add(subDome);

      // Connecting tube corridor
      const tubeGeo = new THREE.CylinderGeometry(2, 2, 45, 8);
      const tube = new THREE.Mesh(tubeGeo, steelMat);
      tube.position.set((Math.cos(ang) * 45) / 2, 2, (Math.sin(ang) * 45) / 2);
      tube.rotation.z = Math.PI / 2;
      tube.rotation.y = -ang;
      domeGroup.add(tube);
    }
    group.add(domeGroup);

  } else if (city.id === 'artemis_base') {
    // ----------------- ARTEMIS LUNAR HABITAT & SOLAR TOWERS -----------------
    const artemis = new THREE.Group();
    const habMat = new THREE.MeshStandardMaterial({
      color: 0xe0e5ea,
      roughness: 0.6,
      metalness: 0.3
    });
    // Modular Hex Inflatable Hubs
    for (let i = 0; i < 4; i++) {
      const habGeo = new THREE.CylinderGeometry(12, 14, 10, 6);
      const hab = new THREE.Mesh(habGeo, habMat);
      hab.position.set((i % 2) * 25 - 12, 5, Math.floor(i / 2) * 25 - 12);
      artemis.add(hab);
    }
    // Radio Telescope Dish
    const dishGeo = new THREE.SphereGeometry(16, 16, 8, 0, Math.PI * 2, 0, Math.PI / 3);
    const dish = new THREE.Mesh(dishGeo, steelMat);
    dish.position.set(40, 20, 0);
    dish.rotation.x = Math.PI * 0.7;
    artemis.add(dish);
    group.add(artemis);
  }
}
