const SESSION_KEY = "mms_session";
const SESSION_DURATION_MS = 60 * 60 * 1000;

function createSession(userId) {
    const session = {
        userId: userId,
        expiresAt: Date.now() + SESSION_DURATION_MS
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}

function getSession() {
    const raw = localStorage.getItem(SESSION_KEY);

    if (raw === null) {
        return null;
    }

    let session;

    try {
        session = JSON.parse(raw);
    } catch (error) {
        clearSession();
        return null;
    }

    if (typeof session.expiresAt !== "number" || Date.now() >= session.expiresAt) {
        clearSession();
        return null;
    }

    return session;
}

function getCurrentUser() {
    const session = getSession();

    if (session === null) {
        return null;
    }

    const user = findUserById(session.userId);

    if (user === null) {
        clearSession();
        return null;
    }

    return user;
}

function requireAuth() {
    if (getSession() === null) {
        window.location.replace("index.html");
        return false;
    }

    return true;
}

function requireGuest() {
    if (getSession() !== null) {
        window.location.replace("home.html");
        return false;
    }

    return true;
}

function logout() {
    clearSession();
    window.location.replace("index.html");
}

window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
        const isProtected = document.body.dataset.protected === "true";

        if (isProtected && getSession() === null) {
            window.location.replace("index.html");
        }
    }
});