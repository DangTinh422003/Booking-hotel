function formatMoney() {
  let money = document.querySelectorAll(".money");
  money.forEach((ele) => {
    let value = ele.getAttribute("value");
    ele.innerText = Number(value).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  });
}
formatMoney();

let ls = window.location.search.split("=")[1];
let arrStar = ls ? ls.split("") : [];

$(".star_rating").each(function () {
  if (ls && ls.includes($(this).val())) {
    $(this).prop("checked", true);
  }
});

$(".star_rating").click(function () {
  if ($(this).is(":checked")) {
    arrStar.push($(this).val());
  } else {
    const index = arrStar.indexOf($(this).val());
    if (index !== -1) {
      arrStar.splice(index, 1);
    }
  }
});

$("#star-form").submit(function (event) {
  event.preventDefault();
  event.stopPropagation();
  $.ajax({
    type: "GET",
    url: "/danh-sach-phong?star=" + arrStar.join(""),
    success: function (res) {
      window.location.href = "/danh-sach-phong?star=" + arrStar.join("");
    },
    error: function (err) {},
  });
});

function toggleChat() {
  const chatBox = document.querySelector(".chat_box");
  document.querySelector(".chat__box-icon").addEventListener("click", (e) => {
    chatBox.classList.toggle("show");
  });
  document.querySelector(".chat_box-control").addEventListener("click", (e) => {
    chatBox.classList.remove("show");
  });
}
toggleChat();

// daterep : null
// datesend : "2023-04-14T08:00:00.000Z"
// hidevc : false
// iduser : "64390426f746a681c6510c53"
// question : "Phú Quốc đi thời gian nào là đẹp nhất? Tôi rất thích khách sạn Vinpearl nhưng hơi xa sân bay. Khách sạn có dịch vụ đưa đón khách tại sân bay không? 🥳"
// rep : false
// repquestion :  ""
// _id : "643981ee8ce4144a5ac39e8a"

function renderChat(chats) {
  const chatboxContainer = document.querySelector(
    ".chat_box-container-content"
  );
  chatboxContainer.innerHTML = [...chats]
    .map((chat) => {
      return `
        <div class="chat_box-container-item__user">${chat.question}</div>
        ${
          chat.repquestion
            ? `<div class="chat_box-container-item__bot">${chat.repquestion}</div>`
            : ""
        }
    `;
    })
    .join("");
}

function getMessages() {
  const iduser = JSON.parse(sessionStorage.getItem("user"))._id;
  fetch(`/api/question/${iduser}`)
    .then((response) => response.json())
    .then((chats) => {
      renderChat(chats.data);
      const chatboxContainer = document.querySelector(
        ".chat_box-container-content"
      );
      chatboxContainer.scroll(0, chatboxContainer.scrollHeight);
    })
    .catch();
}

const checkLogin = () => {
  return JSON.parse(sessionStorage.getItem("user"));
};

checkLogin() ? getMessages() : console.log("Chưa login");

function sendMessage() {
  const iduser = JSON.parse(sessionStorage.getItem("user"))._id;
  const messageInput = document.querySelector(".chat_box-container-type input");
  fetch("/api/question", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      iduser,
      question: messageInput.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      getMessages();
      messageInput.value = "";
    })
    .catch();
}

// event send message
document
  .querySelector(".chat_box-container-type button")
  .addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    sendMessage();
  });
