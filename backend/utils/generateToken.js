import jwt from 'jsonwebtoken';

// This function generates a signed JSON Web Token.
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // The token will be valid for 30 days
  });
};

export default generateToken;
