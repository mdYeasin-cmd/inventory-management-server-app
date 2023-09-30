const formData = require('form-data');
const Mailgun = require('mailgun.js');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// send mail using mailgun
const mailgun = new Mailgun(formData);

const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY
});


exports.sendMailWithMailGun = async (data) => {
    try {
        const result = await mg.messages
            .create("sandboxc0f89b71cdf744ca802fac4cdf094637.mailgun.org", {
                from: 'Excited User <me@samples.mailgun.org>',
                to: data.to,
                subject: data.subject,
                text: data.text
            });

        console.log(result, "MainGun result");
        return result.id;
    } catch (error) {
        console.log("MainGun error", error);
    }
};

// send mail using gmail
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const SENDER_MAIL = process.env.SENDER_MAIL;
const REDIRECT_URL = process.env.REDIRECT_URL;

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

exports.sendMailWithEmail = async (data) => {
    try {
        console.log("Befor get access token");

        const accessToken = await oAuth2Client.getAccessToken();

        console.log("After get access token");

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: SENDER_MAIL,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        const mailData = {
            from: SENDER_MAIL,
            to: data.to,
            subject: data.subject,
            text: data.text
        }

        console.log(mailData, "Mail data");

        let info = await transporter.sendMail(mailData);

        console.log("Message sent", info.messageId);

        console.log("Preview URL", nodemailer.getTestMessageUrl(info));

        return info.messageId;
    } catch (error) {
        console.log(error, "Email with gmail error");
    }
}