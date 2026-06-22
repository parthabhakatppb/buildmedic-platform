import React from 'react';
import {
  Activity,
  Heart,
  TrendingUp,
  Clock,
  ExternalLink,
  GitCommit,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Cpu,
  FileCode,
} from 'lucide-react';
import { kpiData, incidents, statusConfig, type Incident } from '../data/mock';

interface DashboardViewProps {
  onOpenWorkspace: (incident: Incident) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenWorkspace }) => {
  const kpis = [
    {
      label: 'Total Pipelines Tracked',
      value: kpiData.totalPipelines,
      suffix: 'Active',
      icon: Activity,
      color: 'text-medic-info',
      bgColor: 'bg-medic-info/10',
      borderColor: 'border-medic-info/20',
      trend: '+2 this week',
    },
    {
      label: 'Automated Code Repairs',
      value: kpiData.totalHeals,
      suffix: 'Heals',
      icon: Heart,
      color: 'text-medic-heal',
      bgColor: 'bg-medic-heal/10',
      borderColor: 'border-medic-heal/20',
      trend: '+12 today',
    },
    {
      label: 'Healing Efficiency Rate',
      value: kpiData.healingRate,
      suffix: '%',
      icon: TrendingUp,
      color: 'text-medic-agent',
      bgColor: 'bg-medic-agent/10',
      borderColor: 'border-medic-agent/20',
      trend: '↑ 1.3% from last week',
    },
    {
      label: 'Engineering Hours Saved',
      value: kpiData.hoursSaved,
      suffix: 'Hours',
      icon: Clock,
      color: 'text-medic-warn',
      bgColor: 'bg-medic-warn/10',
      borderColor: 'border-medic-warn/20',
      trend: '~$32K value',
    },
  ];

  const getStatusIcon = (status: Incident['status']) => {
    switch (status) {
      case 'idle': return <AlertCircle size={14} />;
      case 'parsing_log': return <Loader2 size={14} className="animate-spin" />;
      case 'mutating_ast': return <Cpu size={14} className="animate-pulse" />;
      case 'validating_code': return <FileCode size={14} className="animate-pulse" />;
      case 'pr_deployed': return <CheckCircle2 size={14} />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div>
        <h2 className="text-xl font-bold text-white">Pipeline Health Dashboard</h2>
        <p className="text-sm text-medic-muted mt-1">Real-time monitoring of connected repositories and active incident resolution</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className={`kpi-card border ${kpi.borderColor} group hover:scale-[1.02] transition-transform duration-200`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-medic-muted uppercase tracking-wide">{kpi.label}</span>
                <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                  <Icon size={16} className={kpi.color} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white tracking-tight">{kpi.value}</span>
                <span className={`text-sm font-medium ${kpi.color}`}>{kpi.suffix}</span>
              </div>
              <span className="text-[11px] text-medic-muted/60">{kpi.trend}</span>
            </div>
          );
        })}
      </div>

      {/* Incident Table */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-medic-border">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-white">Active Incident Tracker</h3>
            <span className="status-badge bg-medic-agent/10 text-medic-agent border border-medic-agent/20">
              {incidents.filter(i => i.status !== 'idle' && i.status !== 'pr_deployed').length} Active
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-medic-muted">
            <span>Auto-refreshing</span>
            <span className="pulse-dot bg-medic-heal" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-medic-border">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-medic-muted uppercase tracking-wider">Repository</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-medic-muted uppercase tracking-wider">Branch</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-medic-muted uppercase tracking-wider">Commit</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-medic-muted uppercase tracking-wider">Timestamp</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-medic-muted uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-[11px] font-semibold text-medic-muted uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident, idx) => {
                const config = statusConfig[incident.status];
                return (
                  <tr
                    key={incident.id}
                    className={`border-b border-medic-border/50 hover:bg-medic-hover/50 transition-colors ${idx === incidents.length - 1 ? 'border-b-0' : ''}`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-medic-card flex items-center justify-center">
                          <GitCommit size={12} className="text-medic-muted" />
                        </div>
                        <span className="text-sm font-medium text-medic-text">{incident.repo}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded bg-medic-card text-xs font-mono text-medic-muted border border-medic-border">
                        {incident.branch}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded bg-medic-agent/10 text-xs font-mono text-medic-agent border border-medic-agent/20">
                        {incident.commitSha}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-medic-muted">{incident.timestamp}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`status-badge ${config.bg} ${config.color} border ${config.border}`}>
                        {getStatusIcon(incident.status)}
                        {config.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => onOpenWorkspace(incident)}
                        className="btn-ghost text-xs"
                      >
                        <span>Open Workspace</span>
                        <ExternalLink size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
