
const User=require('../userSchema');
const Product=require('../productSchema');
const Seller=require('../sellerSchema');
const Order=require('../orderSchema');
const Cart =require('../cartSchema');
async function findProduct(val1,val2,val3,val4){
    console.log(User);
    // console.log("In the find function",val);
    if(val3==undefined&&val4==undefined){
        try{
            let nobj = await  Product.find({}).skip(val1*5).limit(val2)
            let obj=[];
            console.log("printing obj")
            for(let i=0;i<nobj.length;i++){
                if(nobj[i].description[0].active==1){
                    obj.push(nobj[0]);
                }
            }
            console.log(obj);
            return obj;
        }
        catch(err){
            console.log("Error occur Database cant be opened")
        }
    }
    else {
        try{
            let obj = await  Product.find({[val3]:[val4]}).skip(val1*5).limit(val2)
            console.log("printing obj")
            console.log(obj);
            return obj;
        }
        catch(err){
            console.log("Error occur Database cant be opened")
        }
    }
   console.log("after the database query")
}
async function findUser(val1,val2){
    console.log(User);
   
    try{
        let obj = await User.find({[val1]:val2})
        console.log("printing obj")
        console.log(obj);
        return obj;
    }
    catch(err){
        console.log("Error occur Database cant be opened")
    }
   console.log("after the database query")
}
async function updateUser(val1,val2,val3,val4){
   
    try{
         await  User.updateOne({[val1]:val2},{[val3]:val4})
       
    }
    catch(err){
        console.log("Error occur Database cant be opened")
    }
   console.log("after the database query")
}
async function deleteFromCart(val1,val2,val3,val4,val5){
    try {
        console.log("In the deleteFromCart service");
        console.log("printing the val1 val2 val3 val4")
        console.log(val1,val2,val3,val4);
        if(val5==undefined){
            let cart = await Cart.find({[val1]:val2,pId:val4});
            console.log(cart);
            let quantity=cart[0].quantity;
            let product = await Product.find({id:val4});
            let arr = []
            arr.push(product[0].description[0])
            arr[0].stocks+=parseInt(quantity);
            await Product.updateOne({id:val4},{description:arr});
            
        }
        await Cart.deleteOne({[val1]:val2,pId:val4})
    }
    catch(err){
        console.log("Fail to delete from cart "+err);
    }
    
}

async function findProductFromCart(val){
    try {
            let items = await Cart.find({username:val.username});
            let newArr1 = [];
            let newArr2 = [];
            for(let i=0;i<items.length;i++){
                newArr1.push({pId:items[i].pId,quantity:items[i].quantity});
                let product = await  Product.find({id:items[i].pId});
                console.log("Printing the product in the service file");
                console.log(product);
                if(product.length>0){
                    if(product[0]!=undefined){

                        newArr2.push(product[0]);
                    }
                }
            }
            return {newArr1,newArr2}
    }
    catch(err){
            console.log("Fail to fetch the products from the cart "+err);
            let newArr1=[];
            let newArr2=[];
            return {newArr1,newArr2};

    }
}
async function updateCart(val1,val2,val3,val4,val5){
    try {
        let quantity = await Cart.find({username:val2,pId:val4});
        quantity = quantity[0].quantity
       // console.log(quantity, typeof quantity);
                if(val5=='decCount'){
                    if(quantity>1){
                        await Cart.updateOne({username:val2,pId:val4},{quantity:quantity-1});
                        let stocks = await Product.find({id:val4})
                        stocks = stocks[0].description[0];
                        let arr  = []
                        arr.push(stocks)
                        arr[0].stocks++;
                        await Product.updateOne({id:val4},{description:arr})
                        return true;
                    }
            
                }
                else {
                    let stocks = await Product.find({id:val4});
                    stocks = stocks[0].description[0];
                    let arr  = []
                    arr.push(stocks)
                    console.log(stocks);
                    if(arr[0].stocks >= 1){
                        arr[0].stocks--;
                        await Cart.updateOne({username:val2,pId:val4},{quantity:quantity+1});
                        await Product.updateOne({id:val4},{description:arr})
                            return true;
                    }
                }
                return false;
    }
    catch(err){
        console.log("Fail to update value of quantity in the updateCart function "+err);
        return false;
    }
}
async function updateProduct(val1,val2,val3){
    console.log("printing the val3",val3);
       console.log("In the updateProduct service")
    try{
        console.log("before products")
        let products = await Product.find({id:val3});
        console.log("after products")
        let cart = await Cart.findOne({username:val2,pId:val3});
        console.log("after cart")
        console.log("Printing the cart",cart);
        console.log("printing the products array")
        console.log(products[0].description[0])
        let arr =[]
        arr.push(products[0].description[0])
        if(arr[0].stocks >= 1&&cart==null){
            arr[0].stocks--;
            let cart = new Cart({username:val2,pId:val3,quantity:1});
            await cart.save()
            await Product.updateOne({id:val3},{description:arr});
            return true;
        }
        return false;
     //    await  User.updateOne({[val1]:val2},{$push:{products:{pId:[val3][0],quantity:1}}})
       
    }
    catch(err){
        console.log("Error occur Database cant be opened")
        return false;
    }
   //console.log("after the database query")
}
async function createUser(val){
    try {
        let user=new User({name:val.name,username:val.username,email:val.email,password:val.password,isVerified:val.isVerified,token:val.token,products:val.products})
        await user.save();
    }
    catch(err){
        console.log("Error occur Database can not be opened");
    }
}
async function findSeller(val1,val2,val3,val4){
    try {
       let seller = await Seller.find({[val1]:[val2]},{[val3]:[val4]});
       return seller;
    }
    catch(err){
        console.log("Error occur while finding the seller in the sellers table")
    }
}

