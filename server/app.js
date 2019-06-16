const express = require("express");
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const schema = require("./schema");

require('dotenv').config();

const app = express();

//cross origin requests
app.use(cors())

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-nvtf4.mongodb.net/test?retryWrites=true`
);
mongoose.connection.once("open", () => {
  console.log("connected to database");
});

//Single endpoint for graphql
app.use(
    "/graphql",
    graphqlHTTP({
      schema,
      graphiql: true
    })
  );

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
