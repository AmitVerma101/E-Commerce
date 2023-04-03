const nodemailer=require('nodemailer');
const confirmMail= async (req,res,val)=>{

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'jessica.welch72@ethereal.email',
            pass: '14hmk4rZMWE3KKxtcp'
        }
    });
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: val, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: `<b>Password changed successfully</b>`, // html body
      });
   // res.json(info);
}
module.exports=confirmMail;