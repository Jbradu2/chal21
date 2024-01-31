import { gql } from '@apollo/client';

export const GET_USER = gql`
  query GetUser {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;

