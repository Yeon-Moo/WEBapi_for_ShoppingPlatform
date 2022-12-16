
$(document).ready(function () {
  Buyer = getCookie("certifiedUser");
  let Order_div=document.getElementById('Order_Content');
  axios.get(`/Cart/myOrder/json?Buyer=${Buyer}`).then((res) => {
    data = res.data;
    console.log(data);

       for(let i=0;i<data.length;i++){
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
        div1.classList="card mb-3";
        div1.style="width:500px;"
        div2.classList="card-body";
        div3.classList="d-flex justify-content-between";
        div4.classList="d-flex flex-row align-items-center";
        div6.classList="ms-3";
        div7.classList="d-flex flex-row align-items-center";
        div8.style="width: 50px;";
        div9.style="width: 150px;";
        img1.classList="img-fluid rounded-3";
        img1.style="width:65px;";
        
        p1.classList="small mb-0";
        h5_2.classList="fw-normal mb-0";
        h5_3.classList="mb-0";

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

       }
        
  });
});
