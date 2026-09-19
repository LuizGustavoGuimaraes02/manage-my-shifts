const loginForm = document.getElementById("loginForm");
const formErrors = document.getElementById("formErrors");

function showErrors(errors) {
    formErrors.innerHTML = "";

    if (errors.length === 0) {
        return;
    }

    const list = document.createElement("ul");
    list.className = "error-list";

    errors.forEach((message) => {
        const item = document.createElement("li");
        item.textContent = message;
        list.appendChild(item);
    });

    formErrors.appendChild(list);
}

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (username === "" || password === "") {
        showErrors(["Please fill in both fields."]);
        return;
    }

    const user = findUserByUsername(username);

    if (user === null || user.password !== password) {
        showErrors(["Invalid username or password."]);
        return;
    }

    createSession(user.id);
    window.location.replace("home.html");
});