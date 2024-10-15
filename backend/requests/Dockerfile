FROM python:3.9-slim

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

# Install cron
RUN apt-get update && apt-get install -y cron

# Copy your cron job configuration into the container
COPY crontab /etc/cron.d/mycron

# Give execution rights on the cron job file
RUN chmod 0644 /etc/cron.d/mycron

# Apply the cron job
RUN crontab /etc/cron.d/mycron

RUN chmod a+x /app/autoreject.py

ENTRYPOINT ["/bin/bash", "-c", "cron & python app.py"]

