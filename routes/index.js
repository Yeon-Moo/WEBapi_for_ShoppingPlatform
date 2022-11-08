var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.cookies.certifiedUser){
    res.render('index', { title: req.cookies.certifiedUser });
  }else{
    res.render('index', { title: "guest" });
  }
  
});

module.exports = router;
