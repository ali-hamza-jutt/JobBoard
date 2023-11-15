import express from 'express';
import bodyParser from 'body-parser';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app=express();
const port=3000;
app.use(express.static(__dirname+'/public'))
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.render(__dirname+'/views/header.ejs')
})

app.listen(port,()=>{
    console.log(`Server is running  on port ${port}`)
})