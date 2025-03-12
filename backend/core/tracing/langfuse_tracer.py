import os
from contextvars import ContextVar
from typing import Any, Dict, Optional, List

from langfuse import Langfuse

from core.tracing.base_tracer import BaseTracer

current_trace_var = ContextVar("current_trace", default=None)
current_span_stack_var = ContextVar("current_span_stack", default=[])


class LangfuseTracer(BaseTracer):
    def __init__(
        self,
        secret_key: Optional[str] = None,
        public_key: Optional[str] = None,
        host: Optional[str] = None,
        release: Optional[str] = None,
        debug: Optional[bool] = None,
        threads: Optional[int] = None,
        max_retries: Optional[int] = None,
        timeout: Optional[int] = None,
        sample_rate: Optional[float] = None,
    ):
        self.langfuse = Langfuse(
            secret_key=secret_key or os.getenv("LANGFUSE_SECRET_KEY"),
            public_key=public_key or os.getenv("LANGFUSE_PUBLIC_KEY"),
            host=host or os.getenv("LANGFUSE_HOST", "https://cloud.langfuse.com"),
            release=release or os.getenv("LANGFUSE_RELEASE"),
            debug=debug or bool(os.getenv("LANGFUSE_DEBUG", False)),
            threads=threads or int(os.getenv("LANGFUSE_THREADS", 1)),
            max_retries=max_retries or int(os.getenv("LANGFUSE_MAX_RETRIES", 3)),
            timeout=timeout or int(os.getenv("LANGFUSE_TIMEOUT", 20)),
            sample_rate=sample_rate or float(os.getenv("LANGFUSE_SAMPLE_RATE", 1.0)),
        )

    def start_trace(
        self,
        name: str,
        id: Optional[str] = None,
        input: Optional[Any] = None,
        output: Optional[Any] = None,
        metadata: Optional[Dict[str, Any]] = None,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
        version: Optional[str] = None,
        release: Optional[str] = None,
        tags: Optional[List[str]] = None,
        public: Optional[bool] = None,
    ):
        trace = self.langfuse.trace(
            name=name,
            id=id,
            input=input,
            output=output,
            metadata=metadata,
            user_id=user_id,
            session_id=session_id,
            version=version,
            release=release,
            tags=tags,
            public=public,
        )
        # Set the current trace in the ContextVar
        current_trace_var.set(trace)
        # Initialize the current span stack
        current_span_stack_var.set([])
        return trace

    def get_current_trace(self):
        trace = current_trace_var.get()
        if trace is None:
            raise ValueError("No current trace is set.")
        return trace

    def update_trace(self, output):
        trace = self.get_current_trace()
        self.langfuse.trace(id=trace.id, output=output)

    def start_span(
        self,
        name: str,
        id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        level: Optional[str] = None,
        status_message: Optional[str] = None,
        input: Optional[Any] = None,
        output: Optional[Any] = None,
        version: Optional[str] = None,
    ):
        trace = self.get_current_trace()
        span_stack = current_span_stack_var.get()

        if span_stack:
            parent_span = span_stack[-1]
            parent_observation_id = parent_span.id
        else:
            parent_observation_id = None

        span = trace.span(
            name=name,
            id=id,
            parent_observation_id=parent_observation_id,
            metadata=metadata,
            level=level,
            status_message=status_message,
            input=input,
            output=output,
            version=version,
        )

        # Push the new span onto the stack
        span_stack.append(span)
        current_span_stack_var.set(span_stack)
        return span

    def end_span(self, span):
        span_stack = current_span_stack_var.get()
        if not span_stack:
            raise ValueError("No span to end.")
        # Pop the span from the stack
        popped_span = span_stack.pop()
        current_span_stack_var.set(span_stack)
        # Ensure that the popped span is the one we intend to end
        if popped_span != span:
            raise ValueError("Span mismatch when ending span.")
        # End the span
        span.end()
        return span

    def start_generation(
        self,
        name: str,
        model: Optional[str] = None,
        model_parameters: Optional[Dict[str, Any]] = None,
        id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        level: Optional[str] = None,
        status_message: Optional[str] = None,
        input: Optional[Any] = None,
        output: Optional[Any] = None,
        usage: Optional[Dict[str, Any]] = None,
        version: Optional[str] = None,
    ):
        trace = self.get_current_trace()
        span_stack = current_span_stack_var.get()

        if span_stack:
            parent_span = span_stack[-1]
            parent_observation_id = parent_span.id
        else:
            parent_observation_id = None

        generation = trace.generation(
            name=name,
            model=model,
            model_parameters=model_parameters,
            id=id,
            parent_observation_id=parent_observation_id,
            metadata=metadata,
            level=level,
            status_message=status_message,
            input=input,
            output=output,
            usage=usage,
            version=version,
        )

        # Push the new generation onto the stack
        span_stack.append(generation)
        current_span_stack_var.set(span_stack)
        return generation

    def end_generation(self, generation):
        span_stack = current_span_stack_var.get()
        if not span_stack:
            raise ValueError("No generation to end.")
        # Pop the generation from the stack
        popped_generation = span_stack.pop()
        current_span_stack_var.set(span_stack)
        # Ensure that the popped generation is the one we intend to end
        if popped_generation != generation:
            raise ValueError("Generation mismatch when ending generation.")
        # End the generation
        generation.end()
        return generation

    def log_event(
        self,
        name: str,
        id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        level: Optional[str] = None,
        status_message: Optional[str] = None,
        input: Optional[Any] = None,
        output: Optional[Any] = None,
        version: Optional[str] = None,
    ):
        trace = self.get_current_trace()
        span_stack = current_span_stack_var.get()

        if span_stack:
            parent_span = span_stack[-1]
            parent_observation_id = parent_span.id
        else:
            parent_observation_id = None

        event = trace.event(
            name=name,
            id=id,
            parent_observation_id=parent_observation_id,
            metadata=metadata,
            level=level,
            status_message=status_message,
            input=input,
            output=output,
            version=version,
        )
        return event

    def update_trace(self, **kwargs):
        trace = self.get_current_trace()
        trace.update(**kwargs)
