from core.tracing.tracer_factory import TracerFactory
from core.utilities.config import Config
from langchain.tools import tool

config = Config()
tracer = TracerFactory(config).create_tracer()

tool_registry = []


def register_tool(func):
    # Decorate the function with @tool
    decorated_func = tool(func)

    # Add the decorated function to the list
    tool_registry.append(decorated_func)
    return decorated_func


from core.tools.extras.extras_tools import get_weather, get_dealership_address, check_appointment_availability, schedule_appointment

register_tool(get_weather)
register_tool(get_dealership_address)
register_tool(check_appointment_availability)
register_tool(schedule_appointment)





