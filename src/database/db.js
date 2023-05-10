const { Sequelize } = require("sequelize");
require("dotenv").config();

var mysql = require("mysql2");

//deploy
const host = process.env.HOST;
const user = process.env.USER;
const password = process.env.PASSWORD;
const database = process.env.DATABASE;

const connection = mysql.createPool({
  host: host,
  user: user,
  password: password,
  database: database,
});

// Localhost
// const host = process.env.HOST_LOCAL;
// const user = process.env.USER_LOCAL;
// const port = process.env.PORT_LOCAL;
// const password = process.env.PASSWORD_LOCAL;
// const database = process.env.DATABASE_LOCAL;

// const connection = mysql.createPool({
//   host: host,
//   user: user,
//   password: password,
//   database: database,
//   port: port,
// });

module.exports = connection;
