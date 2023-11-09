/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest, onCall} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const nodemailer = require("nodemailer");

const myEmail = "pierre.monier.dev@gmail.com";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  auth: {
    user: myEmail,
    pass: "brdwpttruknpfanf",
  },
});

exports.sendEmail = onCall((request) => {
  try {
    const email = request.data.email;
    const message = request.data.message;

    transporter.sendMail({
      from: email,
      to: myEmail,
      subject: "Wonder formula feedback",
      text: `${email}\n${message}`,
    })

    return {
      data: "success",
    }
  } catch (errors) {
    logger.error(errors);
    return {
      data: "error",
    }
  }
});
