const express = require('express')
const app = express();
const bodyparser = require('body-parser');
const mysql = require('mysql');
const fileUpload = require('express-fileupload');
const expressSession = require('express-session');
 
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

// const fileupload = require('express-fileupload');
const configdb = {
    host: 'localhost',
    user: 'root',
    password: 'Admin123',
    database: 'my_project'
}
const connection = mysql.createConnection(configdb);
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

app.get('/home', function (req, res) {
    const pagedata = {
        title: 'home',
        pagename: 'home'
    }
    res.render('tamplate', pagedata);
});

app.get('/product', async function (req, res) {
    try {
        let pagedata = {
            title: 'product: page',
            pagename: 'product'
        }
        let productlist = await getalluser();
        pagedata.prodata = productlist;
        res.render('tamplate', pagedata);
        console.log('error');
        
    } catch (error) {
        console.log('error');
    }
    // console.log('users data select', getuser)
});
async function getalluser(){
    return new Promise(function(resolve, reject){
    let getuser = `SELECT * FROM product`;
    connection.query(getuser, function (error, result) {
        if (error) {
            reject('error', error);
        } else {
            resolve(result);
        }
    })
})
}


app.get('/creat_product', async function (req, res) {
    const pagedata = {
        title: 'product: page',
        pagename: 'creat_product' 
    }
    res.render('tamplate', pagedata);
});

app.post('/creat_product', async function(req, res){
    try {
        let creatpro = {
            pro_name: req.body.pro_name,
            pro_price: req.body.pro_price,
            discription: req.body.discription,
            category: req.body.category,
            pro_quantity: req.body.pro_quantity
        };
       const pro_img = req.files.pro_img;
       const proimg1 = pro_img.name;
       const proimg2 = proimg1.split('.');
       const proimg3 = proimg2.splice(-1);
       const currenttime = new Date().getTime();
       const random = Math.round(Math.random(1000, 10000) * 500);
       let imagenewname = `${currenttime}.${random}_${proimg3}`;
       console.log('imagenewname',imagenewname)
       creatpro.imagenewname = imagenewname;

       await uploadImage(pro_img, imagenewname);
       let response = await insertdata(creatpro);
       res.redirect('/product');
    } catch (error) {
        console.log('error', error);
    }
});

async function uploadImage(pro_img, imagenewname){
    return new Promise(function (resolve, reject){
        const uploadPath = `${__dirname}/public/img/${imagenewname}`;
        pro_img.mv(uploadPath, async function (error, result) {
            if(error) {
                reject(error);
            } else {
               resolve(result);
            }
        })
    })
}

async function insertdata(data){
    return new Promise(function(resolve, reject){
      let insertuser=`INSERT INTO product(product_img, product_name, price, category, quantity, discription)VALUES('${data.imagenewname}','${data.pro_name}','${data.pro_price}','${data.category}','${data.pro_quantity}','${data.discription}')`;
        connection.query(insertuser, function(error, result) {
            if (error) {
                reject(error);
            } else {
               resolve(result);               
            }
        })
    })
}



app.get('/shop', async function(req, res){
    try {
    let pagedata = {
        title: 'shop: page',
        pagename: 'shop'
    }
    let shopedata = await shopeselectdb();
    pagedata.pro1= shopedata;
    res.render('tamplate', pagedata);
    } catch (error) {
        console.log('***********error :');
    }
});

async function shopeselectdb(){
    return new Promise(function(resolve, reject){
        let getdata = `SELECT * FROM product`;
        connection.query(getdata, function (error, result) {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        })
    })
}



app.get('/edit_product', async function (req, res) {
    try {
        let pagedata = {
            title: 'user',
            pagename: 'edit_product'

        }
        let proId = req.query.proId;
        let editdatas = await editdata(proId);
        console.log("editdatas:", editdatas);
        prodata = editdatas[0];
        pagedata.data = prodata;
        res.render('tamplate', pagedata);
    } catch (error) {
        console.log("**********error", error);
    }
})

async function editdata(proId){
    return new Promise(function(resolve, reject){
        let getuserdata = `SELECT * FROM product WHERE id='${proId}'`;
        console.log('getuserdata', getuserdata);
        connection.query(getuserdata, function (error, result) {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        })
    })

}

// creat product is update// 

