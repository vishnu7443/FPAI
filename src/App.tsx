import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Terminal, 
  Activity, 
  BarChart3, 
  Blocks, 
  History, 
  Settings,
  Search,
  Bell,
  ChevronDown,
  Plus,
  Zap,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  ArrowRight,
  Cpu,
  Circle,
  Link as LinkIcon,
  Play,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { cn } from './lib/utils';

// --- Types ---
type Page = 'dashboard' | 'console' | 'workflows' | 'reports' | 'integrations' | 'history' | 'settings';

// --- Mock Data ---
const productivityData = [
  { name: 'Mon', value: 45 },
  { name: 'Tue', value: 52 },
  { name: 'Wed', value: 48 },
  { name: 'Thu', value: 61 },
  { name: 'Fri', value: 55 },
  { name: 'Sat', value: 67 },
  { name: 'Sun', value: 72 },
];

const workflows = [
  { id: 1, name: 'Sprint Report Gen', status: 'running', agent: 'ReportBot', time: '2m ago', tools: ['ClickUp', 'Slack'] },
  { id: 2, name: 'Lead Enrichment', status: 'completed', agent: 'DataPilot', time: '15m ago', tools: ['Sheets', 'Notion'] },
  { id: 3, name: 'Security Audit', status: 'pending', agent: 'GuardAI', time: 'Scheduled', tools: ['Slack'] },
];

const integrations = [
  { name: 'ClickUp', status: 'connected', icon: 'https://cdn.worldvectorlogo.com/logos/clickup.svg' },
  { name: 'Notion', status: 'connected', icon: 'https://cdn.worldvectorlogo.com/logos/notion-2.svg' },
  { name: 'Slack', status: 'connected', icon: 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg' },
  { name: 'Google Sheets', status: 'disconnected', icon: 'https://cdn.worldvectorlogo.com/logos/google-sheets-1.svg' },
];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
      active 
        ? "bg-primary/10 text-primary" 
        : "text-muted-foreground hover:text-foreground hover:bg-accent"
    )}
  >
    <Icon size={20} className={cn("transition-transform duration-200", active ? "scale-110" : "group-hover:scale-110")} />
    <span className="font-medium text-sm">{label}</span>
    {active && <motion.div layoutId="active-pill" className="ml-auto w-1 h-4 bg-indigo-500 rounded-full" />}
  </button>
);

