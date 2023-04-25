var currentImage = 0; // thumbnail images
var currentImageSlider = 0; // slider images

function changeCurrentImage(currentImage, elementScroll) {
  elementScroll.scroll(currentImage, 0);
}

function controlThumbnails() {
  setInterval(() => {
    const thumbnailImageItems = document.querySelectorAll(
      ".thumbnail-images li"
    );
    const { width } = thumbnailImageItems[0].getBoundingClientRect();
    currentImage += width;
    if (currentImage >= width * thumbnailImageItems.length) {
      currentImage = 0;
    }
    const thumbnailImages = document.querySelector(".thumbnail-images ul");
    changeCurrentImage(currentImage, thumbnailImages);
  }, 3000);
}

function autoChangeSlider() {
  setInterval(() => {
    const sliderImageItems = document.querySelectorAll(".wrap__slider img");
    const { width } = sliderImageItems[0].getBoundingClientRect();
    currentImageSlider += width;
    if (currentImageSlider >= width * sliderImageItems.length) {
      currentImageSlider = 0;
    }
    const sliderImages = document.querySelector(".wrap__slider");
    changeCurrentImage(currentImageSlider, sliderImages);
  }, 2000);
}

function VeMayBay() {
  controlThumbnails();
  autoChangeSlider();
}

export default VeMayBay;
