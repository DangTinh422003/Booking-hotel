function changeStatus() {
    var status = document.getElementById("status");
    var allstatus = document.getElementById("allstatus");

    var stt = []
    for(let i = 0; i < 5; i++) {
        stt.push(document.getElementById("status" + i))
    }

    if(status.value == 5) {
        allstatus.hidden = "";
        for(let i = 0; i < 5; i++) {
            stt[i].hidden = "hidden";
        }
        return;
    }

    allstatus.hidden = "hidden";

    for(let i = 0; i < 5; i++) {
        stt[i].hidden = "hidden";

        if(status.value == i) {
            stt[i].hidden = "";
        }
    }
}