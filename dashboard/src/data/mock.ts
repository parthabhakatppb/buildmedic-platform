export interface Incident {
  id: string;
  repo: string;
  branch: string;
  commitSha: string;
  timestamp: string;
  status: 'idle' | 'parsing_log' | 'mutating_ast' | 'validating_code' | 'pr_deployed';
  filePath?: string;
  targetScope?: string;
}

export interface KPIData {
  totalPipelines: number;
  totalHeals: number;
  healingRate: number;
  hoursSaved: number;
}

export const kpiData: KPIData = {
  totalPipelines: 14,
  totalHeals: 142,
  healingRate: 94.2,
  hoursSaved: 213,
};

export const incidents: Incident[] = [
  {
    id: '1',
    repo: 'acme-corp/web-platform',
    branch: 'main',
    commitSha: 'a3f7c21',
    timestamp: '2 min ago',
    status: 'pr_deployed',
    filePath: 'src/utils/parser.py',
    targetScope: 'parse_config',
  },
  {
    id: '2',
    repo: 'acme-corp/auth-service',
    branch: 'develop',
    commitSha: 'e91b4f8',
    timestamp: '8 min ago',
    status: 'validating_code',
    filePath: 'lib/tokens.py',
    targetScope: 'refresh_jwt_token',
  },
  {
    id: '3',
    repo: 'acme-corp/data-pipeline',
    branch: 'feature/ingest-v2',
    commitSha: 'c44d9e2',
    timestamp: '14 min ago',
    status: 'pr_deployed',
    filePath: 'pipeline/transform.py',
    targetScope: 'apply_schema_map',
  },
  {
    id: '4',
    repo: 'acme-corp/ml-gateway',
    branch: 'main',
    commitSha: 'f02a8b6',
    timestamp: '31 min ago',
    status: 'idle',
    filePath: 'inference/handler.py',
    targetScope: 'run_prediction',
  },
  {
    id: '5',
    repo: 'acme-corp/web-platform',
    branch: 'staging',
    commitSha: '7d13ec5',
    timestamp: '1 hr ago',
    status: 'pr_deployed',
    filePath: 'src/api/routes.py',
    targetScope: 'validate_payload',
  },
  {
    id: '6',
    repo: 'acme-corp/notification-svc',
    branch: 'main',
    commitSha: 'b8f2a01',
    timestamp: '2 hr ago',
    status: 'pr_deployed',
    filePath: 'handlers/email.py',
    targetScope: 'send_template',
  },
];

export const statusConfig: Record<Incident['status'], { label: string; color: string; bg: string; border: string }> = {
  idle: {
    label: 'Idle',
    color: 'text-medic-muted',
    bg: 'bg-medic-muted/10',
    border: 'border-medic-muted/20',
  },
  parsing_log: {
    label: 'Parsing Log',
    color: 'text-medic-agent',
    bg: 'bg-medic-agent/10',
    border: 'border-medic-agent/20',
  },
  mutating_ast: {
    label: 'Mutating AST',
    color: 'text-medic-warn',
    bg: 'bg-medic-warn/10',
    border: 'border-medic-warn/20',
  },
  validating_code: {
    label: 'Validating Code',
    color: 'text-medic-info',
    bg: 'bg-medic-info/10',
    border: 'border-medic-info/20',
  },
  pr_deployed: {
    label: 'PR Deployed',
    color: 'text-medic-heal',
    bg: 'bg-medic-heal/10',
    border: 'border-medic-heal/20',
  },
};

export const mockErrorLog = `FAIL  src/utils/parser.py
● Test suite failed to run

    Traceback (most recent call last):
      File "/app/src/utils/parser.py", line 47, in parse_config
        validated = schema.validate(raw_input)
                    ^^^^^^^^^^^^^^^^^^^^^^^^
      File "/app/src/utils/schema.py", line 12, in validate
        return self._enforce_types(data)
      File "/app/src/utils/schema.py", line 29, in _enforce_types
        raise TypeError(f"Expected dict, got {type(data).__name__}")
    TypeError: Expected dict, got NoneType

    During handling of the above exception, another exception occurred:

      File "/app/src/utils/parser.py", line 49, in parse_config
        fallback = self.defaults.get(key)
                   ^^^^^^^^^^^^^^^^^^^^^^
    AttributeError: 'NoneType' object has no attribute 'get'

Process exited with code 1
error Command failed with exit code 1.
npm ERR! Test failed. See above for more details.`;

export const mockBrokenCode = `def parse_config(self, raw_input, key=None):
    """Parse and validate configuration input."""
    try:
        validated = schema.validate(raw_input)
        return validated
    except TypeError:
        fallback = self.defaults.get(key)
        return fallback or {}`;

export const mockPatchedCode = `def parse_config(self, raw_input, key=None):
    """Parse and validate configuration input."""
    if raw_input is None:
        raw_input = {}
    try:
        validated = schema.validate(raw_input)
        return validated
    except (TypeError, AttributeError):
        if self.defaults is not None:
            fallback = self.defaults.get(key)
            return fallback if fallback else {}
        return {}`;

export const mockRootCause = `The function \`parse_config\` does not guard against a \`None\` value for the \`raw_input\` parameter before passing it to \`schema.validate()\`. When validation fails with a \`TypeError\`, the exception handler attempts to access \`self.defaults.get(key)\`, but \`self.defaults\` is also \`None\` during initialization edge cases, causing a cascading \`AttributeError\`.`;

export const mockJustification = `Added a null-guard at function entry to coerce \`None\` inputs to an empty dict. Extended the except clause to catch both \`TypeError\` and \`AttributeError\`. Added a defensive check on \`self.defaults\` before calling \`.get()\` to prevent the cascading null reference. Returns an empty dict as a safe fallback in all failure paths.`;

export const compilerLogs = [
  { text: '► Try 1/3: Executing local compiler checks...', type: 'info' as const, delay: 0 },
  { text: '  Running: python -m py_compile /tmp/medic_a3f7c21.py', type: 'muted' as const, delay: 800 },
  { text: '✖ SyntaxError: Unexpected indent on Line 4. Passing error trace back to Patch Agent.', type: 'error' as const, delay: 2000 },
  { text: '', type: 'muted' as const, delay: 2200 },
  { text: '► Try 2/3: Applying refined code mutations via AST engine...', type: 'info' as const, delay: 3000 },
  { text: '  Running: python -m py_compile /tmp/medic_a3f7c21.py', type: 'muted' as const, delay: 4000 },
  { text: '✔ Local Compilation Successful. Zero syntax defects detected.', type: 'success' as const, delay: 5500 },
  { text: '  AST node integrity verified. Code hash: sha256:e91b4f...', type: 'muted' as const, delay: 6200 },
  { text: '', type: 'muted' as const, delay: 6400 },
  { text: '✔ Validation complete. Patch approved for deployment.', type: 'success' as const, delay: 7000 },
];
