const BOOKING_URL = "http://192.168.161.129:8082/api/bookings";

async function loadBookings() {
    const userId = localStorage.getItem("userId");
    const res = await fetch(`${BOOKING_URL}/user/${userId}`);
    const bookings = await res.json();

    const container = document.getElementById("bookings-list");
    container.innerHTML = "";

    if (bookings.length === 0) {
        container.innerHTML = "<p>No bookings yet.</p>";
        return;
    }

    bookings.forEach(booking => {
        const div = document.createElement("div");
        div.className = "card";
        const badgeClass = booking.status === "ACTIVE" ? "active" : "cancelled";
        div.innerHTML = `
            <p>Booking #${booking.id} — Event ID: ${booking.eventId}</p>
            <span class="badge ${badgeClass}">${booking.status}</span>
            <p>Booked on: ${booking.bookingDate}</p>
            ${booking.status === "ACTIVE" ? `<button onclick="cancelBooking(${booking.id})">Cancel</button>` : ""}
        `;
        container.appendChild(div);
    });
}

async function cancelBooking(bookingId) {
    await fetch(`${BOOKING_URL}/${bookingId}`, { method: "DELETE" });
    loadBookings();
}
