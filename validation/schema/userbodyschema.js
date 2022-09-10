const joi = require('joi');

class userbodyschema{
    constructor(){}

    insertuserpagedata = joi.object({
        firstname: joi.string().required(),
        lastname: joi.string().required(),
        email: joi.string().email({minDomainSegments: 2}).required(),
        password: joi.string().trim().min(5).max(15).required(),
        address: joi.string().allow('male', 'female', 'other').required(),
        contact: joi.number().integer().required(),
        gender: joi.string().required(),
    });

    
    loginbodyschema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().trim().min(5).max(15).required(),
    });
}
module.exports= new userbodyschema();