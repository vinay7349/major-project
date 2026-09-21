import React from 'react';

export const CardSkeleton = () => (
  <div className="glass-card rounded-2xl p-6 animate-pulse space-y-4">
    <div className="h-4 bg-warmwhite dark:bg-charcoal rounded-lg w-1/3"></div>
    <div className="h-8 bg-slate dark:bg-charcoal rounded-xl w-2/3"></div>
    <div className="h-3 bg-warmwhite dark:bg-charcoal rounded-lg w-1/2"></div>
  </div>
);

export const TableSkeleton = () => (
  <div className="glass-card rounded-2xl p-6 animate-pulse space-y-4">
    <div className="h-6 bg-warmwhite dark:bg-charcoal rounded-lg w-1/4 mb-4"></div>
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center space-x-4">
        <div className="h-10 w-10 bg-slate dark:bg-charcoal rounded-xl"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-warmwhite dark:bg-charcoal rounded-lg w-3/4"></div>
          <div className="h-3 bg-warmwhite dark:bg-charcoal rounded-lg w-1/2"></div>
        </div>
        <div className="h-8 w-20 bg-slate dark:bg-charcoal rounded-lg"></div>
      </div>
    ))}
  </div>
);

export const ChartSkeleton = () => (
  <div className="glass-card rounded-2xl p-6 animate-pulse space-y-4">
    <div className="h-6 bg-warmwhite dark:bg-charcoal rounded-lg w-1/3"></div>
    <div className="h-64 bg-warmwhite/60 dark:bg-charcoal/60 rounded-2xl"></div>
  </div>
);

