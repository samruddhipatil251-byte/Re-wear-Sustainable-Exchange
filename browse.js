// ============================================
// ReWear — browse.js
// ES6: modules, async/await, arrow functions,
// destructuring, array methods (filter/map).
// ============================================

import { fetchClothes, renderClothes } from "./main.js";

const state = {
  all: [],
  search: "",
  category: "",
  location: "",
  condition: "",
};

const $ = (id) => document.getElementById(id);

/** Apply all active filters to the full dataset. */
const getFiltered = () => {
  const { all, search, category, location, condition } = state;
  return all.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || item.category === category;
    const matchesLocation = !location || item.location === location;
    const matchesCondition = !condition || item.condition === condition;
    return matchesSearch && matchesCategory && matchesLocation && matchesCondition;
  });
};

/** Re-run filters and update the grid + result count. */
function refresh() {
  const results = getFiltered();
  renderClothes(results, "browseGrid");
  $("resultsCount").textContent =
    `${results.length} item${results.length === 1 ? "" : "s"} found`;
}

function wireControls() {
  $("searchInput").addEventListener("input", (e) => {
    state.search = e.target.value;
    refresh();
  });

  $("categorySelect").addEventListener("change", (e) => {
    state.category = e.target.value;
    refresh();
  });

  $("locationSelect").addEventListener("change", (e) => {
    state.location = e.target.value;
    refresh();
  });

  document.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      state.condition = chip.dataset.condition;
      refresh();
    });
  });

  $("clearFilters").addEventListener("click", () => {
    state.search = "";
    state.category = "";
    state.location = "";
    state.condition = "";
    $("searchInput").value = "";
    $("categorySelect").value = "";
    $("locationSelect").value = "";
    document.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
    document.querySelector('.filter-chip[data-condition=""]').classList.add("active");
    refresh();
  });
}

(async function init() {
  state.all = await fetchClothes();
  wireControls();
  refresh();
})();