import React, { useState } from 'react';
import { AtlasModal } from './components/AtlasModal';
import { CityScene } from './components/CityScene';
import { GlobeView } from './components/GlobeView';
import { HeaderNav } from './components/HeaderNav';
import { PlanetDrawer } from './components/PlanetDrawer';
import { PlanetSelectorDock } from './components/PlanetSelectorDock';
import { SolarSystemScene } from './components/SolarSystemScene';
import { TimeControls } from './components/TimeControls';
import { CITIES_DATA } from './data/cities';
import { PLANETS_DATA } from './data/planets';
import { PlanetData } from './types/astronomy';
import { CityData } from './types/cities';

export default function App() {
  const [currentView, setCurrentView] = useState<'solar_system' | 'globe' | 'city'>('solar_system');
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData>(
    PLANETS_DATA.find((p) => p.id === 'earth') || PLANETS_DATA[3]
  );
  const [selectedCity, setSelectedCity] = useState<CityData>(
    CITIES_DATA.find((c) => c.id === 'tokyo') || CITIES_DATA[0]
  );

  const [isOrreryScale, setIsOrreryScale] = useState(true);
  const [timeMultiplier, setTimeMultiplier] = useState(200);
  const [isPaused, setIsPaused] = useState(false);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [isPlanetDrawerOpen, setIsPlanetDrawerOpen] = useState(true);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Transitions
  const handleSelectPlanet = (planet: PlanetData) => {
    setSelectedPlanet(planet);
    setIsPlanetDrawerOpen(true);
  };

  const handleDescendToGlobe = () => {
    setCurrentView('globe');
    setIsPlanetDrawerOpen(false);
  };

  const handleSelectCity = (city: CityData) => {
    setSelectedCity(city);
    setCurrentView('city');
  };

  const handleBackToGlobe = () => {
    setCurrentView('globe');
  };

  const handleBackToSolarSystem = () => {
    setCurrentView('solar_system');
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden font-sans text-slate-100 select-none">
      {/* Top Header Navigation */}
      <HeaderNav
        currentView={currentView}
        onChangeView={setCurrentView}
        isOrreryScale={isOrreryScale}
        onToggleScale={() => setIsOrreryScale((prev) => !prev)}
        showOrbits={showOrbits}
        onToggleOrbits={() => setShowOrbits((prev) => !prev)}
        onOpenHelpModal={() => setIsHelpModalOpen(true)}
      />

      {/* Main 3D Viewport View Switcher */}
      <main className="w-full h-full pt-14">
        {currentView === 'solar_system' && (
          <>
            <SolarSystemScene
              selectedPlanet={selectedPlanet}
              onSelectPlanet={handleSelectPlanet}
              isOrreryScale={isOrreryScale}
              timeMultiplier={timeMultiplier}
              isPaused={isPaused}
              showOrbits={showOrbits}
              showLabels={showLabels}
              onOpenGlobeView={handleDescendToGlobe}
            />

            {/* Time Multiplier Simulation Panel */}
            <TimeControls
              isPaused={isPaused}
              onTogglePause={() => setIsPaused((prev) => !prev)}
              timeMultiplier={timeMultiplier}
              onChangeMultiplier={setTimeMultiplier}
              onResetTime={() => setTimeMultiplier(1)}
            />

            {/* Planet Selector Dock */}
            <PlanetSelectorDock
              selectedPlanet={selectedPlanet}
              onSelectPlanet={handleSelectPlanet}
            />

            {/* Scientific Planet Telemetry Drawer */}
            {isPlanetDrawerOpen && (
              <PlanetDrawer
                planet={selectedPlanet}
                onClose={() => setIsPlanetDrawerOpen(false)}
                onExploreCities={
                  selectedPlanet.id === 'earth' || selectedPlanet.id === 'mars'
                    ? handleDescendToGlobe
                    : undefined
                }
              />
            )}
          </>
        )}

        {currentView === 'globe' && (
          <GlobeView
            currentPlanetId={selectedPlanet.id === 'mars' ? 'mars' : 'earth'}
            onSelectCity={handleSelectCity}
            onBackToSolarSystem={handleBackToSolarSystem}
          />
        )}

        {currentView === 'city' && (
          <CityScene
            city={selectedCity}
            onBackToGlobe={handleBackToGlobe}
            onBackToSolarSystem={handleBackToSolarSystem}
          />
        )}
      </main>

      {/* Educational Atlas & Guide Modal */}
      <AtlasModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  );
}
