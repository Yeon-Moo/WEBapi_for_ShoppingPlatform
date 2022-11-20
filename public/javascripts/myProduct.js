
$(document).ready(function(){

    axios.get("/products/myproduct_json")
    .then(res=>{
        var UAPInfo=res.data;
        var UAP_Product_Info=UAPInfo.Product_Info;
        var allImage=UAPInfo.Product_Image;
        console.log(UAPInfo);

    
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
            var ProductPrice=document.createElement('div');
            var delete_btn_div=document.createElement('div');
            var delete_btn=document.createElement('button');
            contentDiv.style="display:flex;flex-direction:row";
            contentDiv.className="123";

            Product_link.href=`/products?ID=${UAP_Product_Info[i].Product_ID}`;
            Product_link.style="text-decoration:none;color:black;";
            ImageDiv.src=`./../img${UAP_Product_Info[i].Product_Image_Address}`;
            ImageDiv.style="width:200px;Height:200px;";
            ProductDiv.style="margin:1px;width:205px;display:flex;flex-direction:column;border:1px;border-style:solid;";
            ProductName_div.innerHTML=UAP_Product_Info[i].Product_Name;//商品名稱
            firstDiv.style=`display:flex;flex-direction:row;width:1300px;height:1000px;flex-wrap:wrap;align-content:flex-start`;
            ProductPrice_div.style="display:flex;flex-direction:row;";
            ProductPrice.style="width:80px;justify-content:center;"
            ProductPrice.innerHTML=`$`+`${UAP_Product_Info[i].Product_Price} `;//商品價格
            delete_btn.classList="delete btn btn-danger";
            delete_btn.value=UAP_Product_Info[i].Upload_User_Product_ID;
            
            delete_btn.style="font-size:5px; padding-top:3px;padding-bottom:3px;"
            delete_btn.innerHTML="下架";
            delete_btn_div.appendChild(delete_btn);
            ProductPrice_div.appendChild(ProductPrice);
            ProductPrice_div.appendChild(delete_btn_div);
            
            
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
        $('.delete').click(function(){
            console.log(event.target.value);
            console.log('hello');
            axios.delete(`/products/myproduct?Product_ID=${event.target.value}`)
            .then(res=>{
                console.log('res finish');
                location.replace('/products/myproduct');
            })
        
        })
       
    }
    else{
        var firstDiv=document.querySelector(`.goods`);  
        var text=document.createTextNode("目前沒有商品上架中");
        firstDiv.appendChild(text);
    }

    })

})
