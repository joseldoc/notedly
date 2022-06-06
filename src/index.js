const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const depthLimit = require('graphql-depth-limit');
const {createComplexityLimitRule} = require('graphql-validation-complexity');

require('dotenv').config();
const app = express();
const helmet = require('helmet');
const cors = require('cors');

// Secure http headers with hemet and cors
app.use(helmet());
app.use(cors())

const port = process.env.PORT || 4000;
const userService = require('./service/user');

// local module import
const db = require('./db');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const models = require('./models');

// Connect to mongoDB Atlas atlas
db.connect(process.env.DB_HOST);

// Configure appolo server to deal with GraphQl
const server = new ApolloServer({
    typeDefs, 
    resolvers,
    validationRules: [depthLimit(5), createComplexityLimitRule[1000]], // include complexity rules 
    context : ({req}) => {
        // get token 
        const token = req.headers.authorization;
        let user = userService.getUser(token);
        return {models, user}
    }
});

server.applyMiddleware({app, path: '/api'});
app.listen({port}, () => console.log(`Server running on http://localhost:${port}${server.graphqlPath}`));
