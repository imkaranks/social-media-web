import { sendMail } from "./sendMail.js";

const htmlTemplate = (email, token) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="UTF-8" />
    <meta content="width=device-width, initial-scale=1" name="viewport" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title></title>
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i" rel="stylesheet" />
  </head>
  <body>
    <div style="margin: 0 auto; max-width: 600px; font-family: Roboto, Arial, sans-serif;">
      <header style="padding: 20px 0; text-align: center;">
        <a style="text-decoration: none; color: black; font-size: 22px; font-weight: 600;" href="${process.env.CORS_ORIGIN}">
        QuietSphere
        </a>
      </header>
      <div style="background-color: #365cce; color: white; text-align: center; padding: 20px 0;">
        <div style="margin-top: 10px;">
          <div style="font-size: 12px; font-weight: normal; text-transform: uppercase;">THANKS FOR SIGNING UP!</div>
          <div style="font-size: 24px; font-weight: bold; text-transform: capitalize; margin-top: 10px;">Verify your E-mail Address</div>
        </div>
      </div>
      <div style="padding: 20px;">
        <h2 style="color: #333;">Hey there,</h2>
        <p style="margin-top: 10px; line-height: 1.6; color: #666;">Please use the following call to action</p>
        <p style="margin-top: 10px; line-height: 1.6; color: #666;">
          This verification token will only be valid for the next <span style="font-weight: bold;">30 minutes</span>. If the verification token does not work, you can login again and new verification token will be sent to you. Use the
          verification link below:
        </p>
        <a
          href="${process.env.CORS_ORIGIN}/verify/?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}"
          style="
          display: inline-block;
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #ffa500;
          color: white;
          text-decoration: none;
          font-weight: bold;
          text-transform: uppercase;
          border-radius: 4px;
          transition: background-color 0.3s ease;
          "
          >
        Verify email
        </a>
        <p style="margin-top: 20px; line-height: 1.6; color: #666;">
          Thank you,<br />
          QuietSphere Team
        </p>
      </div>
      <p style="color: #999; font-size: 12px; padding: 0 20px; margin-top: 20px;">
        This email was sent from <a href="#" style="color: #365cce; text-decoration: none;">no-reply@quietsphere.com</a>. If you'd rather not receive this kind of email, you can
        <a href="#" style="color: #365cce; text-decoration: none;">unsubscribe</a> or <a href="#" style="color: #365cce; text-decoration: none;">manage your email preferences</a>.
      </p>
      <footer style="background-color: rgba(0, 0, 0, 0.1); padding: 20px;">
        <div>
          <div style="text-align: center; margin: auto;">
            <h1 style="color: #365cce; font-weight: 600; text-transform: uppercase; font-size: 16px;">Get in touch</h1>
            <a href="#" style="color: #999; text-decoration: none; display: block; margin-top: 5px;" alt="9876543210">9876543210</a>
            <a href="#" style="color: #999; text-decoration: none; display: block; margin-top: 5px;" alt="no-reply@quietsphere.com">no-reply@quietsphere.com</a>
          </div>
          <div style="margin-top: 10px; margin: auto;">
            <a href="#" style="color: gray; display: inline-block; margin-right: 10px;">
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                <path fill="none" d="M0 0h16v16H0z"></path>
                <path
                  d="M16 8.049c0-4.446-3.582-8.05-8-8.05-4.418 0-8 3.604-8 8.05 0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"
                  ></path>
              </svg>
            </a>
            <a href="#" style="color: gray; display: inline-block; margin-right: 10px;">
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16 4.2V11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4.2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2zm-5.009 1.747a1.751 1.751 0 1 0 0 3.502 1.751 1.751 0 0 0 0-3.502zm1.25 4.662H7.76V9.573h3.48v.036c-.004.483.03.963.09 1.44a3.43 3.43 0 0 0 2.748-1.46l1.162.078a4.168 4.168 0 0 1-3.91 2.896zm2.5-6.908h-3V6.4h3v-.391z"
                  ></path>
              </svg>
            </a>
            <a href="#" style="color: gray; display: inline-block; margin-right: 10px;">
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M512 378.7c-73.4 0-133.3 59.9-133.3 133.3S438.6 645.3 512 645.3 645.3 585.4 645.3 512 585.4 378.7 512 378.7zM911.8 512c0-55.2.5-109.9-2.6-165-3.1-64-17.7-120.8-64.5-167.6-46.9-46.9-103.6-61.4-167.6-64.5-55.2-3.1-109.9-2.6-165-2.6-55.2 0-109.9-.5-165 2.6-64 3.1-120.8 17.7-167.6 64.5C132.6 226.3 118.1 283 115 347c-3.1 55.2-2.6 109.9-2.6 165s-.5 109.9 2.6 165c3.1 64 17.7 120.8 64.5 167.6 46.9 46.9 103.6 61.4 167.6 64.5 55.2 3.1 109.9 2.6 165 2.6 55.2 0 109.9.5 165-2.6 64-3.1 120.8-17.7 167.6-64.5 46.9-46.9 61.4-103.6 64.5-167.6 3.2-55.1 2.6-109.8 2.6-165zM512 717.1c-113.5 0-205.1-91.6-205.1-205.1S398.5 306.9 512 306.9 717.1 398.5 717.1 512 625.5 717.1 512 717.1zm213.5-370.7c-26.5 0-47.9-21.4-47.9-47.9s21.4-47.9 47.9-47.9 47.9 21.4 47.9 47.9a47.84 47.84 0 0 1-47.9 47.9z"
                  ></path>
              </svg>
            </a>
            <a href="#" style="color: gray; display: inline-block;">
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                <path fill="none" d="M0 0h16v16H0z"></path>
                <path
                  d="M16 8.049c0-4.446-3.582-8.05-8-8.05-4.418 0-8 3.604-8 8.05 0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"
                  ></path>
              </svg>
            </a>
          </div>
        </div>
        <div style="background-color: #365cce; padding: 10px; text-align: center; margin-top: 10px; color: white;">
          <p style="margin: 0;">© ${new Date().getFullYear()} QuietSphere. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  </body>
</html>
`;

const sendVerificationEmail = async (email, token) => {
  try {
    return await sendMail({
      email,
      subject: "Verification for QuietSphere",
      text: "Click the link below to verify your email address:",
      html: htmlTemplate(email, token),
    });
  } catch (error) {
    throw new Error(error?.message || "Failed to send verification email");
  }
};

export default sendVerificationEmail;
