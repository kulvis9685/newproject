const productmodel = require('../models/productmodel');
const Commanmodel =require('../helper/Comman'); 


class productController{
    constructor(){}

    async productlist (req, res) {
        try {
            let pagedata = {
                title: 'product: page',
                pagename: 'product',
                Userloggedin: false
            }
            if(req.session.isuserloggedin){
                pagedata.Userloggedin=true;
            }
            let productlist = await productmodel.getalluser();
            pagedata.prodata = productlist;
            res.render('tamplate', pagedata);
            // console.log('error');
    
        } catch (error) {
            console.log('error');
        }
    }

    async creatpage (req, res) {
        const pagedata = {
            title: 'product: page',
            pagename: 'creat_product',
            Userloggedin: false
        }
        if(req.session.isuserloggedin){
            pagedata.Userloggedin=true;
        }
        res.render('tamplate', pagedata);
    }

    async creatinsert (req, res) {
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
            //    console.log('imagenewname',imagenewname)
            creatpro.imagenewname = imagenewname;
    
            await Commanmodel.uploadImage(pro_img, imagenewname);
            let response = await productmodel.insertdata(creatpro);
            res.redirect('/product');
        } catch (error) {
            console.log('error', error);
        }
    }

    async shoppage (req, res) {
        try {
            let pagedata = {
                title: 'shop: page',
                pagename: 'shop',
                Userloggedin: false
            }
            if(req.session.isuserloggedin){
                pagedata.Userloggedin=true;
            }
            let shopedata = await productmodel.shopeselectdb();
            pagedata.pro1 = shopedata;
            res.render('tamplate', pagedata);
        } catch (error) {
            console.log('***********error :');
        }
    }

    async productedit(req, res) {
        try {
            let pagedata = {
                title: 'user',
                pagename: 'edit_product',
                Userloggedin: false
            }
            if(req.session.isuserloggedin){
                pagedata.Userloggedin=true;
            }
            let proId = req.query.proId;
            let result = await productmodel.editdata(proId);
            let prodata = result[0];
            pagedata.data = prodata;
            res.render('tamplate', pagedata);
        } catch (error) {
            console.log(error);
        }
    }

    async updateeditdata (req, res) {
        try {
            let prodata = {
                pro_name: req.body.pro_name,
                pro_price: req.body.pro_price,
                category: req.body.category,
                pro_quantity: req.body.pro_quantity,
                productId: req.query.productId,
            }
         
            let imgnewname = '';
    
            if (req.files && req.files.pro_img) {
                const pro_img = req.files.pro_img;
                const proimg1 = pro_img.name;
                const proimg2 = proimg1.split('.');
                const proimg3 = proimg2.splice(-1);
                const currenttime = new Date().getTime();
                const random = Math.round(Math.random(1000, 10000) * 500);
                imgnewname = `${currenttime}_${random}.${proimg3}`;
                prodata.imgnewname = imgnewname;
                await Commanmodel.uploadImage(pro_img, imgnewname);
                // console.log('imgnewname', imgnewname);
            }
            await productmodel.updatedatapro(prodata);
            res.redirect('/product');
        } catch (error) {
            console.log('****error', error);
        }
       
    }

    async deleteproduct (req, res) {
        try {
            let productId = req.query.productId;
            await productmodel.deleteuserdata(productId);
            res.redirect('/product');
    
        } catch (error) {
            console.log("*********error:", error)
        }
    }

    async userlist (req, res) {
        try {
            const pagedata = {
                title: 'shop: page',
                pagename: 'userlist',
                Userloggedin:''
            }
            if(req.session.isuserloggedin){
                pagedata.Userloggedin=true;
            }
            let usersdata = await productmodel.userdata();
            pagedata.data = usersdata;
            res.render('tamplate', pagedata);
        } catch (error) {
            console.log("****error", error);
        }
      
    }

    logoutpage (req, res) {
        if (req.session.isuserloggedin) {
            delete req.session.isuserloggedin;
        }
        res.redirect('/login');
    }


}
module.exports = new productController();