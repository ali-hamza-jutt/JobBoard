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

const companyRegister = async (req, res) => {
  const {
    companyNameField,
    companyRegisterEmailField,
    registerPasswordField,
    companyCityField,
    companyPostalCodeField,
    companyStreetField,
    companyContactNumberField,
  } = req.body;

  try {
    const pool = await sql.connect(connectionString);

    // Check if the email is already registered
    const checkEmailQuery = 'SELECT CompanyEmail FROM Company WHERE CompanyEmail = @email;';
    const checkEmailResult = await pool
      .request()
      .input('email', sql.VarChar, companyRegisterEmailField)
      .query(checkEmailQuery);

    if (checkEmailResult.recordset.length > 0) {
      // Email is already registered
      res.status(400).send('Email already registered');
      return;
    }

    // Check if the password meets the criteria
    if (!passwordSchema.validate(registerPasswordField)) {
      res.status(400).send('Password does not meet the criteria');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(registerPasswordField, 10);

    // Insert the company into the database
    const insertCompanyQuery = `
      INSERT INTO Company (CompanyName, CompanyEmail, Password, CompanyCity, CompanyPostalCode, CompanyStreet, CompanyContactNumber)
      VALUES (@companyName, @email, @password, @city, @postalCode, @street, @contactNumber);
    `;

    const insertCompanyParams = {
      companyName: companyNameField,
      email: companyRegisterEmailField,
      password: hashedPassword, // Store the hashed password
      city: companyCityField,
      postalCode: companyPostalCodeField,
      street: companyStreetField,
      contactNumber: companyContactNumberField,
    };

    await pool.request()
      .input('companyName', sql.VarChar, insertCompanyParams.companyName)
      .input('email', sql.VarChar, insertCompanyParams.email)
      .input('password', sql.VarChar, insertCompanyParams.password)
      .input('city', sql.VarChar, insertCompanyParams.city)
      .input('postalCode', sql.VarChar, insertCompanyParams.postalCode)
      .input('street', sql.VarChar, insertCompanyParams.street)
      .input('contactNumber', sql.VarChar, insertCompanyParams.contactNumber)
      .query(insertCompanyQuery);

    console.log('Company data inserted successfully');
    res.status(200).send('Company data inserted successfully');
  } catch (error) {
    console.error('Error inserting company data:', error);
    res.status(500).send('Error inserting company data');
  }
};

export default companyRegister;
