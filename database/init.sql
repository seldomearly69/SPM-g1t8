CREATE TYPE time as ('AM', 'PM')

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role INT REFERENCES roles(role_id),
    department INT REFERENCES departments(department_id), -- Department they belong to
);

CREATE TABLE roles (
    role_id INT PRIMARY KEY,
    name VARCHAR(20) NOT NULL
)

CREATE TABLE departments (
    department_id INT PRIMARY KEY,
    name VARCHAR(20) NOT NULL
)

CREATE TABLE wfh_requests (
    request_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE approvals (
    approval_id SERIAL PRIMARY KEY,
    request_id INT REFERENCES wfh_requests(request_id),
    approver_id INT REFERENCES users(user_id),
    approval_status VARCHAR(20) NOT NULL, -- 'approved', 'rejected', 'withdrawn'
    reason TEXT, -- optional reason for approval/rejection
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

