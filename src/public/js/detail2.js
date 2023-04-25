let flag = false;
const numberPeople = document.querySelector(".form__info--number");
numberPeople.addEventListener("click", function () {
    if(flag == true) {
        const numberBox = document.querySelector(".number-box");
        numberBox.classList.remove("active");
        numberBox.classList.add("inactive");
        flag = false;
    }
    else {
        const numberBox = document.querySelector(".number-box");
        numberBox.classList.remove("inactive");
        numberBox.classList.add("active");
        flag = true;
    }
})