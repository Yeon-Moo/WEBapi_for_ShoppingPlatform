
$(document).ready(function(){

    axios.get("/products/myproduct_json")
    .then(res=>{
        var UAPInfo=res.data;
        var UAP_Product_Info=UAPInfo.Product_Info;
        console.log(UAPInfo.Product_Info);

    
        if(UAPInfo.Product_Info.length){
        for(var i=0;i<UAP_Product_Info.length;i++){
            var firstDiv=document.querySelector(`.goods`);  
            var contentDiv=document.createElement('div');
            var ProductDiv=document.createElement('div');
            var ImageDiv=document.createElement('img');
            var ProductName_div=document.createElement('div');
            var ProductPrice_div=document.createElement('div');
            var Product=document.createElement('div');
            var Product_link=document.createElement('a');
            var first=document.createElement('p')
            var img=document.createElement('img');
            var ProductInfo_div=document.createElement('div');


            contentDiv.style="display:flex;flex-direction:row";
            contentDiv.className="123";

            if(i%2===0){
                Product_link.href="https://shopee.tw/";
               }else{
                Product_link.href="https://www.google.com/search?q=6*250&oq=6*250&aqs=chrome..69i57.1008j0j7&sourceid=chrome&ie=UTF-8"
               }

            ImageDiv.src=`./../img/yu10p/${i+1}/0.png`;
            ImageDiv.style="width:200px;Height:200px;";
            ProductDiv.style="margin:1px;width:205px;display:flex;flex-direction:column;border:1px;border-style:solid;";
            ProductName_div.innerHTML=UAP_Product_Info[i].Product_Name;//商品名稱
            firstDiv.style=`display:flex;flex-direction:row;width:1300px;height:1000px;flex-wrap:wrap;align-content:flex-start`;
            ProductPrice_div.innerHTML=`$`+`${UAP_Product_Info[i].Product_Price}`;//商品價格


            
            ProductInfo_div.appendChild(ProductName_div);
            ProductInfo_div.appendChild(ProductPrice_div);
            ProductDiv.appendChild(ImageDiv);
            ProductDiv.appendChild(ProductInfo_div);
            Product_link.appendChild(ProductDiv);
            Product.appendChild(Product_link);
            contentDiv.appendChild(Product);
            contentDiv.appendChild(Product);
            firstDiv.appendChild(contentDiv);
        }
       
    }
    else{
        var firstDiv=document.querySelector(`.goods`);  
        var text=document.createTextNode("目前沒有商品上架中");
        firstDiv.appendChild(text);
    }






    })

})