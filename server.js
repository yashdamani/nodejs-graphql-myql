import Express from "express";
import { graphqlHTTP } from "express-graphql";
import Schema from "./Schemas/schema";
// Config
const APP_PORT = 3000;

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

app.listen(APP_PORT, () => {
  console.log(`App listening on port ${APP_PORT}`);
});
