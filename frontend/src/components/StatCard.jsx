import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import GlassCard from './GlassCard';

/**
 * Reusable StatCard component for dashboard metric tiles.
 */
const StatCard = ({
  title,
  value,
  sub,
  icon: Icon,
  iconColor = 'text-indigo-500',
  iconBg = 'bg-indigo-500/10 border-indigo-500/30',
  trend,
  trendUp = true,
  borderHighlight,
}) => {
  return (
    <GlassCard className={`relative overflow-hidden ${borderHighlight ? `border-${borderHighlight}-500/30` : ''}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1 min-w-0 pr-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
            {title}
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white font-mono leading-tight">
            {value}
          </h2>
          {(sub || trend) && (
            <div className="flex items-center gap-1.5">
              {trend && (
                <span className={`flex items-center gap-0.5 text-[11px] font-bold ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {trendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {trend}
                </span>
              )}
              {sub && <span className="text-[11px] text-slate-400">{sub}</span>}
            </div>
          )}
        </div>

        {Icon && (
          <div className={`w-12 h-12 rounded-2xl ${iconBg} border flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default StatCard;
