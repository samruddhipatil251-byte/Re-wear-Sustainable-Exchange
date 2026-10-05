import { getSavedListings, saveListing } from "./main.js";

const $ = (id) => document.getElementById(id);

/** Shrink a photo to max 400px wide and return it as a small data URL. */
const resizeImage = (file, maxWidth = 400) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

/** Show a live preview when a photo is chosen. */
function wireImagePreview() {
  $("itemImage").addEventListener("change", async (e) => {
    const [file] = e.target.files;
    if (!file) return;

    const img = $("imagePreview");
    img.src = await resizeImage(file);
    img.style.display = "block";
    $("imagePreviewText").style.display = "none";
  });
}

/** Simulate an API call. Returns a resolved promise after a short delay. */
const submitListing = (listing) =>
  new Promise((resolve) => {
    console.log("Submitting listing to API:", listing);
    setTimeout(() => resolve({ ok: true, id: crypto.randomUUID() }), 700);
  });

/** Build a small preview card for a listing. */
const listingCardHTML = ({ name, category, size, condition, location, image }) => `
  <div class="d-flex gap-3 align-items-center" style="background:var(--paper-raised); border-radius:6px; padding:0.7rem; border:1px solid rgba(30,42,31,0.08);">
    <img src="${image}" alt="${name}" style="width:56px; height:70px; object-fit:cover; border-radius:4px; flex-shrink:0;">
    <div>
      <h3 class="h6 mb-1">${name}</h3>
      <span class="footer-fine" style="color:var(--ink-soft);">${category} · Size ${size} · ${condition} · ${location}</span>
    </div>
  </div>
`;

/** Show everything the user has listed so far (survives refresh). */
function renderRecentListings() {
  const saved = getSavedListings();
  if (saved.length === 0) return;
  $("noListingsMsg").style.display = "none";
  $("recentListings").innerHTML = saved.map(listingCardHTML).join("");
}

function wireForm() {
  const form = $("listForm");
  const status = $("submitStatus");
  const submitBtn = $("submitBtn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const listing = {
      name: $("itemName").value.trim(),
      category: $("itemCategory").value,
      size: $("itemSize").value,
      condition: $("itemCondition").value,
      location: $("itemLocation").value.trim(),
      notes: $("itemNotes").value.trim(),
      image: $("imagePreview").src,
    };

    submitBtn.disabled = true;
    status.textContent = "Submitting…";

    try {
      const result = await submitListing(listing);
      if (result.ok) {
        saveListing({ id: result.id, ...listing });
        status.textContent = "Listed! Check Browse or the Dashboard.";
        renderRecentListings();
        form.reset();
        form.classList.remove("was-validated");
        $("imagePreview").style.display = "none";
        $("imagePreviewText").style.display = "block";
      }
    } catch (err) {
      status.textContent = "Couldn't save — try a smaller photo.";
      console.error(err);
    } finally {
      submitBtn.disabled = false;
      setTimeout(() => (status.textContent = ""), 3000);
    }
  });
}

wireImagePreview();
wireForm();
renderRecentListings();