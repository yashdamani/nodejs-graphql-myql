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
const saltRounds = 10;

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
      password: {
        type: GraphQLString,
        resolve(user) {
          return user.password;
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
          return UserSchema.models.users.findAll({
            where: args,
          });
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
      // followersList: {
      //   type: new GraphQLList(Followers),
      //   args: {
      //     userId: {
      //       type: GraphQLInt,
      //     },
      //   },
      //   resolve(root, args) {
      //     return UserSchema.models.followers.findAll({ where: args });
      //   },
      // },
      allUsers: {
        type: new GraphQLList(User),
        resolve(_, args) {
          return UserSchema.models.users.findAll({ where: args });
        },
      },
      // feedTweets: {
      //   type: new GraphQLList(Tweet),
      //   args: {
      //     userId: {
      //       type: new GraphQLList(GraphQLInt),
      //     },
      //   },
      //   resolve(root, args) {
      //     return UserSchema.models.tweets.findAll({ where: args });
      //   },
      // },
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
          return UserSchema.models.users
            .create({
              username: args.username,
              email: args.email.toLowerCase(),
              password: bcrypt.hashSync(args.password, saltRounds),g
            })
            .then((result) => {
              consoe;
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

// const Mutation = new GraphQLObjectType({
//   name: "Mutation",
//   description: "Adds a User",
//   fields() {
//     return {
//       addUser: {
//         type: Users,
//         args: {
//           username: {
//             type: new GraphQLNonNull(GraphQLString),
//           },
//           email: {
//             type: new GraphQLNonNull(GraphQLString),
//           },
//           password: {
//             type: new GraphQLNonNull(GraphQLString),
//           },
//         },
//         resolve(_, args) {
//           let hash = bcrypt.hashSync(args.password, 10);
//           return UserSchema.models.users
//             .create({
//               username: args.username,
//               email: args.email.toLowerCase(),
//               password: hash,
//               createdAt: new Date().toISOString(),
//             })
//             .catch(Sequelize.ValidationError, (err) => {
//               console.log(err.message);
//               return err.message;
//             });
//         },
//       },
//       addTweet: {
//         type: Tweet,
//         args: {
//           user_id: {
//             type: new GraphQLNonNull(GraphQLInt),
//           },
//           body: {
//             type: new GraphQLNonNull(GraphQLString),
//           },
//         },
//         resolve(_, args) {
//           return UserSchema.models.tweets
//             .create({
//               user_id: args.user_id,
//               body: args.body,
//               createdAt: new Date().toISOString(),
//             })
//             .catch(Sequelize.ValidationError, (err) => {
//               console.log(err.message);
//               return err.message;
//             });
//         },
//       },

// followUser: {
//   type: Followers,
//   args: {
//     user_id: {
//       type: new GraphQLNonNull(GraphQLInt),
//     },
//     following_id: {
//       type: new GraphQLNonNull(GraphQLInt),
//     },
//   },
//   resolve(_, args) {
//     return UserSchema.models.followers.create({
//       user_id: args.user_id,
//       following_id: args.following_id,
//       followedAt: new Date().toISOString(),
//     });
//   },
// },

// login: {
//   type: Users,
//   args: {
//     email: {
//       type: new GraphQLNonNull(GraphQLString),
//     },
//     password: {
//       type: new GraphQLNonNull(GraphQLString),
//     },
//   },
//   resolve(_, args) {
//     const hash = bcrypt.hashSync(args.password, 10);
//     const user = UserSchema.models.users.findOne({
//       where: { email: args.email, password: hash },
//     });
//     if (!user) throw err;
//     return user;
//   },
// },
//     };
//   },
// });

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});

export default Schema;
