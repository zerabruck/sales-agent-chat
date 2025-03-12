from typing import Dict, List, Union

from core.models.chat_message import Message, ChatMessage, AssistantMessage, ToolMessage


class ChatHistory:
    def __init__(self):
        self.history: List[Message] = []

    def add_message(self, message: Message):
        self.history.append(message)

    def add_user_message(self, content: str):
        self.add_message(ChatMessage(role="user", content=content))

    def add_tool_calls_message(self, content, tool_calls):
        self.add_message(ChatMessage(role="assistant", content=content, tool_calls=tool_calls))

    def add_system_message(self, content: str):
        self.add_message(ChatMessage(role="system", content=content))

    def add_assistant_message(
            self, content: Union[str, List[Dict[str, Union[str, Dict[str, str]]]]]
    ):
        self.add_message(AssistantMessage(role="assistant", content=content))

    def add_function_message(self, name: str, content: str, tool_call_id: str):
        self.add_message(ToolMessage(name=name, content=content, tool_call_id=tool_call_id))

    def get_history(self) -> List[Message]:
        return self.history

    def clear_history(self):
        self.history = []

    @property
    def messages(self) -> List[dict]:
        return [message.model_dump(exclude_none=True) for message in self.history]
