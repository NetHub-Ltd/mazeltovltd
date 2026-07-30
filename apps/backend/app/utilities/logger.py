
from loguru import logger
from pathlib import Path
import sys

# Create logs directory if it doesn't exist
LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)

LOG_FILE = LOG_DIR / "app.log"

# Remove default logger
logger.remove()

# Console handler (human-readable format)
logger.add(
    sys.stdout,
    level="INFO",
    format="<green>{level}</green>:     <green>{time:YYYY-MM-DD HH:mm:ss}</green> - <cyan>{name}:{function}:{"
           "line}</cyan> - <level>{message}</level>"
)

# File handler (JSON format using serialize=True)
logger.add(
    LOG_FILE,
    rotation="5 MB",
    retention="10 days",
    level="INFO",
    serialize=True,       # ✅ Structured JSON logs
    encoding="utf-8",
    enqueue=True
)

# Create the logger instance
log = logger
