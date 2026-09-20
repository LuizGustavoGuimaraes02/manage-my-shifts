document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("navToggle");
    const nav = document.querySelector(".topbar nav");

    if (toggleButton === null || nav === null) {
        return;
    }

    toggleButton.addEventListener("click", function () {
        const isOpen = nav.classList.toggle("open");
        toggleButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
        });
    });
});