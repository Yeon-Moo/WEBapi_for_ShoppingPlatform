const express = require("express");
const router = express.Router();
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
router.get("/upload", function (req, res, next) {
  if (!req.cookies.certifiedUser) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.send(`<script>alert('您必須先登入才能上傳商品');
                        location.href='/'</script>`);
  } else {
    readHtml("Upload_Product",req,res);
  }
});

//上傳商品資料
router.post("/upload",upload.array("Product_Image"),function (req, res, next) {
    console.log(req.body);
    console.log(req.files);
    var File = req.body;
    if(req.body.Product_Name==''){
      res.setHeader("Content-Type", "text/html");
      res.send(`<script>alert('您必須輸入產品名稱!!!!!');
                          location.href='/products/myproduct/upload'</script>`);
    }
    var sqlsearch = `SELECT UID FROM user_register WHERE (username='${req.cookies.certifiedUser}')`;
    //var Productsearch=`SELECT * FROM  Uploaded_Product_Info WHERE ((Product_Name='${File.Product_Name}') AND (Upload_User_Name='${req.cookies.certifiedUser})')`;
    var sqlInsert = `INSERT INTO  Uploaded_Product_Info (
  "Product_Name",
  "Product_Content",
  "Product_Price",
  "Product_Image_Address",
  "Upload_User_Name",
  "Upload_User_Product_ID") VALUES(?,?,?,?,?,?)`;

    var UMPIDsearch = `SELECT Upload_User_Product_ID
  FROM Uploaded_Product_Info WHERE (Upload_User_Name='${req.cookies.certifiedUser}')`; //找出目前使用者已上傳商品中的最大值 (User_Product_ID)

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
    let ext=req.files[0].path.toString().split('.')[1];
  
    dbinsert.run(
      File.Product_Name,//insert Product Name
      File.Product_Content,//insert Product Content
      File.Product_Price,//insert Product Price
      `/${req.cookies.certifiedUser}/${max + 1}/0.${ext}`,//insert Image Address
      req.cookies.certifiedUser,//insert the Username  Who is uploading now
      max + 1//insert the User's New Product ID
    );

    fs.mkdirSync(
      `./users/${req.cookies.certifiedUser}/${max + 1}`, { recursive: true });
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
    return res.redirect("/myproduct"); //結束這個API後要記得改寫成到myproduct
  }
);

//檢視我的商品區

router.get("/", function (req, res, next) {
    if (req.cookies.certifiedUser) {
      readHtml("MyProducts",req,res);
    } else {
      res.setHeader("Content-Type","text/html");
      res.send(`<script>alert('請先登入才能瀏覽我的商品區');
      location.href='/users/login'</script>`);
    }
 
});


router.get("/json", function (req, res, next) {//用來向網頁發送json
  var UAPsearch = `SELECT * FROM Uploaded_Product_Info WHERE (Upload_User_Name='${req.cookies.certifiedUser}')`; //User All Product search
  var UAP_prepare=Users.prepare(UAPsearch);
  var UAP=UAP_prepare.all();
//讀取文件夾中所有的圖片
  //var allImage=fs.readdirSync('./users/yu10p/1');
 
  //console.log(allImage.toString());


  fs.readFile('./public/json/Product_Info.json',function(err,ProductInfo){
    if(err)console.log(err);
    var Product=ProductInfo.toString(); //將二進制數據轉回字串
    Product=JSON.parse(Product);
    //這段用以將文件夾裡所有圖片的名稱推送到json中 日後可能會用到 先行保留
    // for(var i=0;i<allImage.length;i++){   
    //   Product.Product_Image.push(allImage[i]);
    // }
    for(var i=0;i<UAP.length;i++){
      Product.Product_Info.push(UAP[i]);
    }
    Product.total=UAP.length;
    res.json(Product);

  })

});


router.delete("/", function (req, res, next) {
 console.log(req.query);

 var IDsearch=`SELECT Product_ID FROM Uploaded_Product_Info 
 WHERE Upload_User_Name='${req.cookies.certifiedUser}' AND Upload_User_Product_ID=${req.query.Product_ID}`;
  var IDsearchRun=Users.prepare(IDsearch).all();
  Product_ID=IDsearchRun[0].Product_ID;
  console.log(Product_ID);
 var commentDelete=`DELETE FROM Comment WHERE Product_ID=${Product_ID}`;

 var sqlDelete=`DELETE FROM Uploaded_Product_Info WHERE Upload_User_Name='${req.cookies.certifiedUser}' AND Upload_User_Product_ID=${req.query.Product_ID} `;
 

 var delete_Comment=Users.prepare(commentDelete).run();//下架商品同時 刪除評論以確保資料庫不會被廢棄資料佔據
 var delete_product=Users.prepare(sqlDelete).run();
   var fileRead=fs.readdirSync(`./users/${req.cookies.certifiedUser}/${req.query.Product_ID}`);

   for(var i=0;i<fileRead.length;i++){
    fs.unlink(`./users/${req.cookies.certifiedUser}/${req.query.Product_ID}/${fileRead[i]}`,function(err){
      console.log(err);
    });
   }
  res.end();
   
});


router.get("/SellerOrder", function (req, res, next) {
  readHtml("SellerOrder", req, res);
});

router.get("/SellerOrder/json", function (req, res, next) {
  console.log(req.query);
  Seller=req.query.Seller;
  let OrderSearch ="SELECT * FROM `Order` WHERE Seller=?";
  let Order = Users.prepare(OrderSearch).all(`${Seller}`);

  for(let i =0; i<Order.length;i++){
    let Product_Info=new Array();
    Order[i].Product_ID=JSON.parse(Order[i].Product_ID)
    Order[i].Amount=JSON.parse(Order[i].Amount);
    Order[i].Price=JSON.parse(Order[i].Price);
    for(let j=0;j<Order[i].Product_ID.length;j++){
      let ProductSearch=`SELECT * FROM Uploaded_Product_Info WHERE Product_ID=${Order[i].Product_ID[j]}`
      let Product=Users.prepare(ProductSearch).all();
     Product_Info.push(Product);
    
    }
 
 Order[i].Product_Info=Product_Info;
  }

  res.json(Order);
});


module.exports = router;
