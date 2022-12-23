var express = require("express");
var router = express.Router();
const fs = require("fs");

const database = require("better-sqlite3"); //同步版的sqlite3
const Users = new database("./database/userfile.db");
var bodyParser = require("body-parser");
const multer = require("multer");
var cookieParser = require("cookie-parser");
const { json } = require("express");

function readHtml(Htmlname, req, res) {
  fs.readFile(`./public/html/` + Htmlname + `.html`, function (err, data) {
    if (err) console.log(err);
    res.setHeader("Content-Type", "text/html");
    res.send(data);
  });
}

/* GET home page. */
router.get("/", function (req, res, next) {
  readHtml("index", req, res);
});

router.get("/json", function (req, res, next) {
  var UAPsearch = `SELECT * FROM Uploaded_Product_Info `; //User All Product search
  var UAP_prepare = Users.prepare(UAPsearch);
  var UAP = UAP_prepare.all();

  //////////////////////////首頁圖片隨機顯示
  length = UAP.length;
  let NumArray = new Array();
  for (let i = 0; i < length; i++) {
    let flag = 0;
    Num = Math.round(Math.random() * (length - 1));
    for (let j = 0; j < length; j++) {
      if (NumArray[j] == Num) {
        flag = 1;
        break;
      } else flag = 0;
    }
    if (flag == 0) NumArray.push(Num);
    else i--;
    
  }
  console.log(NumArray);
  let UAP_tmp = new Array();
  for (let i = 0; i < NumArray.length; i++) {
    UAP_tmp[i] = UAP[NumArray[i]];
  }
  UAP = UAP_tmp;
  //////////////////////////

  fs.readFile("./public/json/Product_Info.json", function (err, ProductInfo) {
    if (err) console.log(err);
    var Product = ProductInfo.toString();
    Product = JSON.parse(Product);

    for (var i = 0; i < UAP.length; i++) {
      Product.Product_Info.push(UAP[i]);
    }
    Product.total = UAP.length;
    res.json(Product);
  });
});

module.exports = router;
