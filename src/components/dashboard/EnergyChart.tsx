import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartDataPoint {
  time: string;
  production: number;
  consumption: number;
}

interface EnergyChartProps {
  data: ChartDataPoint[];
}

export const EnergyChart: React.FC<EnergyChartProps> = ({ data }) => {
  return (
    <div className="chart-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Grid Analytics</h3>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Generation vs Demand (Simulation Timeline)</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', fontWeight: 500 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--emerald-green)' }}></span>
            <span>Generation (MW)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--text-secondary)' }}></span>
            <span>Demand (MW)</span>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorProduction" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--emerald-green)" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="var(--emerald-green)" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--text-secondary)" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="var(--text-secondary)" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="var(--text-secondary)" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
              dy={10}
            />
            <YAxis 
              stroke="var(--text-secondary)" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
              dx={-5}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid var(--border-gray)',
                borderRadius: '12px',
                boxShadow: 'var(--glass-shadow)',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
              }}
            />
            <Area 
              type="monotone" 
              dataKey="production" 
              name="Generation"
              stroke="var(--emerald-green)" 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#colorProduction)" 
              activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2 }}
            />
            <Area 
              type="monotone" 
              dataKey="consumption" 
              name="Demand"
              stroke="var(--text-secondary)" 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#colorConsumption)" 
              activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
