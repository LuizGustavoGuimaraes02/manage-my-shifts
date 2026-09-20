const resetForm = document.getElementById("resetForm");
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

resetForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const confirmText = document.getElementById("confirmText").value.trim();

    const errors = [];

    if (confirmText !== "DELETE") {
        errors.push('You must type "DELETE" exactly to confirm.');
    }

    const user = findUserByUsername(username);
    const emailMatches = user !== null && user.email.toLowerCase() === email.toLowerCase();

    if (user === null || !emailMatches) {
        errors.push("No account matches that username and email combination.");
    }

    if (errors.length > 0) {
        showErrors(errors);
        return;
    }

    deleteAllShiftsForUser(user.id);
    deleteUserById(user.id);

    alert("Your account and all associated data have been deleted. Please register a new account.");
    window.location.href = "register.html";
});