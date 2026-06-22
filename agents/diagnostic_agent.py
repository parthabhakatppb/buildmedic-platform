import json
from pydantic import BaseModel, Field
from openai import OpenAI
from config import settings

class LogAnalysisReport(BaseModel):
    is_actionable: bool = Field(description="True if the error is localized to code logic anomalies")
    file_path: str = Field(description="The exact localized file path targeted by the compiler drop")
    target_scope: str = Field(description="The functional component name or method identifier containing the defect")
    error_signature: str = Field(description="Isolated concise runtime exception or compilation message string")
    root_cause_analysis: str = Field(description="Comprehensive technical analysis of the root failure condition")

class DiagnosticAgent:
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)

    def analyze(self, raw_logs: str) -> LogAnalysisReport:
        system_prompt = "You are an expert DevOps engineer parsing raw pipeline server logs. Isolate the target codebase failure down to a single function block."
        
        response = self.client.beta.chat.completions.parse(
            model=settings.LLM_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Parse the following console logs:\n{raw_logs}"}
            ],
            response_format=LogAnalysisReport
        )
        return response.choices[0].message.parsed