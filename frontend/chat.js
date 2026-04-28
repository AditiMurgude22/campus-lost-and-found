const BASE_URL = "https://campus-backend-f3og.onrender.com";

const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get("itemId");

const user = JSON.parse(localStorage.getItem("user"));

// 📥 LOAD MESSAGES
async function loadMessages() {
    try {
        const res = await fetch(`${BASE_URL}/api/chat/${itemId}`);
        const messages = await res.json();

        const chatBox = document.getElementById("chatBox");
        chatBox.innerHTML = "";

        messages.forEach(msg => {
            const div = document.createElement("div");
            div.classList.add("msg");

            if (user && msg.sender === user.name) {
                div.classList.add("right");
            } else {
                div.classList.add("left");
            }

            div.innerText = msg.text || msg.message || "No message";

            chatBox.appendChild(div);
        });

        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (err) {
        console.log(err);
    }
}

// 💬 SEND MESSAGE
async function sendMessage() {
    try {
        const input = document.getElementById("message");
        const text = input.value.trim();

        if (!text) return;

        await fetch(`${BASE_URL}/api/chat/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                itemId: itemId,
                sender: user ? user.name : "Anonymous",
                text: text
            })
        });

        input.value = "";
        loadMessages();

    } catch (err) {
        console.log(err);
    }
}

// 🔄 AUTO REFRESH
setInterval(loadMessages, 2000);

// 🚀 INIT
loadMessages();