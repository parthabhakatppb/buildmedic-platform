import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Terminal,
  Code2,
  CheckCircle2,
  GitPullRequest,
  ChevronRight,
  Shield,
  Lock,
  ExternalLink,
  Copy,
  ChevronDown,
  ChevronUp,
  Sparkles,
  AlertTriangle,
  CircleDot,
} from 'lucide-react';
import {
  mockErrorLog,
  mockBrokenCode,
  mockPatchedCode,
  compilerLogs,
  mockRootCause,
  mockJustification,
} from '../data/mock';

interface HealingVisualizerProps {
  activeStep: number;
  isSimulating: boolean;
}

// ─── Step 1: Log Interception Pane ──────────────────────
const LogInterceptionPane: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const termRef = useRef<HTMLDivElement>(null);
  const lines = mockErrorLog.split('\n');

  useEffect(() => {
    if (!isActive) {
      setVisibleLines([]);
      return;
    }
    setVisibleLines([]);
    let i = 0;
    const timer = setInterval(() => {
      if (i < lines.length) {
        setVisibleLines(prev => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(timer);
      }
    }, 120);
    return () => clearInterval(timer);
  }, [isActive]);

  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight;
    }
  }, [visibleLines]);

  const isErrorLine = (line: string) =>
    line.includes('TypeError') || line.includes('AttributeError') || line.includes('SyntaxError') || line.includes('error Command');

  const isTraceLine = (line: string) =>
    line.includes('File "') || line.includes('Traceback');

  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <div className="terminal-dot bg-medic-fail" />
        <div className="terminal-dot bg-medic-warn" />
        <div className="terminal-dot bg-medic-heal" />
        <span className="ml-2 text-xs text-medic-muted font-mono">CI/CD Pipeline Output — GitHub Actions</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="status-badge bg-medic-fail/10 text-medic-fail border border-medic-fail/20 text-[10px]">
            <CircleDot size={10} /> EXIT CODE 1
          </span>
        </div>
      </div>
      <div ref={termRef} className="p-4 h-[320px] overflow-y-auto font-mono text-[13px] leading-relaxed">
        {visibleLines.map((line, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 py-0.5 px-2 -mx-2 rounded ${
              isErrorLine(line) ? 'error-highlight glow-line-red' :
              isTraceLine(line) ? 'text-medic-warn/80' :
              'text-medic-muted/70'
            }`}
          >
            <span className="code-line-number">{i + 1}</span>
            <span className={isErrorLine(line) ? 'text-medic-fail font-semibold' : ''}>
              {line || '\u00A0'}
            </span>
          </div>
        ))}
        {isActive && visibleLines.length < lines.length && (
          <span className="inline-block w-2 h-4 bg-medic-agent animate-pulse ml-8" />
        )}
      </div>
      {visibleLines.length >= lines.length && isActive && (
        <div className="px-4 py-3 border-t border-medic-border bg-medic-fail/5 flex items-center gap-3">
          <AlertTriangle size={14} className="text-medic-fail" />
          <span className="text-xs text-medic-fail font-medium">
            Diagnostic Agent identified target: <code className="px-1.5 py-0.5 rounded bg-medic-fail/10 font-mono">parse_config</code> in <code className="px-1.5 py-0.5 rounded bg-medic-fail/10 font-mono">src/utils/parser.py</code>
          </span>
        </div>
      )}
    </div>
  );
};

// ─── Step 2: AST Mutation Sandbox Pane ──────────────────
const ASTMutationPane: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [showPatch, setShowPatch] = useState(false);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setShowPatch(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setShowPatch(false);
    }
  }, [isActive]);

  const renderCode = (code: string, highlight: 'broken' | 'patched') => {
    const lines = code.split('\n');
    return (
      <div className="font-mono text-[12px] leading-6">
        {lines.map((line, i) => (
          <div key={i} className="code-line">
            <span className="code-line-number">{i + 1}</span>
            <span className={
              highlight === 'broken' ? 'text-medic-fail/80' :
              highlight === 'patched' && !mockBrokenCode.split('\n').includes(line) ? 'text-medic-heal' :
              'text-medic-text/70'
            }>
              {line || '\u00A0'}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* AST Lock banner */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-medic-agent/5 border border-medic-agent/20">
        <Lock size={14} className="text-medic-agent" />
        <span className="text-xs font-medium text-medic-agent">
          AST Lock Enabled: Surrounding Code Protected from Logic Drift
        </span>
        <Shield size={14} className="text-medic-agent/50 ml-auto" />
      </div>

      {/* Split view */}
      <div className="grid grid-cols-2 gap-0 rounded-xl overflow-hidden border border-medic-border">
        {/* Left: Broken Node */}
        <div className="bg-[#0a0d14]">
          <div className="flex items-center justify-between px-4 py-2.5 bg-medic-card border-b border-medic-border">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-medic-fail" />
              <span className="text-xs font-semibold text-medic-fail">Isolated Broken Node</span>
            </div>
            <span className="text-[10px] font-mono text-medic-muted px-2 py-0.5 rounded bg-medic-card border border-medic-border">
              parse_config()
            </span>
          </div>
          <div className="p-2 min-h-[200px]">
            {isActive && renderCode(mockBrokenCode, 'broken')}
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-medic-agent to-transparent z-10" />

          {/* Right: Patched Code */}
          <div className="bg-[#0a0d14]">
            <div className="flex items-center justify-between px-4 py-2.5 bg-medic-card border-b border-medic-border">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-medic-heal" />
                <span className="text-xs font-semibold text-medic-heal">AI Generated Code Patch</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles size={12} className="text-medic-agent" />
                <span className="text-[10px] font-mono text-medic-agent px-2 py-0.5 rounded bg-medic-agent/10 border border-medic-agent/20">
                  Pydantic Agent
                </span>
              </div>
            </div>
            <div className="p-2 min-h-[200px]">
              {showPatch ? (
                <div className="animate-fade-in">
                  {renderCode(mockPatchedCode, 'patched')}
                </div>
              ) : isActive ? (
                <div className="flex items-center justify-center h-[200px]">
                  <div className="flex items-center gap-3 text-medic-agent">
                    <Sparkles size={20} className="animate-pulse" />
                    <span className="text-sm font-medium">Generating patch...</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Step 3: Verification Console ───────────────────────
const VerificationConsole: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [visibleLogs, setVisibleLogs] = useState<typeof compilerLogs>([]);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) {
      setVisibleLogs([]);
      return;
    }
    setVisibleLogs([]);
    const timers: NodeJS.Timeout[] = [];
    compilerLogs.forEach((log, i) => {
      const timer = setTimeout(() => {
        setVisibleLogs(prev => [...prev, log]);
      }, log.delay);
      timers.push(timer);
    });
    return () => timers.forEach(clearTimeout);
  }, [isActive]);

  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight;
    }
  }, [visibleLogs]);

  const getLogColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-medic-fail';
      case 'success': return 'text-medic-heal';
      case 'info': return 'text-medic-info';
      default: return 'text-medic-muted/60';
    }
  };

  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <div className="terminal-dot bg-medic-fail" />
        <div className="terminal-dot bg-medic-warn" />
        <div className="terminal-dot bg-medic-heal" />
        <span className="ml-2 text-xs text-medic-muted font-mono">Compilation Verification Loop</span>
        <div className="ml-auto flex items-center gap-2">
          {visibleLogs.some(l => l.type === 'success') && (
            <span className="status-badge bg-medic-heal/10 text-medic-heal border border-medic-heal/20 text-[10px]">
              <CheckCircle2 size={10} /> PASSED
            </span>
          )}
        </div>
      </div>
      <div ref={termRef} className="p-4 h-[250px] overflow-y-auto font-mono text-[13px] leading-7">
        {visibleLogs.map((log, i) => (
          <div key={i} className={`${getLogColor(log.type)} ${log.type === 'error' ? 'error-highlight px-2 -mx-2 rounded' : ''}`}>
            {log.text || '\u00A0'}
          </div>
        ))}
        {isActive && visibleLogs.length < compilerLogs.length && (
          <span className="inline-block w-2 h-4 bg-medic-info animate-pulse" />
        )}
      </div>
    </div>
  );
};

// ─── Step 4: Pull Request Deployment Card ───────────────
const PRDeploymentCard: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
      setExpanded(false);
    }
  }, [isActive]);

  if (!visible) return null;

  return (
    <div className="animate-fade-in space-y-4">
      {/* PR Card */}
      <div className="glass-card border-medic-heal/30 overflow-hidden">
        {/* PR Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-medic-heal/5 to-transparent border-b border-medic-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-medic-heal/10 flex items-center justify-center border border-medic-heal/20">
              <GitPullRequest size={20} className="text-medic-heal" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">🩹 BuildMedic AI: Self-Healed Component inside <code className="text-medic-heal">src/utils/parser.py</code></h4>
              </div>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="status-badge bg-medic-heal/10 text-medic-heal border border-medic-heal/20 text-[10px]">
                  <CheckCircle2 size={10} /> Open
                </span>
                <a
                  href="#"
                  className="flex items-center gap-1 text-xs text-medic-agent hover:text-medic-agent/80 font-mono transition-colors"
                >
                  medic/auto-heal-a3f7c21
                  <ExternalLink size={10} />
                </a>
                <span className="text-[10px] text-medic-muted">opened just now by <strong className="text-medic-agent">BuildMedic Bot</strong></span>
              </div>
            </div>
            <button
              onClick={() => navigator.clipboard?.writeText('medic/auto-heal-a3f7c21')}
              className="p-2 rounded-lg text-medic-muted hover:text-medic-text hover:bg-medic-hover transition-colors"
            >
              <Copy size={14} />
            </button>
          </div>
        </div>

        {/* PR Body */}
        <div className="px-5 py-4 space-y-3">
          <div className="flex items-center gap-4 text-xs text-medic-muted">
            <span className="flex items-center gap-1.5">
              <Code2 size={12} /> 1 file changed
            </span>
            <span className="text-medic-heal">+4 additions</span>
            <span className="text-medic-fail">-2 deletions</span>
          </div>

          {/* Expandable Details */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg bg-medic-card border border-medic-border hover:border-medic-muted/30 transition-colors text-left"
          >
            <Sparkles size={14} className="text-medic-agent" />
            <span className="text-xs font-medium text-medic-text flex-1">Automated Diagnostic Report</span>
            {expanded ? <ChevronUp size={14} className="text-medic-muted" /> : <ChevronDown size={14} className="text-medic-muted" />}
          </button>

          {expanded && (
            <div className="animate-fade-in px-4 py-4 rounded-lg bg-medic-bg border border-medic-border space-y-4">
              <div>
                <h5 className="text-[11px] font-semibold text-medic-muted uppercase tracking-wider mb-2">Root Cause Analysis</h5>
                <p className="text-xs text-medic-text/80 leading-relaxed font-mono">{mockRootCause}</p>
              </div>
              <div className="w-full h-px bg-medic-border" />
              <div>
                <h5 className="text-[11px] font-semibold text-medic-muted uppercase tracking-wider mb-2">Architectural Justification</h5>
                <p className="text-xs text-medic-text/80 leading-relaxed font-mono">{mockJustification}</p>
              </div>
            </div>
          )}
        </div>

        {/* PR Actions */}
        <div className="px-5 py-4 border-t border-medic-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-medic-heal" />
            <span className="text-xs text-medic-heal font-medium">All checks passed — Locally verified compilation</span>
          </div>
          <button className="btn-success">
            <CheckCircle2 size={16} />
            Merge & Re-deploy Pipeline
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Visualizer Component ──────────────────────────
export const HealingVisualizer: React.FC<HealingVisualizerProps> = ({ activeStep, isSimulating }) => {
  const steps = [
    { id: 1, label: 'Log Interception', icon: Terminal, description: 'Parsing raw build failure output' },
    { id: 2, label: 'AST Mutation', icon: Code2, description: 'Generating isolated code patch' },
    { id: 3, label: 'Verification', icon: CheckCircle2, description: 'Compiler-in-the-loop validation' },
    { id: 4, label: 'PR Deployment', icon: GitPullRequest, description: 'Opening automated pull request' },
  ];

  const getStepClass = (stepId: number) => {
    if (stepId < activeStep) return 'step-complete';
    if (stepId === activeStep) return 'step-active';
    return 'step-pending';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div>
        <h2 className="text-xl font-bold text-white">Self-Healing Visualizer</h2>
        <p className="text-sm text-medic-muted mt-1">
          {isSimulating
            ? 'Autonomous repair lifecycle in progress...'
            : 'Trigger a failure event to observe the complete self-healing pipeline'}
        </p>
      </div>

      {/* Step Progress Bar */}
      <div className="glass-card px-6 py-5">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = step.id === activeStep;
            const isComplete = step.id < activeStep;
            return (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-3">
                  <div className={getStepClass(step.id)}>
                    {isComplete ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <Icon size={16} className={isCurrent ? 'animate-pulse' : ''} />
                    )}
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${isCurrent ? 'text-medic-agent' : isComplete ? 'text-medic-heal' : 'text-medic-muted'}`}>
                      {step.label}
                    </p>
                    <p className="text-[10px] text-medic-muted/60">{step.description}</p>
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div className="h-px bg-medic-border relative">
                      <div
                        className="h-px bg-gradient-to-r from-medic-heal to-medic-agent transition-all duration-1000"
                        style={{ width: step.id < activeStep ? '100%' : '0%' }}
                      />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Active Step Content */}
      <div className="min-h-[350px]">
        {activeStep === 0 && !isSimulating && (
          <div className="flex flex-col items-center justify-center h-[350px] glass-card">
            <div className="w-16 h-16 rounded-2xl bg-medic-agent/10 flex items-center justify-center mb-4 border border-medic-agent/20">
              <Shield size={32} className="text-medic-agent" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Ready to Self-Heal</h3>
            <p className="text-sm text-medic-muted text-center max-w-md">
              Click the <span className="text-medic-fail font-semibold">"Trigger Failure Event"</span> button in the header
              to simulate a complete autonomous repair lifecycle.
            </p>
          </div>
        )}
        {activeStep >= 1 && <LogInterceptionPane isActive={activeStep === 1} />}
        {activeStep >= 2 && <div className="mt-4"><ASTMutationPane isActive={activeStep === 2} /></div>}
        {activeStep >= 3 && <div className="mt-4"><VerificationConsole isActive={activeStep === 3} /></div>}
        {activeStep >= 4 && <div className="mt-4"><PRDeploymentCard isActive={activeStep === 4} /></div>}
      </div>
    </div>
  );
};