const MetricCard = ({ label, value, trend, icon: Icon, children }: { label: string, value: string, trend: string, icon: any, children?: React.ReactNode }) => (
  <div className="glass-card p-6 flex flex-col gap-2">
    <div className="flex justify-between items-start">
      <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
        <Icon size={20} />
      </div>
      <span className={cn("text-xs font-medium px-2 py-1 rounded-full", trend.startsWith('+') ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400")}>
        {trend}
      </span>
    </div>
    <div className="mt-4">
      <p className="text-muted-foreground text-sm font-medium">{label}</p>
      <h3 className="text-2xl font-bold text-foreground mt-1">{value}</h3>
    </div>
    {children && <div className="mt-3 pt-3 border-t border-border/30">{children}</div>}
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    running: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    failed: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };
  return (
    <span className={cn("text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border", styles[status as keyof typeof styles])}>
      {status}
    </span>
  );
};

// --- Pages ---

const DashboardOverview = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard label="Active Workflows" value="12" trend="+3" icon={Zap} />
      <MetricCard label="Running Agents" value="8" trend="+2" icon={Cpu}>
        <div className="flex flex-wrap gap-3">
          {[
            { name: 'ReportBot', status: 'busy' },
            { name: 'DataPilot', status: 'idle' },
            { name: 'GuardAI', status: 'idle' },
            { name: 'SyncMaster', status: 'error' },
          ].map((agent, i) => (
            <div key={i} className="flex items-center gap-1" title={`${agent.name}: ${agent.status}`}>
              {agent.status === 'busy' && <Activity size={12} className="text-indigo-400 animate-pulse" />}
              {agent.status === 'idle' && <Circle size={12} className="text-emerald-500 fill-emerald-500/20" />}
              {agent.status === 'error' && <AlertCircle size={12} className="text-rose-500" />}
              <span className="text-[10px] text-muted-foreground font-medium">{agent.name.slice(0, 1)}</span>
            </div>
          ))}
        </div>
      </MetricCard>
      <MetricCard label="Completed Today" value="142" trend="+12%" icon={CheckCircle2} />
      <MetricCard label="Avg. Efficiency" value="94%" trend="+4%" icon={BarChart3} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-foreground">Productivity Trends</h3>
          <select className="bg-muted border border-border rounded-md text-xs px-2 py-1 outline-none">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={productivityData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff10', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">AI Insights</h3>
        <div className="space-y-4">
          {[
            { title: "Efficiency Peak", desc: "Workflows are 15% faster between 9AM-11AM.", type: "success" },
            { title: "Bottleneck Detected", desc: "ClickUp API latency is affecting 'Sprint Sync'.", type: "warning" },
            { title: "Resource Optimization", desc: "Agent 'DataPilot' can handle 2 more concurrent tasks.", type: "info" }
          ].map((insight, i) => (
            <div key={i} className="p-4 rounded-lg bg-muted/30 border border-border/30 space-y-1">
              <div className="flex items-center gap-2">
                <div className={cn("w-1.5 h-1.5 rounded-full", 
                  insight.type === 'success' ? 'bg-emerald-500' : 
                  insight.type === 'warning' ? 'bg-amber-500' : 'bg-indigo-500'
                )} />
                <span className="text-sm font-semibold text-foreground">{insight.title}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{insight.desc}</p>
            </div>
          ))}
        </div>
        <button className="w-full mt-6 py-2 rounded-lg border border-border/50 text-xs font-medium text-muted-foreground hover:bg-accent transition-colors">
          View All Insights
        </button>
      </div>
    </div>

    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-border/50 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-foreground">Active Workflows</h3>
        <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
          View Monitor <ArrowRight size={14} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-muted-foreground text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Workflow</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Agent</th>
              <th className="px-6 py-4 font-medium">Tools</th>
              <th className="px-6 py-4 font-medium">Last Run</th>
              <th className="px-6 py-4 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {workflows.map((wf) => (
              <tr key={wf.id} className="hover:bg-accent/50 transition-colors group">
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-foreground">{wf.name}</span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={wf.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                      <Cpu size={12} className="text-indigo-400" />
                    </div>
                    <span className="text-sm text-muted-foreground">{wf.agent}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex -space-x-2">
                    {wf.tools.map((tool, i) => (
                      <div key={i} className="w-7 h-7 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-[10px] font-bold text-foreground">
                        {tool[0]}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{wf.time}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const CommandConsole = () => {
  const [command, setCommand] = useState(() => {
    return localStorage.getItem('flowpilot_last_command') || "";
  });
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState([
    { text: "Generate sprint report for Q1", status: "completed", time: "10:30 AM" },
    { text: "Sync Notion tasks with ClickUp", status: "completed", time: "09:15 AM" }
  ]);

  useEffect(() => {
    localStorage.setItem('flowpilot_last_command', command);
  }, [command]);

  const handleRun = () => {
    if (!command) return;
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHistory([{ text: command, status: "completed", time: "Just now" }, ...history]);
      setCommand("");
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">What should I handle today?</h2>
        <p className="text-muted-foreground">Describe your operational goal in natural language.</p>
      </div>

      <div className="glass-card p-8 space-y-6">
        <div className="relative">
          <textarea
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="e.g., Generate a productivity report for the engineering team and post it to #general in Slack..."
            className="w-full h-32 bg-muted/50 border border-border rounded-xl p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
          />
          <div className="absolute bottom-4 right-4 flex items-center gap-3">
            <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-tighter">Press ⌘ + Enter to run</span>
            <button 
              onClick={handleRun}
              disabled={isRunning || !command}
              className={cn(
                "px-6 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all",
                isRunning || !command 
                  ? "bg-muted text-muted-foreground cursor-not-allowed" 
                  : "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20"
              )}
            >
              {isRunning ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Play size={16} />}
              {isRunning ? "Interpreting..." : "Run Workflow"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {["Generate sprint report", "Analyze team productivity", "Summarize project progress", "Sync calendars"].map((s) => (
            <button 
              key={s}
              onClick={() => setCommand(s)}
              className="px-3 py-1.5 rounded-full bg-muted/50 border border-border/50 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Command History</h3>
        <div className="space-y-3">
          {history.map((h, i) => (
            <div key={i} className="glass-card p-4 flex items-center justify-between group cursor-pointer hover:bg-accent/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{h.text}</p>
                  <p className="text-xs text-muted-foreground">{h.time}</p>
                </div>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-primary font-medium">
                View Output
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WorkflowMonitor = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Workflow Monitor</h2>
        <p className="text-muted-foreground text-sm">Real-time visualization of active execution pipelines.</p>
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 rounded-lg glass border border-border/50 text-sm font-medium text-foreground hover:bg-accent">
          Pause All
        </button>
        <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
          New Workflow
        </button>
      </div>
    </div>

    <div className="glass-card p-8">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Zap size={20} />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Sprint Progress Sync</h3>
            <p className="text-xs text-muted-foreground">ID: WF-92831 • Started 2m ago</p>
          </div>
        </div>
        <StatusBadge status="running" />
      </div>

      <div className="relative flex justify-between items-start max-w-5xl mx-auto">
        {/* Connection Lines */}
        <div className="absolute top-6 left-0 w-full h-0.5 bg-border/20 -z-10" />
        <div className="absolute top-6 left-0 h-0.5 bg-indigo-500 transition-all duration-1000" style={{ width: '60%' }} />

        {[
          { step: "Goal", icon: Terminal, status: "completed" },
          { step: "Interpreter", icon: Cpu, status: "completed" },
          { step: "Planner", icon: LayoutDashboard, status: "running" },
          { step: "Engine", icon: Activity, status: "pending" },
          { step: "Output", icon: CheckCircle2, status: "pending" }
        ].map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-4 relative">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500",
              s.status === 'completed' ? "bg-indigo-500 border-indigo-500 text-white" :
              s.status === 'running' ? "bg-indigo-500/20 border-indigo-500 text-indigo-400 animate-pulse" :
              "bg-muted border-border/50 text-muted-foreground"
            )}>
              <s.icon size={20} />
            </div>
            <div className="text-center">
              <p className={cn("text-xs font-bold uppercase tracking-wider", s.status === 'pending' ? "text-muted-foreground" : "text-foreground")}>
                {s.step}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">{s.status}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-4 bg-muted/20">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Agent Logs</h4>
          <div className="font-mono text-[11px] space-y-2 h-48 overflow-y-auto">
            <p className="text-emerald-400">[10:30:01] Goal received: "Sync ClickUp to Slack"</p>
            <p className="text-indigo-400">[10:30:05] Interpreter: Parsing intent... OK</p>
            <p className="text-indigo-400">[10:30:08] Planner: Mapping ClickUp workspace 'Engineering'</p>
            <p className="text-indigo-400">[10:30:12] Planner: Identified 12 active tasks for sync</p>
            <p className="text-foreground animate-pulse">[10:32:01] Planner: Generating execution graph...</p>
          </div>
        </div>
        <div className="glass-card p-4 bg-muted/20">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Tool Activity</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                  <img src="https://cdn.worldvectorlogo.com/logos/clickup.svg" className="w-4 h-4" referrerPolicy="no-referrer" />
                </div>
                <span className="text-sm text-foreground">ClickUp API</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">200 OK</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                  <img src="https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg" className="w-4 h-4" referrerPolicy="no-referrer" />
                </div>
                <span className="text-sm text-foreground">Slack Webhook</span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">AWAITING</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const IntegrationsPage = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Integrations</h2>
        <p className="text-muted-foreground text-sm">Connect your workspace tools to FlowPilot AI.</p>
      </div>
      <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 flex items-center gap-2">
        <Plus size={16} /> Request Integration
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {integrations.map((app) => (
        <div key={app.name} className="glass-card p-6 flex flex-col gap-6 group transition-all">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-muted p-2.5 flex items-center justify-center">
              <img src={app.icon} alt={app.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <div className={cn(
              "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
              app.status === 'connected' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-muted text-muted-foreground border-border/50"
            )}>
              {app.status}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">{app.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">Connect your {app.name} workspace to automate tasks and sync data.</p>
          </div>
          <div className="flex items-center gap-3 pt-4 border-t border-border/30">
            <button className={cn(
              "flex-1 py-2 rounded-lg text-sm font-semibold transition-all",
              app.status === 'connected' ? "bg-muted text-foreground hover:bg-accent" : "bg-primary text-primary-foreground hover:opacity-90"
            )}>
              {app.status === 'connected' ? "Manage" : "Connect"}
            </button>
            {app.status === 'connected' && (
              <button className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-destructive transition-colors">
                <AlertCircle size={18} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ReportsPage = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Reports & Insights</h2>
        <p className="text-muted-foreground text-sm">AI-generated operational intelligence and analytics.</p>
      </div>
      <button className="px-4 py-2 rounded-lg glass border border-border/50 text-sm font-medium text-foreground hover:bg-accent flex items-center gap-2">
        <BarChart3 size={16} /> Export All
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="glass-card p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-foreground">Sprint Progress Report</h3>
            <p className="text-xs text-muted-foreground">Generated 2h ago • Q1 Sprint 4</p>
          </div>
          <StatusBadge status="completed" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Completion</p>
            <p className="text-xl font-bold text-emerald-400">72%</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Blocked</p>
            <p className="text-xl font-bold text-rose-400">3</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Velocity</p>
            <p className="text-xl font-bold text-indigo-400">42pts</p>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">AI Recommendations</p>
          <ul className="space-y-2">
            <li className="text-sm text-muted-foreground flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
              Reassign 2 blocked tasks from 'Design' to 'Engineering'.
            </li>
            <li className="text-sm text-muted-foreground flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
              Schedule a sync for 'API Integration' to resolve latency.
            </li>
          </ul>
        </div>
        <button className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:opacity-90">
          View Full Report
        </button>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-foreground mb-6">Task Completion Velocity</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--foreground)' }}
              />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
);

const HistoryPage = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div>
      <h2 className="text-2xl font-bold text-foreground">Workflow History</h2>
      <p className="text-muted-foreground text-sm">Audit log of all previously executed operations.</p>
    </div>

    <div className="glass-card overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="text-muted-foreground text-xs uppercase tracking-wider border-b border-border/30">
            <th className="px-6 py-4 font-medium">Workflow Name</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 font-medium">Execution Time</th>
            <th className="px-6 py-4 font-medium">Tools Used</th>
            <th className="px-6 py-4 font-medium">Output</th>
            <th className="px-6 py-4 font-medium"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {[
            { name: "Weekly Sync", status: "completed", time: "2h ago", tools: ["Slack", "Notion"], output: "Report PDF" },
            { name: "Data Cleanup", status: "completed", time: "5h ago", tools: ["Sheets"], output: "142 rows" },
            { name: "Lead Gen", status: "failed", time: "1d ago", tools: ["ClickUp"], output: "API Error" },
            { name: "Sprint Report", status: "completed", time: "2d ago", tools: ["ClickUp", "Slack"], output: "Report Link" },
          ].map((h, i) => (
            <tr key={i} className="hover:bg-accent/50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-foreground">{h.name}</td>
              <td className="px-6 py-4"><StatusBadge status={h.status} /></td>
              <td className="px-6 py-4 text-sm text-muted-foreground">{h.time}</td>
              <td className="px-6 py-4">
                <div className="flex gap-1">
                  {h.tools.map(t => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/50">{t}</span>)}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-primary cursor-pointer hover:underline">{h.output}</td>
              <td className="px-6 py-4 text-right">
                <button className="text-muted-foreground hover:text-foreground"><MoreVertical size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SettingsPage = () => (
  <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
    <div>
      <h2 className="text-2xl font-bold text-foreground">Settings</h2>
      <p className="text-muted-foreground text-sm">Manage your organization and AI preferences.</p>
    </div>

    <div className="space-y-6">
      <div className="glass-card p-6 space-y-6">
        <h3 className="text-lg font-bold text-foreground">Organization Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Organization Name</label>
            <input type="text" defaultValue="Acme Corp" className="w-full bg-muted border border-border rounded-lg py-2 px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Admin Email</label>
            <input type="email" defaultValue="admin@acme.com" className="w-full bg-muted border border-border rounded-lg py-2 px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
        </div>
      </div>

      <div className="glass-card p-6 space-y-6">
        <h3 className="text-lg font-bold text-foreground">AI Behavior</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border/30">
            <div>
              <p className="text-sm font-bold text-foreground">Autonomous Execution</p>
              <p className="text-xs text-muted-foreground">Allow agents to execute workflows without manual approval.</p>
            </div>
            <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-3 h-3 bg-primary-foreground rounded-full" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border/30">
            <div>
              <p className="text-sm font-bold text-foreground">Detailed Logging</p>
              <p className="text-xs text-muted-foreground">Store full execution traces for auditing purposes.</p>
            </div>
            <div className="w-10 h-5 bg-muted rounded-full relative cursor-pointer">
              <div className="absolute left-1 top-1 w-3 h-3 bg-foreground rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button className="px-6 py-2 rounded-lg glass border border-border/50 text-sm font-bold text-foreground hover:bg-accent">Cancel</button>
        <button className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:opacity-90">Save Changes</button>
      </div>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardOverview />;
      case 'console': return <CommandConsole />;
      case 'workflows': return <WorkflowMonitor />;
      case 'reports': return <ReportsPage />;
      case 'integrations': return <IntegrationsPage />;
      case 'history': return <HistoryPage />;
      case 'settings': return <SettingsPage />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full glass border-r border-border/30 transition-all duration-300 z-50",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
            <Zap size={20} className="text-primary-foreground fill-primary-foreground" />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight text-foreground">FlowPilot<span className="text-primary">AI</span></span>}
        </div>

        <nav className="mt-6 px-3 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activePage === 'dashboard'} onClick={() => setActivePage('dashboard')} />
          <SidebarItem icon={Terminal} label="Command Console" active={activePage === 'console'} onClick={() => setActivePage('console')} />
          <SidebarItem icon={Activity} label="Workflow Monitor" active={activePage === 'workflows'} onClick={() => setActivePage('workflows')} />
          <SidebarItem icon={BarChart3} label="Reports & Insights" active={activePage === 'reports'} onClick={() => setActivePage('reports')} />
          <SidebarItem icon={Blocks} label="Integrations" active={activePage === 'integrations'} onClick={() => setActivePage('integrations')} />
          <SidebarItem icon={History} label="Workflow History" active={activePage === 'history'} onClick={() => setActivePage('history')} />
          <div className="pt-4 mt-4 border-t border-border/30">
            <SidebarItem icon={Settings} label="Settings" active={activePage === 'settings'} onClick={() => setActivePage('settings')} />
          </div>
        </nav>

        <div className="absolute bottom-6 left-0 w-full px-6">
          {isSidebarOpen ? (
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Pro Plan</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">Unlock advanced multi-agent coordination.</p>
              <button className="mt-3 w-full py-2 rounded-lg bg-primary text-primary-foreground text-[11px] font-bold hover:opacity-90 transition-colors">
                Upgrade Now
              </button>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary mx-auto">
              <Zap size={14} />
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300",
        isSidebarOpen ? "ml-64" : "ml-20"
      )}>
        {/* Header */}
        <header className="h-20 glass border-b border-border/30 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                type="text" 
                placeholder="Search workflows, agents, or logs..." 
                className="w-full bg-muted/50 border border-border/50 rounded-lg py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50 cursor-pointer hover:bg-accent transition-colors">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground">Acme Corp</span>
              <ChevronDown size={14} className="text-muted-foreground" />
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-400 hover:text-foreground hover:bg-accent transition-all"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button className="relative p-2 rounded-lg text-slate-400 hover:text-foreground hover:bg-accent transition-all">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-background" />
              </button>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 border border-white/20 p-0.5 cursor-pointer">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                  alt="Avatar" 
                  className="w-full h-full rounded-full bg-slate-900"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
