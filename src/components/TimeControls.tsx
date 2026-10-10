import React, { useEffect, useState } from 'react';

interface TimeControlsProps {
  isPaused: boolean;
  onTogglePause: () => void;
  timeMultiplier: number;
  onChangeMultiplier: (multiplier: number) => void;
  onResetTime: () => void;
}

export const TimeControls: React.FC<TimeControlsProps> = ({
  isPaused,
  onTogglePause,
  timeMultiplier,
  onChangeMultiplier,
  onResetTime
}) => {
  // Simulated Julian / Earth Date state
  const [simulatedDate, setSimulatedDate] = useState(new Date());

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setSimulatedDate((prev) => {
        // Increment date according to time multiplier
        // 1 second real-time = timeMultiplier days/hours
        const addSeconds = (timeMultiplier * 86400) / 60;
        return new Date(prev.getTime() + addSeconds);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPaused, timeMultiplier]);

  const speedOptions = [
    { label: '1x (Real)', value: 1 },
    { label: '50x', value: 50 },
    { label: '200x', value: 200 },
    { label: '1000x', value: 1000 },
    { label: '5000x', value: 5000 },
  ];

  return (
    <div className="absolute top-16 left-4 z-20 flex flex-col gap-2 p-3 bg-slate-950/85 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl select-none text-xs">
      {/* Simulation Clock */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
          Simulation Epoch
        </span>
        <span className="font-mono text-cyan-300 font-semibold tabular-nums">
          {simulatedDate.toISOString().slice(0, 10)}
        </span>
      </div>

      {/* Play/Pause & Speed Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onTogglePause}
          className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all cursor-pointer ${
            isPaused
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
          }`}
        >
          {isPaused ? '▶ RESUME' : '⏸ PAUSE'}
        </button>

        <button
          onClick={onResetTime}
          className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 font-mono text-[11px] transition-colors cursor-pointer"
          title="Reset to Present Date"
        >
          ↺ Present
        </button>
      </div>

      {/* Speed Multiplier Segmented Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900/80 rounded-lg border border-slate-800/80">
        {speedOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChangeMultiplier(opt.value)}
            className={`px-2 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
              timeMultiplier === opt.value
                ? 'bg-cyan-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};
