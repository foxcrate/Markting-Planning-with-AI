let VerificationEmail = (userName, token) => {
  return `
    <p>Hello ${userName}, verify your email by clicking this link...</p>
    <a href ='${process.env.CLIENT_URL}/verify-email?emailVerificationToken=${token}'>Verify Your
    Email</a>
  `;
};

export default VerificationEmail;
