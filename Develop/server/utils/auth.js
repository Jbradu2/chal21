const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express'); // Import AuthenticationError from apollo-server-express

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),
  // function for our authenticated routes
  authMiddleware: function ({ req }) { // Update the signature of the middleware function to match Apollo Server's context object
    let token = req.headers.authorization || ''; // Allow token to be sent via headers

    if (!token) {
      throw new AuthenticationError('You must be logged in.'); // Throw an AuthenticationError if token is missing
    }

    try {
      const { data } = jwt.verify(token, secret); // Verify token and extract user data
      req.user = data;
    } catch (err) {
      console.log('Invalid token');
      throw new AuthenticationError('Invalid token.'); // Throw an AuthenticationError if token is invalid
    }
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};