import React from 'react';
import Layout from './components/layout/Layout';
import CamFeed from './components/dashboard/CamFeed';
import ThreatFeed from './components/dashboard/ThreatFeed';
import HQFeed from './components/dashboard/HQFeed';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import { useSync } from './hooks/useSync';
import './index.css';

function App() {
  // Sync Logic Hook (Runs globally)
  const { isSyncing } = useSync();

  return (
    <div className="min-h-screen bg-cyber-black text-white font-sans selection:bg-neon-green selection:text-black">
      <Sidebar />
      <Header isSyncing={isSyncing} />

      {/* Main Content Area */}
      <main className="ml-20 pt-16 min-h-screen p-6 relative">
        {/* Grid Background Effect */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: 'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        <div className="relative z-10 h-full">
          <div className="grid grid-cols-12 gap-6 h-full p-4">
            {/* Main Tactical Display */}
            <div className="col-span-12 lg:col-span-8 h-[60vh] lg:h-auto min-h-[400px]">
              <div className="panel-header mb-2 flex items-center justify-between">
                <h2 className="text-neon-green font-mono uppercase tracking-widest text-sm">
                    /// VISION SYSTEM : ACTIVE
                </h2>
              </div>
              <CamFeed />
            </div>

            {/* Side Feeds */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
              <div className="h-[300px] flex-1">
                <ThreatFeed />
              </div>

              <div className="h-[200px]">
                <HQFeed isSyncing={isSyncing} />
              </div>

              <div className="border border-cyber-gray bg-black/40 p-4 h-[120px]">
                <h3 className="text-neon-green font-mono text-xs mb-2 uppercase border-b border-cyber-gray pb-1">
                  System Telemetry
                </h3>
                <div className="font-mono text-xs text-gray-400 space-y-1">
                  <div className="flex justify-between">
                    <span>CPU LOAD</span>
                    <span className="text-white">12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DB SYNC</span>
                    <span className={isSyncing ? "text-cyan-400 animate-pulse" : "text-neon-green"}>
                      {isSyncing ? "UPLOADING..." : "ACTIVE"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
