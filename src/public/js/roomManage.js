// delete room
document.querySelectorAll(".deleteRoom-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    document.querySelector(".modal-deleting").classList.add("open");
    const id = e.currentTarget.dataset.id;
    fetch("/admin/khachsan", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        window.location.reload();
      });
  });
});

//Mở lại phòng nếu đã xóa
document.querySelectorAll(".UNdeleteRoom-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    document.querySelector(".modal-deleting").classList.add("open");
    const id = e.currentTarget.dataset.id;
    fetch("/admin/khachsan/undelete", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        window.location.reload();
      });
  });
});


// update room
document
  .querySelector(".updateRoom-btn")
  .addEventListener("click", async (e) => {
    const id = e.currentTarget.dataset.id;
    const modalUpdate = document.querySelector(".modal-updateroom");
    modalUpdate.classList.add("open");
    const response = await fetch("/admin/khachsan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    const room = await response.json();
    if (modalUpdate) {
      modalUpdate.querySelector("input[name='number_room']").value =
        room.number_room;
      modalUpdate.querySelector("input[name='direction']").value =
        room.direction;
      modalUpdate.querySelector("input[name='intro']").value = room.intro;
      modalUpdate.querySelector("input[name='img_room']").value = room.img_room;
      modalUpdate.querySelector("input[name='name_room']").value =
        room.name_room;
      modalUpdate.querySelector("input[name='slug']").value = room.slug;
      modalUpdate.querySelector("input[name='star']").value = +room.star;
      modalUpdate.querySelector("input[name='feedback_normal']").value =
        room.feedback_normal;
      modalUpdate.querySelector("input[name='oldprice']").value =
        +room.oldprice;
      modalUpdate.querySelector("input[name='newprice']").value =
        +room.newprice;
      modalUpdate
        .querySelector(".sendRequestUpdateRoom")
        .setAttribute("data-id", id);
    }
  });

// send request update
document
  .querySelector(".sendRequestUpdateRoom")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    document.querySelector(".modal-deleting").classList.add("open");
    const modalUpdate = document.querySelector(".modal-updateroom");
    await fetch("/admin/khachsan", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: e.currentTarget.dataset.id,
        direction: modalUpdate.querySelector("input[name='direction']").value,
        intro: modalUpdate.querySelector("input[name='intro']").value,
        img_room: modalUpdate.querySelector("input[name='img_room']").value,
        name_room: modalUpdate.querySelector("input[name='name_room']").value,
        slug: modalUpdate.querySelector("input[name='slug']").value,
        star: +modalUpdate.querySelector("input[name='star']").value,
        feedback_normal: modalUpdate.querySelector(
          "input[name='feedback_normal']"
        ).value,
        oldprice: +modalUpdate.querySelector("input[name='oldprice']").value,
        newprice: +modalUpdate.querySelector("input[name='newprice']").value,
      }),
    });
    window.location.reload();
  });
