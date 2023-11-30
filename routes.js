// routes.js
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { sql, connectionString } from './Backend/database.js';
import register from './Backend/applicantRegister.js';
import login from './Backend/applicantLogin.js';
import companyLogin from './Backend/companyLogin.js';
import companyRegister from './Backend/companyRegister.js';
import path from 'path';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views')); // Adjust the path as needed

// Middleware to check if the user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    res.locals.isLoggedIn = true; // Set a variable accessible in views
  } else {
    res.locals.isLoggedIn = false;
  }
  next();
};

// Middleware to check if a company is logged in
const isCompanyLoggedIn = (req, res, next) => {
  if (req.session.company) {
    res.locals.isCompanyLoggedIn = true; // Set a variable accessible in views
  } else {
    res.locals.isCompanyLoggedIn = false;
  }
  next();
};

// Apply the middleware to all routes
router.use(isLoggedIn);
router.use(isCompanyLoggedIn);

router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(connectionString);
    const request = pool.request();
    const jobDataQuery = `SELECT * FROM Job JOIN COMPANY ON JOB.COMPANYID=COMPANY.COMPANYID`;
    const jobDataResult = await request.query(jobDataQuery);

    res.render('index.ejs', {
      jobs: jobDataResult.recordset,
      isLoggedIn: res.locals.isLoggedIn,
      isCompanyLoggedIn: res.locals.isCompanyLoggedIn
    });
  } catch (error) {
    console.error('Error fetching job data:', error);
    res.status(500).send('Error fetching job data');
  }
});

router.get('/companyJobs', async (req, res) => {
  try {
    const companyID=req.session.company.CompanyID;
    const pool = await sql.connect(connectionString);
    const request = pool.request();
    const companyDataQuery = `SELECT Job.*,Company.* FROM Company JOIN Job ON Company.CompanyID=Job.CompanyID Where Job.CompanyID=${companyID}`;
    const companyDataResult = await request.query(companyDataQuery);

    res.render(__dirname+'/views/companyHome.ejs', {
      companyJobs: companyDataResult.recordset,
      isLoggedIn: res.locals.isLoggedIn,
      isCompanyLoggedIn: res.locals.isCompanyLoggedIn
    });
  } catch (error) {
    console.error('Error fetching company jobs:', error);
    res.status(500).send('Error fetching company jobs');
  }
});

// router.get('/companyJobs',async(req,res)=>{
//   res.render(__dirname+'/views/companyHome.ejs',
//   {
//     companyJobs : [0],
//     isLoggedIn:false,
//     isCompanyLoggedIn:true
//   })
// })

           

router.get('/login', (req, res) => {
  res.render(path.join(__dirname, '/views/UserLogin.ejs'));
});

router.get('/companyLogin', (req, res) => {
  res.render(path.join(__dirname, '/views/CompanyLogin.ejs'));
});


router.get('/job', async (req, res) => {
  try {
    // Get the job ID from the URL parameter
    const jobId = req.query.id;

    // Create a connection pool
    const pool = await sql.connect(connectionString);

    // Create a request from the pool
    const request = pool.request();

    // Fetch job data from the database based on the job ID
    const jobDataQuery = `SELECT * FROM Job JOIN COMPANY ON JOB.COMPANYID=COMPANY.COMPANYID WHERE JobID = ${jobId}`;
    const jobDataResult = await request.query(jobDataQuery);

    // Render the job.ejs template with job data
    res.render('job.ejs', { job: jobDataResult.recordset[0],
      isLoggedIn:res.locals.isLoggedIn,
      isCompanyLoggedIn:res.locals.isCompanyLoggedIn});
  } catch (error) {
    console.error('Error fetching job data:', error);
    res.status(500).send('Error fetching job data');
  }
});


