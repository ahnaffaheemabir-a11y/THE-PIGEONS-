import React from 'react';

interface AtlasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AtlasModal: React.FC<AtlasModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-white/10 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-bold">
              ✦
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                ASTROSPHERE 3D EXPLORER ATLAS
              </h2>
              <p className="text-xs text-slate-400">
                Orbital Mechanics, Global Megacities & Navigation Guide
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer text-sm font-mono"
          >
            ✕
          </button>
        </div>

        {/* Content sections */}
        <div className="space-y-4 text-xs text-slate-300">
          <div>
            <h3 className="text-sm font-semibold text-cyan-400 mb-1">
              1. Solar System & Keplerian Physics
            </h3>
            <p className="leading-relaxed text-slate-300">
              The simulation calculates the Keplerian elliptical orbits for all 8 planets plus Pluto.
              Toggle between <strong>Visual Orrery Scale</strong> (adjusted for clear spatial inspection)
              and <strong>True Keplerian Scale</strong> (accurate astronomical distance relationships).
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-cyan-400 mb-1">
              2. Seamless Planetary & Megacity Zoom
            </h3>
            <p className="leading-relaxed text-slate-300">
              Select Earth from the solar view or planetary dock to access the{' '}
              <strong>Globe View</strong>. You can inspect 10 worldwide metropolitan centers
              (Tokyo, NYC, Paris, London, Dubai, Singapore, Sydney, San Francisco, Rio de Janeiro, Cairo),
              as well as futuristic colonies on Mars and the Moon. Click any city beacon to descend
              into a hyper-detailed 3D procedural skyline featuring signature landmarks and moving traffic!
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-cyan-400 mb-1">
              3. Interactive 3D Controls
            </h3>
            <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[11px]">
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-cyan-300">Left Mouse Click + Drag</span>
                <p className="text-slate-400 mt-0.5">Rotate orbit camera / pitch & yaw</p>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-cyan-300">Scroll Wheel / Pinch</span>
                <p className="text-slate-400 mt-0.5">Smooth logarithmic zoom in & out</p>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-cyan-300">Direct Object Click</span>
                <p className="text-slate-400 mt-0.5">Select and center on any planet or city</p>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-cyan-300">Day / Sunset / Night</span>
                <p className="text-slate-400 mt-0.5">Switch lighting ambiance in 3D city mode</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
          >
            Begin Exploration
          </button>
        </div>
      </div>
    </div>
  );
};
