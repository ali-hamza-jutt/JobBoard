create database JobBoard

use JobBoard


-- Create Company table
CREATE TABLE Company (
    CompanyID INT PRIMARY KEY IDENTITY(1,1),
    CompanyEmail VARCHAR(255) UNIQUE,
    CompanyName VARCHAR(255),
    CompanyCity VARCHAR(100),
    CompanyStreet VARCHAR(255),
    CompanyPostalCode VARCHAR(20),
    CompanyContactNumber VARCHAR(20),
    Password VARCHAR(255), -- Assuming you'll store hashed passwords
    -- OtherAttributes data types and constraints
);

-- Create Job table
CREATE TABLE Job (
    JobID INT PRIMARY KEY IDENTITY(1,1),
    CompanyID INT FOREIGN KEY REFERENCES Company(CompanyID),
    JobType VARCHAR(50),
    QualificationRequired VARCHAR(255),
    OfferedSalary MONEY,
    JobDescription TEXT,
    -- OtherAttributes data types and constraints
);

-- Create Employee table with Gender attribute
CREATE TABLE Applicant (
    ApplicantID INT PRIMARY KEY IDENTITY(1,1),
    ApplicantEmail VARCHAR(255) UNIQUE ,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    DOB DATE,
    Gender VARCHAR(10), -- Assuming values like 'Male', 'Female', 'Non-Binary', etc.
    Password VARCHAR(255), -- Assuming you'll store hashed passwords
    -- OtherAttributes data types and constraints
);
 
-- Create EmployeeDetails table
CREATE TABLE ApplicantDetails (
    ApplicantID INT FOREIGN KEY REFERENCES Applicant(ApplicantID), 
    City VARCHAR(100),
    Street VARCHAR(255),
    PostalCode VARCHAR(20),
    ContactNumber VARCHAR(20),
    -- OtherAttributes data types and constraints
);


-- Create Experience table
CREATE TABLE Experience (
    ExperienceID INT PRIMARY KEY IDENTITY(1,1),
    ApplicantID INT FOREIGN KEY REFERENCES Applicant(ApplicantID),
    Title VARCHAR(100),
    Company VARCHAR(100),
    StartDate DATE,
    EndDate DATE,
    -- OtherAttributes data types and constraints
);

-- Create Education table
CREATE TABLE Education (
    EducationID INT PRIMARY KEY IDENTITY(1,1),
    ApplicantID INT FOREIGN KEY REFERENCES Applicant(ApplicantID),
    Degree VARCHAR(100),
    Institution VARCHAR(100),
	StartDate DATE,
    GraduationDate DATE,
    -- OtherAttributes data types and constraints
);

-- Create Skills table
CREATE TABLE Skills (
    SkillID INT PRIMARY KEY IDENTITY(1,1),
    SkillName VARCHAR(100),
    -- OtherAttributes data types and constraints
);

-- Create EmployeeSkills table (Many-to-Many Relationship)
CREATE TABLE ApplicantSkills (
    ApplicantSkillsID INT PRIMARY KEY IDENTITY(1,1),
    ApplicantID INT FOREIGN KEY REFERENCES Applicant(ApplicantID),
    SkillID INT FOREIGN KEY REFERENCES Skills(SkillID),
    -- OtherAttributes data types and constraints
);

-- Create JobApplication table
CREATE TABLE JobApplication (
    JobApplicationID INT PRIMARY KEY IDENTITY(1,1),
    JobID INT FOREIGN KEY REFERENCES Job(JobID),
    ApplicantID INT FOREIGN KEY REFERENCES Applicant(ApplicantID),
    ApplicationDate DATE
);


-- Insert computer science-related and soft skills
INSERT INTO Skills (SkillName) VALUES
    ('HTML'), ('CSS'), ('JavaScript'), ('GitHub'),
    ('Python'), ('Java'), ('C++'), ('Ruby'),
    ('SQL'), ('Database Management'), ('Node.js'), ('React.js'),
    ('Git'), ('Web Development'), ('RESTful API'),
    ('UI/UX Design'), ('Agile Methodology'), ('Scrum'),
    ('Problem Solving'), ('Critical Thinking'), ('Communication'),
    ('Team Management'), ('Leadership'), ('Time Management'),
    ('Adaptability'), ('Creativity'), ('Analytical Skills'),
    ('Project Management'), ('Machine Learning'), ('Data Analysis'),
    ('Cybersecurity'), ('Network Security'), ('Cloud Computing'),
    ('Mobile App Development'), ('IoT'), ('DevOps'),
    ('Big Data'), ('Artificial Intelligence'), ('Linux'),
    ('Version Control'), ('Docker'), ('Shell Scripting'),
    ('Statistical Analysis'), ('Data Visualization'), ('Technical Writing'),
    ('Interpersonal Skills'), ('Negotiation'), ('Conflict Resolution'),
    ('Emotional Intelligence'), ('Customer Service');


	INSERT INTO Skills (SkillName) VALUES
    ('Communication'), ('Team Management'), ('Leadership'),
    ('Time Management'), ('Adaptability'), ('Creativity'),
    ('Analytical Skills'), ('Project Management'),
    ('Interpersonal Skills'), ('Negotiation'), ('Conflict Resolution'),
    ('Emotional Intelligence'), ('Customer Service');


	-- Insert data into Company table
INSERT INTO Company (CompanyEmail, CompanyName, CompanyCity, CompanyStreet, CompanyPostalCode, CompanyContactNumber, Password)
VALUES ('company@example.com', 'ABC Corporation', 'CityA', 'StreetA', '12345', '123-456-7890', 'hashed_password');

-- Insert data into Applicant table
INSERT INTO Applicant (ApplicantEmail, FirstName, LastName, DOB, Gender, Password)
VALUES ('applicant@example.com', 'John', 'Doe', '1990-01-15', 'Male', 'hashed_password');

-- Insert data into Job table
INSERT INTO Job (CompanyID, JobType, QualificationRequired, OfferedSalary, JobDescription)
VALUES (1, 'Web Development', 'Bachelor’s degree in Computer Science', 60000, 'Full-stack web development position');

-- Insert data into ApplicantDetails table
INSERT INTO ApplicantDetails (ApplicantID, City, Street, PostalCode, ContactNumber)
VALUES (1, 'CityA', 'StreetA', '54321', '987-654-3210');

-- Insert data into Experience table
INSERT INTO Experience (ApplicantID, Title, Company, StartDate, EndDate)
VALUES (1, 'Software Engineer', 'XYZ Tech', '2015-01-01', '2020-12-31');

-- Insert data into Education table
INSERT INTO Education (ApplicantID, Degree, Institution, StartDate, GraduationDate)
VALUES (1, 'Bachelor of Science', 'University of Tech', '2011-09-01', '2015-06-30');

drop table JobApplication
-- Insert data into JobApplication table
INSERT INTO JobApplication (JobID, ApplicantID, ApplicationDate)
VALUES (1, 1, GETDATE());

select * from Applicant
SELECT ApplicantEmail, Password FROM Applicant WHERE ApplicantEmail = 'alihamza16jutt@outlook.com'