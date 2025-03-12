from datetime import datetime


def get_fecha_formateada():
    fecha_actual = datetime.now()
    return fecha_actual.strftime("%A, %B %d, %Y")
