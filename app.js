
import { db, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "./firebase-config.js";

// Collection Reference (Set to "posts" to match Person 3's form submission)
const itemsRef = collection(db, "posts");

// -------------------------------------------------------------
// 1. FETCH & DISPLAY ALL ITEMS
// -------------------------------------------------------------
export async function fetchItems() {
  const container = document.getElementById("items-container");
  if (!container) return;

  container.innerHTML = "<p>Loading items...</p>";

  try {
    const q = query(itemsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      container.innerHTML = "<p class='no-items'>No posts found. Be the first to report an item!</p>";
      return;
    }

    container.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const item = doc.data();
      const cardHTML = renderItemCard(doc.id, item);
      container.innerHTML += cardHTML;
    });
  } catch (error) {
    console.error("Error fetching items: ", error);
    container.innerHTML = "<p>Failed to load items. Check browser console.</p>";
  }
}

// Helper function to build single HTML card
function renderItemCard(id, item) {
  const itemType = item.type || "Lost";
  const badgeClass =
    itemType.toLowerCase() === "lost"
      ? "badge-lost"
      : "badge-found";

  // Person 3 sends 'image' (Base64).
  // Fallback to imageUrl or the original placeholder.
 const imageSrc = item.image || item.imageUrl || "";

  return `
    <div class="card" data-id="${id}" data-category="${item.category || ""}" data-type="${itemType}">
      <img src="${imageSrc}" alt="${item.title || "Item"}" class="card-img" />

      <div class="card-body">
        <span class="badge ${badgeClass}">${itemType}</span>

        <h3>${item.title || "Untitled Item"}</h3>

        <p><strong>Category:</strong> ${item.category || "General"}</p>

        <p><strong>Location:</strong> ${item.location || "Campus"}</p>

        <p><strong>Date:</strong> ${item.date || "N/A"}</p>

        <p>${item.description || ""}</p>

        <p><strong>Contact:</strong> ${item.contact || "N/A"}</p>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// 2. SAVE POST TO FIREBASE
// -------------------------------------------------------------
window.savePostToFirebase = async function (postPayload) {
  try {
    const postsRef = collection(db, "posts");

    await addDoc(postsRef, {
      ...postPayload,
      createdAt: serverTimestamp()
    });

    alert("🎉 Post saved successfully to Firebase!");
    window.location.href = "index.html";
  } catch (error) {
    console.error("Error saving post to Firebase: ", error);
    alert("Error saving post: " + error.message);
  }
};

// Initial fetch when page loads
document.addEventListener("DOMContentLoaded", () => {
  fetchItems();
});

// -------------------------------------------------------------
// 3. LIVE SEARCH & FILTER LOGIC
// -------------------------------------------------------------

// Read the currently active Lost / Found / All button
function getActiveTypeFilter() {
  const activeBtn = document.querySelector(".filter-btn.active");
  const type = activeBtn?.getAttribute("data-filter") || "All";

  return type === "all" ? "All" : type;
}

function filterItems(selectedType = getActiveTypeFilter()) {
  const searchValue =
    document.getElementById("searchInput")?.value.toLowerCase() || "";

  const categoryFilter =
    document.getElementById("category-filter")?.value || "All";

  const cards =
    document.querySelectorAll("#items-container .card");

  cards.forEach((card) => {
    const title =
      card.querySelector("h3")?.textContent.toLowerCase() || "";

    const description =
      card.querySelector("p:nth-of-type(4)")?.textContent.toLowerCase() || "";

    const location =
      card.querySelector("p:nth-of-type(2)")?.textContent.toLowerCase() || "";

    const cardCategory =
      card.getAttribute("data-category") || "";

    const cardType =
      card.getAttribute("data-type") || "";

    const matchesSearch =
      title.includes(searchValue) ||
      description.includes(searchValue) ||
      location.includes(searchValue);

    const matchesCategory =
      categoryFilter === "All" ||
      cardCategory.toLowerCase() ===
        categoryFilter.toLowerCase();

    const matchesType =
      selectedType === "All" ||
      cardType.toLowerCase() ===
        selectedType.toLowerCase();

    if (
      matchesSearch &&
      matchesCategory &&
      matchesType
    ) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// Search and category filter
document.addEventListener("DOMContentLoaded", () => {
  const searchBox =
    document.getElementById("searchInput");

  const categoryFilter =
    document.getElementById("category-filter");

  if (searchBox) {
    searchBox.addEventListener("input", () => {
      filterItems();
    });
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
      filterItems();
    });
  }

  // Lost / Found / All buttons
  const filterButtons =
    document.querySelectorAll(".filter-btn");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {

      filterButtons.forEach((btn) => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      filterItems();
    });
  });
});
