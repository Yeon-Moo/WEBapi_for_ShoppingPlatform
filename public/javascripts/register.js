
const Async_Btn=document.getElementById("async");
const userName=document.getElementById("username");
const Hint_userName=document.getElementById("username_hint");
const Password=document.getElementById("password");
const Hint_passWord=document.getElementById("password_hint");
const confirmPassword=document.getElementById("confirmPassword");
const Hint_ConfirmPassword=document.getElementById("confirmPassword_hint");
const Email=document.getElementById("email");
const Button=document.getElementById("Button");
const Hint_Email=document.getElementById("email_hint");

function isallow(){
    console.log(userName.value);
    if(userName.value=="" || Password.value!=confirmPassword.value || Email.value=="" || Password.value==""){
        Button.disabled=true;
        if(userName.value==""){
            Hint_userName.innerHTML=`<span id="username_hint"
         style="color:RED">請輸入欲註冊帳號</span>`;
        }else{
            Hint_userName.innerHTML="";
        }
        if(Password.value==""){
            Hint_passWord.innerHTML="請輸入密碼";
        }else{
            Hint_passWord.innerHTML="";
        }
        if(Password.value!=confirmPassword.value) { 
            Hint_ConfirmPassword.innerHTML='與密碼不匹配';
         }else{
            Hint_ConfirmPassword.innerHTML='';
         }
         if(Email.value==""){
            Hint_Email.innerHTML='請輸入電子信箱';
         }else{
            Hint_Email.innerHTML="";

         }
    }
    else{ 
        Hint_ConfirmPassword.innerHTML='';
        Hint_userName.innerHTML="";
        Hint_Email.innerHTML="";
        Button.disabled=false;
        }
    }





