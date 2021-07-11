const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const schema = require("./schema");
const path = require("path");

// Allow cross-origin
app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.use(express.static("public"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
