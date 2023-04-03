async function test(){
    pool=await sql.connect(config);
}
let pool;
const sql = require('mssql');
const config = { 
    user:'admin',
    password:'admin',
    server: 'DESKTOP-EBCTPGM',
    database: 'First',
    options: {
        trustServerCertificate:true,
    }
};
// no need to add a transaction
async function createUser(val){
   
   console.log(val);
   console.log(val.name,val.username);
    await test();
   
    try {
        let request =await  pool.request().query(`insert into users (name,username,email,password,isVerified,token,role) values('${val.name}','${val.username}','${val.email}','${val.password}',${val.isVerified},'${val.token}','${val.role}')`);
        request = await pool.request().query(`select * from users`);
        console.log(request);
    }
    catch(err){
        console.log("Error occur Database can not be opened"+err);
    }
    finally {
        pool.close();

    }
   console.log("after the database query")
}
// no need to add a transaction
async function findUser(val1,val2){
    await test(); 
    try {  
        let request =await  pool.request().query(`select * from users where ${val1} = '${val2}' and (role='Admin' or role = 'user')`);
        return request.recordset;
    }
    catch(err){
        console.log("Error occur Database can not be opened"+err);
    }
    finally {
        pool.close();
    }
   console.log("after the database query")
}
// no need to add a transaction
async function updateUser(val1,val2,val3,val4){
    await test();
   
    try {
      
        await  pool.request().query(`update users set ${val3} = '${val4}' where ${val1} = '${val2}'`);
    }
    catch(err){
        console.log("Error occur Database can not be opened"+err);
    }
    finally {
        pool.close();
    }

   console.log("after the database query")
}
// no need to add a transaction
async function findProduct(val1,val2,val3,val4){
    await test();
    console.log("findproduct");
   console.log(val1,val2,val3,val4)
    try {
        let obj;
        if(val3==undefined&&val4==undefined){
         obj=await  pool.request().query(`select * from products where status = 1 order by p_id offset ${val1*5} rows fetch next ${val2} rows only`);
        }
        else {
            let u_id;
            if(val3=="id"){
                obj =await pool.request().query(`select * from products where p_id = ${val4}`)
            }
            else {
                u_id =await pool.request().query(`select u_id from users where ${val3} = '${val4}'`);
            console.log(u_id);
             u_id = u_id.recordset[0].u_id;
            console.log("consoling the value of u_id ",u_id);
            let query = `select * from products where u_id = ${u_id} and STATUS = 1`;
            console.log(query);
         obj =await pool.request().query(query);
        }}
        console.log("Consoling in the findProduct function");
        console.log(obj);
        if(obj!=undefined){

            obj=obj.recordset;
            console.log(obj);
            let data=[]
            for(let i=0;i<obj.length;i++){
              data.push({id:obj[i].p_id,name:obj[i].name,image:obj[i].image,username:obj[i].u_id,description:[{descMain:obj[i].descMain,Rating:obj[i].Rating,description:obj[i].description,warranty:obj[i].warranty,color:obj[i].color,RAM:obj[i].RAM,price:obj[i].price}]})
    
            }
            console.log(data);
            
            return data;
        }
    }
    catch(err){
        console.log("Error occur Database can not be opened"+err);
    }
    finally {
        pool.close();

    }

   console.log("after the database query")
}
async function updateProduct(val1,val2,val3){
    console.log("In sql updateProduct function")
    console.log(val3);
    await test();
    let stocks = await pool.request().query(`select stocks from products where p_id = ${val3}`)
    stocks=stocks.recordset[0].stocks;
    let u_id =  await pool.request().query(`select u_id from users where ${val1} = '${val2}'`)
    console.log(u_id)
    u_id = u_id.recordset[0].u_id;
    try {
        console.log(u_id);
           
               if(stocks>0){
                   await pool.request().query(`insert into cart values(${u_id})`);
                   let cId=await pool.request().query(`select c_id from cart where u_id = ${u_id}`); 
                   cId= cId.recordset[0].c_id;
                   console.log(cId);    
                   await pool.request().query(`insert into cart_details values(${cId},${val3},${1})`)
                   await pool.request().query(`update products set stocks = ${stocks-1} where p_id = ${val3}`);
                   return true;
                }
                else {
                    console.log("Stocks not available");
                    return false;
                }
            }
            catch(err){
                let cId=await pool.request().query(`select c_id from cart where u_id = ${u_id}`); 
                cId= cId.recordset[0].c_id;
                console.log(cId);
                try {
                    if(stocks > 0){
                        
                        await pool.request().query(`insert into cart_details values(${cId},${val3},${1})`)
                        await pool.request().query(`update products set stocks = ${stocks-1} where p_id = ${val3}`);
                        return true;

                    }
                    else {
                        return false;
                    }

               }
               catch(err){
                    console.log("Item present in cart already");
                    return false;
               }
           }
    
    
    finally {
        pool.close();
    }
}
//adding a transaction
async function updateCart(val1,val2,val3,val4,val5){
    await test();
    const transaction = new sql.Transaction(pool);
    try { 
        console.log(val4);
        transaction.begin();
            //starting the transaction
            let u_id = await pool.request().query(`select u_id from users where ${val1} = '${val2}'`);
            u_id= u_id.recordset[0].u_id;
            let c_id = await pool.request().query(`select c_id from cart where u_id = ${u_id}`);
            c_id= c_id.recordset[0].c_id;
            let quantity = await pool.request().query(`select quantity from cart_details where c_id = ${c_id} and p_id = ${val4}`)
            quantity= quantity.recordset[0].quantity
            let stocks = await pool.request().query(`select stocks from products where p_id = ${val4}`)
            stocks = stocks.recordset[0].stocks;
            if(val5=="incCount"){
                if(stocks>0){
                    await pool.request().query(`update cart_details set quantity = ${quantity+1} where c_id = ${c_id} and p_id = ${val4}`);
                    await pool.request().query(`update products set stocks = ${stocks-1} where p_id = ${val4}` );
                   transaction.commit();
                    return true;
                }
                else {
                    transaction.rollback();
                    return false;
                }
                
                
            }
            else {
                if(quantity>1){
                    await pool.request().query(`update cart_details set quantity = ${quantity-1} where c_id = ${c_id} and p_id = ${val4}`);
                    await pool.request().query(`update products set stocks = ${stocks+1} where p_id = ${val4}` );
                     transaction.commit();
                }
                else {
                    transaction.rollback();
                }
              
            }
            console.log("Transaction occur successfully");
          
            return true;
        }
        
        // console.log(u_id);
        
        
        catch(err){
            transaction.rollback();
            console.log("Fail to update the quantity"+err);
           
            return false;
        }
        finally {
         pool.close();
         console.log("I am also working");
        }

}
async function createOrder(val){
    console.log("In sql createOrder function")
   // console.log(val3);
    await test();
    const transaction = new sql.Transaction(pool);
    console.log("printing the value of total")
    console.log(val.total,typeof val.total);
    let price = await pool.request().query(`select price from products where p_id = ${val.productId}`)
    price = price.recordset[0].price;
    let quantity;
    try {
        transaction.begin();
        let u_id =  await pool.request().query(`select u_id from users where username = '${val.username}'`)
        console.log(u_id)
        u_id = u_id.recordset[0].u_id;
        quantity = await pool.request().query(`select quantity from cart_details where c_id = (select c_id from cart where u_id = ${u_id} and cart.c_id = cart_details.c_id)`)
        console.log(u_id);
        quantity = quantity.recordset[0].quantity;
        let total = price*quantity;
           try {
              // await pool.request().query(`insert into cart values(${u_id})`);
               await pool.request().query(`insert into orders values(${u_id})`)
             //  let cId=await pool.request().query(`select c_id from cart where u_id = ${u_id}`); 
               let oId= await pool.request().query(`SELECT TOP 1 o_id FROM orders WHERE u_id = ${u_id} ORDER BY o_id DESC`)
               oId= oId.recordset[0].o_id;
               console.log("inside try")
               console.log(oId);
               
               // await pool.request().query(`insert into cart_details values(${cId},${1},${1})`)
                await pool.request().query(`insert into order_details values(${oId},${val.productId},${val.status},${quantity},${total})`)
                transaction.commit();
            
           
           }
           catch(err){
              // let cId=await pool.request().query(`select c_id from cart where u_id = ${u_id}`); 
               let oId= await pool.request().query(`SELECT TOP 1 o_id FROM orders WHERE u_id = ${u_id} ORDER BY o_id DESC`);
               oId= oId.recordset[0].o_id;
               console.log("inside catch");
               console.log(oId);
              await pool.request().query(`insert into order_details values(${oId},${val.productId},${0},${val.quantity},${val.total})`);
              transaction.commit();
           }
    }
    catch (err){
        transaction.rollback();
        console.log("Error while updating the value of the product"+err);
    }
    finally {

        pool.close();
    }

}
async function createSeller(val){
    // console.log(User);
   console.log(val);
   console.log(val.name,val.username);
    await test();
   
    try {
        //console.log(pool)
        // let result=await pool.request().query('select * from students')
        // console.log(result);
        let request =await  pool.request().query(`insert into users (name,username,email,password,role) values('${val.name}','${val.username}','${val.email}','${val.password}','${val.seller}')`);
        request = await pool.request().query(`select * from users`);
        console.log(request);
        pool.close();
    }
    catch(err){
        console.log("Error occur Database can not be opened"+err);
    }
    finally {
        pool.close();
    }

   console.log("after the database query")
}
async function createProduct(val1,val2){
    // console.log(User);
//    console.log(val);
//    console.log(val.name,val.username);
    await test();
   
    try {
        //console.log(pool)
        // let result=await pool.request().query('select * from students')
        // console.log(result);
        let u_id =await  pool.request().query(`select u_id from users where username = '${val1.username}'`);
        u_id=u_id.recordset[0].u_id
        console.log(u_id)
        await pool.request().query(`insert into products (name,descMain,Rating,description,image,warranty,color,RAM,u_id,stocks,price) values('${val1.name}','${val2.descMain}',${val2.Rating},'${val2.description}','${val1.image}',${val2.warranty},'${val2.color}',${val2.RAM},${u_id},${val2.stocks},${val2.price})`)
        // request = await pool.request().query(`select * from users`);
       
        pool.close();
    }
    catch(err){
        console.log("Error occur Database can not be opened"+err);
    }
    finally {

        pool.close();
    }

   console.log("after the database query")
}
async function deleteFromCart(val1,val2,val3,val4,val5){
    await test();
    console.log(val1,val2,val3,val4,val5)
    const transaction = new sql.Transaction(pool);
    try {
        transaction.begin();
        let query;
        console.log("before u_id")
        let u_id = await pool.request().query(`select u_id from users where ${val1} = '${val2}'`)
        console.log("before c_id");
        u_id = u_id.recordset[0].u_id;
        console.log(u_id)
        let c_id = await pool.request().query(`select c_id from cart where u_id = ${u_id}`)
        c_id = c_id.recordset[0].c_id;
        console.log(c_id)
        if(val5==undefined){
          
         let quantity =  await pool.request().query(`select quantity from cart_details where p_id = ${val4} and c_id = ${c_id}`);
            quantity=quantity.recordset[0].quantity;
            console.log("quantity",quantity);
           query=`update products set stocks = ((select stocks from products where p_id = ${val4})+${quantity}) where p_id = ${val4}`
         await pool.request().query(query)
         console.log(query);
        }
        await pool.request().query(`delete cart_details where c_id = ${c_id} and p_id = ${val4}`);
       // await pool.request().query(`delete cart where c_id = c_id`);
       

    //   await pool.request().query(`delete cart_details where p_id = ${val4} and c_id = ${c_id}`);
        transaction.commit();


    }
    catch(err){
        transaction.rollback();
        console.log("Fail to delete from cart "+err);
    }
    finally {
        pool.close();

    }

}
async function deleteProduct(val1){
    await test();
    const transaction = new sql.Transaction(pool);
    try {
       await transaction.begin();
       await pool.request().query(`update products set status = 0 where p_id = ${val1}`)
      await transaction.commit();
      
       
    }
    catch(err){
       
        
        await transaction.rollback();
        console.log("Fail to delete the product "+err);
    }
  finally {
      pool.close();

  }


}
async function findProductFromCart(val){
    await test();
    try {
      
        let c_id = await pool.request().query(`select c_id from cart where u_id = ${val}`);
        c_id = c_id.recordset[0].c_id; 
        let p_id = await pool.request().query(`select p_id,quantity from cart_details where c_id = ${c_id}`);
         p_id = p_id.recordset;
         console.log("printing the value of c_id and p_id");
         console.log(c_id,p_id);
         let newArrFinal=[]
         let newArr1=[];
         for(let i=0;i<p_id.length;i++){
                 newArr1.push({pId:p_id[i].p_id,quantity:p_id[i].quantity});
                let result = await pool.request().query(`select * from products where p_id = ${p_id[i].p_id} and status = 1`)
                console.log(result);
                if(result.rowsAffected[0]!=0){
                    newArrFinal.push(result.recordset[0]);
                }
         }

         
         let newArr2=[];
         for(let i=0;i<newArrFinal.length;i++){
            let x=newArrFinal[i];
            newArr2.push({id:x.p_id,name:x.name,image:x.image,username:x.u_id,description:[{descMain:x.descMain,Rating:x.Rating,description:x.description,warranty:x.warranty,color:x.color,RAM:x.RAM,price:x.price}]});
         }

        console.log("printing the value of p_id in the findProductFromCart function sql");
        console.log(p_id);
        console.log("consoling the value of newArrFinal")
        console.log(newArrFinal);
        console.log("consoling newArr1 and newArr2");
        console.log(newArr1,newArr2);
        return {newArr1,newArr2};
    }
    catch(err) {
       let newArr1=[]
       let newArr2=[];
        console.log("Fail to find product from the findProductFromCart function in sql"+err);
        return {newArr1,newArr2};
    }
    finally {

        pool.close();
    }

}
async function updateOrders(val1,val2,val3,val4,val5,val6){
    console.log("In updateOrders endpoint")
    console.log(val2,val4,val6);
    await test();
    try {
            await pool.request().query(`update order_details set status = ${val4} where o_id = ${val2} and p_id = ${val6}`);
    }
    catch(err){
        console.log("Fail to update order status "+err);
    }
    finally {

        pool.close();
    }

}
async function findSeller(val1,val2,val3,val4){
    // console.log(User);
  
    await test();
   
    try {
        //console.log(pool)
        // let result=await pool.request().query('select * from students')
        // console.log(result);
        let request =await  pool.request().query(`select * from users where ${val1}='${val2}' and role = 'seller' and ${val3} = '${val4}'`);
        
        pool.close();
        return request.recordset;
    }
    catch(err){
        console.log("Error occur Database can not be opened"+err);
    }
    finally {
        pool.close();

    }

   console.log("after the database query")
}
async function findOrders(val1,val2,val3,val4){
    await test();

    try {
        let result;
        if(val4!=undefined){
            result =  await pool.request().query(`select * from order_details where p_id in (select p_id from products where u_id = (select u_id from users where username = '${val2}')) and status =${val4}`)
        }
        else {
        result =  await pool.request().query(`select * from order_details where o_id in (select o_id from orders where u_id = (select u_id from users where username = '${val2}'))`)

        }
         console.log(result);
         let arr =  [];
         for(let i=0;i<result.recordset.length;i++){
             arr.push({id:result.recordset[i].o_id,productId:result.recordset[i].p_id,status:result.recordset[i].status,quantity:result.recordset[i].quantity});
            }
            return arr;
    }
    catch(err){
       console.log('some error occur in the findOrders function '+err);
    }  
    finally {
        pool.close();

    }

}
async function updateSellerProduct(val1,val2,val3,val4){
    await test();
    try {
         await pool.request().query(`update products set name = '${val2}',image = '${val3}', descMain = '${val4.descMain}', description = '${val4.description}',Rating = ${val4.Rating},RAM = '${val4.RAM}',warranty = ${val4.warranty}, color = '${val4.color}',stocks = ${val4.stocks} where p_id = ${val1}`)
    }
    catch(err){
            console.log("Fail to update the seller Product "+err);
    }
    finally {
        pool.close();
    }
}

module.exports={createUser,findUser,updateUser,findProduct,updateProduct,createSeller,createProduct,updateCart,deleteFromCart,deleteProduct,findProductFromCart,createOrder,updateOrders,findSeller,findOrders,updateSellerProduct};