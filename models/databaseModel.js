import Conn from "../connections/sqlConnection";
import Sequelize from "sequelize";
import Faker from "faker";
import _ from "lodash";

const User = Conn.define("users", {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Tweet = Conn.define("tweets", {
  body: {
    type: Sequelize.STRING(280),
    allowNull: false,
    validate: {
      len: [1, 280],
    },
  },
});

const Followers = Conn.define("followers", {
  // following_id: {
  //   type: Sequelize.INTEGER,
  //   allowNull: false,
  // },
});

User.hasMany(Tweet);
Tweet.belongsTo(User);
User.hasMany(Followers);
Followers.belongsTo(User, {
  foreignKey: "follower_id",
});

// Conn.sync({ force: true }).then(() => {
//   _.times(10, () => {
//     return User.create({
//       username: Faker.internet.userName(),
//       email: Faker.internet.email(),
//       password: Faker.internet.password(),
//     }).then((user) => {
//       return user.createTweet({
//         body: `Tweet by ${user.username}`,
//       });
//     });
//   });
// });

Conn.sync({ force: false });

export default Conn ;
