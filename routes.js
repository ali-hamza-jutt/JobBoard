import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { sql, connectionString } from './Backend/database.js';
import register from './Backend/applicantRegister.js';
import login from './Backend/applicantLogin.js';
import path from 'path';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set the views directory path
//const viewsPath = path.join(__dirname, './views');

const app = express();

app.set('view engine', 'ejs');
//app.set('views', viewsPath);

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
    const jobDataQuery = 'SELECT * FROM Job';
    const companyDataQuery='SELECT * FROM COMPANY';
    const jobDataResult = await request.query(jobDataQuery);
    const companyDataResult=await request.query(companyDataQuery);

    // Render the EJS template with job data
    res.render(__dirname+'/views/index.ejs', 
    { jobs: jobDataResult.recordset,
      companies:companyDataResult.recordset
     });
  } catch (error) {
    console.error('Error fetching job data:', error);
    res.status(500).send('Error fetching job data');
  }
});

router.get('/login', (req, res) => {
  res.render(path.join(__dirname,'/views/UserLogin.ejs'))
});

router.get('/companyLogin', (req, res) => {
  res.render(path.join(__dirname,'/views/CompanyLogin.ejs'))
});

router.get('/job',(req,res)=>{
  res.render(path.join(__dirname,'/views/job.ejs'))
})


router.post('/register', (req, res) => {
  register(req, res);
});

router.post('/login', (req, res) => {
  login(req, res);
});

export default {
  router,
};
