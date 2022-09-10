const UserModel = require('../models/UserModel');
const joi = require('joi');
const Frontendvalidation = require('../validation/Frontendvalidation');

class FrontendControll {
    constructor() { }

    frontpage(req, res) {
        let pagedata = {
            title: 'front page',
            pagename: 'front',
            Userloggedin: false
        }
        res.render('tamplate', pagedata);
    }

    homepage(req, res) {
        const pagedata = {
            title: 'home page',
            pagename: 'home',
            status: '',
            message: '',
            Userloggedin: false
        };
        if (req.session.isuserloggedin) {
            pagedata.Userloggedin = true;
        }
        if (req.session.status) {
            pagedata.status = req.session.status;
            delete req.session.status;
        }
        if (req.session.message) {
            pagedata.message = req.session.message;
            delete req.session.message;
        }
        res.render('tamplate', pagedata);
    }

    register(req, res) {
        const pagedata = {
            title: 'register: page',
            pagename: 'register',
            status: '',
            message: '',
            Userloggedin: false
        }
        if (req.session.isuserloggedin) {
            pagedata.Userloggedin = true;
        }
        if (req.session.status) {
            pagedata.status = req.session.status;
            delete req.session.status;
        }
        if (req.session.message) {
            pagedata.message = req.session.message;
            delete req.session.message;
        }
        res.render('tamplate', pagedata);
    }

    async userinsert(req, res) {
        try {
            console.log("req.body", req.body);
            const data = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password,
                contact: req.body.contact,
                address: req.body.address,
                gender: req.body.gender
            }
            await Frontendvalidation.singupValidation(req, res);
            console.log("Ready To Go");
            await UserModel.insertuserdata(data);
            res.redirect('/login');
        } catch (error) {
            console.log('error', error);
            if (error && error.error){
                res.redirect('/register')
            }
        }
    }

    loginpage(req, res) {
        const pagedata = {
            title: 'login: page',
            pagename: 'login',
            status: '',
            message: '',
            Userloggedin: false
        }
        if (req.session.status) {
            pagedata.status = req.session.status;
            delete req.session.status;
        }
        if (req.session.message) {
            pagedata.message = req.session.message;
            delete req.session.message;
        }
        res.render('tamplate', pagedata);
    }

    async loginauth(req, res) {
        try {
            const email = req.body.email;
            const password = req.body.password;
            await Frontendvalidation.loginvalidation(req, res);
            const usersdata = await UserModel.getsuersdata(email);
            if (usersdata && usersdata.length > 0) {
                let user = usersdata[0];
                if (user.password == password) {
                    req.session.status = "success";
                    req.session.message = "login successfully";
                    req.session.isuserloggedin = user.id;
                    console.log('user logged in', user.id);
                    res.redirect('/home');
                } else {
                    req.session.status = "error";
                    req.session.message = "incorrect password";
                    res.redirect('/login');
                }
            } else {
                req.session.status = "Error";
                req.session.message = "Incurrect email & password";
                res.redirect('/login');
            }

        } catch (error) {
            console.log('error', error);
            if (error && error.error) {
                res.redirect('/login');
                return false;
            }
        }
    }

    async edituser(req, res) {
        try {
            let pagedata = {
                title: 'user',
                pagename: 'edituser',
                Userloggedin: false
            }
            if (req.session.isuserloggedin) {
                pagedata.Userloggedin = true;
            }
            let editsId = req.query.editsId;
            let prodata = await UserModel.edituserdatas(editsId);
            let data = prodata[0];
            pagedata.data = data;
            res.render('tamplate', pagedata);
        } catch (error) {
            console.log('******edit userlist', error);
        }
    }

    async updateuserdata(req, res) {
        try {
            let data = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                contact: req.body.contact,
                address: req.body.address,
                gender: req.body.gender,
                userpro: req.query.userpro
            }
            await UserModel.updatemydata(data);
            res.redirect('/userlist')
        }
        catch (error) {
            console.log("error", error);
        }
    }

    async deleteuserdata(req, res) {
        try {
            let deleteId = req.query.deleteId;
            let deleteuser = await UserModel.deletesdata(deleteId);
            res.redirect('/userlist');
        } catch (error) {
            console.log('*****new error delete data', error);
        }
    }

}
module.exports = new FrontendControll();