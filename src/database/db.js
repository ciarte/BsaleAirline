// const { Sequelize } = require('sequelize');
require('dotenv').config();

var mysql = require("mysql2/promise");
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


module.exports = connection;