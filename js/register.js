const registerForm = document.getElementById("registerForm");

// Checks if a value contains at least one letter,
// one number and one special character
function hasRequiredCharacters(value) {
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialCharacter = /[^a-zA-Z0-9]/.test(value);

    return hasLetter && hasNumber && hasSpecialCharacter;
}

registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get values from the form
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const birthDate = document.getElementById("birthDate").value;

    // Username validation
    if (username.length < 6) {
        alert("Username must be at least 6 characters long.");
        return;
    }

    if (!hasRequiredCharacters(username)) {
        alert("Username must contain letters, numbers, and a special character.");
        return;
    }

    // Password validation
    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    if (!hasRequiredCharacters(password)) {
        alert("Password must contain letters, numbers, and a special character.");
        return;
    }

    // Password confirmation
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    // Name validation
    const namePattern = /^[a-zA-Z]{2,}$/;

    if (!namePattern.test(firstName)) {
        alert("First name must contain at least 2 letters.");
        return;
    }

    if (!namePattern.test(lastName)) {
        alert("Last name must contain at least 2 letters.");
        return;
    }

    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();

    const monthDifference = today.getMonth() - birth.getMonth();

    if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birth.getDate())
    ) {
        age--;
    }

    if (age < 18 || age > 65) {
        alert("Age must be between 18 and 65.");
        return;
    }

    const user = {
    email: email,
    username: username,
    password: password,
    firstName: firstName,
    lastName: lastName,
    birthDate: birthDate
    };

    saveUser(user);

    alert("Registration successful!");
});