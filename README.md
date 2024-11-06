

# Backend
Tech stack:
- Flask - Python framework
- SQLAlchemy - ORM
- GraphQL - API
- S3 - File storage
- RabbitMQ - Message queue


# Frontend
Tech stack:
- Next.js - React framework
- TailwindCSS - Styling
- Shadcn/UI - Component library


## Getting Started

First, run the backend server:

```bash
docker compose up --build
```

Next, run the frontend server:
```bash
cd frontend
npm run dev

```

Next, set up environment variables:
- Create a `.env` file in the root directory and add the following:
```bash
POSTGRES_USER={your_username}
POSTGRES_PASSWORD={your_password}
POSTGRES_DB={your_database_name}
AWS_ACCESS_KEY_ID={your_access_key_id}
AWS_SECRET_ACCESS_KEY={your_secret_access_key}
```
- Get environment variables from file provided by our team
- Use any another network except for SMU Wifi



Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

