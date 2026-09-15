
const USERS_KEY = "mms_users";

function getUsers() {
    const raw = localStorage.getItem(USERS_KEY);

    if (raw === null) {
        return [];
    }

    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function findUserByEmail(email) {
    const target = email.trim().toLowerCase();
    return getUsers().find((user) => user.email.toLowerCase() === target) || null;
}

function findUserByUsername(username) {
    const target = username.trim().toLowerCase();
    return getUsers().find((user) => user.username.toLowerCase() === target) || null;
}

function addUser(user) {
    const users = getUsers();
    users.push(user);
    saveUsers(users);
}