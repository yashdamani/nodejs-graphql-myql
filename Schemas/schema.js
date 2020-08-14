import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} from "graphql";

import UserSchema from "../models/databaseModel";
import bcrypt from "bcryptjs";
import config from "../Config/config";

//GraphQL API Schemas

//User Schema
const User = new GraphQLObjectType({
  name: "Users",
  description: "This represents a user",
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(user) {
          return user.id;
        },
      },
      username: {
        type: GraphQLString,
        resolve(user) {
          return user.username;
        },
      },
      email: {
        type: GraphQLString,
        resolve(user) {
          return user.email;
        },
      },
      tweets: {
        type: new GraphQLList(Tweet),
        resolve(user) {
          return user.getTweets();
        },
      },
      followers: {
        type: new GraphQLList(Followers),
        resolve(user) {
          return user.getFollowers();
        },
      },
    };
  },
});

//Tweet Schema

const Tweet = new GraphQLObjectType({
  name: "Tweet",
  description: "Tweet",
  fields() {
    return {
      id: {
        type: GraphQLInt,
        resolve(tweet) {
          return tweet.id;
        },
      },
      body: {
        type: GraphQLString,
        resolve(tweet) {
          return tweet.body;
        },
      },
      user: {
        type: User,
        resolve(tweet) {
          return tweet.getUser();
        },
      },
    };
  },
});

//Followers Schema

const Followers = new GraphQLObjectType({
  name: "Followers",
  description: "Followers",
  fields() {
    return {
      follower_id: {
        type: GraphQLInt,
        resolve(followers) {
          return followers.follower_id;
        },
      },
      userId: {
        type: GraphQLInt,
        resolve(followers) {
          return followers.userId;
        },
      },
      user: {
        type: User,
        resolve(followers) {
          return followers.getUser();
        },
      },
      followingTweets: {
        type: Tweet,
        resolve(followers) {
          return followers.getTweets();
        },
      },
    };
  },
});

//GraphQL Queries (GET)

const Query = new GraphQLObjectType({
  name: "Query",
  description: "Root query object",
  fields: () => {
    return {
      users: {
        type: new GraphQLList(User),
        args: {
          id: {
            type: GraphQLInt,
          },
          email: {
            type: GraphQLString,
          },
        },
        resolve(_, args) {
          return UserSchema.models.users.findAll({ where: args });
        },
      },
      tweets: {
        type: new GraphQLList(Tweet),
        args: {
          userId: {
            type: GraphQLInt,
          },
        },
        resolve(_, args) {
          return UserSchema.models.tweets.findAll({ where: args });
        },
      },
      allUsers: {
        type: new GraphQLList(User),
        resolve(_, args) {
          return UserSchema.models.users.findAll({ where: args });
        },
      },
    };
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "This is a Mutation",
  fields: () => {
    return {
      addUser: {
        type: User,
        args: {
          username: {
            type: GraphQLNonNull(GraphQLString),
          },
          email: {
            type: GraphQLNonNull(GraphQLString),
          },
          password: {
            type: GraphQLNonNull(GraphQLString),
          },
        },
        resolve(_, args) {
          return UserSchema.models.users.create({
            username: args.username,
            email: args.email.toLowerCase(),
            password: bcrypt.hashSync(args.password, config.SALT_ROUNDS),
          });
        },
      },
      addTweet: {
        type: Tweet,
        args: {
          userId: {
            type: GraphQLNonNull(GraphQLInt),
          },
          body: {
            type: GraphQLNonNull(GraphQLString),
          },
        },
        resolve(_, args) {
          return UserSchema.models.tweets.create({
            userId: args.userId,
            body: args.body,
          });
        },
      },
      follow: {
        type: Followers,
        args: {
          userId: {
            type: GraphQLNonNull(GraphQLInt),
          },
          follower_id: {
            type: GraphQLNonNull(GraphQLInt),
          },
        },
        resolve(_, args) {
          return UserSchema.models.followers.create({
            userId: args.userId,
            follower_id: args.follower_id,
          });
        },
      },
      login: {
        type: GraphQLString,
        args: {
          email: {
            type: new GraphQLNonNull(GraphQLString),
          },
          password: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve(_, args) {
          UserSchema.models.users
            .findOne({
              where: { email: args.email },
            })
            .then((result) => {
              bcrypt.compare(
                args.password,
                result.dataValues.password,
                (err, passwordExists) => {
                  if (err) {
                    console.log("Something went wrong");
                    return "Something went wrong";
                  } else if (passwordExists) {
                    console.log("Logged In!");
                    return "Logged In!";
                  } else {
                    console.log("Credentials don't match!");
                    return "Credentials don't match!";
                  }
                }
              );
            })
            .catch((err) => {
              console.log("Credentails don't exit!");
              return "Credentails don't exit!";
            });
        },
      },
    };
  },
});

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});

export default Schema;
