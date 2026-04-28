// ✅ LIVE BACKEND URL
const BASE = "https://campus-backend-f3og.onrender.com";

// 🔐 PROTECT PAGE (redirect if not logged in)
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
    window.location.href = "auth.html";
}

// 🚪 LOGOUT FUNCTION
function logout() {
    localStorage.removeItem("user");
    window.location.href = "auth.html";
}

let allItems = [];
let currentType = null;
let currentCategory = null;

// 🚀 LOAD ITEMS
async function loadItems() {
    try {
        const res = await fetch(`${BASE}/api/items/all`);
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
            ? `${BASE}/uploads/${item.image}`
            : "https://via.placeholder.com/80";

        const isOwner = String(item.ownerId) === String(currentUser.id);
        const showChat = item.ownerId && String(item.ownerId) !== String(currentUser.id);

        let actionButtons = "";

        if (showChat) {
            actionButtons += `<button onclick="chatWithOwner('${item.ownerId}', '${item.ownerName || "User"}', '${item._id}')">💬 Chat</button>`;
        }

        if (isOwner) {
            actionButtons += `<button onclick="deleteItem('${item._id}', this)">🗑 Delete</button>`;
        }

        box.innerHTML += `
        <div class="item">
            <img src="${img}">
            <div>
                <b>${item.title}</b> (${item.type})
                <p>${item.location || ""}</p>
                <small>${item.date ? new Date(item.date).toLocaleDateString() : ""}</small>
                <div>${actionButtons}</div>
            </div>
        </div>
        `;
    });
}

// ➕ SUBMIT ITEM
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

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("location", location);
    formData.append("date", date);
    formData.append("type", type);
    formData.append("ownerId", user.id);
    formData.append("ownerName", user.name);

    if (image) formData.append("image", image);

    fetch(`${BASE}/api/items/add`, {
        method: "POST",
        body: formData
    })
    .then(() => {
        alert("Item added ✅");
        loadItems();
    })
    .catch(() => {
        alert("Error adding item ❌");
    });
}

// ❌ DELETE ITEM
async function deleteItem(id, btn) {
    await fetch(`${BASE}/api/items/delete/${id}`, {
        method: "DELETE"
    });

    btn.closest(".item").remove();
}

// 🔍 SEARCH
function searchItems() {
    const q = document.getElementById("searchInput").value.toLowerCase();
    const filtered = allItems.filter(i =>
        i.title && i.title.toLowerCase().includes(q)
    );
    displayItems(filtered);
}

// 🚀 INIT
loadItems();