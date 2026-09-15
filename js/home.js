document.addEventListener("DOMContentLoaded", function () {
    const user = getCurrentUser();

    if (user === null) {
        window.location.replace("index.html");
        return;
    }

    document.getElementById("greeting").textContent = "Hello, " + user.firstName;
    document.getElementById("logoutButton").addEventListener("click", logout);
});