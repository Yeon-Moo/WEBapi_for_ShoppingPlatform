const express = require('express');
const router = express.Router();
const fs=require('fs');
const database=require('better-sqlite3');//同步版的sqlite3
const Users=new database('./database/userfile.db');
const session=require('express-session');

var bodyParser = require('body-parser');



var page_login=function(req,res){
  res.render('login');
}



var page_register=function(req,res){
  res.render('register')
}


/* GET users listing. */
router.get('/register', function(req, res, next) {//取得register頁面

  page_register(req,res);
});

router.get('/login', function(req, res, next) {//取得login頁面
  page_login(req,res);
});

router.post('/register', function(req, res, next) {//上傳註冊資料
 // 取得使用者註冊資料
 const { username, email, password, confirmPassword } = req.body
 res.clearCookie('sameUsername',{path:'/users'});
 res.clearCookie('sameEmail',{path:'/users'});
  console.log(req.body);
  var sqlInsert=`INSERT INTO user_register ("username","email","password") VALUES(?,?,?)`;
  var sqlsearch=`SELECT * FROM user_register WHERE (username='${username}') OR (email='${email}')`;
  const stmt=Users.prepare(sqlsearch);
  const dbinsert=Users.prepare(sqlInsert);
  var row=stmt.all();
  console.log(row);
  if(row.length==[]){
    dbinsert.run(username,email,password);
    return res.redirect('/users/login')
  }
  else{
    if(row[0].username==username){
      console.log("matched username");
      res.cookie('sameUsername',"bad",{path:'/users',maxAge:2000000});
    return res.redirect('/users/register')
    }
    if(row[0].email==email){
      console.log("matched email");
      res.cookie('sameEmail',"bad",{path:'/users',maxAge:2000000});
     return res.redirect('/users/register')
    }
  }
})



router.post('/login', function(req, res, next) {//上傳登入資料
  const { username, password } = req.body
  var sqlsearch=`SELECT * FROM user_register WHERE username='${username}'`;
  const stmt=Users.prepare(sqlsearch);//使用前都要加prepare(sql)
  var row=stmt.all();
  if(row.length==[]){//若於資料庫內找不到相關的帳號 網頁就跳出警告視窗
    res.setHeader("Content-Type","text/html");
      res.send(`<script>alert('帳號輸入錯誤');
      location.href='/users/login'</script>`);
  }else{
    if(password==row[0].password){
      res.cookie('certifiedUser',username,{path:'/',httpOnly:true,maxAge:6000000000});
      console.log("give cookie");
      return res.redirect('/');
    }else{          //若於資料庫內的帳號 與密碼不匹配 網頁就跳出警告視窗
      res.setHeader("Content-Type","text/html");
      res.send(`<script>alert('密碼輸入錯誤');
      location.href='/users/login'</script>`);
    } 
   
  }
});

router.get('/', function(req, res, next) {//取得首頁頁面
  var islogin=false;
  if(req.cookies.certifiedUser){
    res.render('users', { title: req.cookies.certifiedUser,name:req.cookies.certifiedUser });
  }else{
    res.render('guest', { title: "guest" });
  }
  

});

router.get('/logout', function(req, res, next) {//取得logout頁面
 res.clearCookie('certifiedUser',{path:'/'});
 return res.redirect('/');
});


module.exports = router;//module.exports=任何資料型別
