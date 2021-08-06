const nodemailer = require('nodemailer');
const ejs = require('ejs');
const htmlToText = require('html-to-text');
// const catchAsync = require('./catchAsync');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Igbatayo Adetunji <${process.env.EMAIL_FROM}>`;
    }

    //1) Create a transporter
    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            // Mailgun
            return nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USERNAME,
                    pass: process.env.GMAIL_PASSWORD
                }
            });
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async send(template, subject) {
        // Send the actual email
        // 1) Render the HTML based on an ejs template
        const html = await ejs.renderFile(`${__dirname}/../views/email/${template}.ejs`, {
            firstName: this.firstName,
            url: this.url,
            subject
        });

        // 2) Define the email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html, 
            text: htmlToText.fromString(html)
        };

        // 3) Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to the Natours Family!');
    }

    async sendPasswordReset() {
        await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)');
    }
};