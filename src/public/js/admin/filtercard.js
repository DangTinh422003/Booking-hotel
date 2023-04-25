function changeStatus() {
    let card = document.getElementById("card").value;
    let usercard = document.querySelector('.user_card');
    $.ajax({
        type: "GET",
        url: "/api/filtercard?card=" + card,
        success: function (res) {
            if (res.code == 0) {
                console.log(res.data.cardFilter)
                let html = res.data.cardFilter.map(item => {
                    return `
                    <tr>
                        <td>
                            <img class="avatar" src="${item.image}" alt="">
                        </td>
                        <td>
                            <a href="/admin/user/detail/${item.email}" style="text-decoration: none;"><h5 class="name">${item.userName}</h5></a>
                        </td>
                        <td>
                            <p class="email">${item.email}</p>
                        </td>
                        <td>
                            <p class="phone">${item.phoneNumber}</p>
                        </td>
                        <td>
                            <p class="gender">${item.gender}</p>
                        </td>
                        <td>
                        ${item.card.cardType == 0 ? '<p class="class">Khách hàng thường' 
                        : item.card.cardType == 1 ? '<p class="class">Khách hàng thân thiết'
                        : item.card.cardType == 2 ? '<p class="class">Khách hàng VIP'
                        : item.card.cardType == -1 ? '<p class="class">Chưa đăng ký thẻ' : ''
                        }
                        </td>
                        <td>
                        ${String(item.active) == 'true' ? '<p class= "active">Active</p>' 
                        : String(item.active) === 'false' ? '<p class= "active">Deleted</p>' : ''}
                        </td>
                        <td class="edit">
                            <button type="button" id="edit${item.user_id}" onclick= editUser(\"${item.user_id}"\) data-target="#confirm-edit-${item.user_id}" class="btn btn-warning" data-toggle="modal"><i class="bx bx-edit"></i></button> &nbsp
                            <button type="button" data-target="#confirm-delete-${item.user_id}" class="btn btn-danger" data-toggle="modal"><i class="bx bx-trash"></i></button>
                        </td>
                    </tr>
                    <div class="modal fade" id="confirm-edit-${item.user_id}" role="dialog">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <!-- Modal Header -->
                                <div class="modal-header">
                                    <h4 class="modal-title"><b>Cập nhật thông tin khách hàng</b></h4>
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                </div>
                                <!-- Modal body -->
                                <div class="modal-body">
                                    <form action="/admin/user/edit" method="post">
                                        <div class="form-group" style="display: flex; justify-content: center; align-items: center;">
                                            <img class="updateImg" src="${item.image}" alt="avatar">
                                        </div>
                                        <div class="form-group">
                                            <label for="">Họ tên</label>
                                            <input class="form-control" type="text" placeholder="Nhập tên" id="updateName${item.user_id}" name="updateName" value="${item.userName}">
                                        </div>
                                        <div class="form-group">
                                            <label for="">Email</label>
                                            <input class="form-control" type="text" id="updateEmail${item.user_id}" name="updateEmail" value="${item.email}" readonly>
                                        </div>
                                        <div class="form-group">
                                            <label for="">Số điện thoại</label>
                                            <input class="form-control" type="text" placeholder="Nhập số điện thoại" id="updatePhone${item.user_id}" name="updatePhone" value="${item.phoneNumber}">
                                        </div>
                                        <div class="form-group">
                                            <label for="">Giới tính</label> <br>
                                            <div class="custom-control custom-radio custom-control-inline">
                                                <input type="radio" class="custom-control-input" id="update-gender-male${item.user_id}" name="updateGender" value="Male">
                                                <label class="custom-control-label" for="update-gender-male${item.user_id}">Nam</label>
                                            </div>
                                            <div class="custom-control custom-radio custom-control-inline">
                                                <input type="radio" class="custom-control-input" id="update-gender-female${item.user_id}" name="updateGender" value="Female">
                                                <label class="custom-control-label" for="update-gender-female${item.user_id}">Nữ</label>
                                            </div>
                                            <div class="custom-control custom-radio custom-control-inline">
                                                <input type="radio" class="custom-control-input" id="update-gender-another${item.user_id}"name="updateGender" value="Another">
                                                <label class="custom-control-label" for="update-gender-another${item.user_id}">Khác</label>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label for="card-type" class="font-weight-bold">Hạng thẻ</label>
                                            <select name="card-type" class="form-control" id="card-type${item.user_id}">
                                                <option value="0">Khách hàng thường</option>
                                                <option value="1">Khách hàng thân thiết</option>
                                                <option value="2">Khách hàng VIP</option>
                                            </select>
                                        </div>
                                        <!-- Modal footer -->
                                        <div class="modal-footer">     
                                            <button type="submit" class="btn btn-success" onclick = btnClickEdit(\"${item.user_id}"\)>Cập nhật</button>
                                            <button type="button" class="btn btn-dark" data-dismiss="modal">Đóng</button>       
                                        </div>
                                    </form> 
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal fade myModal${item.email}" id="confirm-delete-${item.user_id}" role="dialog">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h4 class="modal-title"><b>Xóa người dùng</b></h4>
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div class="modal-body">
                                    <p>Bạn có chắc muốn xóa khách hàng <strong>${item.userName} ?</strong></p>
                                </div>
                                <div class="modal-footer">
                                    <form id="idForm" action="/admin/user/delete" method="post">
                                        <input type="hidden" name="email" value="${item.email}">
                                        <button id="btn-delete-confirmed" type="submit" class="btn btn-danger" onclick = btnClickDelete(\"${item.email}"\)>Xóa</button>
                                        <button type="button" class="btn btn-dark" data-dismiss="modal">Đóng</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>`
                })
                usercard.innerHTML = html;

            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}

function editUser(id) {
    var currentRow = $(document.getElementById('edit' + id)).closest('tr');
    var gender = $.trim(currentRow.find('td:eq(4)').text());
    if(gender == 'Male')    {
        $("#update-gender-male" + id).prop("checked", true);
    }
    else if(gender == "Female"){
        $("#update-gender-female" + id).prop("checked", true);
    }
    else {
        $("#update-gender-another" + id).prop("checked", true);
    }
}
function btnClickEdit(id){
    let card = document.getElementById("card-type" + id).value;
    let name = $('#updateName'+id).val();
    let email = $('#updateEmail'+id).val();
    let phone = $('#updatePhone'+id).val();
    let gender = $("input[name='updateGender']:checked").val();

    $.ajax({
        url: '/admin/user/edit',
        data: {email: email, name: name, gender: gender, phone: phone, cardClass: card},
        type: "POST",
        dataType: 'json',
        success: function (res) {
            if (res.code == 0) {
                swal({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Cập nhật thành công',
                    showConfirmButton: false,
                })
                .then(() => {
                    window.location.href = "/admin/user"
                })
            }
        
        },
        error: function (err) {
            alert('error')
        },
    })
}
function btnClickDelete(email) {
    // AJAX
    $.ajax({
        url: '/admin/user/delete',
        data: {email: email},
        type: "POST",
        dataType: 'json',
        success: function (res) {
            if (res.code == 0) {
                swal({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Xóa thành công',
                    showConfirmButton: false,
                })
                .then(() => {
                    window.location.href = "/admin/user"
                })
            }
        
        },
        error: function (err) {
            alert('error')
        },
    })
}

$(document).ready(function () {
    $("#abc").click();
});
