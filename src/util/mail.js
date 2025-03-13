import nodemailer from 'nodemailer';
// import path from 'path';

// Create a transporter using SMTP server information from process.env
const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: '587',
    secure: false, // Set to true if using SSL/TLS
    auth: {
        user: 'no-reply.whiteboard@outlook.com',
        pass: 'Qwerty!23456',
    },
    tls: {
        ciphers:'SSLv3'
    }
});

// Define the email options
export function sendMail(recipient, subject, text, html) {
    const mailOptions = {
        from: 'no-reply.whiteboard@outlook.com',
        to: recipient,
        subject: subject,
        text: text,
        html: html,
    };

    console.log(mailOptions);
    
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return error;
        } else {
            console.log('Email sent:', info.response);
            return info.response;
        }
    });
}