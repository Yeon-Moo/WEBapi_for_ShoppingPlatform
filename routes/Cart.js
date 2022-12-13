const express = require("express");
const router = express.Router();
const fs = require("fs");
const database = require("better-sqlite3"); //同步版的sqlite3
const Users = new database("./database/userfile.db");
var bodyParser = require("body-parser");
const multer = require("multer");
var cookieParser = require("cookie-parser");
const { json } = require("express");

function readHtml(Htmlname,req,res){
	fs.readFile(`./public/html/`+Htmlname+`.html`,function(err,data){
		if(err)console.log(err);
	res.setHeader('Content-Type','text/html');
	res.send(data);
	})
}



router.get('/',function(req,res,next){
	readHtml('Cart',req,res);
})



router.post('/',function(req,res,next){
	let {Product_ID,Buyer,Amount,Seller}=req.body;
	console.log("Product_ID:"+Product_ID+",Buyer:"+Buyer+",Seller:"+Seller+",Amount:"+Amount);

	let CartInsertSql= `INSERT INTO  Cart (
		"Buyer",
		"Seller",
		"Product_ID",
		"Amount") VALUES(?,?,?,?)`;
	let CarInsert=Users.prepare(CartInsertSql).run(Buyer,Seller,Product_ID,Amount);

	res.end();

})



router.get('/json',function(req,res,next){
	var Cartsearch = `SELECT * FROM Cart WHERE (Buyer='${req.cookies.certifiedUser}')`; //User All Product search
	
	var Cart=Users.prepare(Cartsearch).all();




	console.log(Cart);
	// let Image=new Array(Cart.length);
	// let Price=new Array(Cart.length);
	// let Product_Name=new Array(Cart.length);
	for(let i=0;i<Cart.length;i++){
		let productSearch =`SELECT * FROM Uploaded_Product_Info WHERE Product_ID=${Cart[i].Product_ID}`
		let product=Users.prepare(productSearch).get();
		Cart[i].Image=product.Product_Image_Address;
		Cart[i].Product_Name=product.Product_Name;
		Cart[i].Price=product.Product_Price;
	}
		console.log(Cart);
	


	fs.readFile('./public/json/Cart_Info.json',function(err,CartInfo){
	  if(err)console.log(err);
	  var CartJson=CartInfo.toString(); //將二進制數據轉回字串
	  CartJson=JSON.parse(CartJson);

	  for(var i=0;i<Cart.length;i++){
		CartJson.Cart.push(Cart[i]);
	  }
	  CartJson.total=Cart.length;
	  res.json(CartJson);
  
	})


})


router.get('/Checkout',function(req,res,next){
readHtml('Checkout',req,res);

})
router.get('/Checkout/json',function(req,res,next){
	console.log(req.query);

	Cart=req.query.Product;
	Cart=String(Cart).split(',');
	console.log(Cart);

	var result=new Array();
	// let Image=new Array(Cart.length);
	// let Price=new Array(Cart.length);
	// let Product_Name=new Array(Cart.length);
	for(let i=0;i<Cart.length;i++){
		let productSearch =`SELECT * FROM Uploaded_Product_Info WHERE Product_ID=${Cart[i]}`
		let product=Users.prepare(productSearch).get();
		result.push(product);
		
	}
	console.log(result);
	res.json(result);
	})


router.post('/Checkout',function(req,res,next){
	console.log(req.body);
	if(req.body.Product.length==0 || req.body.Amount.length==0){
		console.log('hi');
		res.json({success:false});
	}else{
		let Product_string;
		console.log(req.body.Amount.toString())
		// for(let i=0;i<req.body.Product.length;i++){
		// 	if(i==0){
		// 		Product_string=`${req.body.Product[i]}`;
		// 	}else{
		// 		Product_string=Product_string+`,${req.body.Product[i]}`
		// 	}
			
		// }
		Product_string='"'+Product_string+'"';
		console.log(Product_string);
		res.cookie('Product',req.body.Product.toString(),{path:'/Cart/Checkout',maxAge:2000000});
		res.cookie('Amount',`${req.body.Amount.toString()}`,{path:'/Cart/Checkout',maxAge:2000000});
		res.json({success:true});
	}

})

module.exports = router;
