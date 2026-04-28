const BASE = "https://campus-backend-f3og.onrender.com";

const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get("itemId");

const user = JSON.parse(localStorage.getItem("user"));

// 🔐 PROTECT PAGE
if (!user) {
    window.location.href = "auth.html";
}

// 📥 LOAD MESSAGES
async function loadMessages() {
    try {
        const res = await fetch(`${BASE}/api/chat/${itemId}`);
        const messages = await res.json();

        const chatBox = document.getElementById("chatBox");
        chatBox.innerHTML = "";

        messages.forEach(msg => {
            const div = document.createElement("div");

            if (msg.sender === user.name) {
                div.style.textAlign = "right";
            }

            div.innerText = msg.text || "No message";
            chatBox.appendChild(div);
        });

        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (err) {
        console.log(err);
    }
}

// 💬 SEND MESSAGE
async function sendMessage() {
    const input = document.getElementById("message");
    const text = input.value.trim();

    if (!text) return;

    await fetch(`${BASE}/api/chat/send`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            itemId,
            sender: user.name,
            text
        })
    });

    input.value = "";
    loadMessages();
}

// 🔄 AUTO REFRESH
setInterval(loadMessages, 2000);

// 🚀 INIT
loadMessages();