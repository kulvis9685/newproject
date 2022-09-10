
const mysql = require('mysql');
const dbconfig = {
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'newpro'
}
const connection = mysql.createConnection(dbconfig);
connection.connect(function (error) {
    if (error) {
        console.log('database error', error);
    } else {
        console.log('database is connected');
    }
})

module.exports.connection = connection;