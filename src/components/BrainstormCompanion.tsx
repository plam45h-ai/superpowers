import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Sparkles, Terminal, Activity, FileCode, CheckCircle2, Copy, Check } from 'lucide-react';

interface Preset {
  name: string;
  id: string;
  html: string;
  description: string;
}

export default function BrainstormCompanion() {
  const [copied, setCopied] = useState(false);
  const [activePreset, setActivePreset] = useState('breathing');
  const [htmlCode, setHtmlCode] = useState('');
  const [wsLogs, setWsLogs] = useState<{ id: string; time: string; type: 'send' | 'recv'; event: any }[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const presets: Preset[] = [
    {
      id: 'breathing',
      name: '🌸 Meditation Breathing Circle',
      description: 'Elegant meditation interface featuring responsive state rings and breathe guidance.',
      html: `<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
  <style>
    @keyframes pulse-ring {
      0% { transform: scale(0.95); opacity: 0.8; }
      50% { transform: scale(1.08); opacity: 0.4; }
      100% { transform: scale(0.95); opacity: 0.8; }
    }
    .breathing-ring { animation: pulse-ring 6s infinite ease-in-out; }
  </style>
</head>
<body class="bg-stone-50 text-stone-800 p-8 flex flex-col items-center justify-center min-h-[350px]">
  <div class="max-w-md w-full bg-white rounded-2xl border border-stone-200/60 p-6 shadow-sm text-center space-y-6">
    <div class="space-y-1">
      <span class="text-[11px] font-bold uppercase tracking-wider text-amber-600">Active session</span>
      <h2 class="text-xl font-bold tracking-tight text-stone-900">Diaphragmatic Breathing</h2>
    </div>

    <!-- Breathing Animation Indicator -->
    <div class="relative w-40 h-40 mx-auto flex items-center justify-center">
      <div class="absolute inset-0 rounded-full bg-amber-100/60 breathing-ring"></div>
      <div class="relative w-28 h-28 rounded-full bg-amber-500 flex items-center justify-center text-white font-semibold shadow-inner">
        <span class="text-lg">Inhale</span>
      </div>
    </div>

    <div class="space-y-4">
      <p class="text-sm text-stone-500">Hold for 4s, Exhale for 4s. Repeat loop to sync heart coherence.</p>
      
      <div class="flex gap-2 justify-center">
        <button onclick="parent.postMessage({choice: 'complete_session'}, '*')" class="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-sm">
          Complete Loop
        </button>
        <button onclick="parent.postMessage({choice: 'skip'}, '*')" class="px-4 py-2 border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
          Skip
        </button>
      </div>
    </div>
  </div>
</body>
</html>`
    },
    {
      id: 'bento',
      name: '🍱 Bento Feature Grid',
      description: 'Sophisticated grid displaying system parameters, performance ratings, and toggle options.',
      html: `<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
</head>
<body class="bg-[#faf9f6] text-[#1c1917] p-6 min-h-[350px]">
  <div class="max-w-xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-bold tracking-tight">Agent Sandbox Control</h2>
        <p class="text-xs text-stone-400">Live capability grid</p>
      </div>
      <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">STABLE</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Card 1 -->
      <div class="bg-white p-5 rounded-xl border border-stone-200/80 shadow-sm flex flex-col justify-between h-32">
        <span class="text-xs text-stone-400">Memory Load</span>
        <div class="space-y-1">
          <span class="text-2xl font-bold tracking-tight">14.2 GB</span>
          <p class="text-[10px] text-emerald-500">Normal range</p>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="bg-white p-5 rounded-xl border border-stone-200/80 shadow-sm flex flex-col justify-between h-32">
        <span class="text-xs text-stone-400">Execution Health</span>
        <div class="space-y-1">
          <span class="text-2xl font-bold tracking-tight">99.8%</span>
          <p class="text-[10px] text-emerald-500">Perfect response time</p>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="bg-white p-5 rounded-xl border border-stone-200/80 shadow-sm flex flex-col justify-between h-32">
        <span class="text-xs text-stone-400">Token Cost</span>
        <div class="space-y-1">
          <span class="text-2xl font-bold tracking-tight">$0.18</span>
          <p class="text-[10px] text-stone-400">Budget limit: $5.00</p>
        </div>
      </div>
    </div>

    <div class="flex justify-end gap-2">
      <button onclick="parent.postMessage({choice: 'refresh_metrics'}, '*')" class="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-sm">
        Refresh Stats
      </button>
    </div>
  </div>
</body>
</html>`
    },
    {
      id: 'checkout',
      name: '💳 Elegant Invoice Checkout',
      description: 'A premium, highly legible, clean checkout UI illustrating action handling and forms.',
      html: `<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
</head>
<body class="bg-stone-50 text-stone-800 p-8 flex flex-col items-center justify-center min-h-[350px]">
  <div class="max-w-md w-full bg-white rounded-xl border border-stone-200/80 p-6 shadow-sm space-y-6">
    <div class="flex justify-between items-center border-b border-stone-100 pb-4">
      <div>
        <h3 class="font-bold text-stone-900">Secure Checkout</h3>
        <p class="text-xs text-stone-400">Invoice ID: INV-2026-9021</p>
      </div>
      <span class="text-sm font-semibold text-stone-900">$29.00</span>
    </div>

    <div class="space-y-4">
      <div class="space-y-1">
        <label class="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Cardholder Name</label>
        <input type="text" value="Alex Rivera" readonly class="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-sm bg-stone-50 text-stone-600 focus:outline-none" />
      </div>

      <div class="space-y-1">
        <label class="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Card Number</label>
        <input type="text" value="•••• •••• •••• 4242" readonly class="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-sm bg-stone-50 text-stone-600 focus:outline-none" />
      </div>

      <button onclick="parent.postMessage({choice: 'authorize_payment', amount: 29.00}, '*')" class="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm">
        Authorize Payment ($29.00)
      </button>
    </div>
  </div>
</body>
</html>`
    }
  ];

  // Load active preset code
  useEffect(() => {
    const selected = presets.find(p => p.id === activePreset);
    if (selected) {
      setHtmlCode(selected.html);
      pushWsLog('recv', { type: 'screen-added', template: selected.id });
    }
  }, [activePreset]);

  // Update mock iframe when code changes
  useEffect(() => {
    updateIframe();
  }, [htmlCode]);

  // Listen for message events emitted from the sandboxed iframe
  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      if (event.data && event.data.choice) {
        pushWsLog('send', { source: 'user-event', ...event.data });
      }
    };

    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, []);

  const updateIframe = () => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(htmlCode);
        doc.close();
      }
    }
  };

  const pushWsLog = (type: 'send' | 'recv', event: any) => {
    const newLog = {
      id: Math.random().toString(),
      time: new Date().toLocaleTimeString(),
      type,
      event
    };
    setWsLogs(prev => {
      const updated = [newLog, ...prev];
      if (updated.length > 15) updated.pop();
      return updated;
    });
  };

  const triggerReload = () => {
    pushWsLog('recv', { type: 'reload' });
    updateIframe();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Description Header */}
      <div className="bg-white rounded-xl border border-stone-200/80 p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg border border-amber-100 bg-amber-50 text-amber-700">
            <Sparkles className="w-4 h-4" />
          </span>
          <h2 className="text-xl font-bold tracking-tight text-stone-900 font-display">Visual Brainstorm Companion</h2>
        </div>
        <p className="text-stone-500 text-sm leading-relaxed max-w-3xl">
          Superpowers features a unique **Visual Brainstorming Companion**. When an agent wants to show a UI mockup, dashboard layout, or interactive screen, it starts a lightweight, zero-dependency server that pushes live HTML directly to your browser tab. Try editing the presets below or trigger client choices!
        </p>
      </div>

      {/* Preset Picker */}
      <div className="flex flex-wrap gap-2">
        {presets.map(p => (
          <button
            key={p.id}
            onClick={() => setActivePreset(p.id)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all border ${
              activePreset === p.id
                ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-sm'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Code Editor Panel (6 columns) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-stone-200/80 overflow-hidden shadow-sm flex flex-col h-[520px]">
          <div className="px-4 py-3 border-b border-stone-100 bg-stone-50/40 flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-amber-500" /> COMPANION TEMPLATE CODE
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded border border-stone-200/60 hover:bg-stone-50 flex items-center gap-1 text-xs cursor-pointer bg-white"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={triggerReload}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded border border-stone-200/60 hover:bg-stone-50 flex items-center gap-1 text-xs cursor-pointer bg-white"
                title="Send reload signal"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reload
              </button>
            </div>
          </div>
          <textarea
            value={htmlCode}
            onChange={(e) => setHtmlCode(e.target.value)}
            className="flex-1 w-full p-4 font-mono text-[13px] leading-relaxed bg-stone-900 text-stone-100 focus:outline-none resize-none border-none overflow-y-auto"
            spellCheck="false"
          />
        </div>

        {/* Live Preview Panel (6 columns) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Top Frame Preview */}
          <div className="bg-white rounded-xl border border-stone-200/80 overflow-hidden shadow-sm flex flex-col h-[320px]">
            <div className="px-4 py-3 border-b border-stone-100 bg-stone-50/40 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <span className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-100 border border-red-200"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-200"></span>
                  <span className="w-3 h-3 rounded-full bg-green-100 border border-green-200"></span>
                </span>
                <span className="text-xs font-mono text-stone-400 truncate max-w-xs">
                  http://localhost:49152/?key=3fa89b2f...
                </span>
              </div>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <Activity className="w-2.5 h-2.5 animate-pulse" /> LIVE SIMULATION
              </span>
            </div>
            <iframe
              ref={iframeRef}
              title="Visual Companion Iframe Sandbox"
              className="flex-1 w-full bg-white border-none"
              sandbox="allow-scripts"
            />
          </div>

          {/* Bottom WS Logger */}
          <div className="bg-stone-950 rounded-xl border border-stone-800 overflow-hidden shadow-sm flex flex-col h-[180px]">
            <div className="px-4 py-2 bg-stone-900/60 border-b border-stone-800 flex items-center gap-1.5 select-none">
              <Terminal className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-stone-300 font-mono">
                WebSocket Event Frames
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2.5">
              {wsLogs.length === 0 ? (
                <div className="text-stone-600 italic flex items-center justify-center h-full">
                  Waiting for events... (Click buttons in the mock frame to trigger user action messages)
                </div>
              ) : (
                wsLogs.map(log => (
                  <div key={log.id} className="flex gap-3 leading-relaxed">
                    <span className="text-stone-600 select-none">{log.time}</span>
                    <span className={`font-bold select-none px-1 py-0.2 rounded text-[10px] uppercase ${
                      log.type === 'send' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}>
                      {log.type === 'send' ? 'Client' : 'Server'}
                    </span>
                    <span className={log.type === 'send' ? 'text-blue-300' : 'text-amber-300'}>
                      {JSON.stringify(log.event)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
