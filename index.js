console.log("yoro project from local, dani");

document.addEventListener("DOMContentLoaded", () => {
  addActiveClass();
  hideAndShowSidebar();
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

function hideAndShowSidebar() {
  let backArrow = document.getElementById("back-arrow");
  let sidebar = document.getElementById("sidebar_container");
  let expandArrow = document.getElementById('expand-arrow');

  if (!sidebar.classList.contains('compact')) {
    expandArrow.classList.remove('show');
  }

  backArrow.addEventListener("click", () => {
    sidebar.classList.toggle("compact");

    setTimeout(() => {
      expandArrow.classList.add('show');
    }, 300);
  });

  expandArrow.addEventListener("click", () => {
    expandArrow.classList.remove("show");
    sidebar.classList.remove("compact");
  });
}

$(".slider_component.is-founding").each(function (index) {
    const swiper = new Swiper($(this).find(".swiper")[0], {
      slidesPerView: 1,
      spaceBetween: 0,
      speed: 800,
      centerInsufficientSlides: true,
      loop: true,
      loopAdditionalSlides: 5,
      autoplay: {
        delay: 6000,
        disableOnInteraction: false,
      },
      lazy: {
        loadPrevNext: true,
        loadPrevNextAmount: 2
      },
      navigation: {
        nextEl: $(this).find(".swiper-next")[0],
        prevEl: $(this).find(".swiper-prev")[0],
      },
      pagination: {
        el: $(this).find(".swiper-pagination")[0],
        type: "bullets",
        bulletClass: "swiper-bullet",
        bulletActiveClass: "is-active",
        bulletElement: "button",
        clickable: true,
      },
    });
  });

function magnetButton() {
  const magnetElements = document.querySelectorAll('.magnet');
  const magnetArea = 250; // Radio del área magnética en píxeles
  
  // Configuración inicial para todos los elementos
  magnetElements.forEach(element => {
    gsap.set(element, { 
      transformOrigin: "center center",
      x: 0,
      y: 0,
      rotationX: 0,
      rotationY: 0
    });
  });

  document.addEventListener('mousemove', (e) => {
    magnetElements.forEach(element => {
      const elementRect = element.getBoundingClientRect();
      const elementCenter = {
        x: elementRect.left + elementRect.width / 2,
        y: elementRect.top + elementRect.height / 2
      };
      
      const distance = Math.sqrt(
        Math.pow(e.clientX - elementCenter.x, 2) + 
        Math.pow(e.clientY - elementCenter.y, 2)
      );
      
      if (distance < magnetArea) {
        const x = e.clientX - elementCenter.x;
        const y = e.clientY - elementCenter.y;
        
        const strength = 1 - (distance / magnetArea); 
        const tiltIntensity = 20;
        
        gsap.to(element, {
          x: x * 0.5 * strength,
          y: y * 0.5 * strength,
          rotationX: (y / elementRect.height) * tiltIntensity * strength,
          rotationY: -(x / elementRect.width) * tiltIntensity * strength,
          transformPerspective: 500,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        gsap.to(element, {
          x: 0,
          y: 0,
          rotationX: 0,
          rotationY: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)'
        });
      }
    });
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
