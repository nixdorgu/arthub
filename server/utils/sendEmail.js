const nodemailer = require('nodemailer');
require('dotenv').config();

function sendEmail({
  sender, recipient, transactionId, link, artist, onSuccess, onError,
} = {}) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  const mail = {
    from: sender,
    to: recipient,
    subject: `Submission for ${transactionId}`,
    text: `This ${link} is for the completion of transaction ${transactionId} by ${artist}`,
    html: `<p>This <a href=${link}>link</a> is for the completion of transaction <strong>${transactionId}</strong> by ${artist}</p>`,
  };

  return transporter.sendMail(mail, (error, info) => {
    if (!error && info.rejected.length === 0) {
      return onSuccess();
    }

    return onError();
  });
}

module.exports = sendEmail;
