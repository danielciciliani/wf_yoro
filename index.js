console.log('yoro project new version');

document.addEventListener("DOMContentLoaded", () => {
    let menuItems = document.querySelectorAll(".sidebar_list li");

    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            menuItems.forEach(el => el.classList.remove("active"));

            item.classList.add("active");
        });
    });
});
