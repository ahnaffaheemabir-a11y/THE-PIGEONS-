import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PLANETS_DATA } from '../data/planets';
import { PlanetData } from '../types/astronomy';
import {
  createDeepSpaceBackground,
  createEarthCloudTexture,
  createEarthDayTexture,
  createJupiterTexture,
  createMarsTexture,
  createSaturnRingsTexture,
  createSunTexture
} from '../utils/textureGenerator';

interface SolarSystemSceneProps {
  selectedPlanet: PlanetData;
  onSelectPlanet: (planet: PlanetData) => void;
  isOrreryScale: boolean;
  timeMultiplier: number;
  isPaused: boolean;
  showOrbits: boolean;
  showLabels: boolean;
  onOpenGlobeView: () => void;
}

export const SolarSystemScene: React.FC<SolarSystemSceneProps> = ({
  selectedPlanet,
  onSelectPlanet,
  isOrreryScale,
  timeMultiplier,
  isPaused,
  showOrbits,
  showLabels,
  onOpenGlobeView
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // References to meshes for animation
  const planetMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const orbitLinesRef = useRef<Map<string, THREE.Line>>(new Map());
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const sunMeshRef = useRef<THREE.Mesh | null>(null);
  const sunCoronaRef = useRef<THREE.Mesh | null>(null);
  const asteroidBeltRef = useRef<THREE.InstancedMesh | null>(null);

  // Camera animation state
  const targetCameraPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 160, 240));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Orbital angles tracking (in radians)
  const planetAnglesRef = useRef<Map<string, number>>(new Map());

  // Mouse interaction state
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const cameraSpherical = useRef({ radius: 280, theta: Math.PI / 4, phi: Math.PI / 3.2 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 8000);
    cameraRef.current = camera;
    camera.position.set(0, 180, 260);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Deep space background
    scene.background = createDeepSpaceBackground();

    // 2. Lighting
    // The Sun emits radiant light to the whole system
    const sunLight = new THREE.PointLight(0xfff8e8, 3.2, 5000, 0.05);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Subtle ambient light so dark sides are softly readable
    const ambientLight = new THREE.AmbientLight(0x1a2233, 0.85);
    scene.add(ambientLight);

    // 3. Build Sun
    const sunData = PLANETS_DATA.find((p) => p.id === 'sun')!;
    const sunGeo = new THREE.SphereGeometry(sunData.visualRadius, 48, 48);
    const sunMat = new THREE.MeshBasicMaterial({
      map: createSunTexture(),
      color: 0xffffff
    });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sunMesh);
    sunMeshRef.current = sunMesh;

    // Glowing Sun Corona Shield
    const coronaGeo = new THREE.SphereGeometry(sunData.visualRadius * 1.25, 32, 32);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xff8811,
      transparent: true,
      opacity: 0.22,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const sunCorona = new THREE.Mesh(coronaGeo, coronaMat);
    scene.add(sunCorona);
    sunCoronaRef.current = sunCorona;

    // 4. Build Planets & Orbits
    PLANETS_DATA.forEach((planet, index) => {
      // Initialize random orbital start position
      const initialAngle = (index * (Math.PI * 2)) / PLANETS_DATA.length + 0.3;
      planetAnglesRef.current.set(planet.id, initialAngle);

      if (planet.id === 'sun') return;

      const planetGroup = new THREE.Group();
      planetGroup.rotation.z = (planet.axialTiltDeg * Math.PI) / 180;

      // Select texture/material
      let planetMat: THREE.Material;
      if (planet.id === 'earth') {
        planetMat = new THREE.MeshStandardMaterial({
          map: createEarthDayTexture(),
          roughness: 0.5,
          metalness: 0.1
        });
      } else if (planet.id === 'jupiter') {
        planetMat = new THREE.MeshStandardMaterial({
          map: createJupiterTexture(),
          roughness: 0.7
        });
      } else if (planet.id === 'mars') {
        planetMat = new THREE.MeshStandardMaterial({
          map: createMarsTexture(),
          roughness: 0.8
        });
      } else {
        planetMat = new THREE.MeshStandardMaterial({
          color: planet.color,
          roughness: 0.65,
          metalness: 0.15
        });
      }

      const pRadius = isOrreryScale ? planet.visualRadius : Math.max(1.2, planet.trueRadiusScale * 2.8);
      const planetGeo = new THREE.SphereGeometry(pRadius, 32, 32);
      const planetMesh = new THREE.Mesh(planetGeo, planetMat);
      planetGroup.add(planetMesh);

      // Earth Cloud Layer & Moon
      if (planet.id === 'earth') {
        const cloudGeo = new THREE.SphereGeometry(pRadius * 1.025, 32, 32);
        const cloudMat = new THREE.MeshStandardMaterial({
          map: createEarthCloudTexture(),
          transparent: true,
          opacity: 0.75,
          blending: THREE.NormalBlending
        });
        const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
        planetGroup.add(cloudMesh);
        cloudsMeshRef.current = cloudMesh;

        // Earth's Moon
        const moonGeo = new THREE.SphereGeometry(pRadius * 0.27, 16, 16);
        const moonMat = new THREE.MeshStandardMaterial({ color: 0xc8c8c8, roughness: 0.9 });
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);
        moonMesh.position.set(pRadius * 2.8, 0, 0);
        planetGroup.add(moonMesh);
      }

      // Saturn Rings
      if (planet.id === 'saturn' && planet.ringsConfig) {
        const ringGeo = new THREE.RingGeometry(pRadius * 1.35, pRadius * 2.45, 64);
        // Map ring texture UV radially
        const pos = ringGeo.attributes.position;
        const v3 = new THREE.Vector3();
        for (let i = 0; i < pos.count; i++) {
          v3.fromBufferAttribute(pos, i);
          ringGeo.attributes.uv.setXY(i, (v3.length() - pRadius * 1.35) / (pRadius * 1.1), 0.5);
        }
        const ringMat = new THREE.MeshBasicMaterial({
          map: createSaturnRingsTexture(),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.92
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        planetGroup.add(ringMesh);
      }

      // Uranus Tilted Rings
      if (planet.id === 'uranus' && planet.ringsConfig) {
        const ringGeo = new THREE.RingGeometry(pRadius * 1.25, pRadius * 1.8, 48);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x88c2cb,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.65
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        planetGroup.add(ringMesh);
      }

      // Atmospheric Rayleigh Rim Glow
      if (['earth', 'venus', 'neptune', 'uranus'].includes(planet.id)) {
        const atmosphereGlowGeo = new THREE.SphereGeometry(pRadius * 1.14, 32, 32);
        const atmosphereGlowMat = new THREE.MeshBasicMaterial({
          color: planet.color,
          transparent: true,
          opacity: 0.18,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending
        });
        const atmosphereMesh = new THREE.Mesh(atmosphereGlowGeo, atmosphereGlowMat);
        planetGroup.add(atmosphereMesh);
      }

      // Store in map
      planetMeshesRef.current.set(planet.id, planetGroup);
      scene.add(planetGroup);

      // Create Elliptical Orbit Line
      const dist = isOrreryScale ? planet.visualDistance : planet.trueDistanceScale;
      const orbitCurve = new THREE.EllipseCurve(
        0, 0,
        dist, dist * (1 - planet.eccentricity * 0.5),
        0, 2 * Math.PI,
        false,
        0
      );
      const points = orbitCurve.getPoints(120);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(
        points.map((p) => new THREE.Vector3(p.x, 0, p.y))
      );
      const orbitMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(planet.color).lerp(new THREE.Color(0x334155), 0.7),
        transparent: true,
        opacity: showOrbits ? 0.35 : 0.0
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      // Tilt orbit according to inclination
      orbitLine.rotation.x = (planet.inclinationDeg * Math.PI) / 180;
      scene.add(orbitLine);
      orbitLinesRef.current.set(planet.id, orbitLine);
    });

    // 5. Build Asteroid Belt (3,500 asteroids between Mars and Jupiter)
    const asteroidCount = 3500;
    const asteroidGeo = new THREE.DodecahedronGeometry(0.35, 1);
    const asteroidMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.9,
      metalness: 0.2
    });
    const instancedAsteroids = new THREE.InstancedMesh(asteroidGeo, asteroidMat, asteroidCount);
    const dummy = new THREE.Object3D();

    const minBeltDist = isOrreryScale ? 90 : 72;
    const maxBeltDist = isOrreryScale ? 106 : 88;

    for (let i = 0; i < asteroidCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = minBeltDist + Math.random() * (maxBeltDist - minBeltDist);
      const ySpread = (Math.random() - 0.5) * 8;
      const scale = 0.4 + Math.random() * 0.9;

      dummy.position.set(Math.cos(angle) * radius, ySpread, Math.sin(angle) * radius);
      dummy.scale.set(scale, scale, scale);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummy.updateMatrix();
      instancedAsteroids.setMatrixAt(i, dummy.matrix);
    }
    instancedAsteroids.instanceMatrix.needsUpdate = true;
    scene.add(instancedAsteroids);
    asteroidBeltRef.current = instancedAsteroids;

    // 6. Interaction Event Handlers (Orbit Controls)
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      cameraSpherical.current.theta -= deltaX * 0.005;
      cameraSpherical.current.phi = Math.max(
        0.05,
        Math.min(Math.PI / 2 - 0.05, cameraSpherical.current.phi - deltaY * 0.005)
      );

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomSpeed = 0.12;
      cameraSpherical.current.radius = Math.max(
        15,
        Math.min(800, cameraSpherical.current.radius * (1 + (e.deltaY > 0 ? zoomSpeed : -zoomSpeed)))
      );
    };

    // Raycast on click to select planet directly from canvas
    const handleClick = (e: MouseEvent) => {
      if (!sceneRef.current || !cameraRef.current) return;
      const rect = renderer.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      const hitList: { id: string; distance: number }[] = [];
      planetMeshesRef.current.forEach((group, id) => {
        const intersects = raycaster.intersectObjects(group.children, true);
        if (intersects.length > 0) {
          hitList.push({ id, distance: intersects[0].distance });
        }
      });

      // Also check sun
      if (sunMeshRef.current) {
        const sunHit = raycaster.intersectObject(sunMeshRef.current);
        if (sunHit.length > 0) {
          hitList.push({ id: 'sun', distance: sunHit[0].distance });
        }
      }

      if (hitList.length > 0) {
        hitList.sort((a, b) => a.distance - b.distance);
        const hitPlanet = PLANETS_DATA.find((p) => p.id === hitList[0].id);
        if (hitPlanet) {
          onSelectPlanet(hitPlanet);
        }
      }
    };

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    dom.addEventListener('wheel', handleWheel, { passive: false });
    dom.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);

    // 7. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Rotate Sun and Corona
      if (sunMeshRef.current) sunMeshRef.current.rotation.y += 0.002;
      if (sunCoronaRef.current) sunCoronaRef.current.rotation.z += 0.001;

      // Animate Cloud layer on Earth
      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y += 0.003;
      }

      // Rotate Asteroid Belt slowly
      if (asteroidBeltRef.current) {
        asteroidBeltRef.current.rotation.y += 0.0004;
      }

      // Update Planet Orbits and Rotations
      PLANETS_DATA.forEach((planet) => {
        if (planet.id === 'sun') return;

        const group = planetMeshesRef.current.get(planet.id);
        if (!group) return;

        // Orbital period movement
        if (!isPaused && planet.orbitalPeriodDays > 0) {
          // 365 days = 1 year = 2pi radians. timeMultiplier scales speed
          const speed = (0.015 / (planet.orbitalPeriodDays / 365.25)) * timeMultiplier;
          let angle = planetAnglesRef.current.get(planet.id) || 0;
          angle += speed * delta;
          planetAnglesRef.current.set(planet.id, angle);
        }

        const currentAngle = planetAnglesRef.current.get(planet.id) || 0;
        const dist = isOrreryScale ? planet.visualDistance : planet.trueDistanceScale;

        // Elliptical coordinates
        const x = Math.cos(currentAngle) * dist;
        const z = Math.sin(currentAngle) * (dist * (1 - planet.eccentricity * 0.5));
        const y = Math.sin((planet.inclinationDeg * Math.PI) / 180) * z * 0.3;

        group.position.set(x, y, z);

        // Axial spin on planet mesh
        if (group.children[0]) {
          group.children[0].rotation.y += (1 / (planet.rotationPeriodHours || 24)) * 0.1;
        }
      });

      // Camera Follow or Orbit Target calculation
      let focusTarget = new THREE.Vector3(0, 0, 0);
      if (selectedPlanet.id !== 'sun') {
        const selGroup = planetMeshesRef.current.get(selectedPlanet.id);
        if (selGroup) {
          focusTarget.copy(selGroup.position);
        }
      }

      // Smooth camera lerp
      targetLookAt.current.lerp(focusTarget, 0.06);
      currentLookAt.current.lerp(targetLookAt.current, 0.06);

      // Compute camera eye position from spherical coordinates around the target
      const targetRadius = selectedPlanet.id === 'sun'
        ? Math.max(60, cameraSpherical.current.radius)
        : Math.max(selectedPlanet.visualRadius * 4.5, cameraSpherical.current.radius * 0.45);

      const cx = currentLookAt.current.x + targetRadius * Math.sin(cameraSpherical.current.phi) * Math.sin(cameraSpherical.current.theta);
      const cy = currentLookAt.current.y + targetRadius * Math.cos(cameraSpherical.current.phi);
      const cz = currentLookAt.current.z + targetRadius * Math.sin(cameraSpherical.current.phi) * Math.cos(cameraSpherical.current.theta);

      targetCameraPos.current.set(cx, cy, cz);
      camera.position.lerp(targetCameraPos.current, 0.08);
      camera.lookAt(currentLookAt.current);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('wheel', handleWheel);
      dom.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isOrreryScale]);

  // Update orbit lines visibility when toggle changes
  useEffect(() => {
    orbitLinesRef.current.forEach((line) => {
      const mat = line.material as THREE.LineBasicMaterial;
      mat.opacity = showOrbits ? 0.35 : 0.0;
      mat.needsUpdate = true;
    });
  }, [showOrbits]);

  // Focus transition when selectedPlanet changes
  useEffect(() => {
    if (selectedPlanet.id === 'sun') {
      cameraSpherical.current.radius = 280;
    } else {
      cameraSpherical.current.radius = selectedPlanet.visualRadius * 5.5 + 20;
    }
  }, [selectedPlanet]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden">
      {/* 3D Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Planet Badges / Labels Overlay */}
      {showLabels && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {PLANETS_DATA.map((planet) => (
            <div
              key={planet.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded text-[11px] font-mono tracking-wider transition-opacity duration-300 ${
                selectedPlanet.id === planet.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 bg-slate-950/60 border border-slate-800'
              }`}
              style={{
                display: 'none', // Handled if 2D projected coordinates are computed
              }}
            >
              {planet.name}
            </div>
          ))}
        </div>
      )}

      {/* Earth Surface & 3D City Quick-Descend CTA Banner (When Earth is selected) */}
      {selectedPlanet.id === 'earth' && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-3 bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 p-2 pl-4 rounded-xl shadow-2xl">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-cyan-300">Target Acquired: Planet Earth</span>
            <span className="text-[11px] font-mono text-slate-400">Atmosphere, continents & 10 illuminated global 3D cities active</span>
          </div>
          <button
            onClick={onOpenGlobeView}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white font-medium text-xs rounded-lg transition-all shadow-[0_0_15px_rgba(6,182,212,0.5)] flex items-center gap-2 cursor-pointer"
          >
            <span>Descend to Globe & 3D Cities</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      )}
    </div>
  );
};
