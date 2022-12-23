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
    let UserMaxCartIDSql=`SELECT User_Cart FROM Cart WHERE Buyer='${Buyer}' ORDER BY User_Cart DESC`;
    MAXSql=Users.prepare(UserMaxCartIDSql).all();
    if(!MAXSql[0]){
      Max=1;
    }else{
      Max=MAXSql[0].User_Cart+1;
    }
    
    let SameProductSearchSql=`SELECT * FROM Cart WHERE Buyer='${Buyer}' AND Product_ID=${Product_ID}`;
    let SameProductSearch=Users.prepare(SameProductSearchSql).all();
    console.log(SameProductSearch.length);
    if(SameProductSearch.length){
      console.log('hi2');
      Amount=parseInt(Amount);
      let OriginAmount=SameProductSearch[0].Amount;
      console.log(OriginAmount);
      let UpdateCartAmountSql=`Update Cart SET Amount=${Amount+OriginAmount} WHERE Buyer='${Buyer}' AND Product_ID=${Product_ID}`;
      let UpdateCartAmount=Users.prepare(UpdateCartAmountSql).run();
    }else{
      console.log('hi1');
      let CartInsertSql = `INSERT INTO  Cart (
        "Buyer",
        "Seller",
        "Product_ID",
        "Amount",
        "User_Cart") VALUES(?,?,?,?,?)`;
      let CarInsert = Users.prepare(CartInsertSql).run(
        Buyer,
        Seller,
        Product_ID,
        Amount,
        Max
      );
    }



  res.end();
});







router.get("/json", function (req, res, next) {
  var Cartsearch = `SELECT * FROM Cart WHERE (Buyer='${req.cookies.certifiedUser}')`; //User All Product search
  let Amount=new Array;
  var Cart = Users.prepare(Cartsearch).all();
  console.log(Cart);
  for(let i=0;i<Cart.length;i++){
    Amount.push(Cart[i].Amount);
  }
  let result=new Array;

  for (let i = 0; i < Cart.length; i++) {
    let productSearch = `SELECT * FROM Uploaded_Product_Info WHERE Product_ID=${Cart[i].Product_ID}`;
    let product = Users.prepare(productSearch).get();
    result.push(product);
    Cart[i].Image = product.Product_Image_Address;
    Cart[i].Product_Name = product.Product_Name;
    Cart[i].Price = product.Product_Price;
  }


let CartJson={};

let Seller_Amount = new Array();
var Seller_name = new Array();
let Product_ID = new Array();
let Seller_Price = new Array();
let Cart_index=new Array();
let index = 0;
for (let i = 0; i < result.length; i++) {
  let flag = 0; //flag=0代表找到相同名稱 =1代表未找到
  if (Seller_name.length == 0) {
    Product_ID[index] = new Array();
    Seller_Amount[index] = new Array();
    Seller_Price[index] = new Array();
    Cart_index[index]=new Array();
    Seller_Price[index].push(result[i].Product_Price * Amount[i]);
    Product_ID[index].push(result[i].Product_ID);
    Cart_index[index].push(i);
    Seller_Amount[index].push(Amount[i]);

    Seller_name[index] = result[i].Upload_User_Name;

    index++;
  } else {
    for (let j = 0; j < Seller_name.length; j++) {
      if (result[i].Upload_User_Name == Seller_name[j]) {
        flag = 0;
        Product_ID[j].push(result[i].Product_ID);
        Cart_index[j].push(i);
        Seller_Amount[j].push(Amount[i]);
        Seller_Price[j].push(result[i].Product_Price * Amount[i]);
        break;
      } else {
        flag = 1;
      }
    }
    if (flag == 1) {
      Seller_Amount[index] = new Array();
      Seller_Price[index] = new Array();
      Product_ID[index] = new Array();
      Cart_index[index]=new Array();
      Product_ID[index].push(result[i].Product_ID);
      Cart_index[index].push(i);

      Seller_Price[index].push(result[i].Product_Price * Amount[i]);
      Seller_Amount[index].push(Amount[i]);
      Seller_name[index++] = result[i].Upload_User_Name;
      index++;
    }
  }
}
CartJson.Cart_index=Cart_index;
CartJson.Seller_name = Seller_name;
CartJson.Seller_Amount = Seller_Amount;
CartJson.Product_ID = Product_ID;
CartJson.Seller_Price = Seller_Price;
CartJson.Product_Info=result;
CartJson.Cart=Cart;
res.json(CartJson);

});

router.delete('/',function(req,res,next){
  console.log(req.query);
  let data=req.query;
  let cartDelete=`DELETE FROM Cart WHERE Buyer='${data.Buyer}' AND User_Cart=${data.Cart}`
  let Delete=Users.prepare(cartDelete).run();
  res.end();
})



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

  let Seller_Amount = new Array();
  var Seller_name = new Array();
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
  res.json(data);
});

router.post("/Checkout", function (req, res, next) {
  console.log(req.body);
  if (req.body.Product.length == 0 || req.body.Amount.length == 0) {
    res.json({ success: false });
  } else {
    let Product_string;
    console.log(req.body.Amount.toString());

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
  let dt = new Date();
  let month=dt.getMonth()+1;
  let second=dt.getSeconds();
  if(month>12){
	month=month-12;
  }
  if(second<10){
    second='0'+second;
  }
  let format_time=dt.getFullYear()+'/'+month+'/'+dt.getDate()+' '+dt.getHours()+':'+dt.getMinutes()+':'+second;


  let sqlInsert =
    'INSERT INTO `Order` ("Buyer","Seller","Product_ID","Amount","Price","Accout_Stat","Time") VALUES(?,?,?,?,?,?,?)';
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
      0,
      format_time
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
