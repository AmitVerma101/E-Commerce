const nodemailer=require('nodemailer');
const forgotPassword= async (req,res,val)=>{

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
        to: `${val}`, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: `<a href="http://localhost:3000/changePassword">click me</a>`, // html body
      });
   // res.json(info);
}
module.exports=forgotPassword;