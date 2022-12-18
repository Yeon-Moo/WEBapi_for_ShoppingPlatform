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



router.get("/", function (req, res, next) {

  readHtml("Comment",req,res);
});

router.get("/json", function (req, res, next) {

	var productID=req.query.productID;
	var UAPsearch = `SELECT * FROM Comment WHERE Product_ID=${productID} ORDER BY Date DESC`; //User All Product search
	var UAP_prepare=Users.prepare(UAPsearch);
	var historyComment=UAP_prepare.all();
	fs.readFile('./public/json/Comment_Info.json',function(err,CommentInfo){
		if(err)console.log(err);
		var Comment=CommentInfo.toString(); //將二進制數據轉回字串
		Comment=JSON.parse(Comment);
		for(var i=0;i<historyComment.length;i++){
		  Comment.Comment.push(historyComment[i]);
		}
		Comment.total=historyComment.length;
		console.log(Comment);
		res.json(Comment);
	
	  })


	});
	
	// fs.readFile('./public/json/Comment_Info.json',function(err,CommentInfo){
	// 	if(err)console.log(err);
	// 	var Comment=CommentInfo.toString(); //將二進制數據轉回字串
	// 	Comment=JSON.parse(Comment);
	// 	for(var i=0;i<historyComment.length;i++){
	// 	  Comment.Comment.push(historyComment[i]);
	// 	}
	// 	Comment.total=historyComment.length;
	// 	console.log(Comment);
	// 	res.json(Comment);
	
	//   })


router.get("/add", function (req, res, next) {
  readHtml("add_Comment",req,res);
});

router.post("/add", function (req, res, next) {
  let dt = new Date();
  let month=dt.getMonth()+1;
  if(month>12){
	month=month-12;
  }
  let format_time=dt.getFullYear()+'/'+month+'/'+dt.getDate()+' '+dt.getHours()+':'+dt.getMinutes()+':'+dt.getSeconds();
  console.log(format_time);

  console.log(req.body);
  let Comment=req.body.add_Comment_Content;
  let gender=req.body.gender;
  let productID=req.body.productID;

  let sqlInsert = `INSERT INTO  Comment (
	"User_Name",
	"Date",
	"Content",
	"Gender",
	"Product_ID") VALUES(?,?,?,?,?)`;

let commentInsert=Users.prepare(sqlInsert).run(
	req.cookies.certifiedUser,
	format_time,
	Comment,
	gender,
	productID);
  res.redirect(`/Comment?productID=${[productID]}`);

});


router.get("/delete/:id", function (request, response, next) {
  var id = request.params.id;

  var query = `
	DELETE FROM sample_data WHERE id = "${id}"
	`;

  db.serialize(function () {
    db.run(query, function (error, data) {
      if (error) {
        throw error;
      } else {
        response.redirect("/sample_data");
      }
    });
  });
});

module.exports = router;
