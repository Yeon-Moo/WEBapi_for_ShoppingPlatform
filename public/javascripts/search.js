$(document).ready(function () {
  console.log("Hello");
  let getUrlString = location.href;
  var url = new URL(getUrlString);
  var search_name = url.searchParams.get("productName");
  var mall_name = url.searchParams.get("Mall");
  console.log(mall_name);
  var hint=document.getElementById('myproduct_userhint');
 

  if (mall_name && search_name) {
    axios.get(`/search/json?productName=${search_name}&Mall=${mall_name}`)
    .then((res) => {
      console.log(res.data);
      var UAPInfo = res.data;
      var UAP_Product_Info = UAPInfo.Product_Info;
      if (UAPInfo.Product_Info.length) {
        hint.innerHTML=`在${mall_name}的商場中，帶有名字${search_name}的商品`;
        for (var i = 0; i < UAP_Product_Info.length; i++) {
          var firstDiv = document.querySelector(`.goods`);
          var contentDiv = document.createElement("div");
          var ProductDiv = document.createElement("div");
          var ImageDiv = document.createElement("img");
          var ProductName_div = document.createElement("div");
          var ProductPrice_div = document.createElement("div");
          var Product = document.createElement("div");
          var Product_link = document.createElement("a");

          var ProductInfo_div = document.createElement("div");
          var ProductPrice = document.createElement("div");
          var delete_btn_div = document.createElement("div");

          contentDiv.style = "display:flex;flex-direction:row";
          contentDiv.className = "123";

          Product_link.href = `/products?ID=${UAP_Product_Info[i].Product_ID}`;
          Product_link.style = "text-decoration:none;color:black;";
          ImageDiv.src = `./../img${UAP_Product_Info[i].Product_Image_Address}`;
          ImageDiv.style = "width:200px;Height:200px;";
          ProductDiv.style =
            "margin:1px;width:205px;display:flex;flex-direction:column;border:1px;border-style:solid;";
          ProductName_div.innerHTML = UAP_Product_Info[i].Product_Name; //商品名稱
          firstDiv.style = `display:flex;flex-direction:row;width:1300px;height:1000px;flex-wrap:wrap;align-content:flex-start`;
          ProductPrice_div.style = "display:flex;flex-direction:row;";
          ProductPrice.style = "width:80px;justify-content:center;";
          ProductPrice.innerHTML =
            `$` + `${UAP_Product_Info[i].Product_Price} `; //商品價格

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
      } else {
        hint.innerHTML=`在${mall_name}的商場中，找不到帶有名字${search_name}的商品`;
      }
    });



  } else if (search_name) {
    axios.get(`/search/json?productName=${search_name}`)
    .then((res) => {
      console.log(res.data);
      var UAPInfo = res.data;
      var UAP_Product_Info = UAPInfo.Product_Info;
      
      if (UAPInfo.Product_Info.length) {
        hint.innerHTML=`名字中有${search_name}的商品`;
        for (var i = 0; i < UAP_Product_Info.length; i++) {
          var firstDiv = document.querySelector(`.goods`);
          var contentDiv = document.createElement("div");
          var ProductDiv = document.createElement("div");
          var ImageDiv = document.createElement("img");
          var ProductName_div = document.createElement("div");
          var ProductPrice_div = document.createElement("div");
          var Product = document.createElement("div");
          var Product_link = document.createElement("a");

          var ProductInfo_div = document.createElement("div");
          var ProductPrice = document.createElement("div");
          var delete_btn_div = document.createElement("div");

          contentDiv.style = "display:flex;flex-direction:row";
          contentDiv.className = "123";

          Product_link.href = `/products?ID=${UAP_Product_Info[i].Product_ID}`;
          Product_link.style = "text-decoration:none;color:black;";
          ImageDiv.src = `./../img${UAP_Product_Info[i].Product_Image_Address}`;
          ImageDiv.style = "width:200px;Height:200px;";
          ProductDiv.style =
            "margin:1px;width:205px;display:flex;flex-direction:column;border:1px;border-style:solid;";
          ProductName_div.innerHTML = UAP_Product_Info[i].Product_Name; //商品名稱
          firstDiv.style = `display:flex;flex-direction:row;width:1300px;height:1000px;flex-wrap:wrap;align-content:flex-start`;
          ProductPrice_div.style = "display:flex;flex-direction:row;";
          ProductPrice.style = "width:80px;justify-content:center;";
          ProductPrice.innerHTML =
            `$` + `${UAP_Product_Info[i].Product_Price} `; //商品價格

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
      } else {
        hint.innerHTML=`找不到名字中有${search_name}的商品。`;

      }
    });
  } else if (mall_name) {
  } else {
  }
});
