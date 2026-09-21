import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomerDiscoveryHeader from '../components/CustomerDiscoveryHeader';

const CustomerLayout = () => {
  return (
    <div className="min-h-screen bg-warmwhite text-navy transition-colors duration-300 dark:bg-navy dark:text-slate/60">
      <CustomerDiscoveryHeader />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default CustomerLayout;


