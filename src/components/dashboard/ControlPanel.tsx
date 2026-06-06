import React from 'react';
import { SlidersHorizontal, Sun, Wind, ShieldAlert, RotateCcw } from 'lucide-react';
import { useGrid } from '../../store/GridContext';

export const ControlPanel: React.FC = () => {
  const { state, setGlobalWind, setPreset, resetGrid } = useGrid();

  const handleWindChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalWind(parseInt(e.target.value));
  };

  const currentWind = state.globalWindSpeed;

  return (
    <div className="bg-white/95 border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full backdrop-blur-md">
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <SlidersHorizontal className="text-emerald-600" size={20} />
            Global Control Center
          </h3>
          <span className="text-xs text-slate-500">Configure global climate values and farm presets</span>
        </div>
        
        <button
          onClick={resetGrid}
          className="p-2 rounded-lg bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer shadow-sm"
          title="Reset Simulation Grid"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2 bg-slate-50 border border-slate-200/50 rounded-xl p-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-550 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Wind size={14} className="text-slate-400" />
              Global Wind Velocity
            </span>
            <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-sm">
              {currentWind} km/h
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="110"
            value={currentWind}
            onChange={handleWindChange}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />

          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
            <span>0 km/h</span>
            <span>50 km/h (Rated)</span>
            <span>90 km/h (Cut-out)</span>
            <span>110 km/h</span>
          </div>
        </div>

        <div>
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-3">
            Simulated Presets
          </span>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setPreset('calm')}
              className="flex flex-col items-center justify-center gap-1.5 py-3.5 px-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-emerald-50/50 hover:text-emerald-800 hover:border-emerald-300 transition-all duration-200 cursor-pointer text-center shadow-sm"
            >
              <Sun size={18} className="text-amber-500" />
              <span className="font-bold text-xs">Calm Day</span>
              <span className="text-[9px] text-slate-400 leading-none">20 km/h @ 25°</span>
            </button>

            <button
              onClick={() => setPreset('peak')}
              className="flex flex-col items-center justify-center gap-1.5 py-3.5 px-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-emerald-50/50 hover:text-emerald-800 hover:border-emerald-300 transition-all duration-200 cursor-pointer text-center shadow-sm"
            >
              <Wind size={18} className="text-emerald-600" />
              <span className="font-bold text-xs">Grid Peak</span>
              <span className="text-[9px] text-slate-400 leading-none">60 km/h @ 40°</span>
            </button>

            <button
              onClick={() => setPreset('storm')}
              className="flex flex-col items-center justify-center gap-1.5 py-3.5 px-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-emerald-50/50 hover:text-emerald-800 hover:border-emerald-300 transition-all duration-200 cursor-pointer text-center shadow-sm"
            >
              <ShieldAlert size={18} className="text-red-500 animate-pulse" />
              <span className="font-bold text-xs text-red-650">Storm Warning</span>
              <span className="text-[9px] text-slate-400 leading-none">90 km/h @ 15°</span>
            </button>
          </div>
        </div>

        {currentWind > 90 ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 text-xs text-red-700 shadow-sm">
            <ShieldAlert size={20} className="flex-shrink-0 animate-bounce" />
            <div>
              <h5 className="font-bold">CUT-OUT SPEED EXCEEDED</h5>
              <p className="text-red-600">Wind velocity is above cut-out limit (90 km/h). Auto-shutting turbines to prevent catastrophic rotor damage.</p>
            </div>
          </div>
        ) : currentWind < 10 ? (
          <div className="bg-slate-50 border border-slate-200 text-slate-600 rounded-xl p-4 flex gap-3 text-xs shadow-sm">
            <Wind size={20} className="flex-shrink-0 text-slate-400" />
            <div>
              <h5 className="font-bold">BELOW CUT-IN VELOCITY</h5>
              <p className="text-slate-500">Wind speed is below 10 km/h. Rotors are stationary and cannot generate power.</p>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-250 text-emerald-700 rounded-xl p-4 flex gap-3 text-xs shadow-sm">
            <Wind size={20} className="flex-shrink-0 text-emerald-600" />
            <div>
              <h5 className="font-bold">OPTIMAL WIND VELOCITY</h5>
              <p className="text-emerald-650">Climate conditions are optimal for wind generation. Fine-tune blade pitch angles to maximize MW outputs.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ControlPanel;
