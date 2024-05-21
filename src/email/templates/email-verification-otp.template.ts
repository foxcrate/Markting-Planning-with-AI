let emailVerificationOtp = (otp: string) => {
  return `
        <p>Hello , use this otp to verify your email</p>
        <h3>${otp}</h3>
      `;
};

export default emailVerificationOtp;
