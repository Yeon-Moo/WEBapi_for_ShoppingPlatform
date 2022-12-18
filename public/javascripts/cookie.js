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

if(getCookie("sameUsername")){
    Hint_userName.innerHTML=`<span id="username_hint" style="color:RED">已有相同的帳號</span>`;
}

if(getCookie("sameEmail")){
    Hint_Email.innerHTML=`已有相同的電子信箱`;
}

if(getCookie('certifiedUser')){
  
    let user=document.getElementById('user');
    let myProduct=document.createElement('div');
    let Logout_div=document.createElement('div');
    let myProduct_text=document.createElement('a');
    let Logout_text=document.createElement('a');

    myProduct_text.innerHTML="我的商品";
    myProduct_text.href='/myproduct';
    myProduct_text.classList='user_a';
    myProduct.append(myProduct_text);
    Logout_text.innerHTML='登出';
    Logout_text.href='/users/logout';
    Logout_text.classList='user_a';
    Logout_div.appendChild(Logout_text);
    user.innerHTML='';
    user.appendChild(myProduct);
    user.appendChild(Logout_div);
}else{
    document.getElementById('Cart').style='display:none;';
}



