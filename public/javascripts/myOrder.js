
$(document).ready(function () {
  
  Buyer = getCookie("certifiedUser");
  let Order_div=document.getElementById('Order_Content');
  axios.get(`/Cart/myOrder/json?Buyer=${Buyer}`).then((res) => {
    Order = res.data;
    console.log(Order);
    for(let i=0;i<Order.length;i++){
      let div10=document.createElement('div');
      let div11=document.createElement('div');
      let tb=document.createElement('table');
      let tr0=document.createElement('tr');
      let tr1=document.createElement('tr');
      let tr2=document.createElement('tr');
      let tr3=document.createElement('tr');
      let td0=document.createElement('td');
      let td1=document.createElement('td');
      let td2=document.createElement('td');
      let td3=document.createElement('td');
      div10.style='margin-top:30px;margin-bottom:30px;background-color:white;';
      td0.style="font-size:30px;"
      td0.innerHTML='訂單編號:'+Order[i].Number;
      tr0.appendChild(td0);
      td1.innerHTML='賣家:'+Order[i].Seller;
      tr1.appendChild(td1);
      td2.innerHTML='下單時間:'+Order[i].Time;
      tr2.appendChild(td2);
      let totalPrice=0;
      
      for(let j=0;j<Order[i].Price.length;j++){
        totalPrice=totalPrice+Order[i].Price[j];
      }

      td3.innerHTML="總價:"+totalPrice;
      tr3.appendChild(td3);
      tb.append(tr0,tr1,tr2,tr3);
      div11.appendChild(tb);



      let div1=document.createElement('div');
      for(let j=0;j<Order[i].Product_Info.length;j++){
        
        let div2=document.createElement('div');
        let div3=document.createElement('div');
        let div4=document.createElement('div');
        let div5=document.createElement('div');
        let div6=document.createElement('div');
        let div7=document.createElement('div');
        let div8=document.createElement('div');
        let div9=document.createElement('div');
        let img1=document.createElement('img');
        let h5_1=document.createElement('h5');
        let h5_2=document.createElement('h5');
        let h5_3=document.createElement('h5');
        let a1=document.createElement('a1');
        let p1=document.createElement('p1');
        div1.classList='card mb-3';
        div2.classList='card rounded-3 mb-4';
        div3.classList='d-flex justify-content-between';
        div4.classList='d-flex flex-row align-items-center';
        img1.classList='img-fluid rounded-3';
        div5.style="width:70px;";
        img1.src=`/img/${Order[i].Product_Info[j][0].Product_Image_Address}`;
      
        div6.classList='ms-3';
        p1.classList='small mb-0';
        h5_1.innerHTML=Order[i].Product_Info[j][0].Product_Name;
        h5_2.innerHTML='數量:'+Order[i].Amount[j];
        div7.classList='d-flex flex-row align-items-center';
        div7.style='width:300px;'
        div8.style='width: 80px;';
        h5_3.classList='mb-0';
        h5_3.innerHTML='總價:'+Order[i].Price[j];
        div6.appendChild(h5_1);
        div6.appendChild(p1);
        div8.appendChild(h5_2);
        div9.appendChild(h5_3);
        div7.append(div8,div9);
        div5.appendChild(img1);
        div6.append(h5_1,p1);
        div4.append(div5,div6);
        div3.append(div4,div7);
        div2.appendChild(div3);
        div1.appendChild(div2);



      }
      div10.append(div11,div1);
      Order_div.append(div10);
    }
        
  });
});



/* <div class="card mb-3"> div1
<div class="card-body"> div2
  <div class="d-flex justify-content-between"> div3
    <div class="d-flex flex-row align-items-center"> div4
      <div> div5
        <img img1
          src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img1.webp"
          class="img-fluid rounded-3" alt="Shopping item" style="width: 65px;">
      </div>
      <div class="ms-3"> div6
        <h5>Iphone 11 pro</h5> h5_1
        <p class="small mb-0">256GB, Navy Blue</p> p_1
      </div>
    </div>
    <div class="d-flex flex-row align-items-center"> div7
      <div style="width: 50px;"> div8
        <h5 class="fw-normal mb-0">2</h5> h5_2
      </div>
      <div style="width: 80px;"> div9
        <h5 class="mb-0">$900</h5> h5_3
      </div>
      <a href="#!" style="color: #cecece;"><i class="fas fa-trash-alt"></i></a> a_1
    </div>
  </div>
</div>
</div> */
