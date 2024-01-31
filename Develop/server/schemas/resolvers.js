const { AuthenticationError } = require('apollo-server-express');
const { User } = require('./models'); // Import your User model

const resolvers = {
  Query: {
    me: async (_, __, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id);
        return user;
      }
      throw new AuthenticationError('You are not logged in.');
    },
  },
  Mutation: {
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPassword = await user.isCorrectPassword(password);

      if (!correctPassword) {
        throw new AuthenticationError('Incorrect password');
      }

      const token = signToken(user);
      return { token, user };
    },
    addUser: async (_, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (_, { bookData }, context) => {
      if (context.user) {
        const user = await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: bookData } },
          { new: true }
        );
        return user;
      }
      throw new AuthenticationError('You need to be logged in to save a book.');
    },
    removeBook: async (_, { bookId }, context) => {
      if (context.user) {
        const user = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return user;
      }
      throw new AuthenticationError('You need to be logged in to remove a book.');
    },
  },
  User: {
    // Resolve the savedBooks field for the User type
    savedBooks: async (parent) => {
      const user = await User.findById(parent._id).populate('savedBooks');
      return user.savedBooks;
    },
  },
};

module.exports = resolvers;

