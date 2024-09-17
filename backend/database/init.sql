DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- CREATE TYPE time as ('AM', 'PM')

CREATE TABLE roles (
    role_id INT PRIMARY KEY,
    name VARCHAR(20) NOT NULL
);

CREATE TABLE users (
    Staff_ID INT PRIMARY KEY,
    Staff_FName VARCHAR(50) NOT NULL,
    Staff_LName VARCHAR(50) NOT NULL,
    Dept Varchar (50) NOT NULL,
    Position Varchar(50) NOT NULL,
    Country Varchar(50) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Reporting_Manager INT REFERENCES users(Staff_ID),
    Role INT REFERENCES roles(role_id),
    Password VARCHAR(255) NOT NULL DEFAULT encode(digest('password123', 'sha256'), 'hex')
);



INSERT INTO roles VALUES 
    (1, 'HR'),
    (2, 'Staff'),
    (3, 'Manager');

COPY users (Staff_ID, Staff_FName, Staff_LName, Dept, Position, Country, Email, Reporting_Manager, Role)
FROM '/tmp/employee.csv'
DELIMITER ','
CSV HEADER;

-- CREATE TABLE departments (
--     department_id INT PRIMARY KEY,
--     name VARCHAR(20) NOT NULL
-- )

-- CREATE TABLE wfh_requests (
--     request_id SERIAL PRIMARY KEY,
--     user_id INT REFERENCES users(user_id),
--     start_date DATE NOT NULL,
--     end_date DATE NOT NULL,
--     status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE approvals (
--     approval_id SERIAL PRIMARY KEY,
--     request_id INT REFERENCES wfh_requests(request_id),
--     approver_id INT REFERENCES users(user_id),
--     approval_status VARCHAR(20) NOT NULL, -- 'approved', 'rejected', 'withdrawn'
--     reason TEXT, -- optional reason for approval/rejection
--     action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

