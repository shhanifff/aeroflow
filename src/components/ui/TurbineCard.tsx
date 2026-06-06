import React from 'react';
import { motion } from 'framer-motion';
import { Power, Wrench, ShieldAlert } from 'lucide-react';
import type { Turbine } from '../../store/GridContext';

interface TurbineCardProps {
  turbine: Turbine;
  onSetBladeAngle: (id: string, angle: number) => void;
  onToggleMaintenance: (id: string) => void;
  onToggleShutdown: (id: string) => void;
}

export const TurbineCard: React.FC<TurbineCardProps> = React.memo(({
  turbine,
  onSetBladeAngle,
  onToggleMaintenance,
  onToggleShutdown,
}) => {
  console.log(`[AeroFlow] Rendering Turbine Card: ${turbine.name}`);

  const {
    id,
    name,
    windSpeed,
    bladeAngle,
    maintenanceMode,
    mechanicalStress,
    healthStatus,
    powerOutput,
    offlineStatus,
  } = turbine;

  const getHealthLevel = (health: number) => {
    if (health >= 100) return { label: 'OFFLINE', color: 'bg-slate-100 text-slate-600 border-slate-350', textClass: 'text-slate-500' };
    if (health >= 70) return { label: 'CRITICAL', color: 'bg-red-50 text-red-700 border-red-200', textClass: 'text-red-600' };
    if (health >= 40) return { label: 'WARNING', color: 'bg-amber-50 text-amber-700 border-amber-200', textClass: 'text-amber-600' };
    return { label: 'OPTIMAL', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', textClass: 'text-emerald-600' };
  };

  const healthStyle = getHealthLevel(healthStatus);

  const isSafetyTripped = healthStatus >= 100;
  const isGenerating = !offlineStatus && !maintenanceMode && powerOutput > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`border rounded-xl p-4 bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300 ${
        offlineStatus 
          ? 'border-slate-200 bg-slate-100/60 opacity-75' 
          : maintenanceMode 
          ? 'border-blue-300 bg-blue-50/40 shadow-blue-100/50 shadow-md' 
          : isSafetyTripped 
          ? 'border-red-300 bg-red-50/20' 
          : 'border-slate-200 hover:border-emerald-500/50 hover:shadow-md hover:shadow-slate-100'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-slate-800 flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${
              offlineStatus ? 'bg-slate-400' : maintenanceMode ? 'bg-blue-400' : isSafetyTripped ? 'bg-red-500 animate-pulse' : 'bg-emerald-400 animate-pulse'
            }`}></span>
            {name}
          </h4>
          <span className="text-xs text-slate-400">{id.toUpperCase()}</span>
        </div>

        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${healthStyle.color}`}>
          {healthStyle.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-50/70 border border-slate-150 rounded-lg p-2.5">
          <span className="text-[10px] uppercase text-slate-400 font-medium block">Wind Speed</span>
          <span className="font-mono text-base font-bold text-slate-800">{windSpeed.toFixed(0)} <span className="text-xs font-normal text-slate-500">km/h</span></span>
        </div>

        <div className="bg-slate-50/70 border border-slate-150 rounded-lg p-2.5">
          <span className="text-[10px] uppercase text-slate-400 font-medium block">Power Output</span>
          <span className={`font-mono text-base font-bold ${isGenerating ? 'text-emerald-600' : 'text-slate-400'}`}>
            {powerOutput.toFixed(2)} <span className="text-xs font-normal text-slate-500">MW</span>
          </span>
        </div>
      </div>

      <div className="space-y-1 mb-4">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-slate-500">Mechanical Stress</span>
          <span className={`font-mono font-bold ${
            mechanicalStress > 80 ? 'text-red-600' : mechanicalStress > 50 ? 'text-amber-600' : 'text-slate-650'
          }`}>
            {mechanicalStress}%
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              mechanicalStress > 85 ? 'bg-red-500' : mechanicalStress > 55 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${mechanicalStress}%` }}
          />
        </div>
      </div>

      <div className="space-y-1 mb-4">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-slate-500">Mechanical Wear</span>
          <span className={`font-mono font-bold ${healthStyle.textClass}`}>
            {healthStatus.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              healthStatus > 70 ? 'bg-red-600' : healthStatus > 40 ? 'bg-amber-500' : 'bg-emerald-600'
            }`}
            style={{ width: `${Math.min(100, healthStatus)}%` }}
          />
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200/50 rounded-lg p-2.5 mb-4 space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-555 text-slate-500">Blade Pitch Angle</span>
          <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            {bladeAngle}°
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="90"
          disabled={offlineStatus || maintenanceMode}
          value={bladeAngle}
          onChange={(e) => onSetBladeAngle(id, parseInt(e.target.value))}
          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <button
          onClick={() => onToggleMaintenance(id)}
          disabled={offlineStatus && healthStatus < 100}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border font-semibold transition-all duration-200 cursor-pointer ${
            maintenanceMode
              ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed'
          }`}
        >
          <Wrench size={14} className={maintenanceMode ? 'animate-pulse' : ''} />
          {maintenanceMode ? 'Active Service' : 'Service Mode'}
        </button>

        <button
          onClick={() => onToggleShutdown(id)}
          disabled={maintenanceMode}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border font-semibold transition-all duration-200 cursor-pointer ${
            offlineStatus
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed'
          }`}
        >
          <Power size={14} />
          {offlineStatus ? 'Boot Turbine' : 'Shutdown'}
        </button>
      </div>

      {isSafetyTripped && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-2 flex items-center gap-2 text-[10px] text-red-700 font-semibold animate-pulse">
          <ShieldAlert size={12} className="flex-shrink-0" />
          <span>SAFETY TRIP: Turbine mechanical wear limit exceeded (100%+). Shutdown initiated.</span>
        </div>
      )}
    </motion.div>
  );
});
