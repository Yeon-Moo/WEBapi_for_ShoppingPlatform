
let getUrlString = location.href;
var url = new URL(getUrlString);
var Product_ID=url.searchParams.get('ID')

function getCookie(cookiename) {
    const strcookie = document.cookie;
    const cookieList=strcookie.split(";");
    for( let i=0;i<cookieList.length;i++){
        const arr=cookieList[i].split('=');
        if(cookiename===arr[0].trim()){
            return arr[1];
        }
    }
    }



$(document).ready(function(){

    document.getElementById('Amount').value=1;
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
        Product_Image.style="width:450px;height:auto;"
        Product_Name.innerHTML=Product.Product_Name;
        Product_Price.innerHTML='$'+Product.Product_Price;

        $('#Cart_add').click(function(){

            axios.post('/Cart',{
                Product_ID:Product_ID,
                Buyer:getCookie("certifiedUser"),
                Amount:document.getElementById('Amount').value,
                Seller:Product.Upload_User_Name
            })
            .then(res=>{    
                toastr.options.positionClass="toast-top-center";
                toastr.success("已將商品加入購物車!");
            })
        
        })

        $('#Product_Buy').click(function(){
            let Product_Amount=document.getElementById('Amount').value;
            axios.post('/Cart/Checkout',{
                Product:Product_ID,
                Amount:Product_Amount
            })
            .then(res=>{    
                console.log(res.data.success);
                if(res.data.success==false){
                    alert("請至少選擇一樣商品!!!");
                }else if(res.data.success==true){
                    window.location.href='/Cart/Checkout';
                }
            })
        })
        


    })
})



