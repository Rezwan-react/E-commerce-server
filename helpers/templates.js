const emailVerifyTemplates = (otp) => {
    return `
        <div style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0; background-color: #f4f4f4;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #4f46e5; padding: 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Your OTP Code</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; text-align: left;">
              <p style="font-size: 16px; color: #333333; line-height: 1.5;">
                Hello,
              </p>
              <p style="font-size: 16px; color: #333333; line-height: 1.5;">
                Use the following OTP to complete your verification. This code is valid for the next 5 minutes.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <span style="display: inline-block; font-size: 28px; letter-spacing: 8px; color: #4f46e5; font-weight: bold;">
                  ${otp}
                </span>
              </div>
              <p style="font-size: 14px; color: #666666; line-height: 1.5;">
                If you did not request this, you can safely ignore this email.
              </p>
              <p style="font-size: 14px; color: #666666; line-height: 1.5; margin-top: 30px;">
                Thank you,<br/>
                
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f4f4f4; text-align: center; padding: 20px; font-size: 12px; color: #888888;">
              &copy; 2025 Your Company. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>
    `
}

const resetPasswordTemplates = (randomString, email) => {
    return `
  <div style="margin: 0; padding: 0; background-color: #e9eff5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; font-family: Arial, sans-serif; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background: linear-gradient(90deg, #007BFF 0%, #00C6FF 100%); padding: 30px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px;">Reset Your Password</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px; color: #444444; font-size: 16px; line-height: 24px;">
              <p style="margin: 0 0 20px 0;">
                Hello,
              </p>
              <p style="margin: 0 0 20px 0;">
                We received a request to reset your password. Click the button below to create a new one:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.BASE_URL}/api/v1/auth/resetPassword/${randomString}?email=${email}" 
                   style="background-color: #007BFF; color: white; text-decoration: none; padding: 14px 28px; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Reset Password
                </a>
              </div>
               <p style="font-size: 16px; color: #333333; line-height: 1.5;">
                This link will expire in 10 minutes. for security reasons. 
              </p>
              <p style="margin: 0 0 20px 0;">
                If you didn’t request this, you can ignore this email — your password will remain unchanged.
              </p>
              <p style="margin: 0;">
                Thanks
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #f0f4f8; padding: 20px; font-size: 12px; color: #888888;">
              © 2025 Your Company. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>
  `
}

module.exports = { emailVerifyTemplates, resetPasswordTemplates }