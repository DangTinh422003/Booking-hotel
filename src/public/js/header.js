// toggle feedback modal
function toggleFeedbackModal() {
  const feedbackModal = document.querySelector(".feedback-modal");
  // open modal
  document.querySelector(".add-feedback")?.addEventListener("click", (e) => {
    feedbackModal.classList.add("opening");
  });

  // close mmodal
  document.body.addEventListener("click", (e) => {
    if (
      e.target.matches(".feedback-modal-overlay") ||
      e.target.matches(".close-feedback-form")
    )
      feedbackModal.classList.remove("opening");
  });
}

// handle active star rating
function handleActiveStarRating() {
  const handleScroll = (numberItem, scrollTo) => {
    const emotionList = document.querySelector(".emotion-list");
    emotionList.scroll(0, numberItem * scrollTo - scrollTo);
  };

  const starRatingList = document.querySelectorAll(
    ".feedback__star-rating-icon"
  );
  starRatingList.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.currentTarget.classList.toggle("active");
      const numberStar = [...starRatingList].filter((item) =>
        item.classList.contains("active")
      ).length;
      handleScroll(
        numberStar,
        document.querySelector(".emotion-item").getBoundingClientRect().height
      );
    });
  });
}

// animation active navbar
function animationActiveNavbar() {
  const lineActive = document.querySelector(".header__lineActive");
  const navItem = document.querySelectorAll(".header__nav-item");
  navItem.forEach((item) => {
    item.addEventListener("mouseenter", (e) => {
      const { height, width, left, bottom, x } =
        e.currentTarget.getBoundingClientRect();
      lineActive.style.width = width;
      lineActive.style.top = height - 3;
      lineActive.style.left = left;
      lineActive.classList.add("active");
    });
    item.addEventListener("mouseleave", (e) => {
      lineActive.classList.remove("active");
    });
  });
}

// toggle subnav
function toggleSubnav() {
  const toggleSubnav = document.querySelector(".header__nav-item.more");
  toggleSubnav.addEventListener("click", (e) => {
    const subnav = e.currentTarget.querySelector(".header__subnav");
    subnav.classList.toggle("opening");
  });
  document.querySelector("body").addEventListener("click", (e) => {
    if (
      !e.target.matches(".header__subnav") &&
      !e.target.matches(".header__nav-item.more i")
    ) {
      const subnav = document.querySelector(".header__subnav");
      subnav.classList.remove("opening");
    }
  });
}

// toggle login menu
function toggleLoginMenu() {
  const loginForm = document.querySelector(".login-form");
  const customer__account = document.querySelector(".customer__account");
  customer__account.addEventListener("click", (e) => {
    loginForm.classList.toggle("opening");
  });
  document.querySelector(".close-btn").addEventListener("click", (e) => {
    loginForm.classList.remove("opening");
  });
}

// toggle login form
function toggleLoginForm() {
  const loginModal = document.querySelector(".loginModal");
  const body = document.querySelector("body");
  body.addEventListener("click", (e) => {
    if (
      e.target.matches(".login-form .login-btn") ||
      e.target.matches(".login-form .login-btn a")
    ) {
      loginModal.classList.remove("hide");
      loginModal.classList.add("show");
    }
  });
  const closeModalBtn = document.querySelector(".closeModal-btn");
  closeModalBtn.addEventListener("click", (e) => {
    loginModal.classList.remove("show");
    loginModal.classList.add("hide");
  });
}

// validate form
function checkEmail(emailValue, message__err) {
  if (emailValue === "") {
    message__err.innerText = "Vui lòng nhập email !";
    return false;
  } else {
    const validateEmail = (email) => {
      var re = /\S+@\S+\.\S+/;
      return re.test(email);
    };
    if (!validateEmail(emailValue)) {
      message__err.innerText = "Email không hợp lệ !";
      return false;
    }
  }
  return true;
}

function checkPassword(passwordValue, message__err) {
  if (passwordValue === "") {
    message__err.innerText = "Vui lòng nhập mật khẩu !";
    return false;
  } else {
    if (passwordValue.length < 6) {
      message__err.innerText = "Mật khẩu phải có ít nhất 6 ký tự !";
      return false;
    }
  }
  return true;
}

function validateLoginModal__form() {
  const loginModal__form = document.querySelector(".loginModal__form");
  const email = loginModal__form.querySelector("#email");
  const password = loginModal__form.querySelector("#password");
  const emailErr = loginModal__form.querySelector(".email-err");
  const passwordErr = loginModal__form.querySelector(".password-err");
  const btnLogin = loginModal__form.querySelector(".login-btn");
  btnLogin.addEventListener("click", (e) => {
    e.preventDefault();
    if (checkEmail(email.value, emailErr)) {
      emailErr.innerText = "";
    }
    if (checkPassword(password.value, passwordErr)) {
      passwordErr.innerText = "";
    }
  });
  // check when blur
  email.addEventListener("blur", (e) => {
    checkEmail(email.value, emailErr);
  });
  password.addEventListener("blur", (e) => {
    checkPassword(password.value, passwordErr);
  });
  // clear message err when focus
  email.addEventListener("focus", (e) => {
    emailErr.innerText = "";
  });
  password.addEventListener("focus", (e) => {
    passwordErr.innerText = "";
  });
}

