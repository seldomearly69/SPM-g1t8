# Use the official RabbitMQ base image
FROM rabbitmq:3.11-management

# Expose ports for RabbitMQ
# - 5672: RabbitMQ main port (AMQP protocol)
# - 15672: RabbitMQ management web UI
EXPOSE 5672 15672

# Optional: Set environment variables to configure RabbitMQ
# For example, you can configure a default user and password
ENV RABBITMQ_DEFAULT_USER=username
ENV RABBITMQ_DEFAULT_PASS=password

# Optional: Enable RabbitMQ plugins
# The management plugin is already included in the -management image
RUN rabbitmq-plugins enable --offline rabbitmq_management

# Optional: Add custom configuration if needed (rabbitmq.conf or advanced.config)
COPY rabbitmq.config /etc/rabbitmq/rabbitmq.config
COPY rabbitmq_definitions.json /etc/rabbitmq/rabbitmq_definitions.json

# Set the entrypoint to RabbitMQ's default command
CMD ["rabbitmq-server"]