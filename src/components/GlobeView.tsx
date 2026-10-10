import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CITIES_DATA } from '../data/cities';
import { CityData } from '../types/cities';
import {
  createDeepSpaceBackground,
  createEarthCloudTexture,
  createEarthDayTexture,
  createEarthNightTexture,
  createMarsTexture
} from '../utils/textureGenerator';

interface GlobeViewProps {
  currentPlanetId: 'earth' | 'mars' | 'moon';
  onSelectCity: (city: CityData) => void;
  onBackToSolarSystem: () => void;
}

export const GlobeView: React.FC<GlobeViewProps> = ({
  currentPlanetId,
  onSelectCity,
  onBackToSolarSystem
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCity, setHoveredCity] = useState<CityData | null>(null);
  const [activePlanet, setActivePlanet] = useState<'earth' | 'mars' | 'moon'>(currentPlanetId);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeMeshRef = useRef<THREE.Mesh | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const pinsGroupRef = useRef<THREE.Group | null>(null);

  // Mouse interaction state
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const cameraSpherical = useRef({ radius: 85, theta: 0.8, phi: 1.2 });
  const globeRotation = useRef({ x: 0, y: 0 });

  // Convert GPS (lat, lng) to 3D Cartesian coordinates on sphere
  const latLngToVector3 = (lat: number, lng: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = createDeepSpaceBackground();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 20, 85);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Dynamic Sunlight from side to show Day/Night terminator clearly
    const sunLight = new THREE.DirectionalLight(0xfffbf0, 2.5);
    sunLight.position.set(100, 25, 60);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x0e1726, 0.7);
    scene.add(ambientLight);

    // Globe Radius
    const radius = 28;

    // Build Planet Globe
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    let globeMat: THREE.Material;
    if (activePlanet === 'earth') {
      globeMat = new THREE.MeshStandardMaterial({
        map: createEarthDayTexture(),
        roughness: 0.45,
        metalness: 0.1
      });
    } else if (activePlanet === 'mars') {
      globeMat = new THREE.MeshStandardMaterial({
        map: createMarsTexture(),
        roughness: 0.8
      });
    } else {
      globeMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.95
      });
    }

    const globeGeo = new THREE.SphereGeometry(radius, 64, 64);
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globeMesh);
    globeMeshRef.current = globeMesh;

    // Earth Clouds
    if (activePlanet === 'earth') {
      const cloudGeo = new THREE.SphereGeometry(radius * 1.018, 64, 64);
      const cloudMat = new THREE.MeshStandardMaterial({
        map: createEarthCloudTexture(),
        transparent: true,
        opacity: 0.8,
        blending: THREE.NormalBlending
      });
      const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
      globeGroup.add(cloudMesh);
      cloudsMeshRef.current = cloudMesh;

      // Atmospheric Rayleigh Rim Glow
      const atmosGeo = new THREE.SphereGeometry(radius * 1.12, 48, 48);
      const atmosMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.22,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
      });
      const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
      globeGroup.add(atmosMesh);
    }

    // Build 3D City Pins
    const pinsGroup = new THREE.Group();
    globeGroup.add(pinsGroup);
    pinsGroupRef.current = pinsGroup;

    const filteredCities = CITIES_DATA.filter((c) => c.planetId === activePlanet);

    filteredCities.forEach((city) => {
      const pinPos = latLngToVector3(city.lat, city.lng, radius * 1.02);

      const pinSubGroup = new THREE.Group();
      pinSubGroup.position.copy(pinPos);
      pinSubGroup.lookAt(pinPos.clone().multiplyScalar(2)); // Orient normal to sphere surface

      // Pin Needle
      const stemGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 8);
      const stemMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.z = 1.5;
      stem.rotation.x = Math.PI / 2;
      pinSubGroup.add(stem);

      // Glowing Beacon Head
      const headGeo = new THREE.SphereGeometry(0.75, 16, 16);
      const headMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(city.nightLightingColor) });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.z = 3.2;
      head.userData = { cityId: city.id };
      pinSubGroup.add(head);

      // Pulse Ring
      const ringGeo = new THREE.RingGeometry(0.6, 1.2, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(city.nightLightingColor),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.z = 0.1;
      pinSubGroup.add(ring);

      pinsGroup.add(pinSubGroup);
    });

    // Interaction Handlers
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) {
        // Raycasting for city hover
        if (!cameraRef.current || !rendererRef.current) return;
        const rect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, cameraRef.current);

        const intersects = raycaster.intersectObjects(pinsGroup.children, true);
        if (intersects.length > 0) {
          const hitObj = intersects[0].object;
          const hitCityId = hitObj.userData?.cityId;
          if (hitCityId) {
            const found = CITIES_DATA.find((c) => c.id === hitCityId);
            setHoveredCity(found || null);
            container.style.cursor = 'pointer';
            return;
          }
        }
        setHoveredCity(null);
        container.style.cursor = 'grab';
        return;
      }

      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      globeRotation.current.y += deltaX * 0.005;
      globeRotation.current.x = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, globeRotation.current.x + deltaY * 0.005)
      );

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoom = e.deltaY > 0 ? 1.08 : 0.92;
      cameraSpherical.current.radius = Math.max(45, Math.min(160, cameraSpherical.current.radius * zoom));
    };

    const handleClick = (e: MouseEvent) => {
      if (!cameraRef.current || !rendererRef.current) return;
      const rect = renderer.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      const intersects = raycaster.intersectObjects(pinsGroup.children, true);
      if (intersects.length > 0) {
        const hitObj = intersects[0].object;
        const hitCityId = hitObj.userData?.cityId;
        if (hitCityId) {
          const city = CITIES_DATA.find((c) => c.id === hitCityId);
          if (city) {
            onSelectCity(city);
          }
        }
      }
    };

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

    // Animation loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Auto slow rotation when user isn't dragging
      if (!isDragging.current) {
        globeRotation.current.y += 0.0012;
      }

      globeGroup.rotation.y = globeRotation.current.y;
      globeGroup.rotation.x = globeRotation.current.x;

      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y += 0.0006;
      }

      // Camera position from spherical radius
      const r = cameraSpherical.current.radius;
      camera.position.set(0, 15, r);
      camera.lookAt(0, 0, 0);

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
  }, [activePlanet]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden">
      {/* 3D Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Navigation Header */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
        <button
          onClick={onBackToSolarSystem}
          className="px-3.5 py-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium rounded-lg border border-slate-700/80 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <span aria-hidden="true">&larr;</span>
          <span>Return to Solar System</span>
        </button>

        {/* Planet Switcher: Earth / Mars / Moon */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-lg">
          <button
            onClick={() => setActivePlanet('earth')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              activePlanet === 'earth'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Earth (10 Cities)
          </button>
          <button
            onClick={() => setActivePlanet('mars')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              activePlanet === 'mars'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Mars Frontier Base
          </button>
          <button
            onClick={() => setActivePlanet('moon')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              activePlanet === 'moon'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Moon Artemis Outpost
          </button>
        </div>
      </div>

      {/* Quick City Selector Pill List / Horizontal Dock */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 max-w-4xl w-[92%] flex flex-col items-center gap-2">
        <div className="text-[11px] font-mono text-slate-400 tracking-wider uppercase">
          Select a city or base to descend into realistic 3D architecture
        </div>
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-950/85 backdrop-blur-lg border border-white/10 rounded-xl overflow-x-auto w-full justify-start md:justify-center scrollbar-none shadow-2xl">
          {CITIES_DATA.filter((c) => c.planetId === activePlanet).map((city) => (
            <button
              key={city.id}
              onClick={() => onSelectCity(city)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap bg-slate-900/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: city.nightLightingColor }}
              />
              <span>{city.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Hover Info Card Preview */}
      {hoveredCity && (
        <div className="absolute top-20 right-6 z-20 w-80 p-4 bg-slate-950/90 backdrop-blur-md border border-cyan-500/30 rounded-xl shadow-2xl animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="flex items-start justify-between border-b border-slate-800/80 pb-2 mb-3">
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">{hoveredCity.name}</h3>
              <p className="text-xs text-slate-400">{hoveredCity.country}</p>
            </div>
            <span
              className="px-2 py-0.5 text-[10px] font-mono rounded border uppercase"
              style={{
                borderColor: `${hoveredCity.nightLightingColor}60`,
                color: hoveredCity.nightLightingColor,
                backgroundColor: `${hoveredCity.nightLightingColor}15`
              }}
            >
              {hoveredCity.planetId.toUpperCase()}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Coordinates</span>
              <span className="font-mono text-slate-200 tabular-nums">
                {hoveredCity.lat.toFixed(2)}°, {hoveredCity.lng.toFixed(2)}°
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Population</span>
              <span className="font-mono text-slate-200">{hoveredCity.population}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Timezone</span>
              <span className="font-mono text-slate-200">UTC {hoveredCity.utcOffset >= 0 ? `+${hoveredCity.utcOffset}` : hoveredCity.utcOffset}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Elevation</span>
              <span className="font-mono text-slate-200 tabular-nums">{hoveredCity.elevationM} m</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
            {hoveredCity.description}
          </p>

          <button
            onClick={() => onSelectCity(hoveredCity)}
            className="w-full mt-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer text-center"
          >
            Enter 3D City Simulation &rarr;
          </button>
        </div>
      )}
    </div>
  );
};
