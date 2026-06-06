import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  trend: number;
  trendDirection: 'up' | 'down' | 'neutral';
  description: string;
  delay?: number;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  unit,
  icon,
  trend,
  trendDirection,
  description,
  delay = 0,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setDisplayValue(end);
      return;
    }

    const duration = 800;
    const increment = (end - start) / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        clearInterval(timer);
        setDisplayValue(end);
      } else {
        setDisplayValue(Math.round(current * 10) / 10);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  const renderTrend = () => {
    switch (trendDirection) {
      case 'up':
        return (
          <span className="trend-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
            <ArrowUpRight size={16} />
            +{trend}%
          </span>
        );
      case 'down':
        return (
          <span className="trend-down" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
            <ArrowDownRight size={16} />
            -{trend}%
          </span>
        );
      default:
        return (
          <span className="trend-neutral" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
            <Minus size={16} />
            {trend}%
          </span>
        );
    }
  };

  const formatNumber = (num: number) => {
    return num % 1 === 0 ? num.toLocaleString() : num.toFixed(1);
  };

  return (
    <motion.div
      className="kpi-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="kpi-header">
        <span className="kpi-title">{title}</span>
        <div className="kpi-icon-wrapper">
          {icon}
        </div>
      </div>
      
      <div>
        <div className="kpi-value-container">
          <span className="kpi-value">{formatNumber(displayValue)}</span>
          <span className="kpi-unit">{unit}</span>
        </div>
        
        <div className="kpi-footer">
          {renderTrend()}
          <span style={{ color: 'var(--text-secondary)' }}>{description}</span>
        </div>
      </div>
    </motion.div>
  );
};