async function createSeller(val){
    console.log(val)
    try {
         let seller=new Seller({name:val.name,username:val.username,email:val.email,password:val.password})
         await seller.save()
         
    }
    catch(err){
        console.log("Fail to create a seller "+err);
        
    }
}

async function createProduct(val,arr){
    try {
        let product = new Product(val);
        await product.save();
        await Product.updateOne({name:val.name,username:val.username},{$push:{description:arr}})
    }
    catch(err){
        console.log("Fail to add a new product");
    }
}
async function updateSellerProduct(val1,val2,val3,val4){
    try {
         await Product.updateOne({id:[val1]},{name:val2,image:val3});
         await Product.updateOne({id:[val1]},{description:val4});
    }
    catch(err) {
        console.log("Fail to update the product"+err);
    }
}
async function deleteProduct(val){
    try {
            await Product.updateOne({id:val},{active:0});
    }
    catch(err){
        console.log("Fail to delete the product"+err);
    }
}

async function createOrder(val){
    try {
        let quantity = await Cart.find({pId:val.productId});
        quantity = quantity[0].quantity;
        val.quantity=quantity;
        let price = await Product.find({id:val.productId});
        price = price[0].description[0].price;
        let total = price*quantity;
        val.total = total;
        console.log("In the createOrder service")
          let order=new Order(val)
          await order.save()
          console.log("In the end of createOrder service");
    }
    catch(err){
        console.log("Fail to place an order"+err);
    }
}
async function findOrders(val1,val2,val3,val4){
    if(val3==undefined&&val4==undefined){

        try {
            let orders= await  Order.find({[val1]:val2});
            return orders;
        }
        catch(err){
            console.log("Fail to find the orders"+err);
        }
    }
    else {
        try {
            let orders= await Order.find({[val1]:val2,[val3]:val4})
            return orders;
        }
        catch(err){
            console.log("Fail to find the orders"+err);
        }
    }
}

async function updateOrders(val1,val2,val3,val4){
    try {
        await Order.updateOne({[val1]:val2},{[val3]:val4});

    }
    catch(err){
        console.log("Fail  to update the order"+err);
    }
}
module.exports={findUser,findProduct,updateUser,updateProduct,createUser,findSeller,createSeller,createProduct,updateSellerProduct,deleteProduct,createOrder,findOrders,updateOrders,deleteFromCart,findProductFromCart,updateCart};

