import React from 'react';
import { Package } from 'lucide-react';

/**
 * EmptyState – Used when a list has no items to show.
 * Enhanced with 3D effects
 */
const EmptyState = ({
  icon: Icon = Package,
  title = 'Nothing here yet',
  description = 'No items found. Get started by creating one.',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-4 3d-tilt">
      <div className="w-16 h-16 rounded-3xl bg-warmwhite dark:bg-charcoal/60 flex items-center justify-center 3d-icon">
        <Icon className="w-8 h-8 text-slate/80" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-charcoal dark:text-slate/60">{title}</h3>
        <p className="text-xs text-slate/80 max-w-xs leading-relaxed">{description}</p>
      </div>
      {action && <div className="pt-2 3d-badge">{action}</div>}
    </div>
  );
};

export default EmptyState;

