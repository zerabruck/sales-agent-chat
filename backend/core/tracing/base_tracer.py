# tracing/base_trace.py

from abc import ABC


class BaseTracer(ABC):

    def start_trace(self, **kwargs):
        pass

    def get_current_trace(self, **kwargs):
        pass

    def start_span(self, **kwargs):
        pass

    def start_generation(self, **kwargs):
        pass

    def log_event(self, **kwargs):
        pass

    def update_trace(self, **kwargs):
        pass

    def end_generation(self, **kwargs):
        pass
