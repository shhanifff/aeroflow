import React from 'react';
import { Shield, Activity, Zap } from 'lucide-react';

interface EnergyGridProps {
  windSpeed: number;
  solarIntensity: number;
  gridLoad: number;
  batteryLevel: number;
  gridStatus: 'optimal' | 'warning' | 'critical' | 'offline';
  windOutput: number;
  solarOutput: number;
  hydroOutput: number;
  batteryStatus: 'charging' | 'discharging' | 'idle';
}

export const EnergyGrid: React.FC<EnergyGridProps> = ({
  windSpeed,
  solarIntensity,
  gridLoad,
  batteryLevel,
  gridStatus,
  windOutput,
  solarOutput,
  hydroOutput,
  batteryStatus,
}) => {
  const turbineSpinDuration = windSpeed > 1 ? Math.max(0.5, 12 - (windSpeed * 0.2)) : 0;
  
  const getFlowDuration = (output: number) => {
    if (output <= 0) return 0;
    return Math.max(1, 15 - (output / 20));
  };

  const windFlowDuration = getFlowDuration(windOutput);
  const solarFlowDuration = getFlowDuration(solarOutput);
  const hydroFlowDuration = getFlowDuration(hydroOutput);

  let batteryFlowDuration = 0;
  let isBatteryCharging = false;
  if (batteryStatus === 'charging') {
    batteryFlowDuration = Math.max(1, 15 - (gridLoad / 10));
    isBatteryCharging = true;
  } else if (batteryStatus === 'discharging') {
    batteryFlowDuration = Math.max(1, 15 - ((100 - gridLoad) / 10));
    isBatteryCharging = false;
  }

  const getGridColor = () => {
    switch (gridStatus) {
      case 'optimal': return 'var(--emerald-green)';
      case 'warning': return 'var(--status-warning)';
      case 'critical': return 'var(--status-critical)';
      default: return 'var(--status-offline)';
    }
  };

  return (
    <div className="grid-visualizer-card">
      <div className="grid-visualizer-header">
        <div className="visualizer-title-container">
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Active Power Grid Map</h3>
          <span className="visualizer-subtitle">Real-time load balancing & source routing</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={`grid-health-glow ${gridStatus}`}></span>
          <span style={{ fontSize: '13px', fontWeight: 600, textTransform: 'capitalize', color: getGridColor() }}>
            {gridStatus} State
          </span>
        </div>
      </div>

      <div className="grid-svg-container">
        <svg viewBox="0 0 600 350" width="100%" height="100%" style={{ overflow: 'visible' }}>
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-light" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            <linearGradient id="greenFlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--emerald-green)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--forest-green)" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          <text x="300" y="25" textAnchor="middle" fill="var(--text-secondary)" fontSize="10" letterSpacing="1" fontWeight="600">
            VERDANT INTELLIGENT ROUTING
          </text>

          <path
            d="M 120 100 Q 210 120 300 175"
            fill="none"
            stroke={windOutput > 0 ? '#E2E8F0' : '#E2E8F0'}
            strokeWidth="3"
            strokeLinecap="round"
          />
          {windOutput > 0 && (
            <path
              d="M 120 100 Q 210 120 300 175"
              fill="none"
              stroke="var(--emerald-green)"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="flow-line"
              style={{
                animationDuration: `${windFlowDuration}s`,
                filter: 'url(#glow-light)'
              }}
            />
          )}

          <path
            d="M 120 250 Q 210 230 300 175"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {solarOutput > 0 && (
            <path
              d="M 120 250 Q 210 230 300 175"
              fill="none"
              stroke="var(--emerald-green)"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="flow-line"
              style={{
                animationDuration: `${solarFlowDuration}s`,
                filter: 'url(#glow-light)'
              }}
            />
          )}

          <path
            d="M 480 100 Q 390 120 300 175"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {hydroOutput > 0 && (
            <path
              d="M 480 100 Q 390 120 300 175"
              fill="none"
              stroke="var(--emerald-green)"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="flow-line"
              style={{
                animationDuration: `${hydroFlowDuration}s`,
                filter: 'url(#glow-light)',
                animationDirection: 'reverse'
              }}
            />
          )}

          <path
            d="M 480 250 Q 390 230 300 175"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {batteryFlowDuration > 0 && (
            <path
              d="M 480 250 Q 390 230 300 175"
              fill="none"
              stroke={isBatteryCharging ? 'var(--forest-green)' : '#3B82F6'}
              strokeWidth="3.5"
              strokeLinecap="round"
              className="flow-line"
              style={{
                animationDuration: `${batteryFlowDuration}s`,
                filter: 'url(#glow-light)',
                animationDirection: isBatteryCharging ? 'normal' : 'reverse'
              }}
            />
          )}

          <g transform="translate(100, 70)">
            <g transform="translate(-25, 0) scale(0.7)">
              <line x1="0" y1="0" x2="0" y2="45" className="turbine-pole" />
              <g className="turbine-blades" style={{
                animation: turbineSpinDuration > 0 ? `spin ${turbineSpinDuration * 1.3}s linear infinite` : 'none',
                transformOrigin: '0px 0px'
              }}>
                <circle cx="0" cy="0" r="3" fill="#64748B" />
                <path d="M 0 0 L 0 -25 L 3 -20 Z" fill="#94A3B8" />
                <path d="M 0 0 L 21 12 L 14 17 Z" fill="#94A3B8" />
                <path d="M 0 0 L -21 12 L -24 7 Z" fill="#94A3B8" />
              </g>
            </g>

            <g transform="translate(10, 15)">
              <line x1="0" y1="0" x2="0" y2="60" className="turbine-pole" />
              <g className="turbine-blades" style={{
                animation: turbineSpinDuration > 0 ? `spin ${turbineSpinDuration}s linear infinite` : 'none',
                transformOrigin: '0px 0px'
              }}>
                <circle cx="0" cy="0" r="4" fill="#475569" />
                <path d="M 0 0 L 0 -35 L 4 -28 Z" fill="#64748B" />
                <path d="M 0 0 L 30 17 L 21 24 Z" fill="#64748B" />
                <path d="M 0 0 L -30 17 L -34 10 Z" fill="#64748B" />
              </g>
            </g>

            <rect x="-35" y="65" width="70" height="18" rx="5" fill="var(--white)" stroke="var(--border-gray)" strokeWidth="1" />
            <text x="0" y="77" textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--text-primary)">WIND FARM</text>
            <text x="0" y="93" textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--forest-green)">
              {windOutput.toFixed(1)} MW
            </text>
          </g>

          <g transform="translate(100, 240)">
            <g transform="translate(-25, 0)">
              <polygon points="0,15 30,5 50,15 20,25" fill="#1E293B" stroke="#475569" strokeWidth="1" />
              <line x1="10" y1="12" x2="35" y2="20" stroke="#334155" strokeWidth="0.5" />
              <line x1="20" y1="8" x2="45" y2="16" stroke="#334155" strokeWidth="0.5" />
              <line x1="15" y1="10" x2="25" y2="20" stroke="#334155" strokeWidth="0.5" />
              <line x1="25" y1="7" x2="35" y2="17" stroke="#334155" strokeWidth="0.5" />
              
              <polygon points="0,15 30,5 50,15 20,25" 
                       fill="var(--emerald-green)" 
                       fillOpacity={solarIntensity * 0.003} 
                       className="panel-glowing-cell"
              />
            </g>

            <g transform="translate(5, 12)">
              <polygon points="0,15 30,5 50,15 20,25" fill="#1E293B" stroke="#475569" strokeWidth="1" />
              <line x1="10" y1="12" x2="35" y2="20" stroke="#334155" strokeWidth="0.5" />
              <line x1="20" y1="8" x2="45" y2="16" stroke="#334155" strokeWidth="0.5" />
              
              <polygon points="0,15 30,5 50,15 20,25" 
                       fill="var(--emerald-green)" 
                       fillOpacity={solarIntensity * 0.003}
                       className="panel-glowing-cell"
              />
            </g>

            <rect x="-35" y="45" width="70" height="18" rx="5" fill="var(--white)" stroke="var(--border-gray)" strokeWidth="1" />
            <text x="0" y="57" textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--text-primary)">SOLAR ARRAY</text>
            <text x="0" y="73" textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--forest-green)">
              {solarOutput.toFixed(1)} MW
            </text>
          </g>

          <g transform="translate(500, 70)">
            <path d="M-25,10 C-15,10 -10,35 -5,35 C0,35 5,10 15,10 C25,10 30,35 35,35" fill="none" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M-25,20 C-15,20 -10,45 -5,45 C0,45 5,20 15,20 C25,20 30,45 35,45" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
            
            <rect x="-35" y="-5" width="70" height="15" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" rx="2" />
            <circle cx="-20" cy="2" r="1.5" fill={hydroOutput > 0 ? "var(--emerald-green)" : "#64748B"} />
            <circle cx="0" cy="2" r="1.5" fill={hydroOutput > 0 ? "var(--emerald-green)" : "#64748B"} />
            <circle cx="20" cy="2" r="1.5" fill={hydroOutput > 0 ? "var(--emerald-green)" : "#64748B"} />

            <rect x="-35" y="50" width="70" height="18" rx="5" fill="var(--white)" stroke="var(--border-gray)" strokeWidth="1" />
            <text x="0" y="62" textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--text-primary)">HYDRO DAM</text>
            <text x="0" y="78" textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--forest-green)">
              {hydroOutput.toFixed(1)} MW
            </text>
          </g>

          <g transform="translate(500, 240)">
            <rect x="-20" y="-5" width="40" height="42" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="2" />
            <rect x="-8" y="-10" width="16" height="5" rx="1" fill="#475569" />
            
            {batteryLevel > 15 && (
              <rect x="-14" y="27" width="28" height="6" fill={batteryLevel < 30 ? "var(--status-critical)" : "var(--emerald-green)"} rx="1" />
            )}
            {batteryLevel >= 40 && (
              <rect x="-14" y="19" width="28" height="6" fill={batteryLevel < 60 ? "var(--status-warning)" : "var(--emerald-green)"} rx="1" />
            )}
            {batteryLevel >= 75 && (
              <rect x="-14" y="11" width="28" height="6" fill="var(--emerald-green)" rx="1" />
            )}
            {batteryLevel >= 90 && (
              <rect x="-14" y="3" width="28" height="6" fill="var(--emerald-green)" rx="1" />
            )}

            {batteryStatus === 'charging' && (
              <g className="pulse-node" transform="translate(0, 16)">
                <polygon points="0,-8 5,0 -1,0 -1,8 -5,8 0,16" fill="var(--white)" opacity="0.8" />
              </g>
            )}
            {batteryStatus === 'discharging' && (
              <g className="pulse-node" transform="translate(0, 16)">
                <text x="0" y="4" textAnchor="middle" fill="#93C5FD" fontSize="14" fontWeight="bold">↓</text>
              </g>
            )}

            <rect x="-35" y="45" width="70" height="18" rx="5" fill="var(--white)" stroke="var(--border-gray)" strokeWidth="1" />
            <text x="0" y="57" textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--text-primary)">BESS (GRID)</text>
            <text x="0" y="73" textAnchor="middle" fontSize="10" fontWeight="700" fill={batteryStatus === 'discharging' ? '#3B82F6' : 'var(--forest-green)'}>
              {batteryLevel.toFixed(0)}% ({batteryStatus})
            </text>
          </g>

          <g transform="translate(300, 175)">
            <circle cx="0" cy="0" r="42" fill="none" stroke={getGridColor()} strokeWidth="1" opacity="0.1" className="pulse-node" />
            <circle cx="0" cy="0" r="32" fill="none" stroke={getGridColor()} strokeWidth="1.5" opacity="0.2" className="pulse-node" />
            
            <circle cx="0" cy="0" r="24" fill="var(--white)" stroke={getGridColor()} strokeWidth="3" style={{ filter: 'url(#glow)' }} />
            <circle cx="0" cy="0" r="18" fill={getGridColor()} opacity="0.15" />
            
            <g transform="scale(0.8) translate(-10, -10)">
              {gridStatus === 'optimal' ? (
                <Shield size={20} className="pulse-node" style={{ color: 'var(--emerald-green)' }} />
              ) : gridStatus === 'warning' ? (
                <Activity size={20} className="pulse-node" style={{ color: 'var(--status-warning)' }} />
              ) : gridStatus === 'critical' ? (
                <Zap size={20} className="pulse-node" style={{ color: 'var(--status-critical)' }} />
              ) : (
                <Shield size={20} style={{ color: 'var(--status-offline)' }} />
              )}
            </g>

            <rect x="-45" y="28" width="90" height="32" rx="6" fill="var(--white)" stroke="var(--border-gray)" strokeWidth="1" />
            <text x="0" y="40" textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--text-secondary)">FREQUENCY</text>
            <text x="0" y="53" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--text-primary)">
              {gridStatus === 'offline' ? '0.00 Hz' : gridStatus === 'critical' ? '48.91 Hz' : gridStatus === 'warning' ? '49.65 Hz' : '50.04 Hz'}
            </text>
          </g>
        </svg>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};
