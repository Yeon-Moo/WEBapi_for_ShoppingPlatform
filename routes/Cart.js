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
  readHtml("Cart", req, res);
});

router.post("/", function (req, res, next) {
  let { Product_ID, Buyer, Amount, Seller } = req.body;
  console.log(
    "Product_ID:" +
      Product_ID +
      ",Buyer:" +
      Buyer +
      ",Seller:" +
      Seller +
      ",Amount:" +
      Amount
  );

  let CartInsertSql = `INSERT INTO  Cart (
		"Buyer",
		"Seller",
		"Product_ID",
		"Amount") VALUES(?,?,?,?)`;
  let CarInsert = Users.prepare(CartInsertSql).run(
    Buyer,
    Seller,
    Product_ID,
    Amount
  );

  res.end();
});

router.get("/json", function (req, res, next) {
  var Cartsearch = `SELECT * FROM Cart WHERE (Buyer='${req.cookies.certifiedUser}')`; //User All Product search

  var Cart = Users.prepare(Cartsearch).all();

  console.log(Cart);
  // let Image=new Array(Cart.length);
  // let Price=new Array(Cart.length);
  // let Product_Name=new Array(Cart.length);
  for (let i = 0; i < Cart.length; i++) {
    let productSearch = `SELECT * FROM Uploaded_Product_Info WHERE Product_ID=${Cart[i].Product_ID}`;
    let product = Users.prepare(productSearch).get();
    Cart[i].Image = product.Product_Image_Address;
    Cart[i].Product_Name = product.Product_Name;
    Cart[i].Price = product.Product_Price;
  }
  console.log(Cart);

  fs.readFile("./public/json/Cart_Info.json", function (err, CartInfo) {
    if (err) console.log(err);
    var CartJson = CartInfo.toString(); //將二進制數據轉回字串
    CartJson = JSON.parse(CartJson);

    for (var i = 0; i < Cart.length; i++) {
      CartJson.Cart.push(Cart[i]);
    }
    CartJson.total = Cart.length;
    res.json(CartJson);
  });
});

router.get("/Checkout", function (req, res, next) {
  readHtml("Checkout", req, res);
});
router.get("/Checkout/json", function (req, res, next) {
  // console.log(req.query);
  //////////////////////////////////////////
  //讀取所有選取的商品
  Cart = req.query.Product;
  Cart = String(Cart).split(",");
  console.log(Cart);
  Amount = String(req.query.Amount).split(",");
  let newAmount = new Array();
  for (let i = 0; i < Amount.length; i++) {
    newAmount.push(parseInt(Amount[i]));
  }
  console.log(newAmount);
  Amount = newAmount;
  // console.log(Cart);
  var result = new Array();
  var data = {};
  for (let i = 0; i < Cart.length; i++) {
    let productSearch = `SELECT * FROM Uploaded_Product_Info WHERE Product_ID=${Cart[i]}`;
    let product = Users.prepare(productSearch).get();
    result.push(product);
  }
  data.Product = result;
  //////////////////////////////////////////

  //////////////////////////////////////////
  //找出訂單中有幾個不同賣家以及訂單中存有的賣家的商品數量
  var Seller_name = new Array();
  let Seller_Amount = new Array();
  let Product_ID = new Array();
  let Seller_Price = new Array();
  let index = 0;
  for (let i = 0; i < result.length; i++) {
    let flag = 0; //flag=0代表找到相同名稱 =1代表未找到
    if (Seller_name.length == 0) {
      Product_ID[index] = new Array();
      Seller_Amount[index] = new Array();
      Seller_Price[index] = new Array();
      Seller_Price[index].push(result[i].Product_Price * Amount[i]);
      Product_ID[index].push(result[i].Product_ID);
      Seller_Amount[index].push(Amount[i]);

      Seller_name[index] = result[i].Upload_User_Name;

      index++;
    } else {
      for (let j = 0; j < Seller_name.length; j++) {
        if (result[i].Upload_User_Name == Seller_name[j]) {
          flag = 0;
          Product_ID[j].push(result[i].Product_ID);
          Seller_Amount[j].push(Amount[i]);
          Seller_Price[j].push(result[i].Product_Price * Amount[i]);
          break;
        } else {
          flag = 1;
        }
      }
      if (flag == 1) {
        Product_ID[index] = new Array();
        Product_ID[index].push(result[i].Product_ID);
        Seller_Amount[index] = new Array();
        Seller_Price[index] = new Array();
        Seller_Price[index].push(result[i].Product_Price * Amount[i]);
        Seller_Amount[index].push(Amount[i]);
        Seller_name[index++] = result[i].Upload_User_Name;
        index++;
      }
    }
  }
  /////////////////////////////////////////////
  data.Seller_name = Seller_name;
  data.Seller_Amount = Seller_Amount;
  data.Product_ID = Product_ID;
  data.Seller_Price = Seller_Price;
  // console.log(Seller_name);
  // console.log(Seller_Amount);

  res.json(data);
});

router.post("/Checkout", function (req, res, next) {
  console.log(req.body);
  if (req.body.Product.length == 0 || req.body.Amount.length == 0) {
    res.json({ success: false });
  } else {
    let Product_string;
    console.log(req.body.Amount.toString());
    // for(let i=0;i<req.body.Product.length;i++){
    // 	if(i==0){
    // 		Product_string=`${req.body.Product[i]}`;
    // 	}else{
    // 		Product_string=Product_string+`,${req.body.Product[i]}`
    // 	}

    // }
    Product_string = '"' + Product_string + '"';
    console.log(Product_string);
    res.cookie("Product", req.body.Product.toString(), {
      path: "/Cart/Checkout",
      maxAge: 2000000,
    });
    res.cookie("Amount", `${req.body.Amount.toString()}`, {
      path: "/Cart/Checkout",
      maxAge: 2000000,
    });
    res.json({ success: true });
  }
});

router.post("/Checkout/Order", function (req, res, next) {
  console.log(req.body);
  let data = req.body;

  let sqlInsert =
    'INSERT INTO `Order` ("Buyer","Seller","Product_ID","Amount","Price","Accout_Stat") VALUES(?,?,?,?,?,?)';
  console.log(data.Seller.length);
  var Order;
  for (let i = 0; i < data.Seller.length; i++) {
    Product = JSON.stringify(data.Product[i]);
    Amount = JSON.stringify(data.Amount[i]);
    Price = JSON.stringify(data.Price[i]);

    console.log(Product);
    Order = Users.prepare(sqlInsert).run(
      data.Buyer,
      data.Seller[i],
      Product,
      Amount,
      Price,
      0
    );
  }
  res.json({ success: true });
});

router.get("/myOrder", function (req, res, next) {
  readHtml("myOrder", req, res);
});

router.get("/myOrder/json", function (req, res, next) {
  console.log(req.query);
  Buyer=req.query.Buyer;
  let OrderSearch ="SELECT * FROM `Order` WHERE Buyer=?";
  let Order = Users.prepare(OrderSearch).all(`${Buyer}`);

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
