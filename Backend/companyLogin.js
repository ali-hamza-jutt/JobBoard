import bcrypt from 'bcrypt';
import { sql, connectionString } from './database.js';
import session from 'express-session';

const companyLogin = async (req, res) => {
  const { emailField, passwordField } = req.body;

  try {
    const pool = await sql.connect(connectionString);

    // Use the connection pool to query the database
    const result = await pool.request()
      .input('email', sql.VarChar, emailField)
      .query('SELECT * FROM Company WHERE CompanyEmail = @email');

    // Check if the email is found in the database
    if (result.recordset.length === 0) {
      req.flash('error', 'Email not found');
      res.redirect('/companyLogin'); // Redirect to company login page
      return;
    }

    const storedPassword = result.recordset[0].Password;

    // Use bcrypt to compare passwords
    bcrypt.compare(passwordField, storedPassword, (err, passwordMatch) => {
      if (err) {
        console.log(err);
        req.flash('error', 'Error processing company login');
        res.redirect('/companyLogin'); // Redirect to company login page
      } else if (passwordMatch === true) {
        // Set up company session
        req.session.company = {
          CompanyID: result.recordset[0].CompanyID,
          // Include any other company-related information you want to store in the session
        };
        res.redirect('/companyJobs'); // Redirect to company jobs page
      } else {
        req.flash('error', 'Password does not match');
        res.redirect('/companyLogin'); // Redirect to company login page
      }
    });
  } catch (error) {
    console.log(error);
    req.flash('error', 'Error processing company login');
    res.redirect('/companyLogin'); // Redirect to company login page
  }
};

export default companyLogin;
