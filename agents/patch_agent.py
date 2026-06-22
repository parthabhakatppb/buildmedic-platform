from pydantic import BaseModel, Field
from openai import OpenAI
from config import settings

class SyntacticPatchSpecification(BaseModel):
    reconstructed_node: str = Field(description="The full corrected function block code string")
    architectural_justification: str = Field(description="Technical rationale behind structural logic modifications")

class PatchAgent:
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)

    def generate_fix(self, file_context: str, target_function: str, error_context: str, previous_feedback: str | None) -> SyntacticPatchSpecification:
        prompt = (
            f"Target Method Context to Fix: {target_function}\n"
            f"Exception State: {error_context}\n"
            f"Full Source Code Context:\n```\n{file_context}\n```\n"
        )
        if previous_feedback:
            prompt += f"\nCRITICAL: Your previous patch failed validation with this error:\n{previous_feedback}\nCorrect your approach."

        response = self.client.beta.chat.completions.parse(
            model=settings.LLM_MODEL,
            messages=[
                {"role": "system", "content": "You are a specialized AI source patch engine. Output structural code modifications. Do not include markdown wraps in your code output."},
                {"role": "user", "content": prompt}
            ],
            response_format=SyntacticPatchSpecification
        )
        return response.choices[0].message.parsed