function preview() {
    frame.src=URL.createObjectURL(event.target.files[0]);
    frame1.src=URL.createObjectURL(event.target.files[1]);
    console.log(event.target.files)
    }