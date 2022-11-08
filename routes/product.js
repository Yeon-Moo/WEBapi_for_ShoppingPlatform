const express = require('express');
const router = express.Router();
const fs=require('fs');
const database=require('better-sqlite3');//同步版的sqlite3
const Users=new database('./database/userfile.db');
var bodyParser = require('body-parser');


/* GET home page. */
router.get('/myproduct/upload', function(req, res, next) {

    res.render('Upload_Product'/*, { title: req.cookies.username }*/);

  
  
});
router.post('/myproduct', function(req, res, next) {
  if(req.cookies.username){
    res.render('index', { title: req.cookies.username });
  }else{
    res.render('index', { title: "guest" });
  }
  
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



module.exports = router;
