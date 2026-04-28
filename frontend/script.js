const BASE_URL = "https://campus-backend-f3og.onrender.com";

let allItems = [];
let currentType = null;
let currentCategory = null;

// 🚀 LOAD ITEMS
async function loadItems() {
    try {
        const res = await fetch(`${BASE_URL}/api/items/all`);
        const data = await res.json();

        allItems = data.reverse();
        applyFilters();

    } catch (err) {
        console.log(err);
        alert("Server not connected ❌");
    }
}

// 🎯 APPLY FILTERS
function applyFilters() {
    let filtered = [...allItems];

    if (currentType) {
        filtered = filtered.filter(i => i.type === currentType);
    }

    if (currentCategory) {
        filtered = filtered.filter(i => i.category === currentCategory);
    }

    displayItems(filtered);
}

// 🎨 DISPLAY ITEMS
function displayItems(items) {
    const box = document.getElementById("items");
    box.innerHTML = "";

    if (items.length === 0) {
        box.innerHTML = "<p>No items found 😔</p>";
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem("user")) || {};

    items.forEach(item => {
        let img = item.image
            ? `${BASE_URL}/uploads/${item.image}`
            : "https://via.placeholder.com/80";

        const isOwner = String(item.ownerId) === String(currentUser.id);
        const showChat = item.ownerId && String(item.ownerId) !== String(currentUser.id);

        let actionButtons = "";

        if (showChat) {
            actionButtons += `<button onclick="chatWithOwner('${item.ownerId}', '${escapeHtml(item.ownerName || "User")}', '${item._id}')" style="background:#2e6f6f;color:white;border:none;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:12px;margin-top:6px;margin-right:6px;">💬 Chat</button>`;
        }

        if (isOwner) {
            actionButtons += `<button onclick="deleteItem('${item._id}', this)" style="background:#c0392b;color:white;border:none;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:12px;margin-top:6px;">🗑 Delete</button>`;
        }

        box.innerHTML += `
        <div class="item" data-id="${item._id}">
            <img src="${img}" onerror="this.src='https://via.placeholder.com/80?text=No+Image'">
            <div style="flex:1;">
                <b>${item.title}</b>
                <span style="color:${item.type === "lost" ? "red" : "green"};">(${item.type})</span>

                <p>${item.location || ""}</p>

                <small>
                    ${item.date ? new Date(item.date).toLocaleDateString() : ""}
                </small>

                ${item.ownerName ? `<div>Posted by: ${escapeHtml(item.ownerName)}</div>` : ""}

                <div>${actionButtons}</div>
            </div>
        </div>
        `;
    });
}

// 🔐 SAFE TEXT
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// 💬 CHAT
function chatWithOwner(ownerId, ownerName) {
    window.location.href = `chat-tab.html?userId=${encodeURIComponent(ownerId)}&userName=${encodeURIComponent(ownerName)}`;
}

// 🗑 DELETE
async function deleteItem(itemId, btnEl) {
    if (!confirm("Delete this item?")) return;

    try {
        const res = await fetch(`${BASE_URL}/api/items/delete/${itemId}`, {
            method: "DELETE"
        });

        if (res.ok) {
            btnEl.closest(".item").remove();
            alert("Deleted ✅");
        } else {
            alert("Delete failed ❌");
        }
    } catch (err) {
        alert("Error ❌");
    }
}

// 🔍 SEARCH
function searchItems() {
    const q = document.getElementById("searchInput").value.toLowerCase();

    const filtered = allItems.filter(i =>
        i.title && i.title.toLowerCase().includes(q)
    );

    displayItems(filtered);
}

// 🎯 FILTER TYPE
function filterType(type) {
    currentType = type;
    applyFilters();
}

// 🎯 FILTER CATEGORY
function filterCategory(category) {
    currentCategory = category;
    applyFilters();
}

// ➕ ADD ITEM
function submitItem() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const location = document.getElementById("location").value;
    const date = document.getElementById("date").value;
    const type = document.getElementById("type").value;
    const image = document.getElementById("image").files[0];

    if (!title || !description || !category || !location || !type) {
        alert("Fill all fields ⚠️");
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem("user")) || {};

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("location", location);
    formData.append("date", date);
    formData.append("type", type);
    formData.append("ownerId", currentUser.id || "");
    formData.append("ownerName", currentUser.name || "");

    if (image) formData.append("image", image);

    fetch(`${BASE_URL}/api/items/add`, {
        method: "POST",
        body: formData
    })
    .then(() => {
        alert("Item added ✅");
        loadItems();
    })
    .catch(() => {
        alert("Error ❌");
    });
}

// 🚀 INIT
loadItems();