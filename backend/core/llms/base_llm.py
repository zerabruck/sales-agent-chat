from abc import ABC, abstractmethod
from typing import List, Dict, AsyncIterable

from core.models.llms.llm_streams import StreamEvent


class BaseLLM(ABC):
    EVENT_DATA_LIMIT = 50000

    @abstractmethod
    async def inference(self, messages: List[Dict[str, str]]):
        pass

    @abstractmethod
    async def async_stream_inference(
        self, messages: List[Dict[str, str]]
    ) -> AsyncIterable[StreamEvent]:
        pass

    @abstractmethod
    def bind_tools(self, tools: List):
        pass
