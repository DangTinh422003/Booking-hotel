function activeMenu() {
  const items = document.querySelectorAll(".menu__list-item");
  items.forEach((item) => {
    item.addEventListener("click", (e) => {
      items.forEach((item) => {
        item.classList.remove("active");
      });
      e.target.classList.add("active");
    });
  });
}

function menu() {
  activeMenu();
}

export default menu;
