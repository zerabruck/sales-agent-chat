import logging


def configure_logger(name: str) -> logging.Logger:
    """Configs logger with a custom name

    Args:
        name (str): A name for the logger

    Returns:
        logging.Logger: A configured logger object
    """
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)
    stream_handler = logging.StreamHandler()
    stream_handler.setLevel(logging.DEBUG)
    formatter = logging.Formatter(
        "%(asctime)s [%(processName)s: %(process)d] "
        + "[%(threadName)s: %(thread)d] [%(levelname)s] "
        + "%(name)s: %(message)s"
    )
    stream_handler.setFormatter(formatter)
    logger.addHandler(stream_handler)
    return logger
