$(document).ajaxStart(function () {
    $('#loading').show()
}).ajaxStop(function () {
    $('#loading').hide()
})