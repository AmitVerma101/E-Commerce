//const {test} =require('../main.js')
async function test(){

    pool=await sql.connect(config);
//    let result=await pool.request().query('select 1');
//    console.log(result);
}
let pool;
const sql = require('mssql');
// const {test} = require('../main')
const config = {
   
    user:'admin',
    password:'admin',
    server: 'DESKTOP-EBCTPGM',
    database: 'First',
    options: {
        trustServerCertificate:true,
    }
};

async function createUser(val){
    // console.log(User);
   console.log(val);
   console.log(val.name,val.username);
    await test();
   
    try {
        //console.log(pool)
        // let result=await pool.request().query('select * from students')
        // console.log(result);
        let request =await  pool.request().query(`insert into users (name,username,email,password,isVerified,token) values('${val.name}','${val.username}','${val.email}','${val.password}',${val.isVerified},'${val.token}')`);
        request = await pool.request().query(`select * from users`);
        console.log(request);
    }
    catch(err){
        console.log("Error occur Database can not be opened"+err);
    }
   console.log("after the database query")
}
module.exports={createUser};