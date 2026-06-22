from fastapi import FastAPI, BackgroundTasks, HTTPException, status
from pydantic import BaseModel, Field
from core.engine import PipelineOrchestrator
import uvicorn

app = FastAPI(
    title="BuildMedic AI Platform",
    description="Production-grade Autonomous Pipeline Self-Healing Engine",
    version="2.0.0"
)

class WebhookBuildPayload(BaseModel):
    commit_sha: str = Field(..., description="Target commit SHA that triggered the failure")
    branch: str = Field(..., description="Target git reference branch")
    error_log: str = Field(..., description="Raw build log console output stream")

@app.post("/v2/webhook/build-failed", status_code=status.HTTP_202_ACCEPTED)
async def inbound_pipeline_failure_trigger(payload: WebhookBuildPayload, background_tasks: BackgroundTasks):
    """
    Ingests infrastructure build failures and spins up an async worker thread 
    to handle code parsing, AST manipulation, and autonomous recovery.
    """
    orchestrator = PipelineOrchestrator()
    background_tasks.add_task(
        orchestrator.execute_healing_lifecycle,
        payload.commit_sha,
        payload.branch,
        payload.error_log
    )
    return {"status": "Processing asynchronously", "target_commit": payload.commit_sha}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)