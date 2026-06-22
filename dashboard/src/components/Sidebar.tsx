import React from 'react';
import {
  Activity,
  Wrench,
  GitBranch,
  BarChart3,
  Shield,
  Settings,
  HelpCircle,
} from 'lucide-react';

export type ViewType = 'monitors' | 'workspace' | 'repos' | 'analytics';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const navItems: { id: ViewType; label: string; icon: React.ElementType }[] = [
  { id: 'monitors', label: 'Live Monitors', icon: Activity },
  { id: 'workspace', label: 'Healing Workspace', icon: Wrench },
  { id: 'repos', label: 'Connected Repos', icon: GitBranch },
  { id: 'analytics', label: 'Analytics & ROI', icon: BarChart3 },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-medic-surface border-r border-medic-border flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-medic-border">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-medic-agent to-medic-info flex items-center justify-center">
          <Shield size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white tracking-tight">BuildMedic</h1>
          <span className="text-[10px] font-medium text-medic-agent uppercase tracking-widest">AI Engine</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 mb-2 text-[10px] font-semibold text-medic-muted/60 uppercase tracking-widest">
          Platform
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={isActive ? 'nav-item-active w-full' : 'nav-item-inactive w-full'}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.id === 'monitors' && (
                <span className="ml-auto flex items-center gap-1.5">
                  <span className="pulse-dot bg-medic-heal" />
                  <span className="text-[10px] text-medic-heal font-medium">Live</span>
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-4 border-t border-medic-border space-y-1">
        <button className="nav-item-inactive w-full">
          <Settings size={18} />
          <span>Settings</span>
        </button>
        <button className="nav-item-inactive w-full">
          <HelpCircle size={18} />
          <span>Documentation</span>
        </button>
      </div>

      {/* Version badge */}
      <div className="px-5 py-3 border-t border-medic-border">
        <div className="flex items-center gap-2 text-[11px] text-medic-muted/50">
          <span>v2.0.0</span>
          <span>·</span>
          <span className="text-medic-heal">Stable</span>
        </div>
      </div>
    </aside>
  );
};
