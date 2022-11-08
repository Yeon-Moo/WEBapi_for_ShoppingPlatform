function getCookie(cookiename) {
    const strcookie = document.cookie;
    const cookieList=strcookie.split(";");
    for( let i=0;i<cookieList.length;i++){
        const arr=cookieList[i].split('=');
        if(cookiename===arr[0].trim()){
            console.log(arr[1]);
            return arr[1];
        }
    }
    }
console.log(getCookie("sameUsername"));
if(getCookie("sameUsername")){
    Hint_userName.innerHTML=`<span id="username_hint" style="color:RED">已有相同的帳號</span>`;
}

if(getCookie("sameEmail")){
    Hint_Email.innerHTML=`已有相同的電子信箱`;
}



