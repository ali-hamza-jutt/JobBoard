import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import session from 'express-session';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;
app.use(session({
    secret: 'your_secret_key', // Change this to a more secure secret
    resave: true,
    saveUninitialized: true,
  }));
  

// Serve the  directory statically
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes.router); // Use the imported router from the routes object




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

