import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Cpu, BookOpen, Sparkles, Layers, ShieldCheck, HeartPulse } from 'lucide-react';
import { getSkills } from './utils';

// Import sub-components
import Overview from './components/Overview';
import SkillsExplorer from './components/SkillsExplorer';
import BrainstormCompanion from './components/BrainstormCompanion';
import IntegrationChecklist from './components/IntegrationChecklist';
import DiagnosticsCenter from './components/DiagnosticsCenter';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  // Read skills dynamically using the glob-backed utility
  const skills = useMemo(() => {
    try {
      return getSkills();
    } catch (e) {
      console.error('Failed to parse skills dynamically:', e);
      return [];
    }
  }, []);

  const handleNavigateToSkill = (skillId: string) => {
    setSelectedSkillId(skillId);
    setActiveTab('skills');
  };

  const menuItems = [
    { id: 'overview', name: 'Console Overview', icon: Terminal, desc: 'Live traces & parameters' },
    { id: 'skills', name: 'Skills Explorer', icon: BookOpen, desc: 'Interactive rules & guides' },
    { id: 'companion', name: 'Brainstorm Companion', icon: Sparkles, desc: 'Mock preview & sandboxes' },
    { id: 'integrations', name: 'IDE Platforms', icon: Layers, desc: 'Descriptor manifest configs' },
    { id: 'diagnostics', name: 'Diagnostics Suite', icon: ShieldCheck, desc: 'Interactive compliance check' }
  ];

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col antialiased selection:bg-amber-200">
      {/* 1. Header Bar */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-stone-200/80 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-sm select-none">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-sm ring-1 ring-amber-600/10">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-[15px] font-bold tracking-tight text-stone-900 leading-tight">
              Superpowers Workspace
            </h1>
            <span className="text-[11px] font-medium text-stone-400 block font-mono">v6.4.1</span>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 shadow-sm">
            <HeartPulse className="w-3.5 h-3.5 animate-pulse" /> All Systems Nominal
          </div>
          <div className="text-stone-400 border-l border-stone-200 pl-4 h-4 hidden sm:block"></div>
          <div className="text-stone-400 font-mono hidden md:block">
            Binds: 0.0.0.0:3000
          </div>
        </div>
      </header>

      {/* 2. Full Workspace Area (Sidebar + Active Screen) */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Sidebar Navigation (3 columns) */}
        <nav className="lg:col-span-3 flex flex-col gap-2 select-none h-fit lg:sticky lg:top-24">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block px-3.5 mb-1.5">Console Modules</span>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id !== 'skills') setSelectedSkillId(null);
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer group ${
                  isActive
                    ? 'bg-white border-stone-200 shadow-sm ring-1 ring-stone-900/[0.02]'
                    : 'bg-transparent border-transparent text-stone-600 hover:bg-stone-100/60 hover:text-stone-900'
                }`}
              >
                <div className={`p-2 rounded-lg border transition-colors duration-200 ${
                  isActive ? 'bg-amber-500 text-white border-amber-600/10 shadow-sm' : 'bg-white text-stone-400 border-stone-200 group-hover:text-stone-600'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className={`font-bold text-[14px] block ${isActive ? 'text-stone-950' : 'text-stone-700'}`}>
                    {item.name}
                  </span>
                  <span className="text-[11px] text-stone-400 block truncate group-hover:text-stone-500 transition-colors">
                    {item.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Right Side: Tab Panel Viewport (9 columns) */}
        <main className="lg:col-span-9 flex flex-col min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex-1 flex flex-col"
            >
              {activeTab === 'overview' && (
                <Overview
                  skills={skills}
                  onNavigateToTab={setActiveTab}
                  onNavigateToSkill={handleNavigateToSkill}
                />
              )}
              {activeTab === 'skills' && (
                <SkillsExplorer
                  skills={skills}
                  selectedSkillId={selectedSkillId}
                  onSelectSkillId={setSelectedSkillId}
                />
              )}
              {activeTab === 'companion' && <BrainstormCompanion />}
              {activeTab === 'integrations' && <IntegrationChecklist />}
              {activeTab === 'diagnostics' && <DiagnosticsCenter />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* 3. Footer Branding */}
      <footer className="w-full py-6 px-6 text-center text-xs text-stone-400 border-t border-stone-200/80 bg-white select-none mt-12">
        <p>&copy; {new Date().getFullYear()} Prime Radiant. Superpowers Coding Agent Core. Fully Open-Source.</p>
      </footer>
    </div>
  );
}
