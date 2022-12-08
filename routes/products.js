const express = require("express");
const router = express.Router();
const fs = require("fs");
const database = require("better-sqlite3"); //同步版的sqlite3
const Users = new database("./database/userfile.db");
var bodyParser = require("body-parser");
const multer = require("multer");
var cookieParser = require("cookie-parser");


router.get("/", function (req, res, next) {
  console.log(req.cookies.certifiedUser);
  res.render('Product',{username: req.cookies.certifiedUser});
});

router.get("/Product_json", function (req, res, next) {
  var sqlsearch = `SELECT * FROM Uploaded_Product_Info WHERE Product_ID=${req.query.ID}`;
  var  search_prepare=Users.prepare(sqlsearch);
  var stmt=search_prepare.get();
  
  console.log(stmt);
  console.log(req.query.ID);
  res.json(stmt);
});

router.get("/mall", function (req, res, next) {//買家可看到賣家在販賣什麼商品
  var Mall_User=req.query.member;
  console.log(Mall_User);
  if (req.cookies.certifiedUser) {
    res.render("Mall", { username: req.cookies.certifiedUser});
  } else {
    res.render("Mall", { username: "guest" });
  }
});

router.get("/mall_json", function (req, res, next) {//把資料庫的資料傳送到mall
  
  var Mall=req.query.mall;
  console.log(Mall);
  var sqlsearch = `SELECT * FROM Uploaded_Product_Info WHERE Upload_User_Name='${Mall}'`;
  var  search_prepare=Users.prepare(sqlsearch);
  var stmt=search_prepare.all();

  fs.readFile('./public/json/Product_Info.json',function(err,ProductInfo){
    if(err)console.log(err);
    var Product=ProductInfo.toString(); //將二進制數據轉回字串
    Product=JSON.parse(Product);
    //這段用以將文件夾裡所有圖片的名稱推送到json中 日後可能會用到 先行保留
    // for(var i=0;i<allImage.length;i++){   
    //   Product.Product_Image.push(allImage[i]);
    // }
    for(var i=0;i<stmt.length;i++){
      Product.Product_Info.push(stmt[i]);
    }
    Product.total=stmt.length;
    console.log(Product);
    res.json(Product);

  })
});

module.exports = router;
