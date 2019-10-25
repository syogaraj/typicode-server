var mysql = require("mysql");

var dbConnectionInfo = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'ormae',
    connectionLimit: 100
};

var connection_pool = mysql.createPool(dbConnectionInfo);

module.exports = connection_pool;
