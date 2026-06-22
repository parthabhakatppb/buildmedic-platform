import React from 'react';
import {
  Wifi,
  ChevronDown,
  Zap,
  User,
  Bell,
  Search,
} from 'lucide-react';

interface TopBarProps {
  onTriggerDemo: () => void;
  isSimulating: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ onTriggerDemo, isSimulating }) => {
  return (
    <header className="fixed top-0 left-[240px] right-0 h-14 bg-medic-surface/80 backdrop-blur-md border-b border-medic-border flex items-center justify-between px-6 z-30">
      {/* Left: Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-medic-heal/5 border border-medic-heal/20">
          <Wifi size={14} className="text-medic-heal" />
          <span className="text-xs font-medium text-medic-heal">Webhook Listener: Operational</span>
          <span className="pulse-dot bg-medic-heal" />
        </div>

        {/* Branch Selector */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-medic-card border border-medic-border hover:border-medic-muted/30 transition-colors">
          <span className="text-xs font-medium text-medic-muted">Branch:</span>
          <span className="text-xs font-semibold text-medic-text">main</span>
          <ChevronDown size={12} className="text-medic-muted" />
        </button>
      </div>

      {/* Center: Trigger Button */}
      <button
        onClick={onTriggerDemo}
        disabled={isSimulating}
        className={`
          flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300
          ${isSimulating
            ? 'bg-medic-agent/20 text-medic-agent border border-medic-agent/30 cursor-wait animate-pulse'
            : 'bg-gradient-to-r from-medic-fail to-red-600 hover:from-red-600 hover:to-medic-fail text-white shadow-glow-red hover:shadow-lg cursor-pointer'
          }
        `}
      >
        <Zap size={16} className={isSimulating ? 'animate-spin' : ''} />
        {isSimulating ? 'Self-Healing in Progress...' : 'Trigger Failure Event'}
      </button>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg text-medic-muted hover:text-medic-text hover:bg-medic-hover transition-colors">
          <Search size={16} />
        </button>
        <button className="relative p-2 rounded-lg text-medic-muted hover:text-medic-text hover:bg-medic-hover transition-colors">
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-medic-fail" />
        </button>
        <div className="w-px h-6 bg-medic-border mx-1" />
        <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-medic-hover transition-colors">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-medic-agent to-medic-info flex items-center justify-center">
            <User size={14} className="text-white" />
          </div>
          <div className="text-left">
            <p className="text-xs font-medium text-medic-text">DevOps Admin</p>
            <p className="text-[10px] text-medic-muted">Platform Owner</p>
          </div>
          <ChevronDown size={12} className="text-medic-muted" />
        </button>
      </div>
    </header>
  );
};
