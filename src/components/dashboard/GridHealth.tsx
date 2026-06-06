import React, { useMemo } from 'react';
import { ShieldCheck, ShieldAlert, Zap, Wrench, Ban, RefreshCw } from 'lucide-react';
import type { Turbine } from '../../store/GridContext';

interface GridHealthProps {
  turbines: Turbine[];
  gridStability: number;
  totalPower: number;
}

export const GridHealth: React.FC<GridHealthProps> = ({
  turbines,
  gridStability,
  totalPower,
}) => {
  const { activeCount, maintenanceCount, offlineCount, failedCount } = useMemo(() => {
    let active = 0;
    let maintenance = 0;
    let offline = 0;
    let failed = 0;

    turbines.forEach((t) => {
      if (t.offlineStatus) {
        offline++;
        if (t.healthStatus >= 100) {
          failed++;
        }
      } else if (t.maintenanceMode) {
        maintenance++;
      } else {
        active++;
      }
    });

    return { activeCount: active, maintenanceCount: maintenance, offlineCount: offline, failedCount: failed };
  }, [turbines]);

  const arcLength = 220;
  const strokeDashoffset = useMemo(() => {
    return arcLength - (arcLength * gridStability) / 100;
  }, [gridStability]);

  const gaugeColor = useMemo(() => {
    if (gridStability >= 80) return 'stroke-emerald-500';
    if (gridStability >= 50) return 'stroke-amber-500';
    return 'stroke-red-500';
  }, [gridStability]);

  return (
    <div className="bg-white/95 border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full backdrop-blur-md">
      
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          {gridStability >= 75 ? (
            <ShieldCheck className="text-emerald-600" size={20} />
          ) : (
            <ShieldAlert className="text-amber-600 animate-pulse" size={20} />
          )}
          Grid Telemetry & Integrities
        </h3>
        <span className="text-xs text-slate-500">Total farm output and phase-stabilization metrics</span>
      </div>

      <div className="flex flex-col items-center justify-center mb-6">
        <div className="relative w-44 h-24 flex items-center justify-center">
          <svg className="w-full h-full transform" viewBox="0 0 200 100">
            <path
              d="M 20 90 A 70 70 0 0 1 180 90"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M 20 90 A 70 70 0 0 1 180 90"
              fill="none"
              className={`transition-all duration-500 ease-out ${gaugeColor}`}
              strokeWidth="14"
              strokeDasharray={arcLength}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute bottom-1 text-center">
            <span className="text-2xl font-mono font-black text-slate-850">{gridStability}%</span>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Stability</span>
          </div>
        </div>
      </div>

      <div className="grid-cols-2 grid gap-3 flex-grow">
        <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Total MW</span>
          <div className="flex items-center gap-2">
            <Zap className="text-emerald-600" size={16} />
            <span className="text-lg font-mono font-black text-slate-800">{totalPower.toFixed(2)}</span>
          </div>
          <span className="text-[9px] text-slate-500 mt-1 block">Rotor active output</span>
        </div>

        <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Synchronized</span>
          <div className="flex items-center gap-2">
            <RefreshCw className="text-emerald-600 animate-spin-slow" size={16} style={{ animationDuration: '6s' }} />
            <span className="text-lg font-mono font-black text-slate-800">{activeCount} <span className="text-xs text-slate-500">/ 6</span></span>
          </div>
          <span className="text-[9px] text-emerald-600 mt-1 block font-semibold">Generating power</span>
        </div>

        <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Offline</span>
          <div className="flex items-center gap-2">
            <Ban className="text-slate-400" size={16} />
            <span className="text-lg font-mono font-black text-slate-800">{offlineCount} <span className="text-xs text-slate-500">/ 6</span></span>
          </div>
          <span className="text-[9px] text-slate-500 mt-1 block">
            {failedCount > 0 ? `${failedCount} wear-tripped` : 'Stopped/Shut down'}
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Servicing</span>
          <div className="flex items-center gap-2">
            <Wrench className="text-blue-600" size={16} />
            <span className="text-lg font-mono font-black text-slate-800">{maintenanceCount} <span className="text-xs text-slate-500">/ 6</span></span>
          </div>
          <span className="text-[9px] text-blue-600 mt-1 block font-semibold">Repairing rotors</span>
        </div>
      </div>
    </div>
  );
};
export default GridHealth;
