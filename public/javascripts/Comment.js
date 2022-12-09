
$(document).ready(function(){

 
    
    let getUrlString = location.href;
    var url = new URL(getUrlString);
    var Product_ID=url.searchParams.get('productID')
    axios.get(`/products/product_json?ID=${Product_ID}`)
    .then((res)=>{
        document.getElementById('productName').innerHTML=res.data.Product_Name+"的歷史評論";
    })
document.getElementById('add_Comment').href=`/Comment/add?productID=${Product_ID}`;
    axios.get(`/Comment/json?productID=${Product_ID}`)
    .then((res)=>{
        console.log(res.data);
        console.log(res.data.total);
        var data =res.data.Comment;
        for(var i=0;i<res.data.total;i++){
            var user=document.createElement('td');
            var date=document.createElement('td');
            var Content=document.createElement('td');
            var tr=document.createElement('tr');
            var Comment=document.getElementById('History_Content');
            user.innerHTML=data[i].User_Name;
            date.innerHTML=data[i].Date;
            Content.innerHTML=data[i].Content;
            tr.appendChild(user);
            tr.appendChild(date);
            tr.appendChild(Content);
            Comment.appendChild(tr);

        }

    })


})

