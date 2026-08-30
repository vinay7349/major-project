import React from 'react';

/**
 * Consistent page header with title, subtitle, and optional action button slot.
 */
const PageHeader = ({ title, subtitle, badge, badgeColor = 'indigo', children }) => {
  const colorMap = {
    indigo: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
    cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    rose: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="space-y-1">
        {badge && (
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${colorMap[badgeColor] || colorMap.indigo}`}>
            {badge}
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {children && (
        <div className="flex flex-wrap items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
