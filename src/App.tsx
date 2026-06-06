import { useState } from 'react';
import { GridProvider, useGrid } from './store/GridContext';
import { useSimulation } from './hooks/useSimulation';
import { ControlPanel } from './components/dashboard/ControlPanel';
import { GridView } from './components/dashboard/GridView';
import { TurbineCard } from './components/ui/TurbineCard';
import { TelemetryChart } from './components/dashboard/TelemetryChart';
import { GridHealth } from './components/dashboard/GridHealth';
import { Wind, Shield, Info } from 'lucide-react';

function DashboardContent() {
  const { state, setBladeAngle, toggleMaintenance, toggleShutdown } = useGrid();
  
  const [simActive, setSimActive] = useState(true);

  useSimulation(simActive);

  return (
    <div className="min-h-screen text-slate-850 flex flex-col font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-900">
      <header className="border-b border-slate-200/80 bg-white/75 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/10">
            <Wind size={22} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1.5 leading-none">
              AeroFlow
              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-250">PRO</span>
            </h1>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest block mt-1">Smart Grid Operator Console</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm">
            <span className={`w-2 h-2 rounded-full ${simActive ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`}></span>
            <span className="text-slate-600">{simActive ? 'Telemetry Tick: 500ms' : 'Telemetry Paused'}</span>
          </div>

          <button
            onClick={() => setSimActive(!simActive)}
            className={`px-4 py-1.5 rounded-lg border font-bold text-xs shadow-sm transition-all duration-200 cursor-pointer ${
              simActive 
                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            {simActive ? 'Pause Ticker' : 'Resume Ticker'}
          </button>
        </div>
      </header>

      <main className="flex-grow p-6 grid grid-cols-1 xl:grid-cols-12 gap-6 max-w-[1700px] mx-auto w-full">
        <div className="xl:col-span-3 flex flex-col gap-6">
          <div className="flex-grow">
            <ControlPanel />
          </div>
          <div className="flex-grow">
            <GridHealth 
              turbines={state.turbines} 
              gridStability={state.gridStability} 
              totalPower={state.totalPower} 
            />
          </div>
        </div>

        <div className="xl:col-span-5 flex flex-col gap-6">
          <div className="flex-grow">
            <GridView 
              turbines={state.turbines} 
              gridStability={state.gridStability} 
              totalPower={state.totalPower} 
            />
          </div>
          <div>
            <TelemetryChart history={state.telemetryHistory} />
          </div>
        </div>

        <div className="xl:col-span-4 flex flex-col gap-4">
          <div className="border border-slate-200 bg-slate-50/50 rounded-2xl p-5 flex flex-col gap-4 flex-grow max-h-[85vh] overflow-y-auto shadow-inner">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Shield size={18} className="text-emerald-600" />
                Rotor Command Hub
              </h3>
              <span className="text-xs text-slate-500">Fine-tune individual pitch angles or toggle maintenance shutdowns</span>
            </div>

            <div className="flex flex-col gap-4">
              {state.turbines.map((t) => (
                <TurbineCard
                  key={t.id}
                  turbine={t}
                  onSetBladeAngle={setBladeAngle}
                  onToggleMaintenance={toggleMaintenance}
                  onToggleShutdown={toggleShutdown}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white/60 py-4 px-6 text-center text-[10px] text-slate-500 font-semibold uppercase tracking-wider flex justify-between items-center">
        <span>© {new Date().getFullYear()} AeroFlow Smart Grid Solutions</span>
        <span className="flex items-center gap-1">
          <Info size={12} />
          White + Green Operator Cockpit Interface
        </span>
      </footer>
    </div>
  );
}

function App() {
  return (
    <GridProvider>
      <DashboardContent />
    </GridProvider>
  );
}

export default App;
