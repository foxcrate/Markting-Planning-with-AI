export class GoogleReturnDataSerializer {
  static serialize(data) {
    return {
      googleId: data.sub,
      firstName: data.given_name,
      lastName: data.family_name,
      email: data.email,
      profilePicture: data.picture,
    };
  }
}
