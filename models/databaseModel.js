import Conn from "../connections/sqlConnection";
import Sequelize from "sequelize";

//SQL SCHEMAS

//Initialize User Schema
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

//Initialize Tweet Schema
const Tweet = Conn.define("tweets", {
  body: {
    type: Sequelize.STRING(280),
    allowNull: false,
    validate: {
      len: [1, 280],
    },
  },
});

//Initialize Followers Schema
const Followers = Conn.define("followers", {});

//Relationships
User.hasMany(Tweet);
Tweet.belongsTo(User);
User.hasMany(Followers);
Followers.belongsTo(User, {
  foreignKey: "follower_id",
});

//Sync the database (overwrite disabled)
Conn.sync({ force: false });

export default Conn;
