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

        if (window.innerWidth <= 768) {
          const sidebar = document.querySelector(".sidebar_container");
          const expandArrow = document.getElementById("expand-arrow");
          const arrowIcon = document.querySelector(
            ".mobile_arrow_button-arrow"
          );

          sidebar.classList.add("compact");
          if (expandArrow) expandArrow.classList.remove("show");
          if (arrowIcon) arrowIcon.classList.remove("rotated");
          document.body.classList.remove("no-scroll");
        }

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
  const backArrow = document.getElementById("back-arrow");
  const expandArrow = document.getElementById("expand-arrow");
  const sidebarLogoMobile = document.querySelector(".sidebar_logo-mobile");
  const toggleButtonMobile = document.getElementById("mobile-arrow-button");

  function isMobileViewport() {
    return window.innerWidth <= 768;
  }

  function setVisibleMobileMenu() {
    const isMobile = isMobileViewport();

    if (isMobile) {
      sidebar.classList.add("compact");
      document.body.classList.remove("no-scroll");

      if (sidebarLogoMobile) {
        sidebarLogoMobile.classList.add("active");
        sidebar.style.zIndex = "1100";
      }
    } else {
      sidebar.classList.remove("compact");
      document.body.classList.remove("no-scroll");

      if (expandArrow) expandArrow.classList.remove("show");
      if (sidebarLogoMobile) sidebarLogoMobile.classList.remove("active");
    }

    return isMobile;
  }

  function handleToggleButtonMobile() {
    if (!toggleButtonMobile) return;

    toggleButtonMobile.addEventListener("click", (e) => {
      const isMobile = isMobileViewport();
      const arrowIcon = document.querySelector(".mobile_arrow_button-arrow");

      if (!isMobile) return;

      sidebar.classList.toggle("compact");

      if (sidebar.classList.contains("compact")) {
        sidebar.style.overflowY = "auto";
        document.documentElement.classList.remove("no-scroll");
        document.body.classList.remove("no-scroll");
        arrowIcon?.classList.remove("rotated");
      } else {
        document.documentElement.classList.add("no-scroll");
        document.body.classList.add("no-scroll");
        arrowIcon?.classList.add("rotated");
      }
    });
  }

  function setSidebarHeight() {
    const sidebar = document.querySelector(".sidebar_container");
    if (!sidebar) return;

    // Solo lo hacemos en mobile
    if (window.innerWidth <= 768) {
      const vh = window.innerHeight;
      sidebar.style.height = `${vh}px`;
    } else {
      // Reset height en desktop
      sidebar.style.height = "";
    }
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
    setVisibleMobileMenu();
    handleToggleButtonMobile();
    handleArrows();

    if (expandArrow) {
      expandArrow.classList.toggle(
        "show",
        sidebar.classList.contains("compact")
      );
    }
  }

  window.addEventListener("load", init);
  window.addEventListener("resize", setVisibleMobileMenu);
}

///////// DANIELE

$(".slider_component").each(function (index) {
  const $component = $(this);
  const swiper = new Swiper($component.find(".swiper")[0], {
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 800,
    centerInsufficientSlides: true,
    loop: true,
    pagination: {
      el: $component.find(".swiper-pagination")[0],
      type: "bullets",
      bulletClass: "swiper-bullet",
      bulletActiveClass: "is-active",
      bulletElement: "button",
      clickable: true,
    },
  });

  // 🔥 Button click to go to next slide
  $component.find(".swiper-slide .swiper-next").on("click", function () {
    swiper.slideNext();
  });
});

$(".team_slider_component").each(function (index) {
  const teamSwiper = new Swiper($(this).find(".swiper")[0], {
    slidesPerView: 1.2,
    spaceBetween: 32,
    speed: 800,
    loop: true,
    allowTouchMove: true, // Optional, for touch devices
    //effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    breakpoints: {
      // when it gets bigger than 478px
      478: {
        slidesPerView: 2,
        spaceBetween: 32,
      },
      // when it gets bigger than 768px
      768: {
        slidesPerView: 3,
        spaceBetween: 48,
      },
      // when it gets bigger than 991px
      991: {
        slidesPerView: 3,
        //slidesPerGroup: 2,
        spaceBetween: 64,
      },
    },
    navigation: {
      nextEl: $(this).find(".swiper-next")[0],
      prevEl: $(this).find(".swiper-prev")[0],
    },
  });
});

//hero mask animation
gsap.registerPlugin(ScrollTrigger);

// gsap.to(".hero-mask", {
//   width: "1600%",
//   height: "448vw",
//   marginLeft: "448vw",
//   //x: "1%",
//   // scale: 16,
//   ease: "power2.out",
//   scrollTrigger: {
//     trigger: ".section_hero",
//     start: "top top",
//     //end: "bottom top",
//     end: "150% top",
//     scrub: true,
//   },
// });