router.get('/apply', async (req, res) => {
  try {
    // Check if the user is logged in
    if (!req.session.user || !req.session.user.ApplicantID) {
      return res.redirect('/login'); // Redirect to login page if not logged in or missing ApplicantID
    }

    const jobId = req.query.id;

    // Create a connection pool
    const pool = await sql.connect(connectionString);
    const request = pool.request();

    // Fetch job data from the database based on the job ID
    const jobDataQuery = `SELECT * FROM Job JOIN COMPANY ON JOB.COMPANYID=COMPANY.COMPANYID WHERE JobID = ${jobId}`;
    const jobDataResult = await request.query(jobDataQuery);

    // Get the logged-in applicant's details
    const applicantDetailsQuery = `SELECT * FROM Applicant join ApplicantDetails on Applicant.ApplicantID=ApplicantDetails.ApplicantID WHERE Applicant.ApplicantID = ${req.session.user.ApplicantID}`;
    const educationDetailsQuery = `SELECT * FROM Education WHERE ApplicantID = ${req.session.user.ApplicantID}`;
    const experienceDetailsQuery = `SELECT * FROM Experience WHERE ApplicantID = ${req.session.user.ApplicantID}`;
    const skillDetailsQuery = `SELECT * FROM Skills WHERE ApplicantID = ${req.session.user.ApplicantID}`;
    const applicantDetailsResult = await request.query(applicantDetailsQuery);
    const educationDetailsResult = await request.query(educationDetailsQuery);
    const experienceDetailsResult = await request.query(experienceDetailsQuery);
    const skillDetailsResult = await request.query(skillDetailsQuery);

    // Render the apply.ejs template with applicant details
    res.render(__dirname + '/views/apply.ejs', {
      applicants: applicantDetailsResult.recordset,
      education: educationDetailsResult.recordset,
      experience: experienceDetailsResult.recordset,
      skills: skillDetailsResult.recordset,
      job: jobDataResult.recordset[0],
      isLoggedIn:res.locals.isLoggedIn,
      isCompanyLoggedIn:res.locals.isCompanyLoggedIn
    });

    // Close the connection pool
    pool.close();
  } catch (error) {
    console.error('Error fetching applicant details:', error);
    res.status(500).send('Error fetching applicant details');
  }
});

router.get('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Error logging out');
    } else {
      res.redirect('/'); // Redirect to login page after logout
    }
  });
});



router.get('/edu', async(req, res) => {
  res.render(__dirname + '/views/education.ejs');
});

router.get('/exp',  async(req, res) => {
  res.render(__dirname + '/views/experience.ejs');
});
router.get('/skill',async(req,res)=>{
  res.render(__dirname + '/views/skill.ejs');

})


router.post('/register', (req, res) => {
  register(req, res);
});

router.post('/login', (req, res) => {
  login(req, res);
});

router.post('/companyRegister', (req, res) => {
  companyRegister(req, res);
});

router.post('/companyLogin', (req, res) => {
  companyLogin(req, res);
});

router.post('/edu', async (req, res) => {
  try {
    // Get data from the form
    const { degreeField, institutionField, startDateField, graduationDateField } = req.body;

    // Get the ApplicantID from the session
    const applicantID = req.session.user.ApplicantID;

    // Create a connection pool
    const pool = await sql.connect(connectionString);

    // Create a request from the pool
    const request = pool.request();

    // SQL query to insert education details into the Education table
    const insertQuery = `
      INSERT INTO Education (ApplicantID, Degree, Institution, StartDate, GraduationDate)
      VALUES (@applicantID, @degree, @institution, @startDate, @graduationDate)
    `;

    // Execute the query
    const result = await request
      .input('applicantID', sql.Int, applicantID)
      .input('degree', sql.VarChar(100), degreeField)
      .input('institution', sql.VarChar(100), institutionField)
      .input('startDate', sql.Date, startDateField)
      .input('graduationDate', sql.Date, graduationDateField)
      .query(insertQuery);

    // Check if the data was successfully inserted
    if (result.rowsAffected.length > 0) {
      // Redirect to a success page or perform any other necessary actions
      res.redirect('/apply');
    } else {
      // Handle the case where the data insertion failed
      res.status(500).send('Error inserting education details');
    }
  } catch (error) {
    console.error('Error inserting education details:', error);
    res.status(500).send('Error inserting education details');
  }
});

