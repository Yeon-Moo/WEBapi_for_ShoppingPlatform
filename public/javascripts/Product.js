
$(document).ready(function(){
    let getUrlString = location.href;
    var url = new URL(getUrlString);
    var Product_ID=url.searchParams.get('ID')
    console.log(Product_ID);
    document.getElementById('productID').value=Product_ID;
    axios.get(`/products/Product_json?ID=${Product_ID}`)
    .then(res=>{
        console.log(res.data);
        var Product=res.data;
        var page_title=document.getElementById('page_title');
        var Product_Image=document.getElementById('Product_Image');
        var Product_Name=document.getElementById('Product_Name');
        var Product_Price=document.getElementById('Product_Price');
        var Product_Content=document.getElementById('Product_Content');
        var Upload_User_Mall=document.getElementById('Upload_User_Mall');
        page_title.innerHTML=`${Product.Product_Name} | Yeon's Shop`;
        Upload_User_Mall.href=`/products/mall?member=${Product.Upload_User_Name}`;
        Upload_User_Mall.innerHTML=Product.Upload_User_Name;
        Product_Content.innerHTML=Product.Product_Content;
        Product_Image.src=`./img/${Product.Product_Image_Address}`;
        Product_Image.style="width:500px;height:500px;"
        Product_Name.innerHTML=Product.Product_Name;
        Product_Price.innerHTML='$'+Product.Product_Price;
    })
})
