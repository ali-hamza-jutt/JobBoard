import sql from 'msnodesqlv8';																							
const connectionString = "Driver={ODBC Driver 17 for SQL Server};Server=MASTER\\SQLEXPRESS;Database=JobBoard;Trusted_Connection=Yes;";		
const query = "Select * from dbo.Applicant";																					

sql.query(connectionString,query,(err,rows)=>{																					
    console.log(rows);																										
});