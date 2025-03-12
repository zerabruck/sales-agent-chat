import contextvars

from contextvars import ContextVar

trace_context = contextvars.ContextVar("trace_context", default=None)

username = ContextVar("username", default=None)

clickup_token = ContextVar("clickup_token", default=None)
clickup_user_id = ContextVar("clickup_user_id", default=None)
