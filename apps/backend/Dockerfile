FROM python:3.12-slim
LABEL maintainer="Davie Karanja"

WORKDIR /app
# Create non-root user
RUN adduser --disabled-password --gecos "" appuser
# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# Install gunicorn separately (not in requirements.txt)
RUN pip install --no-cache-dir gunicorn
# Copy app code
COPY . .
# Change ownership to non-root
RUN chown -R appuser:appuser /app
USER appuser
# Expose port
EXPOSE 8000
# Environment for gunicorn config

# START WITH UVICORN
CMD ["fastapi", "run"]