let ForgetPasswordEmail = (userName: string, otp: string) => {
  return `
      <p>Hello ${userName}, You requested to change your password here is your OTP...</p>
      <h3>${otp}</h3>
    `;
};

export default ForgetPasswordEmail;
