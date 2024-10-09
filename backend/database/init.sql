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
    Reason VARCHAR(300),
    Remarks VARCHAR(300)
);

CREATE TABLE files(
    File_id SERIAL PRIMARY KEY,
    File_data BYTEA
);

CREATE TABLE file_request_assoc (
    Request_id INT REFERENCES requests(request_id),
    File_id INT REFERENCES files(File_id),
    PRIMARY KEY (Request_id, File_id)
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
(130002, 2024, 1, 15, 'AM', 'approved', 130002, 'approve plz','Approved for morning leave'), -- Jack reports to himself
(140001, 2024, 2, 10, 'PM', 'pending', 130002, 'approve plz', 'Pending approval from manager'), -- Derek reports to Jack
(150008, 2024, 3, 5, 'FULL', 'rejected', 130002, 'approve plz','Rejected due to project deadline'), -- Eric reports to Jack
(151408, 2024, 4, 25, 'AM', 'approved', 130002, 'approve plz','Morning leave approved for urgent matters'), -- Philip reports to Jack
(140894, 2024, 5, 30, 'PM', 'pending', 140001, 'approve plz','Pending for review'), -- Rahim reports to Derek
(130002, 2024, 6, 10, 'FULL', 'approved', 130002, 'approve plz','Approved for full day leave for family event'), -- Jack reports to himself
(140001, 2024, 7, 22, 'PM', 'rejected', 130002, 'approve plz','Leave request rejected due to team shortage'), -- Derek reports to Jack
(150008, 2024, 8, 18, 'FULL', 'approved', 130002, 'approve plz','Approved for vacation'), -- Eric reports to Jack
(151408, 2024, 9, 12, 'AM', 'pending', 130002, 'approve plz','Pending approval'), -- Philip reports to Jack
(140894, 2024, 10, 3, 'PM', 'approved', 140001, 'approve plz','Approved for personal matters'), -- Rahim reports to Derek
(130002, 2024, 11, 14, 'FULL', 'pending', 130002, 'approve plz', 'Pending manager review'), -- Jack reports to himself
(140001, 2024, 12, 1, 'AM', 'approved', 130002, 'approve plz','Morning leave approved for medical appointment'), -- Derek reports to Jack
(150008, 2024, 1, 19, 'PM', 'rejected', 130002, 'approve plz','Rejected due to overlapping leave requests'), -- Eric reports to Jack
(151408, 2024, 2, 8, 'FULL', 'approved', 130002, 'approve plz','Approved for annual leave'), -- Philip reports to Jack
(140894, 2024, 3, 23, 'AM', 'pending', 140001, 'approve plz','Pending approval for emergency leave'),
(140941, 2024, 11, 23, 'AM', 'pending', 140879, 'approve plz','Pending approval for emergency leave'),
(140894, 2024, 11, 23, 'PM', 'approved', 140879, 'approve plz', 'Approved'),
(140894, 2024, 11, 24, 'AM', 'rejected', 140879, 'approve plz','Rejected'); -- Rahim reports to Derek


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

