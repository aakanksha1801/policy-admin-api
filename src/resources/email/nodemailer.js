
const nodemailer = require('nodemailer');
const logger = require("../../libraries/logger");
const jwt = require("jsonwebtoken");
const { th } = require('date-fns/locale');
require("dotenv").config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

const sendEmail = async (email , sellerId, type) => {
    try {
        const verification_token = jwt.sign(
            { seller : { id: sellerId } },
            process.env.JWT_ACCOUNT_ACTIVATION,
            { expiresIn: "30m" }
        );
        const mailOptionsVerification = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: "Account activation link",
            html: `
            <h1>Please use the following link to verify your account</h1>
            <p>${process.env.CLIENT_URL}/seller/verify/${verification_token}</p>
            <hr />
            <p>This email may contain sensetive information</p>
            <p>${process.env.CLIENT_URL}</p>
            `,
        };

        const mailOptionsResetPassword = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: "Reset password link",
            html: `
            <h1>Please use the following link to reset your password</h1>
            <p>${process.env.CLIENT_URL}/seller/reset-password/${verification_token}</p>
            <hr />
            <p>This email may contain sensetive information</p>
            <p>${process.env.CLIENT_URL}</p>
            `,
        };
        if(type === "verification")
        await transporter.sendMail(mailOptionsVerification);
        else if(type === "resetPassword")
        await transporter.sendMail(mailOptionsResetPassword);
    } catch (error) {
        logger.error(error);
        throw error;
    }
}
module.exports = {
    sendEmail
}
