const express = require('express');
const graphqlHTTP = require('express-graphql');

const app = express();

//Single endpoint for graphql
app.use('/graphql', graphqlHTTP({

}))

const port = 4000;

app.listen(port, ()=>{
    console.log(`Now listening on port ${port}`)
})