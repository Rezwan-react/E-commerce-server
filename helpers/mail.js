const nodemailer = require("nodemailer");

const sendMail = async (email, subject, template, random) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        secure: true, // true for port 465, false for other ports
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // send mail with defined transport object
    await transporter.sendMail({
        from: '"on reply" ChatWeb',
        to: email,
        subject: subject,
        html: template(random, email)
    });
}

module.exports = sendMail