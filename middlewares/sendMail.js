const nodemailer=require('nodemailer');
const sendMail= async (req,res,val,email)=>{

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'gunnar23@ethereal.email',
            pass: 'NBCqWbqbG4ZpdGqXF2'
        }
    });
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: `<b>Hello world?</b> <a href="http://localhost:3000/verifyEmail/${val}">click here</a>`, // html body
      });
   // res.json(info);
}
module.exports=sendMail;