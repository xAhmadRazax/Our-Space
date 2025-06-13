export function generateForgotPasswordEmailString(
  username: string,
  url: string,
  siteName: string
): string {
  return `
  <body style="margin: 0; padding: 0; background-color: #f4f4f4">
    <div
      style="
        max-width: 600px;
        margin: 20px auto;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        overflow: hidden;
        font-family: 'Segoe UI', sans-serif;
      "
    >
      <div
        style="
          background-color: #28a745;
          color: #fff;
          padding: 20px;
          text-align: center;
        "
      >
        <h1 style="margin: 0; font-size: 24px">Reset Your Password</h1>
      </div>
      <div style="padding: 20px; color: #333">
        <p style="margin: 0 0 15px">Hello, <strong>${username}</strong>,</p>
        <p style="margin: 0 0 15px">
          We received a request to reset your password. Click the button below
          to proceed:
        </p>
        <p style="margin: 30px 0">
          <a
            href="${url}"
            target="_blank"
            style="
              background-color: #28a745;
              color: #fff;
              padding: 12px 25px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
            "
          >
            Reset Password
          </a>
        </p>
        <p style="margin: 0 0 10px">
          If you didn't request this, you can safely ignore this email.
        </p>
        <p style="margin: 0">Thanks,<br />The ${siteName} Team</p>
      </div>
      <div
        style="
          background: #f9f9f9;
          color: #888;
          text-align: center;
          font-size: 12px;
          padding: 15px;
        "
      >
        &copy; ${new Date().getFullYear()} ${siteName}. All rights reserved.
      </div>
    </div>
  </body>

`;
}
export const generateVerificationEmailString = (
  username: string,
  url: string,
  siteName: string,
  isResend: boolean = false
): string => {
  const introText = isResend
    ? "To get started, please verify your email by clicking the button below:"
    : "Welcome to Our-Space! Please verify your email to complete your registration:";

  return `
    <body style="margin: 0; padding: 0; background-color: #f4f4f4">
      <div
        style="
          max-width: 600px;
          margin: 20px auto;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          font-family: 'Segoe UI', sans-serif;
        "
      >
        <div
          style="
            background-color: #28a745;
            color: #fff;
            padding: 20px;
            text-align: center;
          "
        >
          <h1 style="margin: 0; font-size: 24px">Verify Your Email</h1>
        </div>
        <div style="padding: 20px; color: #333">
          <p style="margin: 0 0 15px">Hello, <strong>${username}</strong>,</p>
          <p style="margin: 0 0 15px">
            ${introText}
          </p>
          <p style="margin: 30px 0">
            <a
              href="${url}"
              target="_blank"
              style="
                background-color: #28a745;
                color: #fff;
                padding: 12px 25px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
              "
            >
              Verify Email
            </a>
          </p>
          <p style="margin: 0 0 10px">
            If you didn’t create an account, you can safely ignore this email.
          </p>
          <p style="margin: 0">Thanks,<br />The ${siteName} Team</p>
        </div>
        <div
          style="
            background: #f9f9f9;
            color: #888;
            text-align: center;
            font-size: 12px;
            padding: 15px;
          "
        >
          &copy; ${new Date().getFullYear()} ${siteName}. All rights reserved.
        </div>
      </div>
    </body>
    `;
};
