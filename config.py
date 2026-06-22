import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class AppSettings(BaseSettings):
    OPENAI_API_KEY: str = Field(default=...)
    GITHUB_TOKEN: str = Field(default=...)
    GITHUB_REPO: str = Field(default=...)
    LLM_MODEL: str = Field(default="gpt-4-turbo")
    MAX_HEALING_ATTEMPTS: int = Field(default=3)

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = AppSettings()