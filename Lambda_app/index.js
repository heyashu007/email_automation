const aws = require("aws-sdk");
const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  const { senderEmail, senderName, message, base64Data, date } = JSON.parse(
    event.body
  );

  const base64RemoveDataURI = base64Data.replace(
    "data:application/pdf;base64,",
    ""
  );

  let transporter = nodemailer.createTransport({
    SES: new aws.SES({ region: "ca-central-1", apiVersion: "2010-12-01" }),
  });

  let emailProps = await transporter.sendMail({
    from: senderName,
    to: senderEmail,
    subject: date,
    text: message,
    html: "<div>" + message + "</div>",
    attachments: [
      {
        filename: "TEST_FILE_NAME.pdf",
        content: base64RemoveDataURI,
        encoding: "base64",
      },
    ],
  });

  return emailProps;
};
