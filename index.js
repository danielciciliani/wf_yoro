console.log("yoro project from local, dani");

document.addEventListener("DOMContentLoaded", () => {
  addActiveClass();
  moveBackArrow();
});

let isUserClick = false;

function addActiveClass() {
  let menuItems = document.querySelectorAll(".sidebar_list li");
  let sections = document.querySelectorAll("section");

  menuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      isUserClick = true;

      menuItems.forEach((el) => el.classList.remove("active"));

      item.classList.add("active");

      let sectionId = item.getAttribute("data-section");
      let targetSection = document.getElementById(sectionId);

      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop,
          behavior: "smooth",
        });

        setTimeout(() => {
          isUserClick = false;
        }, 1000);
      }
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      if (isUserClick) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          let activeSection = entry.target.getAttribute("id");
          menuItems.forEach((item) => {
            let sectionId = item.getAttribute("data-section");
            if (sectionId === activeSection) {
              menuItems.forEach((el) => el.classList.remove("active"));
              item.classList.add("active");
            }
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach((section) => observer.observe(section));
}

function moveBackArrow() {
  let backArrow = document.getElementById("back-arrow");
  let sidebar = document.getElementById("sidebar");

  backArrow.addEventListener("click", () => {
    sidebar.classList.toggle("compact");
    backArrow.classList.toggle("rotated");
  });
}

///////// DANIELE
$(".slider_component").each(function (index) {
  const swiper = new Swiper($(this).find(".swiper")[0], {
    //effect: "fade",
    //crossFade: true,
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 800,
    centerInsufficientSlides: true,
    loop: true,
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: $(this).find(".swiper-next")[0],
      //prevEl: $(this).find(".swiper-prev")[0],
      //disabledClass: "is-disabled",
    },
    pagination: {
      el: $(this).find(".swiper-pagination")[0],
      type: "bullets",
      bulletClass: "swiper-bullet",
      bulletActiveClass: "is-active",
      bulletElement: "button",
      clickable: true,
      //   renderBullet: function (index, className) {
      //     return '<span class="' + className + '">' + (index + 1) + "</span>";
      //   },
    },
  });
});

//hero mask animation
gsap.registerPlugin(ScrollTrigger);

gsap.to(".hero-mask", {
  width: "400%",
  height: "112vw",
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".section_hero",
    start: "top top",
    //end: "bottom top",
    end: "150% top",
    scrub: true,
  },
});

// logo top bar animation
gsap.fromTo(
  ".topbar_logo_link",
  { scale: 0 },
  {
    scale: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".section_main",
      start: "top bottom", // [trigger] [scroller]
      end: "120px top", // [trigger] [scroller]
      scrub: true,
    },
  }
);
