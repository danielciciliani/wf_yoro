console.log('yoro project from local, dani');

document.addEventListener("DOMContentLoaded", () => {
    
    addActiveClass();
    moveBackArrow();

});

let isUserClick = false;

function addActiveClass(){
    let menuItems = document.querySelectorAll(".sidebar_list li");
    let sections = document.querySelectorAll("section");

    menuItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            isUserClick = true;

            menuItems.forEach(el => el.classList.remove("active"));

            item.classList.add("active");

            let sectionId = item.getAttribute("data-section");
            let targetSection = document.getElementById(sectionId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop, 
                    behavior: "smooth"
                });

                setTimeout(() => {
                    isUserClick = false; 
                }, 1000);
            }
        });
    });

    const observer = new IntersectionObserver(entries => {
        if (isUserClick) return;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let activeSection = entry.target.getAttribute("id");
                menuItems.forEach(item => {
                    let sectionId = item.getAttribute("data-section");
                    if (sectionId === activeSection) {
                        menuItems.forEach(el => el.classList.remove("active"));
                        item.classList.add("active");
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));
}

function moveBackArrow () {
    
    let backArrow = document.getElementById('back-arrow');
    let sidebar = document.getElementById('sidebar');

    backArrow.addEventListener("click", () => {

        sidebar.classList.toggle('compact');  
        backArrow.classList.toggle('rotated');
    });
}