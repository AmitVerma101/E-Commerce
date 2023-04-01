
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
            let obj = await  Product.find({}).skip(val1*5).limit(val2)
            console.log("printing obj")
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
async function deleteFromCart(val1,val2,val3,val4){
    await Cart.deleteOne({[val1]:val2,[val3]:val4})

}

async function findProductFromCart(val){
    try {
            let items = await Cart.find({username:val.username});
            let newArr1 = [];
            let newArr2 = [];
            for(let i=0;i<items.length;i++){
                newArr1.push({pId:items[i].pId,quantity:items[i].quantity});
                let product = await  Product.find({id:items[i].pId});
                if(product.length>0){
                    newArr2.push(product[0]);
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
                        let stocks = await Order.find({id:val4})
                        stocks = stocks[0].stocks;
                        await Order.updateOne({id:val4},{stocks:stocks+1})
                    }
                    // else {
                    //     await Cart.updateOne({username:val2,pId:val4},{quantity:quantity+1});
                    // }


                }
                else {
                    let stocks = await Order.find({id:val4});
                    stocks = stocks[0].stocks;
                    if(stocks > 1){
                        await Cart.updateOne({username:val2,pId:val4},{quantity:quantity+1});
                        await Order.updateOne({id:val4},{stocks:stocks-1})
                    }
                }
                return true;
    }
    catch(err){
        console.log("Fail to update value of quantity in the updateCart function"+err);
        return false;
    }
}
async function updateProduct(val1,val2,val3){
   
    try{
         let cart = new Cart({username:val2,pId:val3,quantity:1});
         await cart.save()
     //    await  User.updateOne({[val1]:val2},{$push:{products:{pId:[val3][0],quantity:1}}})
       
    }
    catch(err){
        console.log("Error occur Database cant be opened")
    }
   console.log("after the database query")
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
            await Product.deleteOne({id:val})
    }
    catch(err){
        console.log("Fail to delete the product"+err);
    }
}

async function createOrder(val){
    try {
          let order=new Order(val)
          await order.save()
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

