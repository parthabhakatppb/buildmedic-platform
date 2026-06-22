from config import settings
from github_service import GitHubClient
from agents.diagnostic_agent import DiagnosticAgent
from agents.patch_agent import PatchAgent
from core.ast_mutator import apply_ast_patch
from core.validator import CodeRuntimeValidator

class PipelineOrchestrator:
    def __init__(self):
        self.gh = GitHubClient(settings.GITHUB_REPO, settings.GITHUB_TOKEN)
        self.diagnostic_agent = DiagnosticAgent()
        self.patch_agent = PatchAgent()

    def execute_healing_lifecycle(self, sha: str, branch: str, error_log: str):
        # 1. Parse log stream to identify core issue
        diagnosis = self.diagnostic_agent.analyze(error_log)
        if not diagnosis.is_actionable:
            print("❌ Failure state is outside of actionable boundaries. Aborting.")
            return

        # 2. Extract original codebase components
        original_code = self.gh.pull_file(diagnosis.file_path, branch)
        current_error_context = diagnosis.error_signature
        working_code = original_code
        
        attempt = 0
        is_valid = False
        compiler_feedback = None

        # 3. Enter Self-Correction Loop
        while attempt < settings.MAX_HEALING_ATTEMPTS and not is_valid:
            print(f"🔄 Healing iteration loop running: Try {attempt + 1}/{settings.MAX_HEALING_ATTEMPTS}")
            
            # Generate target block patch structure
            raw_patch = self.patch_agent.generate_fix(
                file_context=working_code,
                target_function=diagnosis.target_scope,
                error_context=current_error_context,
                previous_feedback=compiler_feedback
            )

            try:
                # Execute automated AST injection sequence
                working_code = apply_ast_patch(original_code, diagnosis.target_scope, raw_patch.reconstructed_node)
                
                # Verify stability against local compilation
                is_valid, compiler_feedback = CodeRuntimeValidator.verify_syntax(working_code, diagnosis.file_path)
            except Exception as ast_err:
                is_valid = False
                compiler_feedback = str(ast_err)

            if not is_valid:
                current_error_context = f"AST Patch Verification Failed: {compiler_feedback}"
                attempt += 1

        if not is_valid:
            print("❌ Maximum iteration exhaustion reached. Patch validation unsuccessful.")
            return

        # 4. Generate automated deployment payload
        target_patch_branch = f"medic/auto-heal-{sha[:7]}"
        self.gh.provision_branch(target_patch_branch, sha)
        self.gh.stage_and_commit(
            path=diagnosis.file_path,
            content=working_code,
            branch=target_patch_branch,
            msg=f"BuildMedic Autonomous Correction [Target: {diagnosis.target_scope}]"
        )
        self.gh.launch_pull_request(
            title=f"🩹 BuildMedic AI: Self-Healed Component inside `{diagnosis.file_path}`",
            body=f"### Automated Self-Correction Resolution Summary\n* **Target Component:** `{diagnosis.target_scope}`\n* **Root Cause Structural Analysis:** {diagnosis.root_cause_analysis}\n* **Validation Strategy:** Locally verified compilation completed successfully.",
            head=target_patch_branch,
            base=branch
        )
        print(f"🎉 Codebase repaired successfully. Pull Request opened on {target_patch_branch}.")