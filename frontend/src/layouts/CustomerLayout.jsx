import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomerDiscoveryHeader from '../components/CustomerDiscoveryHeader';

const CustomerLayout = () => {
  return (
    <div className="flex min-h-screen bg-background dark:bg-background-dark text-text-primary dark:text-text-dark font-sans transition-colors duration-300">
      <CustomerDiscoveryHeader />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="p-8 flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;
