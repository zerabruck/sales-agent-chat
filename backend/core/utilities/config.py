import os
from pathlib import Path

import yaml
from dotenv import load_dotenv


class Config:
    def __init__(self, config_filename="config.yaml"):
        config_file = Path(__file__).resolve()
        project_root = config_file.parents[1]
        config_path = project_root / config_filename

        if not config_path.is_file():
            raise FileNotFoundError(f"Configuration file not found: {config_path}")

        with open(config_path, "r") as f:
            config = yaml.safe_load(f)

        self.llms_config = config.get("llms", {})
        print(self.llms_config)
        self.storage_config = config.get("storage", {})
        self.tracing_config = config.get("llm-tracing", {})
        self._load_secrets()

    def _load_secrets(self):
        load_dotenv(override=True)

        for llm_key, llm_config in self.llms_config.items():
            llm_type = llm_config.get("type")
            if llm_type == "bedrock":
                llm_config["aws_access_key_id"] = os.getenv("AWS_ACCESS_KEY_ID")
                llm_config["aws_secret_access_key"] = os.getenv("AWS_SECRET_ACCESS_KEY")
                llm_config["aws_region"] = llm_config.get(
                    "aws_region", os.getenv("AWS_REGION", "us-east-1")
                )
            elif llm_type == "openai":
                llm_config["api_key"] = os.getenv("OPENAI_API_KEY")
            # Update the configuration
            self.llms_config[llm_key] = llm_config

    def get_llm_config(self, llm_key):
        return self.llms_config.get(llm_key)

    def get_storage_config(self, storage_key):
        return self.storage_config.get(storage_key)

    def get_tracing_config(self):
        return self.tracing_config
