import sql from 'mssql';

const config = {
  user: 'sa',  // Replace with your SQL Server username
  password: '12345678',  // Replace with your SQL Server password
  database: 'JobBoard',
  server: 'MASTER',
  options: {
    driver: 'ODBC Driver 17 for SQL Server',
    trustedConnection: true,
    trustServerCertificate: true,
  },
};

sql.connect(config, function (err) {
  if (err) {
    console.log(err);
  } else {
    // create Request object
    const request = new sql.Request();

    // query to the database and get the records
    request.query('select * from Applicant', function (err, recordset) {
      if (err) {
        console.log(err);
      } else {
        // send records as a response
        console.log(recordset);
      }
    });
  }
});


// Import sql and create a connection
import sql from 'msnodesqlv8';

// Database Connection Configuration
const connectionString = "Driver={ODBC Driver 17 for SQL Server};Server=MASTER\\SQLEXPRESS;Database=JobBoard;Trusted_Connection=Yes;";

// Export the connection string and sql
export { connectionString, sql };
