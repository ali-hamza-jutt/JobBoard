import bcrypt from 'bcrypt';
import { sql, connectionString } from './database.js';

import passwordValidator from 'password-validator';

// Initialize password schema
const passwordSchema = new passwordValidator();

passwordSchema
  .is().min(8)            // Minimum length 8
  .has().uppercase()      // Must have uppercase letters
  .has().lowercase()      // Must have lowercase letters
  .has().digits(1)         // Must have at least 1 digit
  .has().not().spaces();   // Should not have spaces

const register = async (req, res) => {
  const {
    firstNameField,
    lastNameField,
    registerEmailField,
    registerPasswordField,
    rememberPasswordField,
    dateOfBirth,
    gender,
  } = req.body;

  try {
    const pool = await sql.connect(connectionString);

    // Check if the email is already registered
    const checkEmailQuery = 'SELECT ApplicantEmail FROM Applicant WHERE ApplicantEmail = @email;';
    const checkEmailResult = await pool
      .request()
      .input('email', sql.VarChar, registerEmailField)
      .query(checkEmailQuery);

    if (checkEmailResult.recordset.length > 0) {
      // Email is already registered
      res.status(400).send('Email already registered');
      return;
    }

    // Check if password and re-entered password match
    if (registerPasswordField !== rememberPasswordField) {
      res.status(400).send('Passwords do not match');
      return;
    }

    // Check if the password meets the criteria
    if (!passwordSchema.validate(registerPasswordField)) {
      res.status(400).send('Password does not meet the criteria');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(registerPasswordField, 10);

    // Insert the user into the database
    const insertUserQuery = `
      INSERT INTO Applicant (FirstName, LastName, ApplicantEmail, Password, DOB, Gender)
      VALUES (@firstName, @lastName, @email, @password, @dob, @gender);
    `;

    const insertUserParams = {
      firstName: firstNameField,
      lastName: lastNameField,
      email: registerEmailField,
      password: hashedPassword, // Store the hashed password
      dob: dateOfBirth,
      gender: gender,
    };

    await pool.request().input('firstName', sql.VarChar, insertUserParams.firstName)
      .input('lastName', sql.VarChar, insertUserParams.lastName)
      .input('email', sql.VarChar, insertUserParams.email)
      .input('password', sql.VarChar, insertUserParams.password)
      .input('dob', sql.Date, insertUserParams.dob)
      .input('gender', sql.VarChar, insertUserParams.gender)
      .query(insertUserQuery);

    console.log('Data inserted successfully');
    res.status(200).send('Data inserted successfully');
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).send('Error inserting data');
  }
};

export default register;
