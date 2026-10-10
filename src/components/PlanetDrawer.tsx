import React from 'react';
import { PlanetData } from '../types/astronomy';

interface PlanetDrawerProps {
  planet: PlanetData;
  onClose: () => void;
  onExploreCities?: () => void;
}

export const PlanetDrawer: React.FC<PlanetDrawerProps> = ({
  planet,
  onClose,
  onExploreCities
}) => {
  return (
    <div className="absolute top-16 right-4 z-20 w-88 max-h-[88vh] overflow-y-auto bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4 select-none">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: planet.color }}
            />
            <h2 className="text-xl font-bold tracking-wide text-white">{planet.name}</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{planet.tagline}</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer text-xs font-mono"
        >
          ✕
        </button>
      </div>

      {/* Surface Descend CTA Button (For Earth & Mars) */}
      {(planet.id === 'earth' || planet.id === 'mars') && onExploreCities && (
        <button
          onClick={onExploreCities}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Descend to Surface & 3D {planet.id === 'earth' ? 'Cities' : 'Colony'}</span>
          <span aria-hidden="true">&rarr;</span>
        </button>
      )}

      {/* Primary Telemetry Metrics Matrix */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 bg-slate-900/60 rounded-xl border border-white/5">
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
            Distance to Sun
          </div>
          <div className="text-sm font-semibold font-mono text-slate-100 mt-0.5 tabular-nums">
            {planet.distanceAU.toFixed(2)}{' '}
            <span className="text-[10px] text-slate-400">AU</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 tabular-nums">
            {(planet.distanceAU * 149.6).toFixed(1)} M km
          </div>
        </div>

        <div className="p-2.5 bg-slate-900/60 rounded-xl border border-white/5">
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
            Orbital Velocity
          </div>
          <div className="text-sm font-semibold font-mono text-cyan-300 mt-0.5 tabular-nums">
            {planet.orbitalVelocityKmS.toFixed(1)}{' '}
            <span className="text-[10px] text-slate-400">km/s</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 tabular-nums">
            {(planet.orbitalVelocityKmS * 3600).toLocaleString()} km/h
          </div>
        </div>

        <div className="p-2.5 bg-slate-900/60 rounded-xl border border-white/5">
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
            Equatorial Radius
          </div>
          <div className="text-sm font-semibold font-mono text-slate-100 mt-0.5 tabular-nums">
            {planet.radiusKm.toLocaleString()}{' '}
            <span className="text-[10px] text-slate-400">km</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 tabular-nums">
            {planet.trueRadiusScale.toFixed(2)}× Earth
          </div>
        </div>

        <div className="p-2.5 bg-slate-900/60 rounded-xl border border-white/5">
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
            Surface Gravity
          </div>
          <div className="text-sm font-semibold font-mono text-slate-100 mt-0.5 tabular-nums">
            {planet.gravityMs2.toFixed(2)}{' '}
            <span className="text-[10px] text-slate-400">m/s²</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 tabular-nums">
            {(planet.gravityMs2 / 9.807).toFixed(2)} g
          </div>
        </div>

        <div className="p-2.5 bg-slate-900/60 rounded-xl border border-white/5">
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
            Orbital Period
          </div>
          <div className="text-sm font-semibold font-mono text-slate-100 mt-0.5 tabular-nums">
            {planet.orbitalPeriodDays > 365
              ? `${(planet.orbitalPeriodDays / 365.25).toFixed(2)} yr`
              : `${planet.orbitalPeriodDays.toFixed(1)} d`}
          </div>
        </div>

        <div className="p-2.5 bg-slate-900/60 rounded-xl border border-white/5">
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
            Day Length (Rotation)
          </div>
          <div className="text-sm font-semibold font-mono text-slate-100 mt-0.5 tabular-nums">
            {Math.abs(planet.rotationPeriodHours) > 48
              ? `${(Math.abs(planet.rotationPeriodHours) / 24).toFixed(1)} d`
              : `${Math.abs(planet.rotationPeriodHours).toFixed(1)} h`}
            {planet.rotationPeriodHours < 0 ? ' (Retro)' : ''}
          </div>
        </div>
      </div>

      {/* Surface Temperature Range */}
      <div className="p-3 bg-slate-900/40 rounded-xl border border-white/5 space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Surface Temperature</span>
          <span className="font-mono text-cyan-300 font-semibold tabular-nums">
            {planet.surfaceTempC.avg}°C avg
          </span>
        </div>
        <div className="flex justify-between text-[11px] font-mono text-slate-400 tabular-nums">
          <span>Min: {planet.surfaceTempC.min}°C</span>
          <span>Max: {planet.surfaceTempC.max}°C</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
          <div className="bg-blue-500 w-1/3" />
          <div className="bg-emerald-500 w-1/3" />
          <div className="bg-amber-500 w-1/3" />
        </div>
      </div>

      {/* Atmosphere Composition Breakdown */}
      <div className="p-3 bg-slate-900/40 rounded-xl border border-white/5 space-y-2">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
          Atmospheric Composition
        </div>
        <div className="space-y-1">
          {planet.atmosphere.map((item) => (
            <div key={item} className="flex items-center justify-between text-xs text-slate-300">
              <span className="text-slate-400">{item}</span>
              <span className="font-mono text-slate-200">✓</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scientific Overview */}
      <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed border-t border-white/10 pt-3">
        <p>{planet.description}</p>
      </div>

      {/* Key Astronomical Features */}
      <div className="space-y-1.5 text-xs">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
          Key Physical Features
        </div>
        <ul className="space-y-1 text-slate-300">
          {planet.keyFeatures.map((feat) => (
            <li key={feat} className="flex items-start gap-1.5">
              <span className="text-cyan-400 mt-0.5">·</span>
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Exploration Milestones */}
      <div className="space-y-1.5 text-xs border-t border-white/10 pt-3">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
          Human Exploration History
        </div>
        <ul className="space-y-1 text-slate-400">
          {planet.explorationHighlights.map((hl) => (
            <li key={hl} className="flex items-start gap-1.5">
              <span className="text-amber-400 mt-0.5">·</span>
              <span className="text-slate-300">{hl}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
