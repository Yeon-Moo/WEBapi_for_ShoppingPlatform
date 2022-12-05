
$(document).ready(function(){
    let getUrlString = location.href;
    var url = new URL(getUrlString);
    var Upload_User_Name=url.searchParams.get('member')
    console.log(Upload_User_Name);
    axios.get(`/products/mall_json?mall=${Upload_User_Name}`)
    .then(res=>{
        var MAPInfo=res.data;
        var MAP_Product_Info=MAPInfo.Product_Info;
        console.log(MAPInfo);

        console.log(MAP_Product_Info.length);
        if(MAPInfo.Product_Info.length){
        for(var i=0;i<MAP_Product_Info.length;i++){
            var firstDiv=document.querySelector(`.goods`);  
            var contentDiv=document.createElement('div');
            var ProductDiv=document.createElement('div');
            var ImageDiv=document.createElement('img');
            var ProductName_div=document.createElement('div');
            var ProductPrice_div=document.createElement('div');
            var Product=document.createElement('div');
            var Product_link=document.createElement('a');
            var ProductInfo_div=document.createElement('div');
            var ProductPrice=document.createElement('div');
            let seller_name=document.getElementById('seller_name');
            contentDiv.style="display:flex;flex-direction:row";
            contentDiv.className="123";
            seller_name.innerHTML='&nbsp &nbsp &nbsp &nbsp &nbsp'+Upload_User_Name+'的商品';
            Product_link.href=`/products?ID=${MAP_Product_Info[i].Product_ID}`;
            Product_link.style="text-decoration:none;color:black;";
            ImageDiv.src=`./../img${MAP_Product_Info[i].Product_Image_Address}`;
            ImageDiv.style="width:200px;Height:200px;";
            ProductDiv.style="margin:1px;width:205px;display:flex;flex-direction:column;border:1px;border-style:solid;";
            ProductName_div.innerHTML=MAP_Product_Info[i].Product_Name;//商品名稱
            firstDiv.style=`display:flex;flex-direction:row;width:1300px;height:1000px;flex-wrap:wrap;align-content:flex-start`;
            ProductPrice_div.style="display:flex;flex-direction:row;";
            ProductPrice.style="width:80px;justify-content:center;"
            ProductPrice.innerHTML=`$`+`${MAP_Product_Info[i].Product_Price} `;//商品價格
         
    
            ProductPrice_div.appendChild(ProductPrice);
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
