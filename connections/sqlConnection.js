import Sequelize from "sequelize";
import config from "../Config/config";

const dbURI = `${config.DB_DIALET}://${config.DB_USERNAME}:${config.DB_PASSWORD}@${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`;
console.log(dbURI);

const Conn = new Sequelize(dbURI);

export default Conn;
