
$(document).ready(function(){



    let Product=getCookie('Product').split('%2C');
    let Product_Amount=getCookie('Amount').split('%2C');
    let Buyer=getCookie('certifiedUser');

    let Cart_content=document.getElementById('Cart_Content');
    axios.get(`/Cart/Checkout/json?Product=${getCookie('Product')}&Amount=${getCookie('Amount')}`)
    .then((res)=>{
        console.log(res.data);
        let cart=res.data.Product;
        var totalPrice=0;
        for(let k=0;k<res.data.Seller_name.length;k++){
            let div10=document.createElement('div');
            let div11=document.createElement('div');
            let div12=document.createElement('div');
            let h5_4=document.createElement('h5');
            h5_4.innerHTML='商場:'+res.data.Seller_name[k];
            div11.appendChild(h5_4);
            div10.appendChild(div11);
            for(let i=0;i<res.data.Product_ID[k].length;i++){
                for(let j=0;j<cart.length;j++){
                    if(cart[j].Product_ID==res.data.Product_ID[k][i]){
                        let div1=document.createElement('div');
                        let div2=document.createElement('div');
                        let div3=document.createElement('div');
                        let div4=document.createElement('div');
                        let div5=document.createElement('div');
                        let div6=document.createElement('div');
                        let div7=document.createElement('div');
                        let div8=document.createElement('div');
                        let div9=document.createElement('div');
                        let img1=document.createElement('img');
                        let h5_1=document.createElement('h5');//product name
                        let h5_2=document.createElement('h5');//product amount
                        let h5_3=document.createElement('h5');
                        let a1=document.createElement('a');
                        let link_product=document.createElement('a');
                        let p1=document.createElement('p');
                        let Price=cart[j].Product_Price*Product_Amount[j];
                        div1.classList="card mb-3";
                        div1.style="width:500px;"
                        div2.classList="card-body";
                        div3.classList="d-flex justify-content-between";
                        div4.classList="d-flex flex-row align-items-center";
                        div6.classList="ms-3";
                        div7.classList="d-flex flex-row align-items-center";
                        div8.style="width: 50px;";
                        div9.style="width: 150px;";
                        link_product.href=`/products?ID=${cart[j].Product_ID}`
                        img1.src="/img/"+cart[j].Product_Image_Address;
                        img1.classList="img-fluid rounded-3";
                        img1.style="width:65px;";
                        
                        p1.classList="small mb-0";
                        h5_1.innerHTML=cart[j].Product_Name;
                        h5_2.classList="fw-normal mb-0";
                        h5_2.innerHTML="<span style='font-size:15px;'>數量</span><br>"+Product_Amount[j];
                        h5_3.classList="mb-0";
                        h5_3.innerHTML="$"+Price;
                        totalPrice=totalPrice+Price;
                        div5.appendChild(img1);
                        div6.appendChild(h5_1);
                        div6.appendChild(p1);
            
                        link_product.append(div5,div6);
                        div4.append(link_product);
                        div8.appendChild(h5_2);
                        div9.appendChild(h5_3);
            
                        div7.append(div8,div9,a1);
            
                        div3.append(div4,div7);
                        div2.appendChild(div3);
                        div1.appendChild(div2);
                        div12.appendChild(div1);
                       
                    }
                }

            };
            div10.appendChild(div12);
            Cart_content.appendChild(div10);
        }
        

        document.getElementById('totalPrice').innerHTML=totalPrice;
        $('#Order').click(function(){
            axios.post('/Cart/Checkout/Order',{
                Buyer:Buyer,
                Seller:res.data.Seller_name,
                Product:res.data.Product_ID,
                Amount:res.data.Seller_Amount,
                Price:res.data.Seller_Price
            }).then(res=>{
                console.log(res);
                alert('下單完成!!!');
                window.location.href='/';
            
            })
        });
    })

})





// <h3 class="mb-5 pt-2 text-center fw-bold text-uppercase">Your products</h3>

// <div class="d-flex align-items-center mb-5">
//     <div class="flex-shrink-0">
//         <img src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Products/13.webp"
//         class="img-fluid" style="width: 150px;" alt="Generic placeholder image">
//     </div>
//     <div class="flex-grow-1 ms-3">
//         <a href="#!" class="float-end text-black"><i class="fas fa-times"></i></a>
//         <h5 class="text-primary">Samsung Galaxy M11 64GB</h5>
//         <h6 style="color: #9e9e9e;">Color: white</h6>
//         <div class="d-flex align-items-center">
//         <p class="fw-bold mb-0 me-5 pe-3">799$</p>
//             <div class="def-number-input number-input safari_only">
//                 <button onclick="this.parentNode.querySelector('input[type=number]').stepDown()"
//                 class="minus"></button>
//                 <h6 class="quantity fw-bold text-black"></h6>
//                 <button onclick="this.parentNode.querySelector('input[type=number]').stepUp()"
//                 class="plus"></button>
//             </div>
//         </div>
//     </div>
// </div>