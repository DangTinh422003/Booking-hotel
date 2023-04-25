
let divfeedback = document.querySelector('.fb_main_content')
let filterstar = document.querySelectorAll('.filterstar')
let idroom = document.querySelector('#number_room').getAttribute('value')
let divpagin = document.querySelector('.div-pagination')

filterstar.forEach(ele => {
    ele.onclick = function (e) {

        $('[title=selected]').removeAttr("title");
        //tô màu ô sao được chọn
        $(this).attr("title", "selected");

        $.ajax({
            type: "GET",
            url: "/api/listfeedback?idroom=" + idroom + "&star=" + ele.value,
            success: function (res) {
                console.log(res);
                if (res.code == 0) {
                    let htmlfeedback = res.data.feedback.map(item => {
                        return `<div class="fb-main-main">
                        <div class="fb_img_name fb_item">
                      <div class="fb_img">
                        <img style="clip-path: circle()" src="${item.ava}" alt="">
                      </div>
                      <div class="fb_name">${item.name}</div>
                    </div>
                    <!--RATE-->
                    <div class="fb_vote fb_item">
                      <div>
                        ${item.starFb == 5 ? '<i class="fa fa-star" style="color: #ff9c00;font-size: 16px;"></i><i class="fa fa-star" style="color: #ff9c00;font-size: 16px;"></i><i class="fa fa-star" style="color: #ff9c00;font-size: 16px;"></i><i class="fa fa-star" style="color: #ff9c00;font-size: 16px;"></i><i class="fa fa-star" style="color: #ff9c00;font-size: 16px;"></i>'
                                : item.starFb == 4 ? '<i class="fa fa-star" style="color: #ff9c00;font-size: 16px;"></i><i class="fa fa-star" style="color: #ff9c00;font-size: 16px;"></i><i class="fa fa-star" style="color: #ff9c00;font-size: 16px;"></i><i class="fa fa-star" style="color: #ff9c00;font-size: 16px;"></i>'
                                    : item.starFb == 3 ? '<i class="fa fa-star" style="color: #ff9c00;font-size: 16px;"></i><i class="fa fa-star" style="color: #ff9c00;font-size: 16px;"></i><i class="fa fa-star" style="color: #ff9c00;font-size: 16px;"></i>'
                                        : item.starFb == 2 ? '<i class="fa fa-star" style="color: #ff9c00;font-size: 16px;"></i><i class="fa fa-star" style="color: #ff9c00;font-size: 16px;"></i>'
                                            : item.starFb == 1 ? '<i class="fa fa-star" style="color: #ff9c00;font-size: 16px;"></i>'
                                                : ''
                            }
                      </div>
                      <div style="margin-left: 4px">
                        <p style="margin: 0px;font-size: 14px;">${item.starFb == 5 ? 'Thật tuyệt vời' : item.starFb == 4 ? 'Tốt'
                                : item.starFb == 3 ? 'Khá tốt' : item.starFb == 2 ? 'Tệ' : 'Rất tệ'}</p>
                      </div>
                    </div>
                    <div class="fb_item" style="font-size: 12px;color: rgba(0,0,0,.54);">${item.timeFb}</div>
                    <div style="font-size: 16px;text-align: justify !important">${item.contentFb}</div>
                    <div style="width:100%;display:flex;overflow:hidden;height:120px" id="list-imgfb">
                    ${item.imageFb.map((ele, index) =>
                                    `<div style="width:12%;height:84px;margin-right:6px">
                                        <img  style="width:100%;height:100%;object-fit:ccover" src="${ele}">
                                    </div>`
                                )}
                    </div>
                    </div>`
                    })
                    divfeedback.innerHTML = htmlfeedback.join('')

                    let htmlpagin = res.data.htmlpagin
                    divpagin.innerHTML = htmlpagin
                }
            },
            error: function (err) {
                console.log(err)
            }
        })
    }
})
$(document).ready(function () {
    $("#allfeedback").click();
});