router.post('/exp', async (req, res) => {
  try {
    // Get data from the form
    const { titleField, companyField, startDate, endDate } = req.body;

    // Get the ApplicantID from the session
    const applicantID = req.session.user.ApplicantID;

    // Create a connection pool
    const pool = await sql.connect(connectionString);

    // Create a request from the pool
    const request = pool.request();

    // SQL query to insert experience details into the Experience table
    const insertQuery = `
      INSERT INTO Experience (ApplicantID, Title, Company, StartDate, EndDate)
      VALUES (@applicantID, @title, @company, @startDate, @endDate)
    `;

    // Execute the query
    const result = await request
      .input('applicantID', sql.Int, applicantID)
      .input('title', sql.VarChar(100), titleField)
      .input('company', sql.VarChar(100), companyField)
      .input('startDate', sql.Date, startDate)
      .input('endDate', sql.Date, endDate)
      .query(insertQuery);

    // Check if the data was successfully inserted
    if (result.rowsAffected.length > 0) {
      // Redirect to a success page or perform any other necessary actions
      res.redirect('/apply');
    } else {
      // Handle the case where the data insertion failed
      res.status(500).send('Error inserting experience details');
    }
  } catch (error) {
    console.error('Error inserting experience details:', error);
    res.status(500).send('Error inserting experience details');
  }
});

router.post('/skill', async (req, res) => {
  try {
    // Get data from the form
    const { skillField } = req.body;

    // Get the ApplicantID from the session
    const applicantID = req.session.user.ApplicantID;

    // Create a connection pool
    const pool = await sql.connect(connectionString);

    // Create a request from the pool
    const request = pool.request();

    // SQL query to insert skill details into the Skills table
    const insertQuery = `
      INSERT INTO Skills (ApplicantID, SkillName)
      VALUES (@applicantID, @skillName)
    `;

    // Execute the query
    const result = await request
      .input('applicantID', sql.Int, applicantID)
      .input('skillName', sql.VarChar(100), skillField)
      .query(insertQuery);

    // Check if the data was successfully inserted
    if (result.rowsAffected.length > 0) {
      // Redirect to a success page or perform any other necessary actions
      res.redirect('/apply');
    } else {
      // Handle the case where the data insertion failed
      res.status(500).send('Error inserting skill details');
    }
  } catch (error) {
    console.error('Error inserting skill details:', error);
    res.status(500).send('Error inserting skill details');
  }
});

router.get('/submitDetail', async (req, res) => {
  try {
    const jobId = req.query.id;
    console.log("JOBID:"+jobId);
    // Check if the user is logged in
    if (!req.session.user || !req.session.user.ApplicantID) {
      return res.redirect('/login'); // Redirect to login page if not logged in or missing ApplicantID
    }

    // Create a connection pool
    const pool = await sql.connect(connectionString);
    const request = pool.request();

    // Insert into JobApplication table
    const insertJobApplicationQuery = `
      INSERT INTO JobApplication (JobID, ApplicantID, ApplicationDate)
      VALUES (@jobId, @applicantId, GETDATE())
    `;

    await request
      .input('jobId', sql.Int, jobId)
      .input('applicantId', sql.Int, req.session.user.ApplicantID)
      .query(insertJobApplicationQuery);

    // Close the connection pool
    pool.close();

    // Redirect to some success page or do whatever is appropriate
    res.redirect('/');
  } catch (error) {
    console.error('Error submitting job application:', error);
    res.status(500).send('Error submitting job application');
  }
});



export default {
  router,
};
