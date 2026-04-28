const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get("itemId");

const user = JSON.parse(localStorage.getItem("user"));

// 📥 LOAD MESSAGES
async function loadMessages() {
    try {
        const res = await fetch(`http://localhost:5000/api/chat/${itemId}`);
        const messages = await res.json();

        const chatBox = document.getElementById("chatBox");
        chatBox.innerHTML = "";

        messages.forEach(msg => {
            const div = document.createElement("div");

            div.classList.add("msg");

            // ✅ LEFT / RIGHT ALIGN
            if (user && msg.sender === user.name) {
                div.classList.add("right");
            } else {
                div.classList.add("left");
            }

            // ✅ FIX UNDEFINED MESSAGE
            div.innerText = msg.text || msg.message || "No message";

            chatBox.appendChild(div);
        });

        // 🔽 AUTO SCROLL
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (err) {
        console.log("Error loading messages:", err);
    }
}

// 💬 SEND MESSAGE
async function sendMessage() {
    try {
        const input = document.getElementById("message");
        const text = input.value.trim();

        if (!text) return; // ❌ empty message block

        await fetch("http://localhost:5000/api/chat/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                itemId: itemId,
                sender: user ? user.name : "Anonymous",
                text: text   // ✅ correct field
            })
        });

        input.value = "";

        loadMessages();

    } catch (err) {
        console.log("Error sending message:", err);
    }
}

// 🔄 AUTO REFRESH EVERY 2 SEC
setInterval(loadMessages, 2000);

// 🚀 INITIAL LOAD
loadMessages();