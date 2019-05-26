const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');

const app = express();

//Single endpoint for graphql
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql : true
}))

const port = 4000;

app.listen(port, ()=>{
    console.log(`Now listening on port ${port}`)
})