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
CREATE TABLE Employee (
    EmployeeID INT PRIMARY KEY IDENTITY(1,1),
    EmployeeEmail VARCHAR(255) UNIQUE ,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    DOB DATE,
    Gender VARCHAR(10), -- Assuming values like 'Male', 'Female', 'Non-Binary', etc.
    Password VARCHAR(255), -- Assuming you'll store hashed passwords
    -- OtherAttributes data types and constraints
);
 
-- Create EmployeeDetails table
CREATE TABLE EmployeeDetails (
    EmployeeID INT PRIMARY KEY FOREIGN KEY REFERENCES Employee(EmployeeID), 
    City VARCHAR(100),
    Street VARCHAR(255),
    PostalCode VARCHAR(20),
    ContactNumber VARCHAR(20),
    -- OtherAttributes data types and constraints
);


-- Create Experience table
CREATE TABLE Experience (
    ExperienceID INT PRIMARY KEY IDENTITY(1,1),
    EmployeeID INT FOREIGN KEY REFERENCES Employee(EmployeeID),
    Title VARCHAR(100),
    Company VARCHAR(100),
    StartDate DATE,
    EndDate DATE,
    -- OtherAttributes data types and constraints
);

-- Create Education table
CREATE TABLE Education (
    EducationID INT PRIMARY KEY IDENTITY(1,1),
    EmployeeID INT FOREIGN KEY REFERENCES Employee(EmployeeID),
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
CREATE TABLE EmployeeSkills (
    EmployeeSkillsID INT PRIMARY KEY IDENTITY(1,1),
    EmployeeID INT FOREIGN KEY REFERENCES Employee(EmployeeID),
    SkillID INT FOREIGN KEY REFERENCES Skills(SkillID),
    -- OtherAttributes data types and constraints
);
