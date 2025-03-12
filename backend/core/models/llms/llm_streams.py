from enum import Enum
from typing import Any

from pydantic import BaseModel


class StreamEventTypes(str, Enum):
    CHUNK = "chunk"
    GATHERED = "gathered"
    TOOL_USE = "tool_use"
    TOOL_OUTPUT = "tool_output"
    REFERENCE = "reference"
    END = "end"
    ERROR = "error"


class StreamEvent(BaseModel):
    event: str
    data: str


class GatheredEvent(BaseModel):
    event: str
    data: Any
