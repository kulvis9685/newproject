const express = require('express');
const app = express();
const Frontends = require('../../controller/FrontendControll');


app.get('/view', Frontends.frontpage);

app.get('/home', Frontends.homepage);

app.get('/register', Frontends.register);

app.post('/register', Frontends.userinsert);

app.get('/login', Frontends.loginpage);

app.post('/login', Frontends.loginauth);

app.get('/edituser', Frontends.edituser);

app.post('/updates', Frontends.updateuserdata);

app.get('/delete', Frontends.deleteuserdata);



module.exports = app;