var express = require('express');
var router = express.Router();
const fs=require('fs');

const database = require("better-sqlite3"); //同步版的sqlite3
const Users = new database("./database/userfile.db");
var bodyParser = require("body-parser");
const multer = require("multer");
var cookieParser = require("cookie-parser");
const { json } = require("express");


/* GET home page. */
router.get('/', function(req, res, next) {
  
 res.render('index');
  
});

router.get("/json", function (req, res, next) {
    var UAPsearch = `SELECT * FROM Uploaded_Product_Info `; //User All Product search
    var UAP_prepare=Users.prepare(UAPsearch);
    var UAP=UAP_prepare.all();
    console.log(UAP.length);

    

    fs.readFile('./public/json/Product_Info.json',function(err,ProductInfo){
      if(err)console.log(err);
      var Product=ProductInfo.toString(); 
      Product=JSON.parse(Product);

      for(var i=0;i<UAP.length;i++){
        Product.Product_Info.push(UAP[i]);
      }
      Product.total=UAP.length;
      res.json(Product);
  
    })
  
  });

module.exports = router;
