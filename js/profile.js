const profileForm = document.getElementById("profileForm");
const formErrors = document.getElementById("formErrors");
const currentUser = getCurrentUser();

// Same patterns as register.js: email format, accented-name support,
// local-time age calculation. Duplicated here rather than imported
// as shared functions because this project has no module system set
// up — splitting into an es-module would be the next-level refactor,
// out of scope for this course's stack (plain script tags).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@.]{2,}$/;
const NAME_PATTERN = /^[a-zA-Z\u00C0-\u024F][a-zA-Z\u00C0-\u024F\s'-]{1,}$/;

function hasRequiredCharacters(value) {
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialCharacter = /[^a-zA-Z0-9]/.test(value);
    return hasLetter && hasNumber && hasSpecialCharacter;
}

function calculateAge(birthDateString) {
    const [year, month, day] = birthDateString.split("-").map(Number);
    const birth = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
}

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

function prefillForm() {
    document.getElementById("email").value = currentUser.email;
    document.getElementById("username").value = currentUser.username;
    document.getElementById("firstName").value = currentUser.firstName;
    document.getElementById("lastName").value = currentUser.lastName;
    document.getElementById("birthDate").value = currentUser.birthDate;
}

function isEmailTakenByAnother(email) {
    const existing = findUserByEmail(email);
    return existing !== null && existing.username !== currentUser.username;
}

function isUsernameTakenByAnother(username) {
    const existing = findUserByUsername(username);
    return existing !== null && existing.username !== currentUser.username;
}

function validate(data) {
    const errors = [];

    if (!EMAIL_PATTERN.test(data.email)) {
        errors.push("Email must be in the format name@domain.com.");
    } else if (isEmailTakenByAnother(data.email)) {
        errors.push("This email is already registered to another account.");
    }

    if (data.username.length < 6) {
        errors.push("Username must be at least 6 characters long.");
    } else if (!hasRequiredCharacters(data.username)) {
        errors.push("Username must contain letters, numbers and a special character.");
    } else if (isUsernameTakenByAnother(data.username)) {
        errors.push("This username is already taken.");
    }

    if (data.password !== "") {
        if (data.password.length < 6) {
            errors.push("Password must be at least 6 characters long.");
        }
        if (data.password !== data.confirmPassword) {
            errors.push("Passwords do not match.");
        }
    }

    if (!NAME_PATTERN.test(data.firstName)) {
        errors.push("First name must contain at least 2 letters.");
    }

    if (!NAME_PATTERN.test(data.lastName)) {
        errors.push("Last name must contain at least 2 letters.");
    }

    if (data.birthDate === "") {
        errors.push("Birth date is required.");
    } else {
        const age = calculateAge(data.birthDate);
        if (age < 18 || age > 65) {
            errors.push("Age must be between 18 and 65.");
        }
    }

    return errors;
}

profileForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const data = {
        email: document.getElementById("email").value.trim(),
        username: document.getElementById("username").value.trim(),
        password: document.getElementById("password").value,
        confirmPassword: document.getElementById("confirmPassword").value,
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        birthDate: document.getElementById("birthDate").value
    };

    const errors = validate(data);

    if (errors.length > 0) {
        showErrors(errors);
        return;
    }

    showErrors([]);

    const updatedFields = {
        email: data.email,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: data.birthDate
    };

    if (data.password !== "") {
        updatedFields.password = data.password;
    }

    const users = getUsers();
    const index = users.findIndex((user) => user.username === currentUser.username);
    users[index] = { ...users[index], ...updatedFields };
    saveUsers(users);


        createSession(currentUser.id);

    window.location.href = "home.html";
});

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("greeting").textContent = "Hello, " + currentUser.firstName;
    document.getElementById("logoutButton").addEventListener("click", logout);
    prefillForm();
});