const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

//OBS! need to take this data into .env
mongoose.connect(
  "mongodb+srv://admin:reffen123@cluster0-nvtf4.mongodb.net/test?retryWrites=true"
);
mongoose.connection.once("open", () => {
  console.log("connected to database");
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

//Single endpoint for graphql
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
