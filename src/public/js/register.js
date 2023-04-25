const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function showToast(message, type = "success") {
  const toast = document.querySelector(".alert-message");
  type == "success"
    ? toast.classList.add("show")
    : toast.classList.add("show", "err");
  toast.querySelector("span").innerText = message;
  setTimeout(() => {
    toast.classList.remove("show", "err");
  }, 3000);
}

function handleSubmit(e) {
  e.preventDefault();
  const form = document.querySelector(".register-form");
  const userName = form.querySelector("input[name='userName']").value;
  const email = form.querySelector("input[name='email']").value;
  const password = form.querySelector("input[name='password']").value;
  const confirmPassword = form.querySelector(
    "input[name='confirmPassword']"
  ).value;
  const phoneNumber = form.querySelector("input[name='phoneNumber']").value;

  if (!userName || !email || !password || !confirmPassword || !phoneNumber) {
    showToast("Nhập thiếu thông tin!", "error");
    return false;
  } else if (!validateEmail(email)) {
    showToast("Email không hợp lệ!", "error");
    return false;
  } else if (password !== confirmPassword) {
    showToast("Mật khẩu không khớp!", "error");
    return false;
  } else if (
    password.length < 6 ||
    password.length > 20 ||
    confirmPassword.length < 6 ||
    confirmPassword.length > 20
  ) {
    showToast("Mật khẩu từ 6 đến 20 kí tự!", "error");
    return false;
  } else if (phoneNumber.length !== 10) {
    showToast("Số điện thoại không hợp lệ!", "error");
    return false;
  }
  return true;
}

function resgisterFeatures() {
  const form = document.querySelector(".register-form");
  const registerBtn = form.querySelector(".register-form-reg-btn");
  registerBtn.addEventListener("click", async (e) => {
    const checkValidate = handleSubmit(e);
    if (checkValidate) {
      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.querySelector("input[name='email']").value,
          password: form.querySelector("input[name='password']").value,
          userName: form.querySelector("input[name='userName']").value,
          phoneNumber: form.querySelector("input[name='phoneNumber']").value,
        }),
      });
      const data = await response.json();
      console.log(
        "🚀 ~ file: register.js:74 ~ registerBtn.addEventListener ~ data:",
        data
      );
      if (data.status) {
        showToast("Đăng ký thành công!");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        showToast("Email đã tồn tại!", "error");
      }
    }
  });
}

export default resgisterFeatures;
