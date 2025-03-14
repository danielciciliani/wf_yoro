console.log('yoro project local');

document.addEventListener("DOMContentLoaded", () => {
    
    addActiveClass();
    moveBackArrow();

});

function addActiveClass(){
    let menuItems = document.querySelectorAll(".sidebar_list li");

    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            menuItems.forEach(el => el.classList.remove("active"));

            item.classList.add("active");
        });
    });
}

function moveBackArrow () {
    
    let backArrow = document.getElementById('back-arrow');
    let sidebar = document.getElementById('sidebar');

    backArrow.addEventListener("click", () => {
        sidebar.classList.toggle('compact');
    });
}