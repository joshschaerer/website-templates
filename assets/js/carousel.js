/*=============== CAROUSEL ===============*/
const carousels = document.querySelectorAll(".carousel");

// Setup each carousel
carousels.forEach((carousel) => {
  const carItems = carousel.querySelectorAll(".carousel__item");
  const carPrev = carousel.querySelector("#carousel-prev");
  const carNext = carousel.querySelector("#carousel-next");
  const nrOfItems = carItems.length;

  // Add a keydown event handler to the carousel
  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      // Move right
      if (e.key === "ArrowRight") {
        e.preventDefault();
        changeSlide(e, 1, nrOfItems);
        // Move left
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        changeSlide(e, -1, nrOfItems);
      }
    }
  });

  // Add a click event handler to the previous button
  carPrev.addEventListener("click", (e) => changeSlide(e, -1, nrOfItems));

  // Add a click event handler to the next button
  carNext.addEventListener("click", (e) => changeSlide(e, 1, nrOfItems));
});

function changeSlide(e, direction, nrOfItems) {
  const target = e.target;
  const parent =
    e instanceof KeyboardEvent ? target : target.parentNode.nextElementSibling;

  // Get the current focus of the carousel
  let focus = parent.scrollLeft;

  // Get the width of a carousel item
  const itemWidth = (parent.clientWidth - 32) / 3 + 16;

  // Check the bounds of the carousel & calculate the offset
  let offset = 0;
  if (direction === -1 && Math.round(focus / itemWidth) === 0)
    offset = itemWidth * (nrOfItems - 3);
  else if (direction === 1 && Math.round(focus / itemWidth) === nrOfItems - 3)
    offset = 0;
  else offset = focus + direction * itemWidth;

  // Toggle the current selected slides
  parent.querySelectorAll("[aria-current]").forEach((slide, index) => {
    if (index === Math.round(offset / itemWidth))
      slide.setAttribute("aria-current", true);
    else slide.setAttribute("aria-current", false);
  });

  // Scroll the carousel
  parent.scrollTo({
    left: offset,
    behavior: "smooth",
  });
}
