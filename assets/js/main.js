/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll(`section[class$="section"][id]`);

function scrollActive() {
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight,
      sectionTop = current.offsetTop - (window.screen.width >= 767 ? 58 : 173),
      sectionId = current.getAttribute("id"),
      sectionClass = document.querySelector(
        ".sidenav__menu a[href*=" + sectionId + "]"
      );

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      sectionClass.classList.add("link--button--active");
    } else {
      sectionClass.classList.remove("link--button--active");
    }
  });
}
window.addEventListener("scroll", scrollActive);
