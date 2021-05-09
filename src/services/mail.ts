import nodemailer from 'nodemailer';
import Config from '../config/mail';

interface IMail {
  to ?: string,
  subject ?: string,
  message ?: string
}

export default {
  async SendMail({to, subject, message}: IMail){

    let mailOptions ={
      from: "suporte@placarvolei.com.br",
      to,
      subject,
      html: message
    };

    const transporter = nodemailer.createTransport(Config);

    transporter.sendMail(mailOptions, async (error, info) =>{
      if (error) {
        console.log(error);
        return await error;
      } else {
        console.log('Email sent: ' + info.response);
        return await info;
      }
    });
  }
}
