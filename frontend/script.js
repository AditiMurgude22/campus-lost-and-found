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
            <div style="flex:1;min-width:0;">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                    <div>
                        <b>${item.title}</b>
                        <span style="margin-left:8px;color:${item.type === "lost" ? "red" : "green"};">
                            (${item.type})
                        </span>
                    </div>
                </div>

                <p style="margin:5px 0;">${item.location || ""}</p>

                <small style="color:#888;">
                    ${item.date ? new Date(item.date).toLocaleDateString() : ""}
                </small>

                ${item.ownerName ? `<div style="font-size:12px;color:#4c8d8d;margin-top:4px;">Posted by: ${escapeHtml(item.ownerName)}</div>` : ""}

                <div>${actionButtons}</div>
            </div>
        </div>
        `;
    });
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function chatWithOwner(ownerId, ownerName, itemId) {
    window.location.href = `chat-tab.html?userId=${encodeURIComponent(ownerId)}&userName=${encodeURIComponent(ownerName)}`;
}

// 🗑 DELETE ITEM
async function deleteItem(itemId, btnEl) {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
        const res = await fetch(`${BASE_URL}/api/items/delete/${itemId}`, {
            method: "DELETE"
        });

        if (res.ok) {
            const itemCard = btnEl.closest(".item");
            if (itemCard) itemCard.remove();
            alert("Item deleted ✅");
        } else {
            alert("Failed to delete item ❌");
        }
    } catch (err) {
        console.log("Delete error:", err);
        alert("Error deleting item ❌");
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

// 🔥 TYPE FILTER
function filterType(type, el) {
    currentType = type;

    document.querySelectorAll(".main-card").forEach(c =>
        c.classList.remove("active-tab")
    );

    if (el) el.classList.add("active-tab");

    applyFilters();
}

// 🔥 CATEGORY FILTER
function filterCategory(category, el) {
    currentCategory = category;

    document.querySelectorAll(".category-box").forEach(c =>
        c.classList.remove("active-category")
    );

    if (el) {
        el.querySelector(".category-box").classList.add("active-category");
    }

    applyFilters();
}

// ➕ SUBMIT ITEM
function submitItem() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const location = document.getElementById("location").value;
    const date = document.getElementById("date").value;
    const type = document.getElementById("type")?.value;
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

        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("location").value = "";
        document.getElementById("date").value = "";
        document.getElementById("image").value = "";

        loadItems();
    })
    .catch(() => {
        alert("Error adding item ❌");
    });
}

// INIT
loadItems();