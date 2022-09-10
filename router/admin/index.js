const express = require('express');
const app = express();
const productdata = require('../../controller/productController');


app.get('/product', productdata.productlist);

app.get('/creat_product',productdata.creatpage);

app.post('/creat_product', productdata.creatinsert);


app.get('/shop', productdata.shoppage);

app.get('/edit_product',productdata.productedit);

app.post('/update', productdata.updateeditdata);

app.get('/delete_pro', productdata.deleteproduct);

app.get('/userlist',productdata.userlist);

app.get('/logout', productdata.logoutpage);










module.exports=app;