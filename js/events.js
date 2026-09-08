const EVENT_URL = "http://192.168.161.129:8081/api/events";
const BOOKING_URL = "http://192.168.161.129:8082/api/bookings";

async function loadEvents() {
    const res = await fetch(EVENT_URL);
    const events = await res.json();

    const container = document.getElementById("events-list");
    container.innerHTML = "";

    events.forEach(event => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
            <h3>${event.name}</h3>
            <p>${event.venue} — ${event.date}</p>
            <p>Seats available: ${event.availableSeats} / ${event.totalSeats}</p>
            <button onclick="bookEvent(${event.id})" ${event.availableSeats <= 0 ? "disabled" : ""}>
                ${event.availableSeats <= 0 ? "Sold Out" : "Book"}
            </button>
        `;
        container.appendChild(div);
    });
}

async function bookEvent(eventId) {
    const userId = localStorage.getItem("userId");

    const res = await fetch(`${BOOKING_URL}?userId=${userId}&eventId=${eventId}`, {
        method: "POST"
    });

    const messageEl = document.getElementById("message");

    if (res.ok) {
        messageEl.textContent = "Booked successfully!";
        messageEl.className = "success";
        loadEvents();
    } else {
        const errText = await res.text();
        messageEl.textContent = errText;
        messageEl.className = "error";
    }
}
