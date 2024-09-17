# Use the official PostgreSQL image as the base
FROM postgres:14

# Copy the initialization SQL file into the Docker entrypoint directory
COPY init.sql /docker-entrypoint-initdb.d/
COPY employee.csv /tmp/employee.csv

# Expose the PostgreSQL port
EXPOSE 5432