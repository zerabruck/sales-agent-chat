import json
from typing import Any, AsyncGenerator, List, Dict

from core.chat_history import ChatHistory
from core.models.llms.llm_streams import GatheredEvent, StreamEvent, StreamEventTypes
from core.tracing.tracer_factory import TracerFactory
from core.utilities.config import Config
from core.utilities.logger import configure_logger
from langchain_openai import ChatOpenAI

from .base_llm import BaseLLM

config = Config()
tracer = TracerFactory(config).create_tracer()
logger = configure_logger(__name__)


class OpenAILLM(BaseLLM):
    """
    A class representing a Bedrock Large Language Model (LLM).
    This class extends the BaseLLM and provides specific implementation for Amazon Bedrock.
    """

    def __init__(self, config: Config):
        """
        Initialize the BedrockLLM instance.

        Args:
            config (Config): Configuration object containing necessary parameters.
        """
        self._validate_config(config)
        self.llm = self._create_llm(config)
        print(self.llm)

        self.tool_map = {}

    def _validate_config(self, config: Config):
        """
        Validate the configuration for Bedrock LLM.

        Args:
            config (Config): Configuration object to validate.

        Raises:
            ValueError: If any required configuration key is missing.
        """
        required_keys = [
            # "aws_region",
            # "aws_access_key_id",
            # "aws_secret_access_key",
            # "model_id",
        ]
        for key in required_keys:
            if key not in config or not config[key]:
                raise ValueError(f"{key} is required for Bedrock LLM.")

    def _create_llm(self, config: Config):
        """
        Create and return a ChatBedrock instance.

        Args:
            config (Config): Configuration object containing necessary parameters.

        Returns:
            OpenAIChat: An instance of OpenAIChat.
        """
        return ChatOpenAI(
            model=config["model_id"],
            temperature=0,
            max_tokens=None,
            timeout=None,
            max_retries=2,
            # api_key="...",  # if you prefer to pass api key in directly instaed of using env vars
            # base_url="...",
            # organization="...",
            # other params...
        )

    @property
    def model(self):
        """
        Get the model ID of the LLM.

        Returns:
            str: The model ID.
        """
        # return self.llm.model
        return "gpt-4o"

    async def inference(self, messages: List[Dict[str, str]]):
        """
        Perform inference using the LLM.

        Args:
            messages (List[Dict[str, str]]): List of message dictionaries.

        Returns:
            Any: The result of the inference.
        """
        return await self.llm.ainvoke(messages)

    async def async_stream_inference(
            self, chat_history: ChatHistory
    ) -> AsyncGenerator[dict, None]:
        """
        Perform asynchronous streaming inference.

        Args:
            messages (List[Dict[str, Any]]): List of message dictionaries.

        Yields:
            dict: Stream events during inference.
        """

        while True:
            generation_trace = tracer.start_generation(
                name="LLM", input=chat_history.messages, model=self.model
            )

            gathered = None
            async for event in self._generate_chunks_and_gather(chat_history.messages):
                if isinstance(event, GatheredEvent):
                    gathered = event.data
                elif isinstance(event, StreamEvent):
                    yield event

            if not gathered:
                return

            if gathered.get("tool_calls"):
                chat_history.add_tool_calls_message(content=gathered["content"], tool_calls=gathered["tool_calls"])
            else:
                if gathered.get("content"):
                    chat_history.add_assistant_message(gathered["content"])


            generation_trace.update(output=gathered)
            tracer.end_generation(generation_trace)
            tracer.update_trace(output=gathered)

            tool_uses = await self._check_if_tool_uses(gathered)

            logger.debug(f"Tool uses: {tool_uses}")

            if not tool_uses:
                break

            for tool_use in tool_uses:

                yield StreamEvent(
                    event=StreamEventTypes.TOOL_USE,
                    data=tool_use["name"],
                )

                async for chunk in self._process_tool_call(tool_use, chat_history):
                    yield chunk

    async def _generate_chunks_and_gather(self, messages):
        """
        Generate chunks and gather them into a complete response.

        Args:
            messages (List[Dict[str, Any]]): List of message dictionaries.

        Yields:
            Union[StreamEvent, GatheredEvent]: Stream events or gathered event.
        """
        gathered = None

        async for chunk in self.llm.astream(messages):
            if gathered is None:
                gathered = chunk
            else:
                gathered = gathered + chunk

            yield StreamEvent(
                event=StreamEventTypes.CHUNK, data=self._extract_chunk_content(chunk)
            )

        processed_gathered = self._process_gathered(gathered)
        yield GatheredEvent(event=StreamEventTypes.GATHERED, data=processed_gathered)

    def _extract_chunk_content(self, chunk):
        """
        Extract the content from a chunk.

        Args:
            chunk (Any): The chunk to extract content from.

        Returns:
            str: The extracted content.
        """
        if isinstance(chunk.content, list) and chunk.content:
            return chunk.content[0].get("text", "")
        elif isinstance(chunk.content, str):
            return chunk.content
        else:

            logger.warning(
                f"Unexpected chunk content |{chunk}| of type: {type(chunk.content)}"
            )
            return ""

    def _process_gathered(self, gathered) -> Dict[str, Any]:
        """
        Process the gathered content.

        Args:
            gathered (Any): The gathered content to process.

        Returns:
            Dict[str, Any]: Processed content as a dictionary.
        """
        processed_content = []

        if gathered.content:
            processed_content.append({"type": "text", "text": gathered.content})

        if gathered.tool_calls:
            return {"role": "assistant", "content": processed_content, "tool_calls": gathered.tool_calls}
            # for tool_call in gathered.tool_calls:
            #     processed_content.append(
            #         ToolUse(
            #             id=tool_call["id"],
            #             name=tool_call["name"],
            #             input=tool_call["args"],
            #         ).model_dump()
            #     )

        return {"role": "assistant", "content": processed_content}

    async def _check_if_tool_uses(self, gathered):
        """
        Check if the gathered content contains tool uses.

        Args:
            gathered (Dict[str, Any]): The gathered content to check.

        Returns:
            List[Dict[str, Any]]: List of tool uses found in the gathered content.
        """
        tool_uses = []

        if gathered.get("tool_calls"):
            tool_uses = gathered["tool_calls"]

        return tool_uses

    async def _process_tool_call(self, tool_call, chat_history: ChatHistory):
        """
        Process a tool call.

        Args:
            tool_call (Dict[str, Any]): The tool call to process.
            messages (List[Dict[str, Any]]): List of message dictionaries.

        Yields:
            StreamEvent: Stream event containing tool output.
        """
        selected_tool = self.tool_map[tool_call["name"]]
        arguments = tool_call["args"]
        tool_output = await selected_tool.coroutine(**arguments)

        chat_history.add_function_message(
            name=tool_call["name"],
            content=tool_output,
            tool_call_id=tool_call["id"],
        )

        print("***debug***")

        print(json.dumps(chat_history.messages, indent=2))

        print("***debug***")

        event_tool_output = (
            tool_output[: self.EVENT_DATA_LIMIT]
            if len(tool_output) > self.EVENT_DATA_LIMIT
            else tool_output
        )



        yield StreamEvent(
            event=StreamEventTypes.TOOL_OUTPUT,
            data=json.dumps(
                {
                    "output": event_tool_output,
                    "name": tool_call["name"],
                }
            ),
        )

    def bind_tools(self, tools: List):
        """
        Bind tools to the LLM.

        Args:
            tools (List): List of tools to bind.
        """
        self.tool_map = {tool.name: tool for tool in tools}
        self.llm = self.llm.bind_tools(tools)
