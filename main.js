// ============================================
// ReWear — main.js
// API-based version
// Uses REST API, fetch(), async/await,
// arrow functions, template literals,
// and destructuring.
// ============================================

const API_URL = "http://localhost:3000/clothes";

/**
 * Fetch all clothing listings from the REST API.
 */
export async function fetchClothes() {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error(`Request failed: ${res.status}`);
    }

    return await res.json();

  } catch (err) {
    console.error("Could not load clothes:", err);
    return [];
  }
}


/**
 * Get all saved listings from the API.
 * This replaces localStorage.
 */
export async function getSavedListings() {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error(`Request failed: ${res.status}`);
    }

    return await res.json();

  } catch (err) {
    console.error("Could not load listings:", err);
    return [];
  }
}


/**
 * Add a new clothing listing to the API.
 * Uses HTTP POST.
 */
export async function saveListing(listing) {
  const res = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify(listing)
  });

  if (!res.ok) {
    throw new Error(`Failed to save listing: ${res.status}`);
  }

  return await res.json();
}


/**
 * Build one clothing card's HTML.
 */
const clothCardHTML = ({
  name,
  category,
  condition,
  image
}) => `
  <div class="col-sm-6 col-lg-3">
    <div class="cloth-card">

      <img
        class="cloth-img"
        src="${image}"
        alt="${name}"
      >

      <div class="cloth-body">

        <span class="cloth-tagline">
          ${category}
        </span>

        <h3>${name}</h3>

        <span class="badge-condition">
          ${condition}
        </span>

      </div>

    </div>
  </div>
`;


/**
 * Render clothing items into a container.
 */
export function renderClothes(items, containerId) {

  const container = document.getElementById(containerId);

  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `
      <p class="text-secondary">
        No items to show right now.
      </p>
    `;
    return;
  }

  container.innerHTML =
    items.map(clothCardHTML).join("");
}


/**
 * Load featured clothes on the homepage.
 */
if (document.getElementById("featuredGrid")) {

  const items = await fetchClothes();

  renderClothes(
    items.slice(0, 4),
    "featuredGrid"
  );
}