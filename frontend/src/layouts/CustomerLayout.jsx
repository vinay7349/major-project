import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomerDiscoveryHeader from '../components/CustomerDiscoveryHeader';

const CustomerLayout = () => {
  return (
    <div className="min-h-screen bg-[#f6f1ea] text-slate-900 transition-colors duration-300 dark:bg-[#0d1320] dark:text-slate-100">
      <CustomerDiscoveryHeader />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default CustomerLayout;
