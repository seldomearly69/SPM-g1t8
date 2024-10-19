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

CREATE TABLE requests (
    Request_id SERIAL PRIMARY KEY,
    Requesting_staff INT REFERENCES users(Staff_ID),
    Year INT NOT NULL,
    Month INT NOT NULL,
    Day INT NOT NULL,
    Type VARCHAR(4) NOT NULL,
    Status VARCHAR(8) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    Approving_manager INT REFERENCES users(Staff_ID),
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    Reason VARCHAR(300),
    Remarks VARCHAR(300)
);

CREATE TABLE files(
    File_name VARCHAR(100) NOT NULL,
    File_key VARCHAR(100) PRIMARY KEY
);

CREATE TABLE file_request_assoc (
    Request_id INT REFERENCES requests(request_id),
    File_key VARCHAR(100) REFERENCES files(File_key),
    PRIMARY KEY (Request_id, File_key)
);

INSERT INTO roles VALUES 
    (1, 'HR'),
    (2, 'Staff'),
    (3, 'Manager');

COPY users (Staff_ID, Staff_FName, Staff_LName, Dept, Position, Country, Email, Reporting_Manager, Role)
FROM '/tmp/employee.csv'
DELIMITER ','
CSV HEADER;
INSERT INTO requests (Requesting_staff, Year, Month, Day, Type, Status, Approving_manager, Reason, Remarks) VALUES
(130002, 2024, 1, 15, 'AM', 'approved', 130002, 'Urgent medical appointment', 'Approved for morning leave due to doctors visit'), 
(140001, 2024, 2, 10, 'PM', 'pending', 130002, 'Client meeting scheduled', ''), 
(150008, 2024, 3, 5, 'FULL', 'rejected', 130002, 'Team project nearing deadline', 'Rejected due to critical project deadline'), 
(151408, 2024, 4, 25, 'AM', 'approved', 130002, 'Childs school event', 'Morning leave approved for attending childs school event'), 
(140894, 2024, 5, 30, 'PM', 'pending', 140001, 'Family commitment in the afternoon', ''), 
(130002, 2024, 6, 10, 'FULL', 'approved', 130002, 'Family event scheduled', 'Approved for full day leave for family event'), 
(140001, 2024, 7, 22, 'PM', 'rejected', 130002, 'Overlapping with other team leave requests', 'Leave request rejected due to team shortage'), 
(150008, 2024, 8, 18, 'FULL', 'approved', 130002, 'Annual vacation planned', 'Approved for vacation'), 
(151408, 2024, 9, 12, 'AM', 'pending', 130002, 'Client presentation prep', ''), 
(140894, 2024, 10, 3, 'PM', 'approved', 140001, 'Urgent personal matter', 'Approved for personal matters'), 
(130002, 2024, 11, 14, 'FULL', 'pending', 130002, 'Relatives visiting from overseas', ''), 
(140001, 2024, 12, 1, 'AM', 'approved', 130002, 'Scheduled medical appointment', 'Morning leave approved for medical appointment'), 
(150008, 2024, 1, 19, 'PM', 'rejected', 130002, 'Team critical tasks on same day', 'Rejected due to overlapping leave requests'), 
(151408, 2024, 2, 8, 'FULL', 'approved', 130002, 'Annual family holiday', 'Approved for annual leave'), 
(140894, 2024, 3, 23, 'AM', 'pending', 140001, 'Morning family commitment', ''), 
(140941, 2024, 11, 23, 'AM', 'pending', 140879, 'Doctors appointment scheduled', ''), 
(140894, 2024, 11, 23, 'PM', 'approved', 140879, 'Personal time needed', 'Approved'), 
(140894, 2024, 11, 24, 'AM', 'rejected', 140879, 'Business review meeting scheduled', 'Rejected due to business meeting');


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

