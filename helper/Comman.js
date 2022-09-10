class Comman {
    constructor() { }

    uploadImage(pro_img, imagenewname) {
        return new Promise(function (resolve, reject) {
            let uploadPath = `${__dirname}/../public/product_img/${imagenewname}`;
            pro_img.mv(uploadPath, async function (error, result) {
                if (error) {
                    reject('error', error);
                } else {
                    resolve(result);
                }
            })
        })
    }


    validationuser(schema, req) {
        return new Promise(function (resolve, reject) {
            let result = schema.validate(req.body);
            let response = {};
            console.log('validatelogin data', result);
            if (result && result.error && result.error.details) {
                req.session.status = 'error';
                req.session.message = result.error.details[0].message;
                response.error = true;
                reject(response);
            } else {
                response.error = false;
                resolve(response);
            }
        });
    }

}


module.exports = new Comman();