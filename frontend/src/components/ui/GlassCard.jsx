import React from 'react';

const GlassCard = ({ children, className = '', hoverEffect = true }) => {
  const baseClasses = hoverEffect ? '3d-tilt' : '';
  
  return (
    <div
      className={`glass-card rounded-2xl p-6 transition-all duration-300 ${baseClasses} ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;
