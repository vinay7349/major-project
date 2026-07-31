import React from 'react';

export const CardSkeleton = () => (
  <div className="glass-card rounded-2xl p-6 animate-pulse space-y-4">
    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3"></div>
    <div className="h-8 bg-slate-300 dark:bg-slate-700 rounded-xl w-2/3"></div>
    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2"></div>
  </div>
);

export const TableSkeleton = () => (
  <div className="glass-card rounded-2xl p-6 animate-pulse space-y-4">
    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/4 mb-4"></div>
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center space-x-4">
        <div className="h-10 w-10 bg-slate-300 dark:bg-slate-700 rounded-xl"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2"></div>
        </div>
        <div className="h-8 w-20 bg-slate-300 dark:bg-slate-700 rounded-lg"></div>
      </div>
    ))}
  </div>
);

export const ChartSkeleton = () => (
  <div className="glass-card rounded-2xl p-6 animate-pulse space-y-4">
    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3"></div>
    <div className="h-64 bg-slate-200/60 dark:bg-slate-800/60 rounded-2xl"></div>
  </div>
);
