import React from 'react';
import { PLANETS_DATA } from '../data/planets';
import { PlanetData } from '../types/astronomy';
import { audioService } from '../utils/audioSynthesizer';

interface PlanetSelectorDockProps {
  selectedPlanet: PlanetData;
  onSelectPlanet: (planet: PlanetData) => void;
}

export const PlanetSelectorDock: React.FC<PlanetSelectorDockProps> = ({
  selectedPlanet,
  onSelectPlanet
}) => {
  const handleClick = (planet: PlanetData) => {
    audioService.playFlybyChime();
    onSelectPlanet(planet);
  };

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 max-w-4xl w-[94%]">
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-950/85 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-x-auto scrollbar-none justify-start md:justify-center">
        {PLANETS_DATA.map((planet) => {
          const isSelected = selectedPlanet.id === planet.id;
          return (
            <button
              key={planet.id}
              onClick={() => handleClick(planet)}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-cyan-500/20 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                  : 'bg-slate-900/60 hover:bg-slate-800/80 border border-transparent hover:border-slate-700'
              }`}
            >
              <div
                className="w-3.5 h-3.5 rounded-full transition-transform group-hover:scale-110 shadow-sm"
                style={{
                  backgroundColor: planet.color,
                  boxShadow: isSelected ? `0 0 10px ${planet.color}` : 'none'
                }}
              />
              <div className="flex flex-col text-left">
                <span
                  className={`text-xs font-medium tracking-wide ${
                    isSelected ? 'text-white font-semibold' : 'text-slate-300 group-hover:text-white'
                  }`}
                >
                  {planet.name}
                </span>
                <span className="text-[10px] font-mono text-slate-500 tabular-nums">
                  {planet.id === 'sun' ? 'Center' : `${planet.distanceAU.toFixed(1)} AU`}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
