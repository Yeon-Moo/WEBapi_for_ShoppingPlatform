
function preview() {
    var Upload_ImgDiv=document.getElementById('Upload_Img_Preview_div');
    var Product_Submit_Button=document.getElementById('Product_Submit_Button');
    var picture_hint=document.getElementById('picture_hint');
    Upload_ImgDiv.innerHTML="";
    var frame=document.createElement('img');
    Upload_ImgDiv.style="width:500px;height:300px";
    frame.style="width:500px;height:auto;";

    console.log(event.target.files);
    if(event.target.files[0]==undefined){
        console.log('disabled');
        Product_Submit_Button.disabled=true;
        picture_hint.innerHTML="&nbsp &nbsp 請上傳一張圖片";
    }else{

        Product_Submit_Button.disabled=false;
    frame.src=URL.createObjectURL(event.target.files[0]);
    Upload_ImgDiv.appendChild(frame);
    picture_hint.innerHTML="";
    console.log(Upload_ImgDiv.innerHTML);
   
    console.log(event.target.files)
}
    }