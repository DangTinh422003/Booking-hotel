$("#add-form").submit(e => {
    e.preventDefault()
    const data = new FormData($("#add-form")[0])
    fetch($('#preview').attr('src'))
        .then(response => response.blob())
        .then(blob => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64data = reader.result;
                $.ajax({
                    type: "POST",
                    url: "/admin/nhanvien/add",
                    data: JSON.stringify({
                        name: data.get('addName'),
                        email: data.get('addEmail'),
                        password: data.get('addPassword'),
                        phone: data.get('addPhone'),
                        gender: data.get('addGender'),
                        address: data.get('addAddress'),
                        image: base64data
                    }),

                    processData: false,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (res) {
                        if (res.code === 0) {
                            swal({
                                position: 'top-end',
                                icon: 'success',
                                title: 'Thêm thành công',
                                showConfirmButton: false,
                            })
                            .then(() => {
                                window.location.href = "/admin/nhanvien"
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