var conn_pool = require("./mysqlConnector");

/**
 * 
 * @param {String} query 
 * returns true/false based on result length
 */
exports.hasResults = function (query) {
    return new Promise((resolve, reject) => conn_pool.getConnection(function (err, connection) {
        if (err) {
            console.log("Error while getting connection from connection pool!");
            throw err;
        }
        connection.query(query, function (err, rows) {
            if (!err) {
                if (rows.length) {
                    resolve(true);
                } else {
                    reject(false);
                }
            }
            connection.release();
        });
    }));
};

/**
 * 
 * @param {String} query 
 * returns an array of RowDataPacket i.e jsonObject
 */
exports.getResults = function (query) {
    return new Promise((resolve, reject) => conn_pool.getConnection(function (err, connection) {
        if (err) {
            console.log("Error while getting connection from connection pool!");
            throw err;
        }
        connection.query(query, function (err, rows) {
            if (!err) {
                resolve(rows);
            }
            else {
                reject(err);
            }
            connection.release();
        });
    }));
};

/**
 * 
 * @param {String} query 
 * use this function to retrieve only one row and one field.
 */
exports.getResultAsString = function (query) {
    return new Promise((resolve, reject) => conn_pool.getConnection(function (err, connection) {
        if (err) {
            console.log("Error while getting connection from connection pool!");
            throw err;
        }
        connection.query(query, function (err, rows) {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
            connection.release();
        });
    }));
};

/**
 * 
 * @param {String} query 
 * use it for only insertion and updation
 */
exports.executeQuery = function (query) {
    return new Promise((resolve, reject) => conn_pool.getConnection(function (err, connection) {
        if (err) {
            console.log("Error while getting connection from connection pool!");
            throw err;
        }
        connection.query(query, function (err, rows) {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
            connection.release();
        });
    }));
};
