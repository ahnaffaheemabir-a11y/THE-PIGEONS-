import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CameraPreset, CityData } from '../types/cities';
import { generate3DCity } from '../utils/cityGenerator';

interface CitySceneProps {
  city: CityData;
  onBackToGlobe: () => void;
  onBackToSolarSystem: () => void;
}

export const CityScene: React.FC<CitySceneProps> = ({
  city,
  onBackToGlobe,
  onBackToSolarSystem
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'sunset' | 'night'>('night');
  const [cameraMode, setCameraMode] = useState<CameraPreset>('cinematic_orbit');
  const [selectedLandmarkIndex, setSelectedLandmarkIndex] = useState<number | null>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);

  // Camera state & interaction
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const cameraSpherical = useRef({ radius: 320, theta: 0.8, phi: 1.1 });
  const cameraTarget = useRef(new THREE.Vector3(0, 30, 0));
  const autoOrbitAngle = useRef(0);

  // Calculate live local time for the city based on UTC offset
  const getCityLocalTime = () => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const cityTime = new Date(utc + 3600000 * city.utcOffset);
    return cityTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const [localTime, setLocalTime] = useState(getCityLocalTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setLocalTime(getCityLocalTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [city]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 1, 3000);
    cameraRef.current = camera;
    camera.position.set(220, 160, 260);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x111122, 0.4);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const sunLight = new THREE.DirectionalLight(0xfff5ea, 1.8);
    sunLight.position.set(200, 350, 150);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 1000;
    const d = 300;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // 3. Generate 3D Procedural City
    const cityEnv = generate3DCity(city);
    scene.add(cityEnv.cityGroup);

    // Apply Time of Day Lighting & Sky
    const applyTimeOfDay = (tod: 'day' | 'sunset' | 'night') => {
      if (!sceneRef.current || !sunLightRef.current || !hemiLightRef.current) return;

      if (tod === 'day') {
        sceneRef.current.background = new THREE.Color(0x87ceeb); // Daylight sky
        sceneRef.current.fog = new THREE.FogExp2(0x87ceeb, 0.0012);
        sunLightRef.current.color.setHex(0xffffff);
        sunLightRef.current.intensity = 2.2;
        sunLightRef.current.position.set(200, 400, 150);
        hemiLightRef.current.intensity = 0.8;
      } else if (tod === 'sunset') {
        sceneRef.current.background = new THREE.Color(0xfd5e53); // Warm sunset twilight
        sceneRef.current.fog = new THREE.FogExp2(0xd94b43, 0.0016);
        sunLightRef.current.color.setHex(0xff8844);
        sunLightRef.current.intensity = 1.4;
        sunLightRef.current.position.set(300, 80, 200);
        hemiLightRef.current.intensity = 0.4;
      } else {
        // Night
        sceneRef.current.background = new THREE.Color(0x060913); // Deep night sky
        sceneRef.current.fog = new THREE.FogExp2(0x060913, 0.0018);
        sunLightRef.current.color.setHex(0x384a6e);
        sunLightRef.current.intensity = 0.35;
        sunLightRef.current.position.set(100, 150, 100);
        hemiLightRef.current.intensity = 0.2;
      }
    };

    applyTimeOfDay(timeOfDay);

    // 4. Mouse / Touch Navigation Event Handlers
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      cameraSpherical.current.theta -= deltaX * 0.006;
      cameraSpherical.current.phi = Math.max(
        0.1,
        Math.min(Math.PI / 2 - 0.05, cameraSpherical.current.phi - deltaY * 0.005)
      );

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoom = e.deltaY > 0 ? 1.08 : 0.92;
      cameraSpherical.current.radius = Math.max(30, Math.min(650, cameraSpherical.current.radius * zoom));
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
    window.addEventListener('resize', handleResize);

    // 5. Animation loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Update traffic movement
      cityEnv.updateTraffic(delta);

      // Camera motion depending on active mode
      if (cameraMode === 'cinematic_orbit') {
        if (!isDragging.current) {
          autoOrbitAngle.current += delta * 0.12;
        } else {
          autoOrbitAngle.current = cameraSpherical.current.theta;
        }

        const r = cameraSpherical.current.radius;
        const cx = Math.sin(autoOrbitAngle.current) * r;
        const cz = Math.cos(autoOrbitAngle.current) * r;
        const cy = r * 0.45;

        camera.position.set(cx, cy, cz);
        camera.lookAt(cameraTarget.current);

      } else if (cameraMode === 'rooftop') {
        // High observation terrace vantage
        camera.position.set(30, 160, 45);
        const lookX = Math.sin(autoOrbitAngle.current * 0.5) * 60;
        camera.lookAt(lookX, 20, -50);

      } else if (cameraMode === 'street_cruise') {
        // Low altitude boulevard cruise
        const cruiseZ = ((Date.now() * 0.035) % 500) - 250;
        camera.position.set(-8, 6, cruiseZ);
        camera.lookAt(-8, 12, cruiseZ - 120);

      } else if (cameraMode === 'top_down') {
        // Plan view / urban map view
        camera.position.set(0, 480, 0);
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      cityEnv.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [city, timeOfDay, cameraMode]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden">
      {/* 3D Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Header Navigation & Breadcrumbs */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <button
          onClick={onBackToGlobe}
          className="px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
        >
          <span aria-hidden="true">&larr;</span>
          <span>Earth Globe</span>
        </button>
        <button
          onClick={onBackToSolarSystem}
          className="px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium rounded-lg border border-slate-800 backdrop-blur-md transition-all cursor-pointer shadow-lg"
        >
          Solar System
        </button>

        {/* City Title Badge */}
        <div className="ml-2 flex items-center gap-2 px-3 py-1.5 bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 rounded-lg">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block animate-pulse"
            style={{ backgroundColor: city.nightLightingColor }}
          />
          <span className="text-xs font-bold text-white tracking-wide">{city.name}</span>
          <span className="text-slate-500 text-xs">/</span>
          <span className="text-xs font-mono text-cyan-300 tabular-nums">{localTime}</span>
        </div>
      </div>

      {/* Right Telemetry & Architecture Spec Sidebar */}
      <div className="absolute top-4 right-4 z-20 w-80 max-h-[92vh] overflow-y-auto bg-slate-950/85 backdrop-blur-lg border border-slate-800 rounded-xl p-4 shadow-2xl space-y-4">
        {/* City Header */}
        <div className="border-b border-slate-800/80 pb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-wide">{city.name}</h2>
            <span className="text-[11px] font-mono text-slate-400 uppercase">{city.country}</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{city.architecturalStyle}</p>
        </div>

        {/* Environmental & City Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-slate-900/60 rounded border border-slate-800/80">
            <div className="text-[10px] uppercase font-mono text-slate-400">Metro Population</div>
            <div className="font-semibold text-slate-100 mt-0.5">{city.population}</div>
          </div>
          <div className="p-2 bg-slate-900/60 rounded border border-slate-800/80">
            <div className="text-[10px] uppercase font-mono text-slate-400">Elevation & Lat/Lng</div>
            <div className="font-mono text-slate-100 mt-0.5 tabular-nums">
              {city.elevationM}m · {city.lat.toFixed(1)}°N
            </div>
          </div>
          <div className="p-2 bg-slate-900/60 rounded border border-slate-800/80">
            <div className="text-[10px] uppercase font-mono text-slate-400">Tallest Structure</div>
            <div className="font-semibold text-cyan-300 mt-0.5 truncate">
              {city.skylineStats.tallestStructure}
            </div>
          </div>
          <div className="p-2 bg-slate-900/60 rounded border border-slate-800/80">
            <div className="text-[10px] uppercase font-mono text-slate-400">Peak Height</div>
            <div className="font-mono text-cyan-300 mt-0.5 tabular-nums font-semibold">
              {city.skylineStats.tallestHeightM} m
            </div>
          </div>
        </div>

        {/* Signature 3D Landmarks */}
        <div>
          <div className="text-[11px] uppercase tracking-wider font-mono text-slate-400 mb-2">
            Signature Architectural Landmarks
          </div>
          <div className="space-y-2">
            {city.landmarks.map((lm, idx) => (
              <div
                key={lm.name}
                onClick={() => setSelectedLandmarkIndex(idx === selectedLandmarkIndex ? null : idx)}
                className={`p-2.5 rounded-lg border text-xs transition-all cursor-pointer ${
                  selectedLandmarkIndex === idx
                    ? 'bg-cyan-950/40 border-cyan-500/60 text-white'
                    : 'bg-slate-900/40 border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{lm.name}</span>
                  <span className="font-mono text-[11px] text-cyan-400 tabular-nums">
                    {lm.heightM}m
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {lm.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Overview summary */}
        <div className="pt-2 border-t border-slate-800/80">
          <p className="text-xs text-slate-300 leading-relaxed">{city.description}</p>
        </div>
      </div>

      {/* Bottom Floating Control Bar (Lighting & Camera Presets) */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex flex-wrap items-center justify-center gap-3 bg-slate-950/90 backdrop-blur-md border border-white/10 p-2 rounded-xl shadow-2xl">
        {/* Time of Day Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/80 rounded-lg border border-slate-800">
          <button
            onClick={() => setTimeOfDay('day')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              timeOfDay === 'day' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Daylight
          </button>
          <button
            onClick={() => setTimeOfDay('sunset')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              timeOfDay === 'sunset' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sunset / Twilight
          </button>
          <button
            onClick={() => setTimeOfDay('night')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              timeOfDay === 'night' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Night Neon
          </button>
        </div>

        {/* Camera Preset Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/80 rounded-lg border border-slate-800">
          <button
            onClick={() => setCameraMode('cinematic_orbit')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              cameraMode === 'cinematic_orbit'
                ? 'bg-white text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Helicopter Orbit
          </button>
          <button
            onClick={() => setCameraMode('rooftop')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              cameraMode === 'rooftop'
                ? 'bg-white text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Observation Deck
          </button>
          <button
            onClick={() => setCameraMode('street_cruise')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              cameraMode === 'street_cruise'
                ? 'bg-white text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Avenue Cruise
          </button>
          <button
            onClick={() => setCameraMode('top_down')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              cameraMode === 'top_down'
                ? 'bg-white text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Urban Grid (Top)
          </button>
        </div>
      </div>
    </div>
  );
};
