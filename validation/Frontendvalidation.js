const joi =  require('joi');
const Comman = require('../helper/Comman');

const frontendbodyschema = require('./schema/userbodyschema');

class Frontendvalidation{
    constructor(){}

    
    async singupValidation(req, res){
        let schema = frontendbodyschema.insertuserpagedata;
        let response = await Comman.validationuser(schema, req);
        return response;
    }
    
    async loginvalidation(req, res){
       let schema = frontendbodyschema.loginbodyschema;
       let resonse = await Comman.validationuser(schema, req);
       return resonse; 
    }
}
module.exports= new Frontendvalidation();