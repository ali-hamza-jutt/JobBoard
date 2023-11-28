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

// Set the views directory path
//const viewsPath = path.join(__dirname, './views');

const app = express();

// Middleware to check if the user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    res.locals.isLoggedIn = true; // Set a variable accessible in views
  } else {
    res.locals.isLoggedIn = false;
  }
  next();
};

app.set('view engine', 'ejs');
//app.set('views', viewsPath);

// Use the middleware in all routes
router.use(isLoggedIn);

// router.get('/',(req,res)=>{
//   res.render(path.join(__dirname,'/views/index.ejs'))
// })
router.get('/', async (req, res) => {
  try {
    // Create a connection pool
    const pool = await sql.connect(connectionString);

    // Create a request from the pool
    const request = pool.request();

    // Fetch job data from the database
    const jobDataQuery = `SELECT * FROM Job JOIN COMPANY ON JOB.COMPANYID=COMPANY.COMPANYID`;
    const jobDataResult = await request.query(jobDataQuery);

    // Render the EJS template with job data
    res.render(__dirname + '/views/index.ejs', {
      jobs: jobDataResult.recordset,
      isLoggedIn:res.locals.isLoggedIn
    });
  } catch (error) {
    console.error('Error fetching job data:', error);
    res.status(500).send('Error fetching job data');
  }
});

router.get('/login', (req, res) => {
  res.render(path.join(__dirname, '/views/UserLogin.ejs'));
});

router.get('/companyLogin', (req, res) => {
  res.render(path.join(__dirname, '/views/CompanyLogin.ejs'));
});

// router.get('/job',(req,res)=>{
//   res.render('job.ejs', {job:[0]})

// })

// routes.js

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
    isLoggedIn:res.locals.isLoggedIn });
  } catch (error) {
    console.error('Error fetching job data:', error);
    res.status(500).send('Error fetching job data');
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


router.get('/edu',  (req, res) => {
  res.render(__dirname + '/views/education.ejs');
});


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

export default {
  router,
};
