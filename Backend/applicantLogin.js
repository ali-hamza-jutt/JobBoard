import bcrypt from 'bcrypt';
import { sql, connectionString } from './database.js';
import session from 'express-session';
import flash from 'express-flash';

const login = async (req, res) => {
  const { emailField, passwordField } = req.body;

  try {
    const pool = await sql.connect(connectionString);

    // Use the connection pool to query the database
    const result = await pool.request()
      .input('email', sql.VarChar, emailField)
      .query('SELECT * FROM Applicant WHERE ApplicantEmail = @email');

    // Check if the email is found in the database
    if (result.recordset.length === 0) {
      req.flash('error', 'Email not found');
      res.redirect('/login'); // Redirect to login page
      return;
    }

    const user = result.recordset[0];
    const storedPassword = user.Password;

    // Use bcrypt to compare passwords
    bcrypt.compare(passwordField, storedPassword, (err, passwordMatch) => {
      if (err) {
        console.log(err);
        req.flash('error', 'Error processing login');
        res.redirect('/login'); // Redirect to login page
      } else if (passwordMatch === true) {
        // Set up session
        req.session.user = {
          ApplicantID: user.ApplicantID,
          // Include any other user-related information you want to store in the session
        };

        res.redirect('/');
      } else {
        req.flash('error', 'Password does not match');
        res.redirect('/login'); // Redirect to login page
      }
    });
  } catch (error) {
    console.log(error);
    req.flash('error', 'Error processing login');
    res.redirect('/login'); // Redirect to login page
  }
};

export default login;
