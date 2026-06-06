import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import { BarChart3, Database } from 'lucide-react';
import type { TelemetryPoint } from '../../store/GridContext';

interface TelemetryChartProps {
  history: TelemetryPoint[];
}

export const TelemetryChart: React.FC<TelemetryChartProps> = ({ history }) => {
  return (
    <div className="bg-white/95 border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full backdrop-blur-md">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="text-emerald-600" size={20} />
            Real-Time Farm Telemetry
          </h3>
          <span className="text-xs text-slate-500">Scrolling generation versus consumer load timeline (500ms cycles)</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600">Generation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span className="text-slate-600">Grid Load</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="text-slate-600">Stability</span>
          </div>
        </div>
      </div>

      <div className="flex-grow w-full h-[260px] bg-slate-50/50 border border-slate-200/60 rounded-xl p-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={history}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="glowGen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="glowLoad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            
            <XAxis
              dataKey="time"
              stroke="#94A3B8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={8}
              tickFormatter={(tick) => {
                const parts = tick.split(':');
                return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : tick;
              }}
            />

            <YAxis
              yAxisId="power"
              stroke="#94A3B8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dx={-8}
              unit="MW"
            />
            
            <YAxis
              yAxisId="stability"
              orientation="right"
              stroke="#94A3B8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dx={8}
              domain={[0, 100]}
              unit="%"
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                fontSize: '11px',
                fontFamily: 'monospace',
                color: '#0F172A'
              }}
            />

            <Area
              yAxisId="power"
              type="monotone"
              dataKey="production"
              name="Generation"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#glowGen)"
              isAnimationActive={false}
            />

            <Area
              yAxisId="power"
              type="monotone"
              dataKey="load"
              name="Grid Load"
              stroke="#3B82F6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#glowLoad)"
              isAnimationActive={false}
            />

            <Line
              yAxisId="stability"
              type="monotone"
              dataKey="stability"
              name="Stability"
              stroke="#F59E0B"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-center mt-3 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
        <span className="flex items-center gap-1">
          <Database size={12} />
          Telemetry Buffer Size: {history.length} samples
        </span>
        <span>Resolution: 2Hz</span>
      </div>
    </div>
  );
};
export default TelemetryChart;
