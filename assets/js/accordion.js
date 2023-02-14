/*=============== ACCORDION ===============*/
const accordions = document.querySelectorAll("[data-accordion-header]");

// Add a click event handler to each accordion
accordions.forEach((accordion) => {
  accordion.addEventListener("click", changeAccordions);
});

function changeAccordions(e) {
  const target = e.target;
  const parent = target.parentNode;

  // Toggle the expanded state of the accordion
  const expanded = target.getAttribute("aria-expanded") === "true" || false;
  target.setAttribute("aria-expanded", !expanded);

  // Toggle the hidden state of the accordion panel
  parent.nextElementSibling.toggleAttribute("hidden");
}
