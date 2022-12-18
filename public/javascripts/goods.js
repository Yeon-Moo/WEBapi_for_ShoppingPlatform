
$(document).ready(function(){
    axios.get("/json")
    .then(res=>{
        var UAPInfo=res.data;
        var UAP_Product_Info=UAPInfo.Product_Info;
       
        

        if(UAPInfo.Product_Info.length){
        for(var i=0;i<UAP_Product_Info.length;i++){

            if(i == 0){
                var firstDiv=document.querySelector(`.goods_title`);  
                var contentDiv=document.createElement('div');
                var ProductDiv=document.createElement('div');
                var ImageDiv=document.createElement('img');
                var ProductName_div=document.createElement('div');
                var ProductPrice_div=document.createElement('div');
                var Product=document.createElement('div');
                var Product_link=document.createElement('a');

                var ProductInfo_div=document.createElement('div');
                var ProductPrice=document.createElement('div');

                contentDiv.className="title_goods_div";
                ImageDiv.className = "title_img_div";
                ProductName_div.className = "title_goodsname_div";
                ProductPrice_div.className = "title_price_div";
                ProductPrice.className = "title_price_div";
                Product_link.className = "title_links_div";
                ProductDiv.className = "title_product_div";
                Product.className = "title_link_div";
                ProductInfo_div.className = "title_info_div";

                Product_link.href=`/products?ID=${UAP_Product_Info[i].Product_ID}`;
                ImageDiv.src=`./../img${UAP_Product_Info[i].Product_Image_Address}`;

                ProductName_div.innerHTML=UAP_Product_Info[i].Product_Name;//商品名稱

                ProductPrice.innerHTML=`$`+`${UAP_Product_Info[i].Product_Price} `;//商品價格

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

            else if(i == 1 || i==2 || i==3 || i==4){
                var firstDiv=document.querySelector(`.today${i}`);  
                var contentDiv=document.createElement('div');
                var ProductDiv=document.createElement('div');
                var ImageDiv=document.createElement('img');
                var ProductName_div=document.createElement('div');
                var ProductPrice_div=document.createElement('div');
                var Product=document.createElement('div');
                var Product_link=document.createElement('a');

                var ProductInfo_div=document.createElement('div');
                var ProductPrice=document.createElement('div');

                contentDiv.className="second_goods_div";
                ImageDiv.className = "second_img_div";
                ProductName_div.className = "second_goodsname_div";
                ProductPrice_div.className = "second_price_div";
                ProductPrice.className = "second_price_div";
                Product_link.className = "second_links_div";
                ProductDiv.className = "second_product_div";
                Product.className = "second_link_div";
                ProductInfo_div.className = "second_info_div";

                Product_link.href=`/products?ID=${UAP_Product_Info[i].Product_ID}`;
                ImageDiv.src=`./../img${UAP_Product_Info[i].Product_Image_Address}`;

                ProductName_div.innerHTML=UAP_Product_Info[i].Product_Name;//商品名稱

                ProductPrice.innerHTML=`$`+`${UAP_Product_Info[i].Product_Price} `;//商品價格

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
            
            else{
                    var firstDiv=document.querySelector(`.all_goodss`);  
                    var contentDiv=document.createElement('div');
                    var ProductDiv=document.createElement('div');
                    var ImageDiv=document.createElement('img');
                    var ProductName_div=document.createElement('div');
                    var ProductPrice_div=document.createElement('div');
                    var Product=document.createElement('div');
                    var Product_link=document.createElement('a');

                    var ProductInfo_div=document.createElement('div');
                    var ProductPrice=document.createElement('div');

                    contentDiv.className="goods_div";
                    ImageDiv.className = "img_div";
                    ProductName_div.className = "goodsname_div";
                    ProductPrice_div.className = "price_div";
                    ProductPrice.className = "price_div";
                    Product_link.className = "links_div";
                    ProductDiv.className = "product_div";
                    Product.className = "link_div";
                    ProductInfo_div.className = "info_div";

                    Product_link.href=`/products?ID=${UAP_Product_Info[i].Product_ID}`;
                    ImageDiv.src=`./../img${UAP_Product_Info[i].Product_Image_Address}`;

                    ProductName_div.innerHTML=UAP_Product_Info[i].Product_Name;//商品名稱

                    ProductPrice.innerHTML=`$`+`${UAP_Product_Info[i].Product_Price} `;//商品價格

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

            //document.getElementById("all_goods").appendChild(firstDiv);  
            //////
        }
        $('.delete').click(function(){
            console.log(event.target.value);
            console.log('hello');
            axios.delete(`/myproduct?Product_ID=${event.target.value}`)
            .then(res=>{
                console.log('res finish');
                location.replace('/myproduct');
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


