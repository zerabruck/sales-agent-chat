import os

from core.tracing.base_tracer import BaseTracer
from core.tracing.langfuse_tracer import LangfuseTracer
from core.utilities.config import Config


class TracerFactory:
    def __init__(self, config: Config):
        self.tracing_config = config.get_tracing_config()

    def create_tracer(self) -> BaseTracer:
        tracer_type = self.tracing_config["type"]
        tracer_config = self.tracing_config.get("config", {})

        if tracer_type == "langfuse":
            return self._create_langfuse_tracer(tracer_config)
        else:
            raise ValueError(f"Unsupported tracer type: {tracer_type}")

    def _create_langfuse_tracer(self, config):
        secret_key = os.getenv("LANGFUSE_SECRET_KEY")
        public_key = os.getenv("LANGFUSE_PUBLIC_KEY")
        host = os.getenv("LANGFUSE_HOST")

        return LangfuseTracer(secret_key=secret_key, public_key=public_key, host=host)
