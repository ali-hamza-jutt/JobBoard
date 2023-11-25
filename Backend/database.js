import sql from 'mssql';

const connectionString = {
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

export { sql, connectionString };
