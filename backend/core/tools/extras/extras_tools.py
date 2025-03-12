import json

from dotenv import load_dotenv

load_dotenv(override=True)



async def get_weather(city: str) -> str:
    """
    Function that provides current weather of a city.
    :param city: City name from which you want to retrieve the weather.
    :return: Weather of the city.
    """

    return f"The weather in {city} is 34°C"



async def get_dealership_address(dealership_id: str):
    """
    Function that provides the address of a dealership.
    :param dealership_id: ID of the dealership.
    :return: Address of the dealership.
    """

    return "5th Avenue, New York"


async def check_appointment_availability(dealership_id: str, date: str) -> str:
    """
    Function that checks available appointment slots at a specific agency for a given date.
    :param dealership_id: Unique identifier for the agency.
    :param date: Date in YYYY-MM-DD format.
    :return: List of available time slots.
    """
    response = [
        "10:00", "11:30", "13:00", "16:30", "17:45"
    ]
    # Mock implementation
    return json.dumps(f"```{response}```")


async def schedule_appointment(user_id: str, dealership_id: str, date: str, time: str, car_model: str) -> str:
    """
    Function that schedules a test drive appointment.
    :param user_id: Unique identifier for the user.
    :param dealership_id: Unique identifier for the agency.
    :param date: Date in YYYY-MM-DD format.
    :param time: Time slot in HH:MM format.
    :param car_model: Car model for the test drive.
    :return: Dictionary with appointment confirmation details.
    """
    # Mock implementation
    response = {
        "confirmacion_id": "SuperCar-123",
        "fecha": date,
        "hora": time,
        "modelo": car_model,
        "mensaje": "Cita agendada exitosamente"
    }
    return json.dumps(f"```{response}```")