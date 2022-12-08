const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
var router = express.Router();



//Connecting to local DataBase
var db = new sqlite3.Database("./database/userfile.db");

router.get("/", function(request, response, next){

	var query = "SELECT * FROM sample_data WHERE Product_ID ORDER BY date DESC";
	console.log("DataBase Connected");

	db.serialize(function(){
		db.all(query, function(error, data){
	
			if(error)
			{
				throw error; 
			}
			else
			{
				response.render('Comment', {title:'留言評論', action:'list', sampleData:data});
			}

		});

	});
	

});




router.get("/add", function(request, response, next){
	response.render("add_Comment");

});

router.post("/add_sample_data", function(request, response, next){

	let dt = new Date();

	var name = request.body.first_name;

	// var last_name = request.body.last_name;
	var date = dt.getFullYear().toString() + "/" + dt.getMonth().toString() + "/" + dt.getDate().toString();

	var content = request.body.age;

	var gender = request.body.gender;

	if(content == '') response.redirect("/sample_data/add");
	else{
		db.serialize(function(){
			var query = `SELECT id FROM sample_data`;
	
			db.all(query, function(error, data){
				console.log(data[data.length-1].id,data.length);
				var register_str = data[data.length-1].id;
				var count_id = parseInt(register_str) +1;
				var id = count_id;
				var query2 = `
				INSERT INTO sample_data 
				(id,name, date, content, gender) 
				VALUES ("${id}","${name}", "${date}", "${content}", "${gender}")
				`;
				if(error)
				{
					throw error; 
				}
				else
				{
					db.run(query2, function(error, data){
		
						if(error)
						{
							throw error; 
						}
						else
						{
							response.redirect("/sample_data");
						}
			
					});
				}
	
			});
	
		});
	}
	

	

});

router.get('/edit', function(request, response, next){
console.log("hellot");
response.render("edit_Comment");

});

router.post('/edit/:id', function(request, response, next){

	let dt = new Date();
	

	var id = request.params.id;

	var name = request.body.first_name;

	var date = dt.getFullYear().toString() + "/" + dt.getMonth().toString() + "/" + dt.getDate().toString();

	var content = request.body.age;

	var gender = request.body.gender;


	var query = `
	UPDATE sample_data 
	SET name = "${name}", 
	date = "${date}", 
	content = "${content}", 
	gender = "${gender}" 
	WHERE id = "${id}"
	`;

	if(content == '') response.redirect(`/sample_data/edit/${id}`);
	else{
		db.serialize(function(){
			db.run(query, function(error, data){
		
				if(error)
				{
					throw error; 
				}
				else
				{
					response.redirect('/sample_data');
				}
	
			});
	
		});
	}


});

router.get('/delete/:id', function(request, response, next){

	var id = request.params.id; 

	var query = `
	DELETE FROM sample_data WHERE id = "${id}"
	`;

	db.serialize(function(){
		db.run(query, function(error, data){
	
			if(error)
			{
				throw error; 
			}
			else
			{
				response.redirect('/sample_data');
			}

		});

	});


});

module.exports = router;