// gsap.registerPlugin(ScrollTrigger);

// const aspectRatio = 1477.47 / 397.19;
// const heroMask = document.querySelector(".hero-mask");

// ScrollTrigger.create({
//   trigger: ".section_hero",
//   start: "top top",
//   end: "150% top",
//   scrub: true,
//   onUpdate: (self) => {
//     const progress = self.progress;

//     const baseWidth = window.innerWidth;
//     const maxWidth = baseWidth * 16; // equivalente a 1600%

//     const currentWidth = baseWidth + (maxWidth - baseWidth) * progress;

//     const currentHeight = currentWidth / aspectRatio;

//     const maxMarginLeft = baseWidth * 4.48;
//     const currentMarginLeft = maxMarginLeft * progress;

//     heroMask.style.width = `${currentWidth}px`;
//     heroMask.style.height = `${currentHeight}px`;
//     heroMask.style.marginLeft = `${currentMarginLeft}px`;
//   },
// });

// codigo que funciona en desktop, pero no en mobile:

// function updateHeroMask(progress = ScrollTrigger.getById("heroMaskAnim")?.progress || 0) {
//   const aspectRatio = 1477.47 / 397.19;
//   const baseWidth = window.innerWidth;
//   const maxWidth = baseWidth * 16;
//   const currentWidth = baseWidth + (maxWidth - baseWidth) * progress;
//   const currentHeight = currentWidth / aspectRatio;
//   const maxMarginLeft = baseWidth * 4.48;
//   const currentMarginLeft = maxMarginLeft * progress;

//   const heroMask = document.querySelector(".hero-mask");
//   heroMask.style.width = `${currentWidth}px`;
//   heroMask.style.height = `${currentHeight}px`;
//   heroMask.style.marginLeft = `${currentMarginLeft}px`;
// }

// window.addEventListener("load", () => updateHeroMask());
// window.addEventListener("resize", () => updateHeroMask());

// ScrollTrigger.create({
//   id: "heroMaskAnim",
//   trigger: ".section_hero",
//   start: "top top",
//   end: "150% top",
//   scrub: true,
//   onUpdate: (self) => updateHeroMask(self.progress),
// });

// codigo para probar dejar el funcionamiento mobile como antes, y el nuevo para desktop:

const isMobile = window.matchMedia("(max-width: 768px)").matches;

if (isMobile) {
  // En mobile: usar el comportamiento anterior
  gsap.to(".hero-mask", {
    width: "1600%",
    height: "448vw",
    marginLeft: "448vw",
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".section_hero",
      start: "top top",
      end: "150% top",
      scrub: true,
    },
  });
} else {
  // En desktop: usar el comportamiento más preciso con proporción
  function updateHeroMask(
    progress = ScrollTrigger.getById("heroMaskAnim")?.progress || 0
  ) {
    const aspectRatio = 1477.47 / 397.19;
    const baseWidth = window.innerWidth;
    const maxWidth = baseWidth * 16;
    const currentWidth = baseWidth + (maxWidth - baseWidth) * progress;
    const currentHeight = currentWidth / aspectRatio;
    const maxMarginLeft = baseWidth * 4.48;
    const currentMarginLeft = maxMarginLeft * progress;

    const heroMask = document.querySelector(".hero-mask");
    heroMask.style.width = `${currentWidth}px`;
    heroMask.style.height = `${currentHeight}px`;
    heroMask.style.marginLeft = `${currentMarginLeft}px`;
  }

  window.addEventListener("load", () => updateHeroMask());
  window.addEventListener("resize", () => updateHeroMask());

  ScrollTrigger.create({
    id: "heroMaskAnim",
    trigger: ".section_hero",
    start: "top top",
    end: "150% top",
    scrub: true,
    onUpdate: (self) => updateHeroMask(self.progress),
  });
}

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

// Audio autoplay and button control
window.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("audio");
  const audioButtons = document.querySelectorAll(".audio-button");

  // Try to play audio on page load (may require user interaction due to browser policies)
  const playAudio = () => {
    audio.play().catch((error) => {
      console.warn("Autoplay failed:", error);
    });
  };

  playAudio();

  // Sync button states based on audio state
  const updateButtonStates = () => {
    audioButtons.forEach((btn) => {
      if (audio.paused) {
        btn.classList.add("off");
      } else {
        btn.classList.remove("off");
      }
    });
  };

  // Handle click on any audio button
  audioButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    });
  });

  // Update button states when audio state changes
  audio.addEventListener("pause", updateButtonStates);
  audio.addEventListener("play", updateButtonStates);
});
