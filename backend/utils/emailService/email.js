// import {
//   PASSWORD_RESET_REQUEST_TEMPLATE,
//   PASSWORD_RESET_SUCCESS_TEMPLATE,
//   VERIFICATION_EMAIL_TEMPLATE,
//   WELCOME_EMAIL_TEMPLATE
// } from "./emailTemplates.js";
 import {
  PASSWORD_RESET_REQUEST_TEMPLATE,

 } from "./emailTemplates.js";
// import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

// const sesClient = new SESv2Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// const senderEmail = process.env.AWS_SES_SENDER; // Must be verified in AWS SES

// const sendEmail = async ({ toEmail, subject, html }) => {
//   const command = new SendEmailCommand({
//     FromEmailAddress: senderEmail,
//     Destination: {
//       ToAddresses: [toEmail],
//     },
//     Content: {
//       Simple: {
//         Subject: {
//           Data: subject,
//         },
//         Body: {
//           Html: {
//             Data: html,
//           },
//         },
//       },
//     },
//   });

//   try {
//     const response = await sesClient.send(command);
//     console.log(`Email sent to ${toEmail}:`, response.MessageId);
//     return response;
//   } catch (error) {
//     console.error(`Error sending email to ${toEmail}`, error);
//     throw new Error(`Failed to send email: ${error.message}`);
//   }
// };
// utils/emailService.js
import { Resend } from 'resend';

const resend = new Resend("re_FuvSwiP6_BFviz4SLBvYgBXYZidc8TrNj");
const senderEmail = 'Support <support@lootcrate.me>'; // Must be verified in Resend

export const sendEmail = async ({ toEmail, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: senderEmail,
      to: toEmail,
      subject,
      html,
    });

    if (error) {
      console.error(`Error sending email to ${toEmail}`, error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return data;
  } catch (err) {
    throw new Error(`Resend error: ${err.message}`);
  }
};

// === Email Handlers ===

export const sendVerificationEmail = async (email, verificationToken) => {
  const html = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken);
  return sendEmail({ toEmail: email, subject: "Verify your email", html });
};

export const sendWelcomeEmail = async (email, name) => {
  const dashboardUrl = "https://airdropz.io/dashboard";
  const html = WELCOME_EMAIL_TEMPLATE
    .replace("{userName}", name)
    .replace("{dashboardUrl}", dashboardUrl);

  return sendEmail({ toEmail: email, subject: "Welcome to Airdropz!", html });
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const html = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL);
  return sendEmail({ toEmail: email, subject: "Reset your password", html });
};

export const sendResetSuccessEmail = async (email) => {
  return sendEmail({ toEmail: email, subject: "Password Reset Successful", html: PASSWORD_RESET_SUCCESS_TEMPLATE });
};

//re_ZopCbCN2_reL5FCLvKn6HC3XGW4KZUVbX