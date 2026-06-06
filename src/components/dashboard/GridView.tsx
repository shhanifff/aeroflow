import React, { useMemo } from 'react';
import { Activity, ShieldAlert } from 'lucide-react';
import type { Turbine } from '../../store/GridContext';

interface GridViewProps {
  turbines: Turbine[];
  gridStability: number;
  totalPower: number;
}

export const GridView: React.FC<GridViewProps> = ({
  turbines,
  gridStability,
  totalPower,
}) => {
  const coordinates = useMemo(() => [
    { x: 150, y: 70, label: 'T-A' },
    { x: 130, y: 200, label: 'T-B' },
    { x: 150, y: 330, label: 'T-C' },
    { x: 650, y: 70, label: 'T-D' },
    { x: 670, y: 200, label: 'T-E' },
    { x: 650, y: 330, label: 'T-F' },
  ], []);

  const stabilityColor = gridStability >= 80 
    ? 'text-emerald-700 border-emerald-200 bg-emerald-50/50 shadow-sm' 
    : gridStability >= 50 
    ? 'text-amber-700 border-amber-250 bg-amber-50/50 shadow-sm' 
    : 'text-red-700 border-red-200 bg-red-50/50 shadow-sm animate-pulse';

  return (
    <div className="bg-white/95 border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full relative overflow-hidden backdrop-blur-md">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 z-10">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Activity className="text-emerald-600" size={20} />
            Live Power Grid Gridscape
          </h3>
          <span className="text-xs text-slate-500">Turbine synchronization and energy distribution routing</span>
        </div>

        <div className={`flex items-center gap-3 px-4 py-2 border rounded-xl shadow-lg transition-all duration-300 ${stabilityColor}`}>
          <div className="relative flex items-center justify-center">
            <span className={`w-3.5 h-3.5 rounded-full bg-current ${gridStability < 50 ? 'animate-ping' : ''}`}></span>
          </div>
          <div>
            <span className="text-[10px] text-slate-550 uppercase tracking-wider block font-semibold">Grid Stability</span>
            <span className="text-base font-mono font-bold leading-none">{gridStability}%</span>
          </div>
        </div>
      </div>

      <div className="flex-grow bg-slate-50/70 border border-slate-200 rounded-xl overflow-hidden min-h-[350px] relative flex items-center justify-center shadow-inner">
        <svg 
          viewBox="0 0 800 400" 
          width="100%" 
          height="100%" 
          style={{ overflow: 'visible' }}
          className="absolute inset-0"
        >
          <defs>
            <filter id="glow-grid" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            <linearGradient id="gradient-substation" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
          </defs>

          <circle cx="400" cy="200" r="180" fill="none" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 6" />
          <circle cx="400" cy="200" r="100" fill="none" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 6" />
          {turbines.map((t, idx) => {
            const coord = coordinates[idx];
            const isGenerating = !t.offlineStatus && !t.maintenanceMode && t.powerOutput > 0;
            
            const duration = isGenerating ? Math.max(1.5, 12 - (t.powerOutput * 2)) : 0;

            const bendX = coord.x < 400 ? coord.x + 100 : coord.x - 100;
            const bendY = coord.y < 200 ? coord.y + 30 : coord.y - 30;

            return (
              <g key={`path-${t.id}`}>
                <path
                  d={`M ${coord.x} ${coord.y} Q ${bendX} ${bendY} 400 200`}
                  fill="none"
                  stroke={isGenerating ? '#CBD5E1' : '#E2E8F0'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                
                {isGenerating && (
                  <path
                    d={`M ${coord.x} ${coord.y} Q ${bendX} ${bendY} 400 200`}
                    fill="none"
                    stroke="url(#gradient-substation)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="flow-line"
                    style={{
                      animationDuration: `${duration}s`,
                      filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.4))'
                    }}
                  />
                )}
              </g>
            );
          })}

          <g transform="translate(400, 200)">
            <circle cx="0" cy="0" r="45" fill="none" stroke="#059669" strokeWidth="1" opacity="0.25" className="pulse-node-ring" />
            <circle cx="0" cy="0" r="32" fill="none" stroke="#10B981" strokeWidth="1.5" opacity="0.3" className="pulse-node-ring" />

            <circle 
              cx="0" 
              cy="0" 
              r="22" 
              fill="#FFFFFF" 
              stroke={gridStability > 50 ? '#10B981' : '#F59E0B'} 
              strokeWidth="3.5"
              style={{ filter: 'url(#glow-grid)' }} 
            />
            <circle cx="0" cy="0" r="15" fill={gridStability > 50 ? '#10B981' : '#F59E0B'} opacity="0.15" />

            <text x="0" y="4" textAnchor="middle" fill="#0F172A" fontSize="10" fontWeight="bold">HUB</text>
            <rect x="-42" y="30" width="84" height="28" rx="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
            <text x="0" y="42" textAnchor="middle" fill="#64748B" fontSize="8" fontWeight="600" letterSpacing="0.5">TOTAL OUTPUT</text>
            <text x="0" y="53" textAnchor="middle" fill="#059669" fontSize="11" fontWeight="800" fontFamily="monospace">
              {totalPower.toFixed(1)} MW
            </text>
          </g>

          {turbines.map((t, idx) => {
            const coord = coordinates[idx];
            const isGenerating = !t.offlineStatus && !t.maintenanceMode && t.powerOutput > 0;
            
            const spinDuration = isGenerating 
              ? `${Math.max(0.4, 4.0 - (t.powerOutput * 0.7))}s` 
              : '0s';

            let statusColor = '#10B981';
            if (t.offlineStatus) statusColor = '#64748B';
            else if (t.maintenanceMode) statusColor = '#60A5FA';
            else if (t.healthStatus >= 70) statusColor = '#EF4444';
            else if (t.healthStatus >= 40) statusColor = '#F59E0B';

            return (
              <g key={t.id} transform={`translate(${coord.x}, ${coord.y})`}>
                <line x1="0" y1="0" x2="0" y2="40" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
                
                <polygon points="-4,40 4,40 2,-5 -2,-5" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />

                <g 
                  className={isGenerating ? "animate-turbine-spin" : ""}
                  style={{
                    '--spin-speed': spinDuration,
                    transformOrigin: '0px -5px'
                  } as React.CSSProperties}
                >
                  <circle cx="0" cy="-5" r="4" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />

                  <path d="M 0 -5 L 0 -35 L 2.5 -30 Z" fill="#10B981" opacity="0.95" stroke="#059669" strokeWidth="0.5" />
                  <path d="M 0 -5 L 26 10 L 21 15 Z" fill="#10B981" opacity="0.95" stroke="#059669" strokeWidth="0.5" />
                  <path d="M 0 -5 L -26 10 L -21 15 Z" fill="#10B981" opacity="0.95" stroke="#059669" strokeWidth="0.5" />
                </g>

                <circle cx="0" cy="40" r="5.5" fill="#FFFFFF" stroke={statusColor} strokeWidth="2.5" />
                
                {t.healthStatus >= 70 && !t.offlineStatus && (
                  <circle cx="0" cy="40" r="9" fill="none" stroke="#EF4444" strokeWidth="1" opacity="0.8" className="pulse-node-ring" />
                )}

                <rect x="-30" y="49" width="60" height="23" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
                <text x="0" y="58" textAnchor="middle" fill="#0F172A" fontSize="8" fontWeight="bold">{coord.label}</text>
                <text 
                  x="0" 
                  y="68" 
                  textAnchor="middle" 
                  fill={isGenerating ? '#059669' : '#94A3B8'} 
                  fontSize="8" 
                  fontWeight="bold" 
                  fontFamily="monospace"
                >
                  {isGenerating ? `${t.powerOutput.toFixed(1)} MW` : t.offlineStatus ? 'SHUT' : 'SERV'}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      {gridStability < 60 && (
        <div className="absolute bottom-6 left-6 right-6 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-3 z-10 animate-bounce shadow-md">
          <ShieldAlert className="text-red-500 flex-shrink-0" size={20} />
          <div className="text-xs">
            <h5 className="font-bold text-red-800">GRID STABILITY HAZARD ALERT</h5>
            <p className="text-red-650">Total farm output fluctuating or multiple turbines offline. Increase blade pitch angle on remaining turbines to cool mechanical stresses.</p>
          </div>
        </div>
      )}
    </div>
  );
};
export default GridView;
