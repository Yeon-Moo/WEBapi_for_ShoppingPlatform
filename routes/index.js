var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.cookies.certifiedUser){
    res.render('users', { title: req.cookies.certifiedUser });
  }else{
    res.render('guest', { title: "guest" });
  }
  
});

module.exports = router;
