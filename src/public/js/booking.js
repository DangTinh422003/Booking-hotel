window.onload = function () {
    let url = window.location.search;
    $('.pagination a').each(function () {
        let href = $(this).attr('href');
        if (href === url && !$(this).hasClass('first') && !$(this).hasClass('next') && !$(this).hasClass('last') && !$(this).hasClass('prev')) {
            $(this).addClass('active');
            $(this).css('color', '#ee4d2d');
        } else {
            $(this).removeClass('active');
            $(this).css('color', '');
        }
    });

    const divIn = $('.mbsc-segmented-item');
    const divCalen = $('.mbsc-datepicker-tab-wrapper');
    divIn.click(function () {
        if (divCalen.css('display') === 'flex') {
            divCalen.css('display', 'none');
        } else {
            divCalen.css('display', 'flex');
        }
    });

    function formatMoney(value) {
        return Number(value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    let data = {
        sl: $('.roomData').data('sl'),
        dg: $('.roomData').data('dg'),
        total: 0
    };

    function totalPrice() {
        data.total = data.sl * data.dg;

        $('.roomPlus').click(function () {
            data.sl += 1;
            data.total = data.sl * data.dg;
            $('.sum__price').text(formatMoney(data.total));
            $('.sum__price').attr('value', data.total);
        });

        $('.roomMinus').click(function () {
            if (data.sl > 1) {
                data.sl -= 1;
                data.total = data.sl * data.dg;
                $('.sum__price').text(formatMoney(data.total));
                $('.sum__price').attr('value', data.total);
            }
        });
        return data;
    }
    totalPrice()

    function countDate(start, end) {
        const date1 = new Date(start);
        const date2 = new Date(end);
        const diffInMs = date2 - date1;
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

        return diffInDays
    }

    function formatText(str) {

        let date = new Date(str);

        let day = date.getDate().toString().padStart(2, '0'); // lấy ngày và định dạng thành chuỗi 2 chữ số với padStart
        let month = (date.getMonth() + 1).toString().padStart(2, '0'); // lấy tháng (lưu ý tháng bắt đầu từ 0) và định dạng thành chuỗi 2 chữ số với padStart
        let year = date.getFullYear().toString(); // lấy năm

        let hours = date.getHours().toString().padStart(2, '0'); // lấy giờ và định dạng thành chuỗi 2 chữ số với padStart
        let minutes = date.getMinutes().toString().padStart(2, '0'); // lấy phút và định dạng thành chuỗi 2 chữ số với padStart
        let ampm = date.getHours() >= 12 ? 'PM' : 'AM'; // lấy AM/PM

        let result = `${day}-${month}-${year}_${hours}:${minutes}${ampm}`;
        return result

    }

    $('.btnBook2').click(function () {

        let data = {
            room: $('.btnBook2').data('room'),
            amount_room: totalPrice().sl,
            adult_num: document.querySelector(".sum__adult").innerText,
            child_num: document.querySelector(".sum__child").innerText,
            check_in: formatText($('.mbsc-range-control-value').eq(0).text()),
            check_out: formatText($('.mbsc-range-control-value').eq(1).text()),
            rate_token: null
        }

        console.log(data);

        if (data.check_in != "NaN-NaN-NaN_NaN:NaNAM" && data.check_out != "NaN-NaN-NaN_NaN:NaNAM") {
            $.ajax({
                type: "GET",
                url: "/user/sendtoken",
                success: function (res) {
                    if (res.code == 0) {
                        let token = res.token
                        window.location.href = `/user/booking?room=${data.room}&amount_room=${data.amount_room}&adult_num=${data.adult_num}&child_num=${data.child_num}&check_in=${data.check_in}&check_out=${data.check_out}&rate_token=${token}`
                    }
                    if (res.code == 1) {
                        swal("Thất bại", "Vui lòng đăng nhập", "error")
                            .then(() => {
                                window.location.href = "/"
                            })
                    }

                },
                error: function (err) {
                    console.log(err)
                }
            })
        }
        else {
            swal("Lỗi", "Vui lòng chọn ngày Checkin - Checkout", "error")
        }
    })
}

//XỬ LÝ VOUCHER
function setPrice(price) {
    let result = "";
    var price1 = Number(price.substring(0, price.indexOf(' ')))
    result = new Intl.NumberFormat({ style: 'currency', currency: 'JPY' }).format(price1) + " VND"
    return result;
}
let totalValue = document.querySelector('.total')
totalValue.setAttribute("valueori", totalValue.getAttribute("value"))
let inputVoucher = document.querySelector('.txtvoucher')
inputVoucher.onchange = function () {
    totalValue.setAttribute('value', totalValue.getAttribute('valueori'))
}
let resultVoucher = null
document.querySelector('.btnvoucher').onclick = function () {
    $.ajax({
        type: "GET",
        url: "/api/vouchers/" + inputVoucher.value,
        success: function (res) {
            const now = new Date();
            const fromDate = new Date(res.voucher.from);
            const toDate = new Date(res.voucher.to);

            if (res.code == 0 && now >= fromDate && now <= toDate && res.voucher.quantity>0) {
                resultVoucher = {
                    "idvoucher": res.voucher.idvoucher,
                    "valuevc": res.voucher.valuevc
                }
                document.querySelector('.voucher-error').style.display = "none"
                let dis, saleoff
                document.getElementById('voucherform').style.display = "block"
                if (res.voucher.valuevc.includes('%')) {
                    dis = res.voucher.valuevc.replace('%', '') / 100;
                    saleoff = totalValue.getAttribute('value') * (1 - dis)
                    console.log(saleoff);
                    $('.sale-value').text("-" + setPrice(totalValue.getAttribute('value') * dis + " VND"));
                }
                totalValue.setAttribute('value', saleoff)
                totalValue.innerText = setPrice(totalValue.getAttribute('value') + " VND")
            }
            else {
                document.querySelector('.voucher-error').style.display = "block"
                document.getElementById('voucherform').style.display = "none"
                totalValue.setAttribute('value', totalValue.getAttribute('valueori'));
                totalValue.innerText = setPrice(totalValue.getAttribute('valueori') + " VND")
            }
        },
        error: function (e) {
            document.querySelector('.voucher-error').style.display = "block"
            document.getElementById('voucherform').style.display = "none"
            totalValue.setAttribute('value', totalValue.getAttribute('valueori'));
            totalValue.innerText = setPrice(totalValue.getAttribute('valueori') + " VND")
        }
    });
}


$('#bookingok').click(function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    let data = {
        idroom: urlParams.get('room'),
        idvoucher: resultVoucher ?? null,
        totalPrice: document.querySelector('.total').innerText.substring(0, document.querySelector('.total').innerText.indexOf(' ')).replaceAll('.', ''),
        name: $('#ndd').val(),
        phone: $('#sdd').val(),
        email: $('#mdd').val(),
        amountRoom: $('.sophong').val(),
        from: urlParams.get('check_in'),
        to: urlParams.get('check_out'),
        adult: urlParams.get('adult_num'),
        child: urlParams.get('child_num'),
    }
    $.ajax({
        type: "POST",
        url: "/user/booking",
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        success: function (res) {
            if (res.code == 0) {
                swal({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Đặt phòng thành công',
                    showConfirmButton: false,
                })
                    .then(() => {
                        window.location.href = "/profile/history"
                    })
            }
        },
        error: function (e) {
            console.log("Lỗi")
        }
    });
})
