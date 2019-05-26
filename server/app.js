const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

const app = express();

//OBS! need to take this data into .env
mongoose.connect('mongodb+srv://admin:reffen123@cluster0-nvtf4.mongodb.net/test?retryWrites=true');
mongoose.connection.once('open', () => {
    console.log('connected to database')
})


//Single endpoint for graphql
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql : true
}))

const port = 4000;

app.listen(port, ()=>{
    console.log(`Now listening on port ${port}`)
})