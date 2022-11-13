const express = require("express");
const router = express.Router();
const fs = require("fs");
const database = require("better-sqlite3"); //同步版的sqlite3
const Users = new database("./database/userfile.db");
var bodyParser = require("body-parser");
const multer = require("multer");
var cookieParser = require("cookie-parser");
const { json } = require("express");







//上傳商品區
fs.mkdir(`./upload`, { recursive: true }, (err) => {
  if (err) throw err;
});

//圖片暫存區
var uploadFolder = "./upload/";

// 通過storage選項來客製化上傳路徑與名稱
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder); // 將圖片暫存的地方
  },
  filename: function (req, file, cb) {
    let ext = file.mimetype.split("/")[1];
    cb(null, file.fieldname + "-" + Date.now() + `.${ext}`);//設定上傳後圖片的名字
  },
});

var upload = multer({ storage: storage });







/* GET home page. */
router.get("/myproduct/upload", function (req, res, next) {
  if (!req.cookies.certifiedUser) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.send(`<script>alert('您必須先登入才能上傳商品');
                        location.href='/'</script>`);
  } else {
    res.render("Upload_Product" , { username: req.cookies.certifiedUser });
  }
});

//上傳商品資料
router.post("/myproduct/upload",upload.array("Product_Image"),function (req, res, next) {
    console.log(req.body);
    console.log(req.files);
    var File = req.body;

    var sqlsearch = `SELECT UID FROM user_register WHERE (username='${req.cookies.certifiedUser}')`;
    //var Productsearch=`SELECT * FROM  Uploaded_Product_Info WHERE ((Product_Name='${File.Product_Name}') AND (Upload_User_Name='${req.cookies.certifiedUser})')`;
    var sqlInsert = `INSERT INTO  Uploaded_Product_Info (
  "Product_Name",
  "Product_Discribtion",
  "Product_Content",
  "Product_Price",
  "Product_Image_Address",
  "Upload_User_Name",
  "Upload_User_ID",
  "Upload_User_Product_ID") VALUES(?,?,?,?,?,?,?,?)`;

    var UMPIDsearch = `SELECT Upload_User_Product_ID
  FROM Uploaded_Product_Info WHERE (Upload_User_Name='yu10p')`; //找出目前使用者已上傳商品中的最大值 (User_Product_ID)

    const stmt = Users.prepare(sqlsearch);
    const dbinsert = Users.prepare(sqlInsert);
    const UMPID_prepare = Users.prepare(UMPIDsearch);
    //var SameP_row=SameProduct.all();
    var UMPID = UMPID_prepare.all();
    var row = stmt.all();
    var max = 0;
    for (var i = 0; i < UMPID.length; i++) {
      if (UMPID[i].Upload_User_Product_ID > max) {
        max = UMPID[i].Upload_User_Product_ID;
      }
    }
    var UID = row[0].UID;

  
    dbinsert.run(
      File.Product_Name,//insert Product Name
      File.Product_Discribtion,//insert Product Discribtion
      File.Product_Content,//insert Product Content
      File.Product_Price,//insert Product Price
      `./users/${req.cookies.certifiedUser}/${max + 1}`,//insert Image Address
      req.cookies.certifiedUser,//insert the Username  Who is uploading now
      UID,//insert the ID of the User is uploading 
      max + 1//insert the User's New Product ID
    );

    fs.mkdir(
      `./users/${req.cookies.certifiedUser}/${max + 1}`,
      { recursive: true },
      (err) => {
        //若使用者沒有自己的圖片庫 創建一個
        if (err) throw err;
      }
    );
    for (var i = 0; i < req.files.length; i++) {
      let ext=req.files[i].path.toString().split('.')[1];
      fs.rename(
        `./${req.files[i].path}`, //用重命名的方式來移動圖片 第一個參數為舊路徑
        `./users/${req.cookies.certifiedUser}/${max + 1}/${i}.${ext}`, //第二個為新路徑
        function (err) {
          console.log(err);
        }
      );
    }
    return res.redirect("/products/myproduct/upload"); //結束這個API後要記得改寫成到myproduct
  }
);

//檢視我的商品區

router.get("/myproduct", function (req, res, next) {
    if (req.cookies.certifiedUser) {
      res.render("MyProducts", { username: req.cookies.certifiedUser });
    } else {
      return res.redirect('/');
    }
 
});


router.get("/myproduct_json", function (req, res, next) {//用來向網頁發送json
  var UAPsearch = `SELECT * FROM Uploaded_Product_Info WHERE (Upload_User_Name='${req.cookies.certifiedUser}')`; //User All Product search
  var UAP_prepare=Users.prepare(UAPsearch);
  var UAP=UAP_prepare.all();
  console.log(UAP.length);

  fs.readFile('./public/json/Product_Info.json',function(err,ProductInfo){
    if(err)console.log(err);
    var Product=ProductInfo.toString(); //將二進制數據轉回字串
    console.log(ProductInfo);
    Product=JSON.parse(Product);
    for(var i=0;i<UAP.length;i++){
      Product.Product_Info.push(UAP[i]);
    }
    Product.total=UAP.length;
    res.json(Product);

  })

});


router.delete("/myproduct", function (req, res, next) {
  if (req.cookies.username) {
    res.render("index", { title: req.cookies.username });
  } else {
    res.render("index", { title: "guest" });
  }
});



router.get("/", function (req, res, next) {
  if (req.cookies.username) {
    res.render("index", { title: req.cookies.username });
  } else {
    res.render("index", { title: "guest" });
  }
});

module.exports = router;
