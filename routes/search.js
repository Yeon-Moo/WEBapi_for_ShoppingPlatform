const express = require("express");
const router = express.Router();
const fs = require("fs");
const database = require("better-sqlite3"); //同步版的sqlite3
const Users = new database("./database/userfile.db");
var bodyParser = require("body-parser");

var cookieParser = require("cookie-parser");

let search= function(productName){
    //如果商品名不為空，搜尋特定商品
    if(productName!=''){
        //字串處理，輸入部分關鍵字也可查詢，但無法處理空格
        productName = '%'+productName+'%'
        //console.log('entry If')   

        //取得特定商品資料
        var result = Users.prepare(`SELECT * FROM Uploaded_Product_Info WHERE Product_Name like '${productName}'`).all()

        
    //如果商品名為空，搜尋所有商品
    }else{  
        console.log('entry Else')
        var result = Users.prepare("SELECT * FROM Uploade_Product_info").all()
        //console.log(result)
    }
    console.log(result);
    return result
}


let mysearch=function(productName,userId){
    //如果商品名不為空，搜尋特定商品
    if(productName!=''){
        //字串處理，輸入部分關鍵字也可查詢，但無法處理空格
        productName = '%'+productName+'%'
        //console.log('entry If')   

        //取得特定商品資料
        var result = Users.prepare("SELECT * FROM Uploade_Product_info WHERE Product_Name like ? AND Upload_User_Name like ?").all(productName,userId)
        //console.log(result)

        
    //如果商品名為空，搜尋所有商品
    }else{  
        console.log('entry Else')
        var result = Users.prepare("SELECT * FROM Uploade_Product_info WHERE Product_Name like ?").all(userId)
        //console.log(result)
    }
    console.log(result);
    return result
}

router.get('/' ,(req,res) => {
    //取得傳入的商品名並搜尋
    res.render('search')
})

router.get('/json' ,(req,res) => {
    //取得傳入的商品名並搜尋
    console.log(req.query);
    result=search(req.query.productName);
    
    fs.readFile('./public/json/Product_Info.json',function(err,ProductInfo){
        if(err)console.log(err);
        var Product=ProductInfo.toString(); //將二進制數據轉回字串
        Product=JSON.parse(Product);
        //這段用以將文件夾裡所有圖片的名稱推送到json中 日後可能會用到 先行保留
        // for(var i=0;i<allImage.length;i++){   
        //   Product.Product_Image.push(allImage[i]);
        // }
        for(var i=0;i<result.length;i++){
          Product.Product_Info.push(result[i]);
        }
        Product.total=result.length;
        console.log(Product);
        res.json(Product);
    
      })

})

router.get('/Myproduct',(req,res) => {
    //取得傳入的商品名並搜尋
    received = mysearch(req.query.productName,req.query.userId)
    res.render('search',{
        result: received,
        productName: req.query.productName
    })
})


module.exports = router;