function loginFeatures() {
  const loginModal__form = document.querySelector(".loginModal__form");
  const email = loginModal__form.querySelector("#email");
  const password = loginModal__form.querySelector("#password");
  const emailErr = loginModal__form.querySelector(".email-err");
  const passwordErr = loginModal__form.querySelector(".password-err");
  const btnLogin = loginModal__form.querySelector(".login-btn");
  btnLogin.addEventListener("click", async (e) => {
    if (!emailErr.innerText && !passwordErr.innerText) {
      try {
        const response = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          }),
        });
        const data = await response.json();
        if (data.status) {
          sessionStorage.setItem("user", JSON.stringify({ ...data.user._doc }));
          window.location.href = "/";
        } else {
          // alert("Sai tài khoản hoặc mật khẩu");
          const toastErr = document.querySelector(".alert-message-login");
          toastErr.querySelector("span").innerText =
            "Sai tài khoản hoặc mật khẩu";
          toastErr.classList.add("show", "err");
          await new Promise((resolve) =>
            setTimeout(() => {
              toastErr.classList.remove("show", "err");
              resolve();
            }, 2000)
          );
        }
      } catch (error) {
        alert(error);
      }
    }
  });
}

function checkLogin() {
  const currentUser = JSON.parse(sessionStorage.getItem("user"));
  if (currentUser) {
    const { userName } = currentUser;
    const customer__account = document.querySelector(
      ".customer__account-check"
    );
    customer__account.innerText = userName;
    return currentUser;
  } else {
    return false;
  }
}

function toggleNotification() {
  document.querySelector("body").addEventListener("click", (e) => {
    if (
      e.target.matches(".fa-bell") ||
      e.target.matches(".notification-icon span")
    ) {
      const notification = document.querySelector(".notification-list");
      notification.classList.toggle("show");
    }
  });
  document.querySelector(".close-nof-btn").addEventListener("click", (e) => {
    const notification = document.querySelector(".notification-list");
    notification.classList.remove("show");
  });
}

function sendFeedback() {
  const feedbackMsgRef = document.querySelector(".feedback-message");

  document
    .querySelector(".send-feedback-btm")
    ?.addEventListener("click", async (e) => {
      e.preventDefault();
      const starRatingList = document.querySelectorAll(
        ".feedback__star-rating-icon"
      );
      const { _id, email } = JSON.parse(sessionStorage.getItem("user"));
      const feedback = {
        from: _id,
        star: [...starRatingList].filter((item) =>
          item.classList.contains("active")
        ).length,
        emailUser: email,
        contentFb: feedbackMsgRef.value,
      };

      try {
        const response = await fetch("http://localhost:3000/api/feedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...feedback }),
        });
        const data = await response.json();
        console.log(
          "🚀 ~ file: header.js:278 ~ .addEventListener ~ data:",
          data
        );
        if (data.status) {
          const toastErr = document.querySelector(".alert-message-login");
          toastErr.querySelector("span").innerText =
            "Thêm feedback thành công!";
          toastErr.classList.add("show");
          await new Promise((resolve) =>
            setTimeout(() => {
              toastErr.classList.remove("show");
              resolve();
            }, 2000)
          );
          window.location.reload();
        }
      } catch (error) {
        // alert error
        const toastErr = document.querySelector(".alert-message-login");
        toastErr.querySelector("span").innerText =
          "Lỗi trong quá trình gửi feedback!";
        toastErr.classList.add("show", "err");
        await new Promise((resolve) =>
          setTimeout(() => {
            toastErr.classList.remove("show", "err");
            resolve();
          }, 2000)
        );
      }
    });
}

// MAIN FUNCTION
const header = () => {
  toggleSubnav();
  animationActiveNavbar();
  const currentUser = checkLogin();
  if (!currentUser) {
    toggleLoginMenu();
    toggleLoginForm();
    validateLoginModal__form();
    loginFeatures();
  } else {
    const customer__account = document.querySelector(".customer__account");
    customer__account.innerHTML = `
        <div class="icon notification-icon" >
          <span data-notification="true"></span>
          <i class="fas fa-bell"></i>
        </div>
        <a href="/profile" class="customer__account-check">
          ${currentUser.userName}
        </a>
        <button class="logout-btn">Đăng Xuất</button>
    `;
    document.body.addEventListener("click", async (e) => {
      if (e.target.matches(".logout-btn")) {
        await fetch("http://localhost:3000/api/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        sessionStorage.clear();
        location.reload();
      }
    });
    toggleNotification();
    toggleFeedbackModal();
    handleActiveStarRating();
    sendFeedback();
  }
};

export default header;
