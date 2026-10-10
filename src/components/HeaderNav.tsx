import React, { useState } from 'react';
import { audioService } from '../utils/audioSynthesizer';

interface HeaderNavProps {
  currentView: 'solar_system' | 'globe' | 'city';
  onChangeView: (view: 'solar_system' | 'globe' | 'city') => void;
  isOrreryScale: boolean;
  onToggleScale: () => void;
  showOrbits: boolean;
  onToggleOrbits: () => void;
  onOpenHelpModal: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentView,
  onChangeView,
  isOrreryScale,
  onToggleScale,
  showOrbits,
  onToggleOrbits,
  onOpenHelpModal
}) => {
  const [isAudioActive, setIsAudioActive] = useState(!audioService.getMuted());

  const handleToggleAudio = () => {
    const active = audioService.toggleMute();
    setIsAudioActive(active);
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 bg-slate-950/70 backdrop-blur-md border-b border-white/10 select-none">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-white/90 bg-amber-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-wider text-white font-mono uppercase">
              ASTROSPHERE 3D
            </h1>
            <span className="text-[10px] font-mono text-cyan-400 border border-cyan-500/30 px-1.5 py-0.2 rounded">
              SOLAR & CITIES
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            Real Orbital Mechanics · High-Fidelity Global 3D Cities
          </div>
        </div>
      </div>

      {/* Primary Navigation Modes */}
      <nav className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
        <button
          onClick={() => onChangeView('solar_system')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
            currentView === 'solar_system'
              ? 'bg-cyan-600 text-white shadow-sm font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>☀️</span>
          <span>Solar System</span>
        </button>
        <button
          onClick={() => onChangeView('globe')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
            currentView === 'globe'
              ? 'bg-cyan-600 text-white shadow-sm font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>🌍</span>
          <span>Planet Globe</span>
        </button>
        <button
          onClick={() => onChangeView('city')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
            currentView === 'city'
              ? 'bg-cyan-600 text-white shadow-sm font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>🏙️</span>
          <span>3D Megacity</span>
        </button>
      </nav>

      {/* Auxiliary Controls (Scale, Orbits, Audio, Telemetry Manual) */}
      <div className="flex items-center gap-2">
        {currentView === 'solar_system' && (
          <>
            {/* Scale Switcher: Orrery vs Real Scale */}
            <button
              onClick={onToggleScale}
              title={isOrreryScale ? 'Switch to True Astronomical Scale' : 'Switch to Enhanced Orrery View'}
              className="px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-white rounded-lg border border-slate-800 transition-colors cursor-pointer"
            >
              Scale: <span className="text-cyan-400">{isOrreryScale ? 'Visual Orrery' : 'True Keplerian'}</span>
            </button>

            {/* Orbit Lines Toggle */}
            <button
              onClick={onToggleOrbits}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors cursor-pointer ${
                showOrbits
                  ? 'bg-slate-900/90 text-cyan-400 border-cyan-500/40'
                  : 'bg-slate-950 text-slate-500 border-slate-800'
              }`}
            >
              Orbits: {showOrbits ? 'ON' : 'OFF'}
            </button>
          </>
        )}

        {/* Ambient Audio Drone Toggle */}
        <button
          onClick={handleToggleAudio}
          className={`p-2 rounded-lg border transition-colors cursor-pointer text-xs ${
            isAudioActive
              ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
          }`}
          title={isAudioActive ? 'Mute Cosmic Ambient Audio' : 'Unmute Cosmic Ambient Audio'}
        >
          {isAudioActive ? '🔊 Audio ON' : '🔈 Audio OFF'}
        </button>

        {/* Info / Guide */}
        <button
          onClick={onOpenHelpModal}
          className="px-2.5 py-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono rounded-lg border border-slate-800 transition-colors cursor-pointer"
        >
          Atlas Guide
        </button>
      </div>
    </header>
  );
};
