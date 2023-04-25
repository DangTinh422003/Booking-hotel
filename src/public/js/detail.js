const adultMinus = document.querySelector(".adultMinus");
const adultPlus = document.querySelector(".adultPlus");
const sumRoom = document.querySelector(".sum__room");
const sumAdult = document.querySelector(".sum__adult");
const sumChild = document.querySelector(".sum__child");
let adult = document.querySelector(".adult span");
let i =  Number($('.adult').children('span').attr('value'));

sumRoom.innerHTML = $('.child').children('span').attr('value');
sumAdult.innerHTML = $('.adult').children('span').attr('value');
sumChild.innerHTML = $('.room').children('span').data('sl');

adultPlus.addEventListener("click", function () {
    i = i + 1;
    adult.innerHTML = i;
    sumAdult.innerHTML = i;
})

adultMinus.addEventListener("click", function () {
    if(i <= 0) {
        i = 0;
    }
    else {
        i = i - 1;
        adult.innerHTML = i;
        sumAdult.innerHTML = i;
    }
})

const childMinus = document.querySelector(".childMinus");
const childPlus = document.querySelector(".childPlus");
let child = document.querySelector(".child span");
let j = Number($('.child').children('span').attr('value'));

childPlus.addEventListener("click", function () {
    j = j + 1;
    child.innerHTML = j;
    sumChild.innerHTML = j;
})

childMinus.addEventListener("click", function () {
    if(j <= 0) {
        j = 0;
    }
    else {
        j = j - 1;
        child.innerHTML = j;
        sumChild.innerHTML = j;
    }
})

const roomMinus = document.querySelector(".roomMinus");
const roomPlus = document.querySelector(".roomPlus");
let room = document.querySelector(".room span");
let k = Number($('.room').children('span').data('sl'));

roomPlus.addEventListener("click", function () {
    k = k + 1;
    room.innerHTML = k;
    sumRoom.innerHTML = k;
})

roomMinus.addEventListener("click", function () {
    if(k <= 1) {
        k = 1;
    }
    else {
        k = k - 1;
        room.innerHTML = k;
        sumChild.innerHTML = k;
    }
})




