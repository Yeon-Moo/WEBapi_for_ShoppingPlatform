
        let Product_ID=new Array;
        let Product_Amount=new Array;
$(document).ready(function(){
    let Cart_content=document.getElementById('Cart_Content');
    axios.get('/Cart/json')
    .then((res)=>{
      
        let data=res.data;
        console.log(data);
        for(let j=0;j<data.Seller_name.length;j++){
            let div12=document.createElement('div');
            let div13=document.createElement('div');
            div13.style='background-color:white;width:500px;';
            div12.style='width:500px;'
            let h5_4=document.createElement('h5');
            let link_Seller=document.createElement('a');
            link_Seller.href=`products/mall?member=${data.Seller_name[j]}`
            link_Seller.style='Text-decoration:none;color:black;'
            h5_4.innerHTML='<i class="bi bi-bag"></i> '+data.Seller_name[j];
            link_Seller.appendChild(h5_4);
            div12.appendChild(link_Seller);
            div13.appendChild(div12);
            let div1=document.createElement('div');
            for(let i=0;i<data.Cart_index[j].length;i++){
                let index=data.Cart_index[j][i];
                let cart=data.Cart[index]
                console.log(cart);
                let check=document.createElement('input');
                check.type='checkbox';
                check.classList='form-check-input Checkout';
                
                check.value=cart.Product_ID;
                let hidden_amount=document.createElement('input');
                hidden_amount.type='hidden';
                hidden_amount.id=`Product_ID=${cart.Product_ID}`;
                let delete_btn=document.createElement('Button');
                delete_btn.classList="Delete btn btn-danger";
                delete_btn.innerHTML='從購物車刪除';
                delete_btn.value=cart.User_Cart;
                
                let div2=document.createElement('div');
                let div3=document.createElement('div');
                let div4=document.createElement('div');
                let div5=document.createElement('div');
                let div6=document.createElement('div');
                let div7=document.createElement('div');
                let div8=document.createElement('div');
                let div9=document.createElement('div');
                let div10=document.createElement('div');
                let div11=document.createElement('div');
              
                let img1=document.createElement('img');
                let h5_1=document.createElement('h5');//product name
                let h5_2=document.createElement('h5');//product amount
                let h5_3=document.createElement('h5');
                let a1=document.createElement('a');
             
                let link_product=document.createElement('a');
                let p1=document.createElement('p');
    
               

                link_product.style='Text-decoration:none;color:black;'

                div1.classList="card mb-3";
                div1.style="width:500px;"
                div2.classList="card-body";
                div2.appendChild(check);
                div3.classList="d-flex justify-content-between";
                div4.classList="d-flex flex-row align-items-center";
                div6.classList="ms-3";
                div11.classList="d-flex flex-row align-items-center";
                div11.appendChild(delete_btn);
                div7.classList="d-flex flex-row align-items-center";
                div8.style="width: 50px;";
                div9.style="width: 100px;";
                link_product.href=`/products?ID=${cart.Product_ID}`
                img1.src="/img/"+cart.Image;
                img1.classList="img-fluid rounded-3";
                img1.style="width:65px;";
                
                p1.classList="small mb-0";
                h5_1.innerHTML=cart.Product_Name;
                h5_2.classList="fw-normal mb-0";
                h5_2.innerHTML="<span style='font-size:15px;'>數量</span><br>"+cart.Amount;
                hidden_amount.value=cart.Amount;
                h5_3.classList="mb-0";
              
                h5_3.innerHTML="<span style='font-size:15px;'>總價</span><br>$"+cart.Price*cart.Amount;
            
                div5.appendChild(img1);
                div6.appendChild(h5_1);
                div6.appendChild(p1);
    
                link_product.append(div5,div6);
                div4.append(link_product);
                div8.appendChild(h5_2);
                div8.appendChild(hidden_amount);
                div9.appendChild(h5_3);
    
                div7.append(div8,div9,a1);
    
                div3.append(div4,div7,div11);
                div2.appendChild(div3);
                div1.appendChild(div10);
                div1.appendChild(div2);
                
            };
            div13.appendChild(div1);
            Cart_content.appendChild(div13);
        }
 
        $('.Checkout').change(function(){
            if(event.target.checked){
                Product_ID.push(event.target.value)
                Product_Amount.push(document.getElementById(`Product_ID=${event.target.value}`).value);
                console.log('ID='+Product_ID);
                console.log('Amount='+Product_Amount);

            }else{
               Product_ID.splice(Product_ID.indexOf(event.target.value),1);
               Product_Amount=new Array;
               for(let i=0;i<Product_ID.length;i++){
                Product_Amount.push(document.getElementById(`Product_ID=${Product_ID[i]}`).value)
               }
               
               console.log('ID='+Product_ID);
               console.log('Amount='+Product_Amount);

            }
        })

        $('.Delete').click(function(){
            let Cart=event.target.value;
            Buyer=getCookie('certifiedUser');
            axios.delete(`/Cart?Buyer=${Buyer}&Cart=${Cart}`)
            .then(res=>{
                console.log(res);
                history.go(0);
            })
        })



        
    })

    

})

$('#goCheckout').click(function(){

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

$('#myOrder').click(function(){

    window.location.href='/Cart/myOrder';

})




/* <div class="card mb-3"> div1
    <div class="card-body"> div2
        <div class="d-flex justify-content-between"> div3
            <div class="d-flex flex-row align-items-center"> div4
                <div> div5
                    <img img1
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img2.webp"
                    class="img-fluid rounded-3" alt="Shopping item" style="width: 65px;">
                </div>
                <div class="ms-3"> div6
                    <h5>Samsung galaxy Note 10 </h5> h5-1
                    <p class="small mb-0">256GB, Navy Blue</p> p-1
                </div>
            </div>
            <div class="d-flex flex-row align-items-center"> div7
                <div style="width: 50px;"> div8
                    <h5 class="fw-normal mb-0">2</h5> h5-2
                </div>
                <div style="width: 80px;"> div9
                    <h5 class="mb-0">$900</h5> h5-3
                </div>
                <a href="#!" style="color: #cecece;"><i class="fas fa-trash-alt"></i></a> a-1
            </div>
        </div>
    </div>
</div> */
