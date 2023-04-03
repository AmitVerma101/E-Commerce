const nodemailer=require('nodemailer');
const sellerMail= async (req,res,val,username,password)=>{

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'jessica.welch72@ethereal.email',
            pass: '14hmk4rZMWE3KKxtcp'
        }
    });
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <admin@example.com>', // sender address
        to: val, // list of receivers
        subject: "Hello Seller", // Subject line
        text: 'Details for your seller account are as follows:', // plain text body
        html: `Your username for the seller account is ${username} and password is ${password}`, // html body
      });
   // res.json(info);
}
module.exports=sellerMail;