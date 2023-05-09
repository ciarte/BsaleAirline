const { Sequelize } = require("sequelize");
require("dotenv").config();

var mysql = require("mysql2/promise");
//descomentar para conecxion remota

// const host = process.env.HOST;
// const user = process.env.USER;
// const password = process.env.PASSWORD;
// const database = process.env.DATABASE;

// const connection = mysql.createPool({
//   host: host,
//   user: user,
//   password: password,
//   database: database,
// });

//conexion Local

const host = "localhost";
const user = "root";
const password = "123456";
const database = "airline";

const connection = mysql.createPool({
  host: host,
  user: user,
  password: password,
  database: database,
  port: "3306",
});

module.exports = connection;
