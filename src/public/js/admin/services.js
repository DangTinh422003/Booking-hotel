$("#add-form").submit(e => {
    e.preventDefault()
    const data = new FormData($("#add-form")[0])
    // var fileInput = $('#file')[0];
    // var filePath = fileInput.value;
    fetch($('#preview').attr('src'))
        .then(response => response.blob())
        .then(blob => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64data = reader.result;
                $.ajax({
                    type: "POST",
                    url: "/admin/dichvu/add",
                    data: JSON.stringify({
                        namesv: data.get('namesv'),
                        pricesv: data.get('pricesv'),
                        descriptionsv: data.get('descriptionsv'),
                        type: data.get('type'),
                        imgsv: base64data
                    }),

                    processData: false,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (res) {
                        if (res.code === 0) {
                            swal("Good Job!", "Thêm Sản phẩm thành công!", "success")
                                .then(() => {
                                    // $('#addService').modal('hide')
                                    location.reload()
                                })
                        } else {
                            alert("Lỗi")
                        }
                    },
                    error: function (err) {

                    }
                })
            };
        })
        .catch(error => console.error(error));


})