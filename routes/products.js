const express = require('express');
const router = express.Router();
const fs=require('fs');
const database=require('better-sqlite3');//同步版的sqlite3
const Users=new database('./database/userfile.db');
var bodyParser = require('body-parser');
const multer=require("multer");
var cookieParser = require('cookie-parser');




fs.mkdir(`./upload`, { recursive: true }, (err) => {
  if (err) throw err;
});
var uploadFolder = './upload/';
// 通过 filename 属性定制
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        let ext=file.mimetype.split('/')[1];
        cb(null, file.fieldname+'-'+Date.now()+`.${ext}`);  
    }
});
// 通過storage選項來客製化上傳路徑與名稱
var upload = multer({ storage: storage })



/* GET home page. */
router.get('/myproduct/upload', function(req, res, next) {
    if(!req.cookies.certifiedUser){
      res.statusCode=200;
      res.setHeader("Content-Type","application/json")
      return res.redirect('/');
    }
    res.render('Upload_Product'/*, { title: req.cookies.username }*/);

});


//上傳商品資料
router.post('/myproduct/upload',upload.array('Product_Image'), function(req, res, next) {
  
  console.log(req.body);
  console.log(req.files);
  var File=req.body;
  fs.mkdir(`./users/${req.cookies.certifiedUser}`, { recursive: true }, (err) => {
    if (err) throw err;
});
  for(var i=0;i<req.files.length;i++){
    fs.rename( `./${req.files[i].path}`, //用重命名的方式來移動圖片 第一個參數為舊路徑
              `./users/${req.cookies.certifiedUser}/${req.files[i].filename}`,//第二個為新路徑
              function(err){
      console.log(err);
    });
  }
  var sqlsearch=`SELECT UID FROM user_register WHERE (username='${req.cookies.certifiedUser}')`;

  var sqlInsert=`INSERT INTO  Uploaded_Product_Info 
  ("Product_Name","Product_Discribtion",
  "Product_Content","Product_Image_Address",
  "Upload_User_Name","Upload_User_ID") VALUES(?,?,?,?,?,?)`;

  const stmt=Users.prepare(sqlsearch);
  const dbinsert=Users.prepare(sqlInsert);
  var row=stmt.all();
  console.log(row[0].UID);
  var UID=row[0].UID;
  dbinsert.run(File.Product_Name,File.Product_Discribtion,File.Product_Content,
    `./users/${req.cookies.certifiedUser}/`,req.cookies.certifiedUser,UID);

  return res.redirect('/products/myproduct/upload')//結束這個API後要記得改寫成到myproduct


});

router.delete('/myproduct', function(req, res, next) {
  if(req.cookies.username){
    res.render('index', { title: req.cookies.username });
  }else{
    res.render('index', { title: "guest" });
  }
  
});


router.get('/search', function(req, res, next) {
  if(req.cookies.username){
    res.render('index', { title: req.cookies.username });
  }else{
    res.render('index', { title: "guest" });
  }
  
});

router.get('/', function(req, res, next) {
  if(req.cookies.username){
    res.render('index', { title: req.cookies.username });
  }else{
    res.render('index', { title: "guest" });
  }
  
});


router.get('/myproduct', function(req, res, next) {
  if(req.cookies.certifiedUser){
    res.render('MyProducts');
  }else{
    res.render('index', { title: "guest" });
  }
  
});



module.exports = router;
