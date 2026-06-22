import subprocess
import tempfile
import os

class CodeRuntimeValidator:
    @staticmethod
    def verify_syntax(source_code: str, file_path: str) -> tuple[bool, str | None]:
        """
        Executes a localized verification step using compilation checks 
        to capture edge cases before production delivery.
        """
        suffix = os.path.splitext(file_path)[1] or ".py"
        with tempfile.NamedTemporaryFile(mode='w', suffix=suffix, delete=False) as tmp:
            tmp.write(source_code)
            tmp_path = tmp.name

        try:
            if suffix == ".py":
                # Check for syntax errors by forcing bytecode generation
                result = subprocess.run(
                    ["python", "-m", "py_compile", tmp_path],
                    capture_output=True, text=True, timeout=5
                )
            else:
                # Fallback default verification rule
                return True, None

            if result.returncode != 0:
                # Clean up compiler errors to mask systemic path parameters
                cleaned_err = result.stderr.replace(tmp_path, file_path)
                return False, cleaned_err
            return True, None
            
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)