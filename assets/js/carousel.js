/*=============== CAROUSEL ===============*/
const carousels = document.querySelectorAll(".carousel");

// Setup each carousel
carousels.forEach((carousel) => {
  /*===== GENERAL =====*/
  const carList = carousel.querySelector(".carousel__list");
  let carItems = carousel.querySelectorAll(".carousel__item");
  const carPrev = carousel.querySelector("#carousel-prev");
  const carNext = carousel.querySelector("#carousel-next");
  let nrOfItems = carItems.length;

  // Additional specifications for the carousel
  const nrOfVisibleItems = carousel.getAttribute("data-visible-items");
  const isLooped = carousel.hasAttribute("data-looped");
  const isClickable = carousel.hasAttribute("data-clickable");

  // Add a keydown event handler to the carousel
  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      // Move right
      if (e.key === "ArrowRight") {
        e.preventDefault();
        changeSlide(carList, 1, nrOfItems, nrOfVisibleItems, isLooped);
        // Move left
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        changeSlide(carList, -1, nrOfItems, nrOfVisibleItems, isLooped);
      }
    }
  });

  // Add a click event handler to the previous button
  carPrev.addEventListener("click", (e) =>
    changeSlide(carList, -1, nrOfItems, nrOfVisibleItems, isLooped)
  );

  // Add a click event handler to the next button
  carNext.addEventListener("click", (e) =>
    changeSlide(carList, 1, nrOfItems, nrOfVisibleItems, isLooped)
  );

  /*===== LOOPED =====*/
  // Clone the first and last items if the carousel is looped
  if (isLooped) {
    const firstItem = carItems[0].cloneNode(true);
    const secondItem = carItems[1].cloneNode(true);
    const secondToLastItem = carItems[nrOfItems - 2].cloneNode(true);
    const lastItem = carItems[nrOfItems - 1].cloneNode(true);

    // Modify the clones
    firstItem.hidden = true;
    secondItem.hidden = true;
    secondToLastItem.hidden = true;
    lastItem.hidden = true;

    // Insert the clones in the DOM
    carList.insertBefore(secondToLastItem, carItems[0]);
    carList.insertBefore(lastItem, carItems[0]);
    carList.appendChild(firstItem);
    carList.appendChild(secondItem);

    // Update the number of items
    carItems = carousel.querySelectorAll(".carousel__item");
    nrOfItems = carItems.length;

    // Manually set the anchor scroll position, since we are messing with the DOM
    if (window.location.hash) {
      // Get the ID of the anchor from the URL
      const anchorId = window.location.hash.substring(1);

      // Find the corresponding element on the page
      const anchorElement = document.getElementById(anchorId);

      // If the element exists, scroll to it
      if (anchorElement) {
        anchorElement.scrollIntoView();
      }
    }
  }

  /*===== CLICKABLE =====*/
  // Add a click event handler to each item if the carousel is clickable
  if (isClickable) {
    carItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        // Get the index of the clicked item
        const itemIndex = Array.from(carItems).indexOf(e.target);

        // Get the index of the current item
        const carIndex = Math.round(
          carList.scrollLeft /
            ((carList.clientWidth - 32) / nrOfVisibleItems + 16)
        );

        // Calculate the direction
        const direction = itemIndex - carIndex;

        // Change the slide
        changeSlide(carList, direction, nrOfItems, nrOfVisibleItems, isLooped);
      });
    });
  }
});

function changeSlide(parent, direction, nrOfItems, nrOfVisibleItems, isLooped) {
  // Get the current focus of the carousel
  let focus = parent.scrollLeft;

  // Get the width of a carousel item
  const itemWidth = (parent.clientWidth - 32) / nrOfVisibleItems + 16;

  // Get the current index of the carousel
  const carIndex = Math.round(focus / itemWidth);

  // Check the bounds of the carousel & calculate the offset
  let offset = 0;
  let reset = false;

  // Reached left bound
  if (direction <= 0 && carIndex === 0) {
    // Calculate the offset
    offset = itemWidth * (nrOfItems - nrOfVisibleItems);
    // If the carousel is looped, set the offset to the last non-copied item
    if (isLooped) {
      offset =
        itemWidth * (nrOfItems - (nrOfVisibleItems - 1) - nrOfVisibleItems);
      reset = true;
    }
  }
  // Reached right bound
  else if (direction >= 0 && carIndex === nrOfItems - nrOfVisibleItems) {
    // Set the offset to the first item
    offset = 0;
    // If the carousel is looped, set the offset to the first non-copied item
    if (isLooped) {
      offset = itemWidth * (nrOfVisibleItems - 1);
      reset = true;
    }
  }
  // Anywhere in between
  else {
    // Calculate the offset
    offset = focus + direction * itemWidth;
  }

  // Get the new index of the carousel
  const carNewIndex = Math.round(offset / itemWidth);

  // Handle accessibility
  parent.querySelectorAll("[aria-current]").forEach((slide, index) => {
    // Toggle the current selected slides
    if (index === carNewIndex) slide.setAttribute("aria-current", true);
    else slide.setAttribute("aria-current", false);

    // Toggle the hidden state of the slides
    if (
      index === carNewIndex ||
      index === carNewIndex + 1 ||
      index === carNewIndex + 2
    )
      slide.removeAttribute("hidden");
    else slide.setAttribute("hidden", "");
  });

  // Reset the scroll position if the carousel is looped
  if (isLooped && reset) {
    if (direction < 0) {
      parent.scrollLeft = itemWidth * (nrOfItems - nrOfVisibleItems - 1);
    } else if (direction > 0) parent.scrollLeft = itemWidth;
  }

  // Scroll the carousel
  parent.scrollTo({
    left: offset,
    behavior: "smooth",
  });
}
