const express = require('express');
const { graphqlHTTP } = require('express-graphql'); // The name of graphqlHTTP is a convention
const mongoose = require('mongoose');
const cors = require('cors');

// We load the schemas
const bookSchema = require('./schema/schema');

// dotenv loads environment variables from a .env file into process.env. 
// This makes development simpler. Instead of setting environment variables 
// on our development machine, they can be stored in a file. 
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// allow cross-origin requests
app.use(cors());

const uri = process.env.ATLAS_URI;

// The section useNewUrlParser: true is added because the MongoDB Node.js 
// driver rewrote the tool it uses to parse MongoDB connection strings. 
// Because this is such a big change, they put the new connection string 
// parser behind a flag. The section useCreateIndex: true is similar. 
// It is to deal with MongoDB deprecating the ensureIndex() function.
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;

connection.once('open', () => {
    console.log("MongoDB database connection established succesfully");
});

app.use('/graphql', graphqlHTTP({
    schema: bookSchema,
    graphiql: true
}));

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})