app.post('/update', function (req, res) {

    const pro_name = req.body.pro_name;
    const pro_price = req.body.pro_price;
    const category = req.body.category;
    const pro_quantity = req.body.pro_quantity;
    const productId = req.query.productId;
    let imgnewname ='';
    
    if(req.files && req.files.product_img){
        console.log("New image found")
        const proimg1 = pro_img.name;
        const proimg2 = proimg1.split('.');
        const proimg3 = proimg2.splice(-1);
        const currenttime = new Date().getTime();
        const random = Math.round(Math.random(1000, 10000) * 500);
        imgnewname = `${currenttime}_${random}.${proimg3}`;
    }

    // console.log('Image product name', productId);
    let updateProduct = `UPDATE product SET product_name='${pro_name}', price='${pro_price}', category='${category}', quantity='${pro_quantity}'`;
    if(imgnewname){
        updateProduct += `, image='${imgnewname}'`;
    }
    updateProduct += `WHERE id='${productId}'`;
    connection.query(updateProduct, function (error, result){
        if (error) {
            console.log('data is not update', error);
        } else {
            console.log('update data', result);
            res.redirect('/product');
        }
    })
});


app.get('/delete_pro', async function (req, res) {
   try {
    let productId = req.query.productId;
    datauser = await deleteuserdata(productId);
    res.redirect('/product');

   } catch (error) {
        console.log("*********error:", error)
   }
});


async function deleteuserdata(productId){
    return new Promise(function(resolve, reject){
        deleteuser = `DELETE FROM product WHERE id='${productId}'`;
        connection.query(deleteuser, function (error, result) {
            if (error) {
                reject(error);
            } else {
               resolve(result);
            }
        })
    })
}



app.get('/register', function (req, res) {
    const pagedata = {
        title: 'register: page',
        pagename: 'register'
    }
    res.render('tamplate', pagedata);
});

app.post('/register', function (req, res) {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    const contact = req.body.contact;
    const address = req.body.address;
    const gender = req.body.gender;
    const insertuser = `INSERT INTO user1(firstname, lastname, email, password, contact, address, gender)VALUES('${firstname}', '${lastname}', '${email}', '${password}', '${contact}', '${address}', '${gender}')`;
    connection.query(insertuser, function (error, result) {
        if (error) {
            console.log('database query error', error);
        } else {
            console.log('database query run', result);
            res.redirect('/login');
        }
    })
})

app.get('/login', function (req, res) {
    const pagedata = {
        title: 'login: page',
        pagename: 'login',
        status: '',
        message: ''
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
});


app.post('/login', function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const getdata = `SELECT * FROM user1 WHERE email='${email}' AND password='${password}'`;
    connection.query(getdata, function (error, result) {
        if (error) {
            console.log('database query error', error)
        } else {
            if (result && result.length > 0) {
                console.log('user login', result);
                req.session.status = "Success";
                req.session.message = "Succesfully logged in";
                res.redirect('/register_user');
            } else {
                req.session.status = "Error";
                req.session.message = "Invailed user and email";
                res.redirect('/login');
                console.log('user password incurrect');
            }
        }
    })
})

app.get('/register_user', function (req, res) {
    const pagedata = {
        title: 'shop: page',
        pagename: 'register_user'
    }

    const getdata = `SELECT * FROM user1`;
    connection.query(getdata, function (error, result) {
        if (error) {
            console.log('data query error');
        } else {
            console.log('data query run', result)
            pagedata.data = result;
            res.render('tamplate', pagedata);
        }
    })
});

app.get('/edituser', async function (req, res) {
    try {
        let pagedata = {
            title: 'user',
            pagename: 'edituser'
        }
        let editsId = req.query.editsId;
        let prodata = await edituserdatas(editsId);
        data = prodata[0];
        console.log('this is edituser data', data);
        pagedata.data = data;
        res.render('tamplate', pagedata);
    } catch (error) {
        console.log('******edit userlist', error);
    }
})

async function edituserdatas(editsId){
    return new Promise(function(resolve, reject){
        const getuserdata = `SELECT * FROM user1 WHERE id='${editsId}'`;
        console.log('getuserdata project', getuserdata);
        connection.query(getuserdata, function(error, result) {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        })
    })
}

app.post('/updates', function(req, res){
    const firstname =req.body.firstname;
    const lastname =req.body.lastname;
    const email =req.body.email;
    const contact =req.body.contact;
    const address =req.body.address;
    const gender =req.body.gender;
    console.log('updatedata', req.body);
});


app.get('/delete', async function (req, res) {
    try {
        deleteId = req.query.deleteId;
        deleteuser = await deletesdata(deleteId);
        res.redirect('/register_user');
    } catch (error) {
        console.log('*****new error delete data', error);
    }
});

async function deletesdata(){
    return new Promise(function(resolve, reject){
        deleteuser = `DELETE FROM user1 WHERE id='${deleteId}'`;
        connection.query(deleteuser, function (error, result) {
        if (error) {
             reject(error);
        } 
        else {
            resolve(result);
        }
    })
    })

}

app.get('/addcard', function (req, res) {
    const pagedata = {
        title: 'register: page',
        pagename: 'addcard'
    }
    res.render('tamplate', pagedata);
});



const port = 5001;
app.listen(port, function () {
    console.log('server is connected', port);
})