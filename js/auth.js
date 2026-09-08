const AUTH_URL = "http://192.168.161.129:8083/auth";

async function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const name = document.getElementById("name").value;

    const res = await fetch(`${AUTH_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name })
    });

    const messageEl = document.getElementById("message");

    if (res.ok) {
        const data = await res.json();
        saveSession(data);
        window.location.href = "events.html";
    } else {
        const errText = await res.text();
        messageEl.textContent = errText;
        messageEl.className = "error";
    }
}

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${AUTH_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const messageEl = document.getElementById("message");

    if (res.ok) {
        const data = await res.json();
        saveSession(data);
        window.location.href = "events.html";
    } else {
        const errText = await res.text();
        messageEl.textContent = errText;
        messageEl.className = "error";
    }
}

function saveSession(data) {
    localStorage.setItem("userId", data.id);
    localStorage.setItem("userName", data.name);
    localStorage.setItem("token", data.token);
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

function requireLogin() {
    if (!localStorage.getItem("userId")) {
        window.location.href = "index.html";
    }
}
