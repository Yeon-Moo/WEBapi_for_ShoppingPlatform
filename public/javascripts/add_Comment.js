
$(document).ready(function(){
 
    let getUrlString = location.href;
    var url = new URL(getUrlString);
    var Product_ID=url.searchParams.get('productID')
    document.getElementById('productID').value=Product_ID;
    axios.get(`/products/product_json?ID=${Product_ID}`)
    .then((res)=>{
        document.getElementById('title_add_Comment').innerHTML="為"+res.data.Product_Name+"新增評論吧!";
    })

})