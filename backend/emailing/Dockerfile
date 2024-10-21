# Use an official Python runtime as a parent image
FROM python:3.8-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

RUN pip install pika
# Define environment variables for email credentials
# Replace these with your actual email and password or use Docker secrets for production environments
ENV EMAIL_USER=spmg1t8@gmail.com
ENV EMAIL_PASSWORD=xthxsgcdzikpmiyo

ENV FLASK_APP=app.py
# Run app.py when the container launches
CMD ["python", "app.py"]