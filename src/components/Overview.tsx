import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Cpu, CheckCircle2, RefreshCw, Activity, AlertCircle, Play } from 'lucide-react';
import { Skill } from '../types';

interface OverviewProps {
  skills: Skill[];
  onNavigateToTab: (tab: string) => void;
  onNavigateToSkill: (skillId: string) => void;
}

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'agent' | 'command';
  sender: 'Controller' | 'Agent' | 'Shell' | 'Superpowers';
  message: string;
}

export default function Overview({ skills, onNavigateToTab, onNavigateToSkill }: OverviewProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isSimulating, setIsSimulating] = useState(true);
  const [simulationStep, setSimulationStep] = useState(0);

  // Simulated agent workspace trace steps
  const simulationSteps: Omit<LogEntry, 'id' | 'timestamp'>[] = [
    { type: 'info', sender: 'Controller', message: 'Harness initialized. Reading AGENTS.md...' },
    { type: 'success', sender: 'Superpowers', message: 'Bootstrap successfully injected into session context.' },
    { type: 'agent', sender: 'Agent', message: 'User requested: "Create a react todo list". Auto-triggering "brainstorming" skill...' },
    { type: 'command', sender: 'Shell', message: 'start-server.sh --project-dir . --host 127.0.0.1 --open' },
    { type: 'success', sender: 'Superpowers', message: 'Visual Brainstorm Companion running on http://localhost:49152/?key=3fa89b2f...' },
    { type: 'info', sender: 'Controller', message: 'User accepted visual mockup. Moving to planning phase.' },
    { type: 'agent', sender: 'Agent', message: 'Invoking "writing-plans" skill to draft implementation steps.' },
    { type: 'success', sender: 'Superpowers', message: 'Plan generated and saved to /docs/plans/todo-implementation.md' },
    { type: 'command', sender: 'Shell', message: 'npm run test' },
    { type: 'warning', sender: 'Shell', message: 'FAIL: src/components/TodoList.test.tsx - Expected 3 items, found 0' },
    { type: 'agent', sender: 'Agent', message: 'Test failed. Triggering "systematic-debugging" skill to isolate state polluter...' },
    { type: 'success', sender: 'Superpowers', message: 'Root cause identified: State initialization was missing initial items in localStorage.' },
    { type: 'success', sender: 'Agent', message: 'Applying surgical code patch to /src/components/TodoList.tsx' },
    { type: 'command', sender: 'Shell', message: 'npm run test' },
    { type: 'success', sender: 'Shell', message: 'PASS: 12 tests passed successfully.' },
    { type: 'info', sender: 'Controller', message: 'Session complete. Developer branch ready for merge.' },
  ];

  useEffect(() => {
    if (!isSimulating) return;

    // Seed initial logs
    if (logs.length === 0) {
      setLogs([
        {
          id: '1',
          timestamp: new Date().toLocaleTimeString(),
          type: 'info',
          sender: 'Controller',
          message: 'Superpowers kernel v6.4.1 online.',
        },
      ]);
    }

    const interval = setInterval(() => {
      setSimulationStep((prevStep) => {
        const nextStep = (prevStep + 1) % simulationSteps.length;
        const stepData = simulationSteps[nextStep];
        
        const newEntry: LogEntry = {
          id: Math.random().toString(),
          timestamp: new Date().toLocaleTimeString(),
          ...stepData,
        };

        setLogs((prevLogs) => {
          const updated = [...prevLogs, newEntry];
          if (updated.length > 20) updated.shift(); // Keep last 20 logs
          return updated;
        });

        return nextStep;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isSimulating, logs.length]);

  const toggleSimulation = () => {
    setIsSimulating(!isSimulating);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-xl border border-stone-200/80 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <Cpu className="w-3.5 h-3.5 animate-pulse" /> Dual-Compatible V1/V2
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-stone-900 font-display">
              Superpowers Agent Console
            </h1>
            <p className="text-stone-500 max-w-2xl text-[14px]">
              Superpowers is a workspace engine and skills library designed to turn AI coding agents into master software engineers with zero-dependency execution, robust planning, and visual feedback loops.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onNavigateToTab('skills')}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-sm font-medium shadow-sm transition-colors duration-200 cursor-pointer"
            >
              Browse Skills
            </button>
            <button
              onClick={() => onNavigateToTab('diagnostics')}
              className="px-4 py-2 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer"
            >
              Run Audit
            </button>
          </div>
        </div>
      </div>

      {/* 2. Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Registered Skills',
            value: skills.length.toString(),
            label: 'Loaded from /skills',
            icon: Cpu,
            color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
            onClick: () => onNavigateToTab('skills'),
          },
          {
            title: 'Active Integrations',
            value: '6',
            label: 'Cursor, Claude, Codex, etc.',
            icon: CheckCircle2,
            color: 'bg-amber-50 text-amber-700 border-amber-100',
            onClick: () => onNavigateToTab('integrations'),
          },
          {
            title: 'System Umask',
            value: '077',
            label: 'Owner-only permission lock',
            icon: Activity,
            color: 'bg-stone-50 text-stone-700 border-stone-200',
          },
          {
            title: 'Bootstrap Status',
            value: 'Active',
            label: 'Using-superpowers auto-injected',
            icon: Terminal,
            color: 'bg-blue-50 text-blue-700 border-blue-100',
          },
        ].map((metric, i) => (
          <div
            key={i}
            onClick={metric.onClick}
            className={`bg-white rounded-xl border border-stone-200/80 p-5 shadow-sm space-y-3 ${
              metric.onClick ? 'cursor-pointer hover:border-stone-300 transition-colors' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="text-[13px] font-medium text-stone-500">{metric.title}</span>
              <span className={`p-1.5 rounded-lg border ${metric.color}`}>
                <metric.icon className="w-4 h-4" />
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-bold tracking-tight text-stone-900">{metric.value}</span>
              <p className="text-xs text-stone-400">{metric.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Interactive Agent Session Trace */}
      <div className="bg-stone-950 border border-stone-800 rounded-xl overflow-hidden shadow-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800/80 bg-stone-900/60">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSimulating ? 'bg-emerald-400' : 'bg-stone-500'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isSimulating ? 'bg-emerald-500' : 'bg-stone-600'}`}></span>
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-amber-500" /> Coding Agent Live Trace
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleSimulation}
              className="flex items-center gap-1 px-2.5 py-1 text-xs rounded border border-stone-700 hover:border-stone-600 bg-stone-800 text-stone-300 cursor-pointer transition-colors"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin text-emerald-500" /> Pause Simulation
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-emerald-500 fill-emerald-500" /> Resume Simulation
                </>
              )}
            </button>
            <button
              onClick={clearLogs}
              className="px-2.5 py-1 text-xs rounded border border-stone-700 hover:border-stone-600 bg-stone-800 text-stone-400 hover:text-stone-300 cursor-pointer transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Log view */}
        <div className="p-5 font-mono text-[13px] space-y-3 h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-transparent">
          {logs.length === 0 ? (
            <div className="h-full flex items-center justify-center text-stone-500 italic">
              No logs emitted yet. Simulation is running.
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {logs.map((log) => {
                let colorClass = 'text-stone-300';
                if (log.type === 'success') colorClass = 'text-emerald-400 font-semibold';
                if (log.type === 'warning') colorClass = 'text-amber-400';
                if (log.type === 'command') colorClass = 'text-stone-400';
                if (log.type === 'agent') colorClass = 'text-blue-400';

                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-4 hover:bg-stone-900/30 py-0.5 rounded px-1 transition-all"
                  >
                    <span className="text-stone-600 select-none text-xs leading-5">{log.timestamp}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] leading-3 uppercase font-bold tracking-wider select-none ${
                      log.sender === 'Superpowers' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                      log.sender === 'Agent' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      log.sender === 'Shell' ? 'bg-stone-500/10 text-stone-400 border border-stone-500/20' :
                      'bg-stone-800 text-stone-400'
                    }`}>
                      {log.sender}
                    </span>
                    <div className="flex-1 min-w-0">
                      {log.type === 'command' && <span className="text-amber-500 select-none mr-1.5">$</span>}
                      <span className={`${colorClass} break-words leading-relaxed`}>{log.message}</span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* 4. Core Skills Carousel Preview */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight text-stone-900">Featured Skills</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {skills
            .filter((s) => ['using-superpowers', 'subagent-driven-development', 'systematic-debugging'].includes(s.id))
            .map((skill) => (
              <div
                key={skill.id}
                onClick={() => onNavigateToSkill(skill.id)}
                className="bg-white rounded-xl border border-stone-200/80 p-5 shadow-sm hover:border-stone-300 transition-colors cursor-pointer group flex flex-col justify-between h-[180px]"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <h4 className="font-semibold text-[15px] text-stone-900 group-hover:text-amber-600 transition-colors">
                      {skill.name}
                    </h4>
                  </div>
                  <p className="text-stone-500 text-[13px] line-clamp-3 leading-relaxed">
                    {skill.description}
                  </p>
                </div>
                <div className="flex items-center justify-between text-stone-400 text-xs mt-3 border-t border-stone-100 pt-3">
                  <span className="font-mono">{skill.id}</span>
                  <span className="text-amber-500 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Read Skill &rarr;
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
