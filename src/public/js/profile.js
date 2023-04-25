$("#image-form").submit(function (e) {
    e.preventDefault()
    const data = new FormData($("#image-form")[0])
    const currentPath = window.location.pathname;
    $.ajax({
        type: "PUT",
        url: currentPath+"/edit-user-image",
        data: data,
        processData: false,
        contentType: false,
        success: function (res) {
            console.log(res)
            if (res.code === 0) {
                location.reload()
                // console.log("Ok");
            }
            if (res.code == 3){
                $("#danger_message").text(res.message).fadeIn().delay(3000).fadeOut()
            }
        },
        error: function (err) {
            console.log("fail")
        }
    })
})