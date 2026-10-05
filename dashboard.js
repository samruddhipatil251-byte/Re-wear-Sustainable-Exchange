import { fetchClothes } from "./main.js";

const items = await fetchClothes();

// Count items per category
const byCategory = Object.entries(
  items.reduce((acc, { category }) => {
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {})
);

const cities = new Set(items.map(({ location }) => location)).size;
const likeNew = items.filter(({ condition }) =>
  ["New", "Like New"].includes(condition)
).length;

// Stat tags
const stats = [
  [items.length, "ITEMS LISTED"],
  [byCategory.length, "CATEGORIES"],
  [cities, "CITIES"],
  [likeNew, "NEW OR LIKE NEW"],
];

document.getElementById("dashStats").innerHTML = stats
  .map(
    ([n, label]) => `
    <div class="col-sm-6 col-lg-3">
      <div class="impact-tag">
        <div class="stat">${n}</div>
        <span class="stat-label">${label}</span>
      </div>
    </div>`
  )
  .join("");

// Category bars
const max = Math.max(...byCategory.map(([, n]) => n), 1);

document.getElementById("catBars").innerHTML = byCategory
  .map(
    ([category, n]) => `
    <div class="mb-3">
      <div class="d-flex justify-content-between results-count">
        <span>${category}</span><span>${n}</span>
      </div>
      <div style="height:8px; border-radius:4px; background:rgba(107,127,94,.2);">
        <div style="height:100%; width:${(n / max) * 100}%; border-radius:4px; background:var(--gold);"></div>
      </div>
    </div>`
  )
  .join("");

// Listings table
document.getElementById("dashRows").innerHTML = items
  .map(
    ({ name, size, location, condition }) => `
    <tr>
      <td>${name}</td>
      <td>${size}</td>
      <td>${location}</td>
      <td><span class="badge-condition">${condition}</span></td>
    </tr>`
  )
  .join("");