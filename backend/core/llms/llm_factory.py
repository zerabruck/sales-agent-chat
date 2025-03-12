from .base_llm import BaseLLM
from .bedrock_llm import BedrockLLM
from .groq_llm import GroqLLM
from .openai_llm import OpenAILLM


class LLMFactory:
    @staticmethod
    def create_llm(llm_type: str, config: dict) -> BaseLLM:
        if llm_type == "bedrock":

            return BedrockLLM(config)
        elif llm_type == "openai":
            return OpenAILLM(config)
        elif llm_type == "groq":
            return GroqLLM(config)
        else:
            raise ValueError(f"Unsupported LLM type: {llm_type}")
