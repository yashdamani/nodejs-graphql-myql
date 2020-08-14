import Express from "express";
import { graphqlHTTP } from "express-graphql";
import Schema from "./Schemas/schema";
import config from "./Config/config";
// Config
const PORT = process.env.port || config.PORT;

// Start
const app = Express();

// GraphQL
app.use(
  "/graphql",
  graphqlHTTP({
    schema: Schema,
    pretty: true,
    graphiql: true,
  })
);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
