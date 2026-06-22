import React, { useState, useCallback } from 'react';
import { Sidebar, type ViewType } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardView } from './components/DashboardView';
import { HealingVisualizer } from './components/HealingVisualizer';
import {
  GitBranch,
  BarChart3,
  Activity,
  Heart,
  TrendingUp,
  Clock,
  Server,
  Globe,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import type { Incident } from './data/mock';

function App() {
  const [activeView, setActiveView] = useState<ViewType>('monitors');
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const triggerDemo = useCallback(() => {
    if (isSimulating) return;

    setActiveView('workspace');
    setIsSimulating(true);
    setActiveStep(0);

    // Step 1: Log Interception (0ms → 4s)
    setTimeout(() => setActiveStep(1), 300);

    // Step 2: AST Mutation (4s → 7.5s)
    setTimeout(() => setActiveStep(2), 4000);

    // Step 3: Verification (7.5s → 15s)
    setTimeout(() => setActiveStep(3), 7500);

    // Step 4: PR Deployment (15s → done)
    setTimeout(() => setActiveStep(4), 15000);

    // Complete
    setTimeout(() => setIsSimulating(false), 17000);
  }, [isSimulating]);

  const handleOpenWorkspace = useCallback((_incident: Incident) => {
    setActiveView('workspace');
  }, []);

  return (
    <div className="min-h-screen bg-medic-bg">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <TopBar onTriggerDemo={triggerDemo} isSimulating={isSimulating} />

      {/* Main Content */}
      <main className="ml-[240px] pt-14 p-6">
        {activeView === 'monitors' && (
          <DashboardView onOpenWorkspace={handleOpenWorkspace} />
        )}

        {activeView === 'workspace' && (
          <HealingVisualizer activeStep={activeStep} isSimulating={isSimulating} />
        )}

        {activeView === 'repos' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-white">Connected Repositories</h2>
              <p className="text-sm text-medic-muted mt-1">Manage your monitored repositories and webhook integrations</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'acme-corp/web-platform', lang: 'Python', status: 'active', heals: 47, branches: 3 },
                { name: 'acme-corp/auth-service', lang: 'Python', status: 'active', heals: 32, branches: 2 },
                { name: 'acme-corp/data-pipeline', lang: 'Python', status: 'active', heals: 28, branches: 4 },
                { name: 'acme-corp/ml-gateway', lang: 'Python', status: 'paused', heals: 19, branches: 1 },
                { name: 'acme-corp/notification-svc', lang: 'Python', status: 'active', heals: 11, branches: 2 },
                { name: 'acme-corp/billing-api', lang: 'Python', status: 'active', heals: 5, branches: 1 },
              ].map((repo) => (
                <div key={repo.name} className="glass-card-hover p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-medic-card flex items-center justify-center border border-medic-border">
                        <GitBranch size={18} className="text-medic-agent" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">{repo.name}</h3>
                        <p className="text-[11px] text-medic-muted">{repo.lang} · {repo.branches} branches monitored</p>
                      </div>
                    </div>
                    <span className={`status-badge ${
                      repo.status === 'active'
                        ? 'bg-medic-heal/10 text-medic-heal border border-medic-heal/20'
                        : 'bg-medic-warn/10 text-medic-warn border border-medic-warn/20'
                    }`}>
                      {repo.status === 'active' ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                      {repo.status === 'active' ? 'Active' : 'Paused'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-medic-muted">
                    <span className="flex items-center gap-1"><Heart size={12} className="text-medic-heal" /> {repo.heals} heals</span>
                    <span className="flex items-center gap-1"><Activity size={12} /> Last: 2hr ago</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-medic-border overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-medic-agent to-medic-heal transition-all duration-500"
                      style={{ width: `${Math.min(100, (repo.heals / 50) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'analytics' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-white">Analytics & ROI</h2>
              <p className="text-sm text-medic-muted mt-1">Platform performance metrics and return on investment analysis</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-card p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-medic-heal" />
                  <span className="text-xs font-semibold text-medic-muted uppercase tracking-wider">Success Rate Trend</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">94.2%</span>
                  <span className="text-xs text-medic-heal font-medium">↑ 1.3%</span>
                </div>
                {/* Mini chart */}
                <div className="flex items-end gap-1 h-16">
                  {[65, 72, 68, 80, 85, 78, 88, 91, 87, 94, 92, 94].map((v, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm bg-medic-heal/20 hover:bg-medic-heal/40 transition-colors"
                      style={{ height: `${v}%` }}
                    >
                      <div
                        className="w-full rounded-sm bg-medic-heal transition-all duration-300"
                        style={{ height: `${v}%` }}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-medic-muted">Last 12 weeks</p>
              </div>

              <div className="glass-card p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-medic-warn" />
                  <span className="text-xs font-semibold text-medic-muted uppercase tracking-wider">Avg. Resolution Time</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">47</span>
                  <span className="text-sm text-medic-warn font-medium">seconds</span>
                </div>
                <div className="flex items-end gap-1 h-16">
                  {[90, 82, 75, 70, 68, 62, 58, 55, 52, 50, 48, 47].map((v, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm transition-colors"
                      style={{ height: `${v}%` }}
                    >
                      <div
                        className="w-full rounded-sm bg-medic-warn transition-all duration-300"
                        style={{ height: '100%' }}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-medic-muted">Trending downward (improving)</p>
              </div>

              <div className="glass-card p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <BarChart3 size={16} className="text-medic-agent" />
                  <span className="text-xs font-semibold text-medic-muted uppercase tracking-wider">Cost Savings</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">$32K</span>
                  <span className="text-sm text-medic-agent font-medium">saved</span>
                </div>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-medic-muted">Engineering hours</span>
                    <span className="text-medic-text font-medium">213 hrs × $150/hr</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-medic-muted">Incidents prevented</span>
                    <span className="text-medic-text font-medium">142 auto-resolved</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-medic-muted">MTTR reduction</span>
                    <span className="text-medic-heal font-medium">-87% vs. manual</span>
                  </div>
                </div>
              </div>
            </div>

            {/* System Overview */}
            <div className="glass-card p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white">System Architecture Health</h3>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Webhook Listener', status: 'Operational', icon: Globe, color: 'text-medic-heal' },
                  { label: 'Diagnostic Agent', status: 'Standby', icon: Activity, color: 'text-medic-info' },
                  { label: 'AST Engine', status: 'Standby', icon: Server, color: 'text-medic-info' },
                  { label: 'GitHub Client', status: 'Connected', icon: GitBranch, color: 'text-medic-heal' },
                ].map((svc) => {
                  const Icon = svc.icon;
                  return (
                    <div key={svc.label} className="flex items-center gap-3 p-3 rounded-lg bg-medic-bg border border-medic-border">
                      <Icon size={16} className={svc.color} />
                      <div>
                        <p className="text-xs font-medium text-medic-text">{svc.label}</p>
                        <p className={`text-[10px] font-medium ${svc.color}`}>{svc.status}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
