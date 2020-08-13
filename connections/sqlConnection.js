import Sequelize from "sequelize";

const Conn = new Sequelize("user_accounts", "root", "admin@1234", {
  dialect: "mysql",
  host: "localhost",
});

export default Conn;
