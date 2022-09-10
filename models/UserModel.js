const db = require('../config/dbconfig');

class UserModel{
    constructor(){}

    async insertuserdata(data) {
        return new Promise(function (resolve, reject) {
            const insertuser = `INSERT INTO users(firstname, lastname, email, password, contact, address, gender)VALUES('${data.firstname}', '${data.lastname}', '${data.email}', '${data.password}', '${data.contact}', '${data.address}', '${data.gender}')`;
            db.connection.query(insertuser, function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            })
        })
    }

    async  getsuersdata(emailId) {
        return new Promise(function (resolve, reject) {
            const getdata = `SELECT * FROM users WHERE email='${emailId}'`;
            db.connection.query(getdata, function (error, result) {
                if (error) {
                    reject(error);
                }else{
                    resolve(result);
                }
            })
        })
    }

    async edituserdatas(editsId) {
        return new Promise(function (resolve, reject) {
            const getuserdata = `SELECT * FROM users WHERE id='${editsId}'`;
            console.log('getuserdata project', getuserdata);
            db.connection.query(getuserdata, function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            })
        })
    }

    async updatemydata(data) {
        return new Promise(function (resolve, reject) {
            const userprodata = `UPDATE users SET firstname='${data.firstname}', lastname='${data.lastname}', email='${data.email}', contact='${data.contact}', address='${data.address}', gender='${data.gender}' WHERE id='${data.userpro}'`;
            db.connection.query(userprodata, function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            })
        })
    }

    async deletesdata(deleteId) {
        return new Promise(function (resolve, reject) {
            const deleteuser = `DELETE FROM users WHERE id='${deleteId}'`;
            db.connection.query(deleteuser, function (error, result) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            })
        })
    }

}

module.exports = new UserModel();