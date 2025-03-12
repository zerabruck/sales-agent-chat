from typing import Any, Literal, Optional, Union, List, Dict

from pydantic import BaseModel


class ChatMessage(BaseModel):
    role: Literal["system", "user", "assistant", "function"]
    content: Union[str, List[Dict[str, Union[Any, Dict[str, Any]]]]]
    name: Optional[str] = None
    tool_calls: Optional[Any] = None
    tool_call_id: Optional[str] = None


class ToolCall(BaseModel):
    name: str
    arguments: Any


class ToolUse(BaseModel):
    type: Literal["tool_use"] = "tool_use"
    id: str
    name: str
    input: Dict[str, Any]


class AssistantMessage(ChatMessage):
    function_call: Optional[ToolCall] = None


class ToolMessage(ChatMessage):
    role: Literal["tool"] = "tool"
    name: str
    tool_call_id: str


Message = Union[ChatMessage, AssistantMessage, ToolMessage]
