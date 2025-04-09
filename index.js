console.log("yoro project from index");

document.addEventListener("DOMContentLoaded", () => {
  manageSidebar();
  addActiveClass();
  magnetButton();
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

function magnetButton() {
  const magnetElements = document.querySelectorAll(".magnet");

  const config = {
    area: 200, // Radio del área magnética
    moveStrength: 0.5, // Intensidad del movimiento
    tiltIntensity: 20, // Intensidad de inclinación 3D
    hoverScale: 1.05, // Escala al interactuar
    normalScale: 1, // Escala normal
    hoverOpacity: 1.1, // Opacidad al interactuar
    normalOpacity: 1, // Opacidad normal
    // hoverShadow: '0 0 10px 5px rgba(0, 0, 0, 0.15)', // Sombra al interactuar
    // normalShadow: '0 0 10px 2px rgba(0, 0, 0, 0.1)',   // Sombra normal
    inDuration: 0.3, // Duración entrada
    outDuration: 0.5, // Duración salida
    perspective: 500, // Perspectiva 3D
  };

  magnetElements.forEach((element) => {
    gsap.set(element, {
      transformOrigin: "center center",
      x: 0,
      y: 0,
      rotationX: 0,
      rotationY: 0,
      scale: config.normalScale,
      opacity: config.normalOpacity,
      boxShadow: config.normalShadow,
    });

    // Guardar datos de posición
    element._magnetData = {
      update: () => {
        const rect = element.getBoundingClientRect();
        return {
          rect,
          center: {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          },
        };
      },
    };
  });

  // Función de throttling para mejor rendimiento
  const throttle = (fn, delay) => {
    let lastTime = 0;
    return (...args) => {
      const now = new Date().getTime();
      if (now - lastTime < delay) return;
      lastTime = now;
      fn(...args);
    };
  };

  // Handle efecto magnético
  const handleMagnetMove = throttle((e) => {
    magnetElements.forEach((element) => {
      const { rect, center } = element._magnetData.update();
      const x = e.clientX - center.x;
      const y = e.clientY - center.y;
      const distance = Math.sqrt(x * x + y * y);

      if (distance < config.area) {
        const strength = 1 - distance / config.area;

        gsap.to(element, {
          x: x * config.moveStrength * strength,
          y: y * config.moveStrength * strength,
          rotationX: (y / rect.height) * config.tiltIntensity * strength,
          rotationY: -(x / rect.width) * config.tiltIntensity * strength,
          scale: config.hoverScale,
          opacity: config.hoverOpacity,
          boxShadow: config.hoverShadow,
          transformPerspective: config.perspective,
          duration: config.inDuration,
          ease: "power2.out",
        });
      } else if (!gsap.isTweening(element)) {
        gsap.to(element, {
          x: 0,
          y: 0,
          rotationX: 0,
          rotationY: 0,
          scale: config.normalScale,
          opacity: config.normalOpacity,
          boxShadow: config.normalShadow,
          duration: config.outDuration,
          ease: "elastic.out(1, 0.3)",
        });
      }
    });
  }, 16);

  document.addEventListener("mousemove", handleMagnetMove);

  window.addEventListener("resize", () => {
    magnetElements.forEach((el) => el._magnetData.update());
  });
}

function manageSidebar() {
  const sidebar = document.querySelector(".sidebar_container");
  const topbarLogoLink = document.querySelector(".topbar_logo_link");
  const backArrow = document.getElementById("back-arrow");
  const expandArrow = document.getElementById("expand-arrow");
  const sidebarLogoMobile = document.querySelector(".sidebar_logo-mobile");

  function checkViewport() {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      sidebar.classList.add("compact");
      if (sidebarLogoMobile) {
        sidebarLogoMobile.classList.add("active");
        sidebar.style.zIndex = "1100";
      }
    } else {
      sidebar.classList.remove("compact");
      if (expandArrow) expandArrow.classList.remove("show");
      if (sidebarLogoMobile) sidebarLogoMobile.classList.remove("active");
    }
  }

  function handleLogoClick() {
    if (!topbarLogoLink) return;

    topbarLogoLink.addEventListener("click", (e) => {
      e.preventDefault();
      sidebar.classList.toggle("compact");
      if (expandArrow) {
        expandArrow.classList.toggle(
          "show",
          !sidebar.classList.contains("compact")
        );
      }
    });
  }

  function handleSidebarLogoClick() {
    if (!sidebarLogoMobile) return;

    sidebarLogoMobile.addEventListener("click", (e) => {
      if (
        window.innerWidth <= 768 &&
        sidebarLogoMobile.classList.contains("active")
      ) {
        e.preventDefault();
        sidebar.classList.add("compact");
        if (expandArrow) expandArrow.classList.add("show");
      }
    });
  }

  function handleArrows() {
    if (!backArrow || !expandArrow) return;

    backArrow.addEventListener("click", () => {
      sidebar.classList.add("compact");
      setTimeout(() => {
        expandArrow.classList.add("show");
      }, 300);
    });

    expandArrow.addEventListener("click", () => {
      expandArrow.classList.remove("show");
      sidebar.classList.remove("compact");
    });
  }

  function init() {
    checkViewport();
    handleLogoClick();
    handleSidebarLogoClick();
    handleArrows();

    if (expandArrow) {
      expandArrow.classList.toggle(
        "show",
        sidebar.classList.contains("compact")
      );
    }
  }

  window.addEventListener("load", init);
  window.addEventListener("resize", checkViewport);
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
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: $(this).find(".swiper-next")[0],
      prevEl: $(this).find(".swiper-prev")[0],
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
  //width: "800%",
  //height: "224vw",
  scale: 8,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".section_hero",
    start: "top top",
    //end: "bottom top",
    end: "150% top",
    scrub: true,
  },
});

// // logo top bar animation
// gsap.fromTo(
//   ".topbar_logo_link",
//   { scale: 0 },
//   {
//     scale: 1,
//     ease: "power2.out",
//     scrollTrigger: {
//       trigger: ".section_main",
//       start: "top bottom", // [trigger] [scroller]
//       end: "120px top", // [trigger] [scroller]
//       scrub: true,
//     },
//   }
// );

// Split text into spans
///////// SCROLLTRIGGER ANIMATION
gsap.registerPlugin(ScrollTrigger);

// Link timelines to scroll position
function createScrollTrigger(triggerElement, timeline) {
  // Reset tl when scroll out of view past bottom of screen
  ScrollTrigger.create({
    trigger: triggerElement,
    start: "top bottom",
    onLeaveBack: () => {
      timeline.progress(0);
      timeline.pause();
    },
  });
  // Play tl when scrolled into view (60% from top of screen)
  ScrollTrigger.create({
    trigger: triggerElement,
    start: "top 70%",
    onEnter: () => timeline.play(),
  });
}

$("[animate]").each(function (index) {
  let tl = gsap.timeline({ paused: true });
  tl.to($(this).children(), {
    opacity: 1,
    y: 0,
    duration: 1.4,
    ease: "power2.out",
    stagger: { amount: 0.3 },
  });
  createScrollTrigger($(this), tl);
});
