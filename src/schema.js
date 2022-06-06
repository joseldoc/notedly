const {gql} = require('apollo-server-express');

module.exports = gql `
    scalar DateTime
    type Note {
        id: ID!,
        content: String!,
        author: User!,
        # favorite
        favoriteCount: Int!
        favoriteBy: [User!]!
        createdAt: DateTime!,
        updatedAt: DateTime!
    },
    type User {
        id: ID!
        username: String!
        email: String!
        avatar: String
        notes: [Note!]!
        favorites: [Note!]!
    },
    type Query {
        hello: String
        notes: [ Note! ]!
        note(id: ID!): Note!
        users: [User!]!
        user(username: String!): User!
        me: User!
        noteFeed(cursor: String): NoteFeed
    }
    type Mutation {
        newNote(content: String!): Note!,
        updateNote(id: ID!, content: String!):Note!,
        deleteNote(id: ID!): Boolean!
        signUp(email: String!, password: String!, username: String!): String!
        signIn(email: String!, password: String!): String!
        deleteUser(id: ID!): Boolean!
        # favourite actions
        toogleFavorite(id:ID!): Note!
    }
    type NoteFeed {
        notes: [Note]!
        cursor: String!
        hasNextPage: Boolean!
    }
`;