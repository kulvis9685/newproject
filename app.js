const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mysql = require('mysql');
const fileUpload = require('express-fileupload');
const expressSession = require('express-session');
const frountrouter = require('./router/frontend/index');
const adminpro = require('./router/admin/index');

const sessionConfig = {
    secret: 'bogs121311',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
        path: '/',
        maxAge: 1000 * 60 * 60 * 60 * 24
    }
};
app.use(expressSession(sessionConfig));
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
app.use(bodyparser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(fileUpload());

app.use('/', frountrouter);
app.use('/', adminpro);


app.get('/admin', valideuser, function (req, res) {
    const pagedata = {
        title: 'admin: page',
        pagename: 'admin',
        Userloggedin: false
    }
    if(req.session.isuserloggedin){
        pagedata.Userloggedin=true;
    }
    res.render('tamplate', pagedata);
});


app.get('/addcard', valideuser,async function (req, res) {
    const pagedata = {
        title: 'register: page',
        pagename: 'addcard',
        Userloggedin: false
    }
    if(req.session.isuserloggedin){
        pagedata.Userloggedin=true;
    }
    const data={
        userid: req.session.isuserloggedin,
        proId : req.query.proId
    }
    console.log('data',req.query)
    pagedata.datapro=data;
   // console.log('pagedata',pagedata);

    // let data = await getalluser();
    // let  kunal=data[0].id;
    // pagedata.pro=kunal;
    // // console.log("kunla", kunal);

    res.render('tamplate', pagedata);
});



app.get('/logout', function (req, res) {
    if (req.session.isuserloggedin) {
        delete req.session.isuserloggedin;
    }
    res.redirect('/login');
});

function valideuser(req, res, next){
    if(!req.session.isuserloggedin){
        req.session.status="error";
        req.session.message=" session is expired";
        res.redirect('/login');
    }else{
        next();
    }
}

function backDoorEntry(req, res, next){
    if(req.session.isuserloggedin){
        res.redirect('/home');
    }else{
        next();
    }
}


const port = 5001;
app.listen(port, function () {
    console.log('server is connected', port);
})