import React from 'react';

/**
 * Consistent page header with title, subtitle, and optional action button slot.
 */
const PageHeader = ({ title, subtitle, badge, badgeColor = 'indigo', children }) => {
  const colorMap = {
    indigo: 'bg-charcoal/10 border-charcoal/30 text-indigo-400',
    cyan: 'bg-amber/10 border-amber/30 text-cyan-400',
    purple: 'bg-charcoal/10 border-charcoal/30 text-purple-400',
    rose: 'bg-red/10 border-red/30 text-rose-400',
    emerald: 'bg-mutedgreen/10 border-mutedgreen/30 text-emerald-400',
  };

  return (
    <div className="3d-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="space-y-1">
        {badge && (
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold 3d-badge ${colorMap[badgeColor] || colorMap.indigo}`}>
            {badge}
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-charcoal dark:text-white leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate dark:text-slate/80 text-xs leading-relaxed">
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



