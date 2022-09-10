const db = require('../config/dbconfig');


class productmodel{
    constructor(){}
     
    
    async  getalluser() {
        return new Promise(function (resolve, reject) {
            let getuser = `SELECT * FROM product_tbl`;
            db.connection.query(getuser, function (error, result) {
                if (error) {
                    reject('error', error);
                } else {
                    resolve(result);
                }
            })
        })
    }

    
    async  insertdata(data) {
        return new Promise(function (resolve, reject) {
            let insertuser = `INSERT INTO product_tbl(product_img, product_name, price, category, quantity, description)VALUES('${data.imagenewname}','${data.pro_name}','${data.pro_price}','${data.category}','${data.pro_quantity}','${data.discription}')`;
            db.connection.query(insertuser, function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            })
        })
    }

    async shopeselectdb() {
        return new Promise(function (resolve, reject) {
            let getdata = `SELECT * FROM product_tbl`;
            db.connection.query(getdata, function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            })
        })
    }

    async editdata(data) {
        return new Promise(function (resolve, reject) {
            let getuserdata = `SELECT * FROM product_tbl WHERE id='${data}'`;
            console.log('getuserdata', getuserdata);
            db.connection.query(getuserdata, function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            })
        })
    }

    async updatedatapro(prodata) {
        return new Promise(function (resolve, reject) {
            let updateProduct = `UPDATE product_tbl SET product_name='${prodata.pro_name}', price='${prodata.pro_price}', category='${prodata.category}', quantity='${prodata.pro_quantity}'`;
            if (prodata.imgnewname) {
                updateProduct += `, product_img='${prodata.imgnewname}'`;
            }
            updateProduct += `WHERE id='${prodata.productId}'`;
            // console.log('update',updateProduct);
            db.connection.query(updateProduct, function (error, result) {
                if (error) {
                    reject('data is not update', error);
                } else {
                    resolve(result);
                }
            })
        })
    }

    async  deleteuserdata(productId) {
        return new Promise(function (resolve, reject) {
           const deleteuser = `DELETE FROM product_tbl WHERE id='${productId}'`;
            db.connection.query(deleteuser, function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            })
        })
    }

    async userdata() {
        return new Promise(function (resolve, reject) {
            const getdatas = `SELECT * FROM users`;
            db.connection.query(getdatas, function (error, result) {
                if (error) {
                    reject('error', error);
                } else {
                    resolve(result);
                }
            })
        })
    }


}
module.exports=new productmodel();