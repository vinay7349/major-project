import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import VoiceAssistantModal from '../components/VoiceAssistantModal';

const DashboardLayout = () => {
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      <Sidebar isVoiceOpen={isVoiceOpen} setIsVoiceOpen={setIsVoiceOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onOpenVoice={() => setIsVoiceOpen(true)} />
        <main className="p-8 flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <VoiceAssistantModal isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
    </div>
  );
};

export default DashboardLayout;
