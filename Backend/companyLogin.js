// Import necessary modules
import bcrypt from 'bcrypt';
import { sql, connectionString } from './database.js';

// Company login function
const companyLogin = async (req, res) => {
  const { emailField, passwordField } = req.body;

  try {
    // Create a connection pool
    const pool = await sql.connect(connectionString);

    // Use the connection pool to query the database
    const result = await pool.request()
      .input('email', sql.VarChar, emailField)
      .query('SELECT * FROM Company WHERE CompanyEmail = @email');

    // Check if the email is found in the database
    if (result.recordset.length === 0) {
      res.status(400).send('Email not found');
      return;
    }

    const storedPassword = result.recordset[0].Password;

    // Use bcrypt to compare passwords
    bcrypt.compare(passwordField, storedPassword, (err, passwordMatch) => {
      if (err) {
        console.log(err);
      } else if (passwordMatch === true) {
        res.status(200).send('Company Login successful');
      } else {
        res.status(400).send('Password does not match');
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error processing company login');
  }
};

// Export the companyLogin function
export default companyLogin;
