// ===============================================================
// UMKM MUjahir-MUhajir - Spesialis Ikan Mujair Mentah Segar
// Menerapkan Pola State -> Render (Tiny React) dari Pertemuan 1 - 4
// Fitur: Modal Detail Ikan Mentah (Cegah Direct WA), Filter, Dark Mode
// ===============================================================

// ===== STYLE CLASSES =====
const CARD_CLASSES =
  "group relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 rounded-2xl bg-white p-4.5 shadow-xs ring-1 ring-slate-200/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-teal-500/80 dark:bg-slate-900 dark:ring-slate-800 dark:hover:ring-teal-400 dark:hover:shadow-slate-950/50 cursor-pointer text-left";

const TAB_CLASSES =
  "rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/90 transition duration-150 aria-pressed:bg-teal-600 aria-pressed:text-white aria-pressed:ring-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800 dark:aria-pressed:bg-teal-600 cursor-pointer shadow-xs";

const MESSAGE_CLASSES =
  "rounded-2xl bg-white px-5 py-6 text-center text-sm text-slate-500 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800 shadow-xs";

// Nomor WhatsApp Resmi UMKM MUjahir-MUhajir
const WHATSAPP_NUMBER = "6281234567890";

// ===== STATE (Single Source of Truth) =====
const state = {
  links: [],
  activeCategory: "semua",
  theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
  status: "loading", // "loading" | "ready" | "error"
  selectedProduct: null, // Objek ikan mentah yang sedang dibuka di modal
  productQty: 1, // Jumlah timbangan / kuantiti saat modal aktif
  productPrep: "", // Pilihan kondisi/pembersihan ikan mentah
  customNote: "" // Catatan request timbangan dari pembeli
};

// Satu-satunya pintu untuk memodifikasi state & memicu render UI
function setState(changes) {
  Object.assign(state, changes);
  render();
}

// ===== HELPER: SANITASI XSS (Pertemuan 4) =====
function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Format Angka Rupiah
function formatRupiah(number) {
  if (typeof number !== "number" || isNaN(number)) return "";
  return "Rp " + number.toLocaleString("id-ID");
}

// ===== KOMPONEN =====

// 1. Kartu Ikan Mentah / Tautan
function LinkCard(link) {
  const isProduct = link.category === "produk" || link.type === "product";

  // Jika produk ikan mentah: Buka modal detail (JANGAN langsung ke WA)
  if (isProduct) {
    return `
      <li>
        <button type="button" data-action="open-product" data-id="${link.id}"
                class="${CARD_CLASSES} w-full text-left">
          
          <div class="flex items-start gap-3.5">
            <!-- Ikon dengan Background Soft -->
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-2xl ring-1 ring-teal-200/60 dark:bg-teal-950/60 dark:ring-teal-800/60">
              <span aria-hidden="true">${escapeHtml(link.icon || "🐟")}</span>
            </div>

            <div class="space-y-1">
              <div class="flex flex-wrap items-center gap-1.5">
                <span class="text-sm font-bold text-slate-900 group-hover:text-teal-700 dark:text-white dark:group-hover:text-teal-300">
                  ${escapeHtml(link.title)}
                </span>
                ${
                  link.tag
                    ? `<span class="rounded-md bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-800 ring-1 ring-teal-200 dark:bg-teal-950/80 dark:text-teal-300 dark:ring-teal-800">${escapeHtml(link.tag)}</span>`
                    : ""
                }
              </div>

              ${
                link.desc
                  ? `<p class="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">${escapeHtml(link.desc)}</p>`
                  : ""
              }

              ${
                link.priceDisplay || link.price
                  ? `<div class="pt-0.5 text-xs font-bold text-teal-700 dark:text-teal-400">
                      ${escapeHtml(link.priceDisplay || formatRupiah(link.price))}
                    </div>`
                  : ""
              }
            </div>
          </div>

          <!-- Tombol Aksi Visual: Jelas bahwa ini membuka detail rincian -->
          <div class="flex sm:shrink-0 items-center justify-end pt-1 sm:pt-0">
            <span class="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition group-hover:bg-teal-600 group-hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-teal-600 dark:group-hover:text-white">
              <span>Detail & Timbangan</span>
              <span aria-hidden="true">→</span>
            </span>
          </div>
        </button>
      </li>`;
  }

  // Jika bukan produk (Sosmed, Maps, Email, dll): Buka tautan luar dengan aman
  let extraAttributes = "";
  if (link.url && link.url.startsWith("http")) {
    extraAttributes = ' target="_blank" rel="noopener noreferrer"';
  }

  return `
    <li>
      <a href="${escapeHtml(link.url || "#")}"${extraAttributes} class="${CARD_CLASSES}">
        
        <div class="flex items-start gap-3.5">
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-2xl ring-1 ring-slate-200/80 dark:bg-slate-800 dark:ring-slate-700">
            <span aria-hidden="true">${escapeHtml(link.icon || "🔗")}</span>
          </div>

          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-1.5">
              <span class="text-sm font-bold text-slate-900 group-hover:text-teal-700 dark:text-white dark:group-hover:text-teal-300">
                ${escapeHtml(link.title)}
              </span>
              ${
                link.tag
                  ? `<span class="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700">${escapeHtml(link.tag)}</span>`
                  : ""
              }
            </div>
            ${
              link.desc
                ? `<p class="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">${escapeHtml(link.desc)}</p>`
                : ""
            }
          </div>
        </div>

        <div class="flex sm:shrink-0 items-center justify-end pt-1 sm:pt-0">
          <span class="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition group-hover:bg-slate-900 group-hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-slate-100 dark:group-hover:text-slate-900">
            <span>Kunjungi</span>
            <span aria-hidden="true">↗</span>
          </span>
        </div>
      </a>
    </li>`;
}

// 2. State Komponen Pesan (Loading, Error, Empty)
function EmptyState() {
  return `<li class="${MESSAGE_CLASSES}">Belum ada pilihan ikan di kategori ini. Silakan coba kategori lainnya.</li>`;
}

function LoadingState() {
  return `<li class="${MESSAGE_CLASSES}">
    <div class="flex items-center justify-center gap-2">
      <span class="h-2 w-2 rounded-full bg-teal-500 animate-ping"></span>
      <span>Memuat data ikan mujair mentah…</span>
    </div>
  </li>`;
}

function ErrorState() {
  return `<li class="${MESSAGE_CLASSES} border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400">
    Gagal memuat file <code>data/links.json</code>.<br>
    <span class="text-xs text-slate-500 mt-1 block">Pastikan website dibuka via Web Server (Live Server di VS Code atau http://localhost/linkpage_umkm/).</span>
  </li>`;
}

// 3. Filter dan Daftar Link
function getVisibleLinks(state) {
  if (state.activeCategory === "semua") {
    return state.links;
  }
  return state.links.filter(function (link) {
    return link.category === state.activeCategory;
  });
}

function LinkList(state) {
  if (state.status === "loading") {
    return LoadingState();
  }
  if (state.status === "error") {
    return ErrorState();
  }
  const visibleLinks = getVisibleLinks(state);
  if (visibleLinks.length === 0) {
    return EmptyState();
  }
  return visibleLinks.map(LinkCard).join("");
}

// 4. Tab Filter Kategori (Fokus Ikan Mentah)
const TABS = [
  { category: "semua", label: "✨ Semua" },
  { category: "produk", label: "🐟 Ikan Mujair Mentah" },
  { category: "kontak", label: "💬 Kontak & Admin" },
  { category: "sosmed", label: "📍 Sosmed & Lokasi" }
];

function FilterTabs(state) {
  return TABS.map(function (tab) {
    const isActive = tab.category === state.activeCategory;
    return `
      <button type="button" data-action="filter" data-category="${tab.category}"
              aria-pressed="${isActive}" class="${TAB_CLASSES}">${tab.label}</button>`;
  }).join("");
}

// 5. Counter Tautan
function LinkCount(state) {
  if (state.status !== "ready") {
    return "";
  }
  const total = getVisibleLinks(state).length;
  return `Menampilkan ${total} pilihan ikan mentah & tautan`;
}

// 6. Konten Modal Detail Ikan Mentah (Solusi Cegah Langsung ke WA)
function ProductModalContent(state) {
  const product = state.selectedProduct;
  if (!product) return "";

  const unitPrice = product.price || 32000;
  const currentQty = state.productQty || 1;
  const unit = product.unit || "Kg";
  const totalEst = unitPrice * currentQty;

  const prepOptions = product.prepOptions || [
    "Ikan Mentah Hidup Utuh",
    "Ikan Mentah Segar Dingin (Es)",
    "Gratis Bersih Sisik & Jeroan"
  ];

  // Pesan WhatsApp rapi yang HANYA dibuat ketika pengguna memilih "Lanjut Pesan ke WhatsApp"
  const waMessage =
    `Halo Admin MUjahir-MUhajir,\n` +
    `Saya ingin memesan Ikan Mujair Mentah Segar:\n\n` +
    `• Pilihan: ${product.title}\n` +
    `• Jumlah: ${currentQty} ${unit}\n` +
    (state.productPrep ? `• Kondisi/Pembersihan: ${state.productPrep}\n` : "") +
    (state.customNote ? `• Catatan: ${state.customNote}\n` : "") +
    `• Estimasi Total: ${formatRupiah(totalEst)}\n\n` +
    `Mohon info ketersediaan panen hari ini & ongkos kirimnya. Terima kasih!`;

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;

  return `
    <div class="space-y-4">
      <!-- Header Ikan Mentah -->
      <div class="flex items-start gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-3xl ring-1 ring-teal-200 dark:bg-teal-950 dark:ring-teal-800">
          <span>${escapeHtml(product.icon || "🐟")}</span>
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-1.5">
            <h3 id="modal-title" class="text-lg font-bold text-slate-900 dark:text-white">
              ${escapeHtml(product.title)}
            </h3>
            ${
              product.tag
                ? `<span class="rounded-md bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">${escapeHtml(product.tag)}</span>`
                : ""
            }
          </div>
          <p class="mt-1 text-base font-extrabold text-teal-700 dark:text-teal-400">
            ${escapeHtml(product.priceDisplay || formatRupiah(unitPrice))}
          </p>
        </div>
      </div>

      <!-- Keterangan Ikan Mentah -->
      <div class="rounded-2xl bg-slate-50 p-3.5 text-xs leading-relaxed text-slate-600 ring-1 ring-slate-200/70 dark:bg-slate-950 dark:text-slate-300 dark:ring-slate-800">
        <p class="font-semibold text-slate-800 dark:text-slate-200 mb-1">📋 Info Kualitas Ikan Mentah:</p>
        <p>${escapeHtml(product.desc || "Ikan mujair mentah segar hasil panen kolam air mengalir alami. Daging padat manis, bebas bau lumpur, dan siap diolah sendiri.")}</p>
      </div>

      <!-- Opsi Kondisi & Pembersihan Mentah (Gratis) -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
          🔪 Opsi Kondisi & Pembersihan Mentah (Gratis):
        </label>
        <div class="grid grid-cols-1 gap-2">
          ${prepOptions
            .map(function (opt) {
              const isSelected = state.productPrep === opt;
              return `
                <button type="button" data-action="select-prep" data-val="${escapeHtml(opt)}"
                        class="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium text-left transition ring-1 ${
                          isSelected
                            ? "bg-teal-50 ring-teal-500 text-teal-900 dark:bg-teal-950/70 dark:ring-teal-400 dark:text-teal-200 font-bold"
                            : "bg-white ring-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:ring-slate-800 dark:text-slate-300"
                        }">
                  <span>${escapeHtml(opt)}</span>
                  <span>${isSelected ? "✓" : ""}</span>
                </button>`;
            })
            .join("")}
        </div>
      </div>

      <!-- Pengaturan Jumlah / Timbangan -->
      <div class="flex items-center justify-between rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200/80 dark:bg-slate-950 dark:ring-slate-800">
        <div>
          <span class="block text-xs font-semibold text-slate-700 dark:text-slate-300">Timbangan (${escapeHtml(unit)})</span>
          <span class="text-[11px] text-slate-500 dark:text-slate-400">Min. 1 ${escapeHtml(unit)}</span>
        </div>

        <div class="flex items-center gap-3">
          <button type="button" data-action="qty-decrease" aria-label="Kurangi"
                  class="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-bold text-slate-700 shadow-xs ring-1 ring-slate-300 transition hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 cursor-pointer">
            -
          </button>
          <span class="w-8 text-center text-sm font-bold text-slate-900 dark:text-white">
            ${currentQty}
          </span>
          <button type="button" data-action="qty-increase" aria-label="Tambah"
                  class="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-bold text-slate-700 shadow-xs ring-1 ring-slate-300 transition hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 cursor-pointer">
            +
          </button>
        </div>
      </div>

      <!-- Catatan Tambahan -->
      <div>
        <label for="custom-note-input" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          📝 Catatan Timbangan / Request Khusus (Opsional):
        </label>
        <input id="custom-note-input" type="text" value="${escapeHtml(state.customNote)}"
               placeholder="Contoh: minta dipilihkan yang agak besar / dibelah bekakak mentah"
               class="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs ring-1 ring-slate-200 transition focus-visible:outline-2 focus-visible:outline-teal-600 dark:bg-slate-950 dark:ring-slate-800 dark:focus-visible:outline-teal-400">
      </div>

      <!-- Ringkasan Total & Tombol Aksi -->
      <div class="border-t border-slate-100 pt-3 dark:border-slate-800 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs text-slate-500 dark:text-slate-400">Perkiraan Biaya Timbangan:</span>
          <span class="text-base font-extrabold text-teal-700 dark:text-teal-400">
            ${formatRupiah(totalEst)}
          </span>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <!-- Tombol Tutup / Batal: Pengguna TIDAK dipaksa ke WhatsApp -->
          <button type="button" data-action="close-modal"
                  class="w-full rounded-xl bg-slate-100 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition cursor-pointer">
            Kembali / Batal
          </button>

          <!-- Tombol Lanjut ke WhatsApp: Pengguna HANYA ke WA jika dia sendiri yang mengklik tombol ini -->
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer"
             class="flex w-full items-center justify-center gap-1.5 rounded-xl bg-teal-600 py-3 text-xs font-bold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 transition cursor-pointer">
            <span>💬 Pesan ke WhatsApp</span>
          </a>
        </div>

        <p class="text-center text-[11px] text-slate-400">
          Pesanan ikan mentah akan dibuka di WhatsApp dengan format rapi tanpa perlu mengetik ulang.
        </p>
      </div>
    </div>`;
}

// ===== RENDER =====
const filterTabs = document.querySelector("#filter-tabs");
const linkList = document.querySelector("#link-list");
const linkCount = document.querySelector("#link-count");
const themeToggle = document.querySelector("#theme-toggle");
const productModal = document.querySelector("#product-modal");
const modalContent = document.querySelector("#modal-content");
const modalCloseBtn = document.querySelector("#modal-close-btn");

function renderTheme() {
  const isDark = state.theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Ganti ke mode terang" : "Ganti ke mode gelap"
  );
}

function renderModal() {
  if (state.selectedProduct) {
    modalContent.innerHTML = ProductModalContent(state);
    productModal.classList.remove("hidden");
    productModal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
  } else {
    productModal.classList.add("hidden");
    productModal.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
  }
}

function render() {
  filterTabs.innerHTML = FilterTabs(state);
  linkList.innerHTML = LinkList(state);
  linkCount.textContent = LinkCount(state);
  renderTheme();
  renderModal();
}

// ===== EVENT LISTENERS =====

// 1. Delegasi Event Filter Kategori
filterTabs.addEventListener("click", function (event) {
  const button = event.target.closest("[data-action='filter']");
  if (button === null) return;
  setState({ activeCategory: button.dataset.category });
});

// 2. Klik pada Daftar Link: Buka Modal jika Ikan Mentah (Mencegah Langsung ke WA)
linkList.addEventListener("click", function (event) {
  const productButton = event.target.closest("[data-action='open-product']");
  if (!productButton) return;

  const productId = parseInt(productButton.dataset.id, 10);
  const found = state.links.find(function (l) {
    return l.id === productId;
  });

  if (found) {
    const defaultPrep =
      found.prepOptions && found.prepOptions.length > 0
        ? found.prepOptions[0]
        : "Ikan Mentah Hidup Utuh";

    setState({
      selectedProduct: found,
      productQty: 1,
      productPrep: defaultPrep,
      customNote: ""
    });
  }
});

// 3. Delegasi Event di Dalam Modal (Jumlah, Opsi Pembersihan, Catatan, Tutup)
modalContent.addEventListener("click", function (event) {
  // Tambah Jumlah
  if (event.target.closest("[data-action='qty-increase']")) {
    setState({ productQty: state.productQty + 1 });
    return;
  }

  // Kurangi Jumlah
  if (event.target.closest("[data-action='qty-decrease']")) {
    if (state.productQty > 1) {
      setState({ productQty: state.productQty - 1 });
    }
    return;
  }

  // Pilih Opsi Pembersihan/Kondisi
  const prepBtn = event.target.closest("[data-action='select-prep']");
  if (prepBtn) {
    setState({ productPrep: prepBtn.dataset.val });
    return;
  }

  // Tombol Tutup / Batal
  if (event.target.closest("[data-action='close-modal']")) {
    setState({ selectedProduct: null });
    return;
  }
});

// Catatan tambahan di modal
modalContent.addEventListener("input", function (event) {
  if (event.target.id === "custom-note-input") {
    // Simpan di memori tanpa me-render ulang seluruh modal agar fokus input tidak hilang
    state.customNote = event.target.value;
  }
});

// 4. Tombol Tutup Modal (X)
if (modalCloseBtn) {
  modalCloseBtn.addEventListener("click", function () {
    setState({ selectedProduct: null });
  });
}

// Tutup modal jika klik di area luar dialog (backdrop)
productModal.addEventListener("click", function (event) {
  if (event.target === productModal) {
    setState({ selectedProduct: null });
  }
});

// Tutup modal dengan tombol Escape
window.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && state.selectedProduct) {
    setState({ selectedProduct: null });
  }
});

// 5. Toggle Tema Gelap / Terang
themeToggle.addEventListener("click", function () {
  const newTheme = state.theme === "dark" ? "light" : "dark";
  localStorage.setItem("linkpage:theme", newTheme);
  setState({ theme: newTheme });
});

// 6. Form Tambah Link / Usulan Produk Mentah (Sesuai Materi Pertemuan 4)
const addLinkForm = document.querySelector("#add-link-form");
const formError = document.querySelector("#form-error");

function showFormError(message) {
  formError.textContent = message;
  formError.classList.remove("hidden");
}

function hideFormError() {
  formError.textContent = "";
  formError.classList.add("hidden");
}

function isValidUrl(url) {
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("mailto:")
  );
}

addLinkForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const title = document.querySelector("#link-title").value.trim();
  const url = document.querySelector("#link-url").value.trim();
  const category = document.querySelector("#link-category").value;

  if (title === "") {
    showFormError("Nama tautan atau ukuran ikan tidak boleh kosong.");
    return;
  }
  if (!isValidUrl(url)) {
    showFormError("URL harus diawali http://, https://, atau mailto:");
    return;
  }

  hideFormError();
  addLinkForm.reset();

  let icon = "🐟";
  let tag = "✨ Ukuran Baru";
  if (category === "kontak") {
    icon = "💬";
    tag = "Kontak";
  } else if (category === "sosmed") {
    icon = "📍";
    tag = "Sosmed";
  }

  const isProduct = category === "produk";

  const newLink = {
    id: Date.now(),
    title: title,
    url: url,
    category: category,
    type: isProduct ? "product" : "external",
    icon: icon,
    tag: tag,
    price: isProduct ? 32000 : 0,
    priceDisplay: isProduct ? "Rp 32.000 / kg" : "",
    unit: isProduct ? "Kg" : "",
    desc: isProduct
      ? "Pilihan ikan mujair mentah segar langsung dari kolam air mengalir. Klik untuk rincian."
      : "Tautan eksternal yang baru ditambahkan.",
    prepOptions: isProduct
      ? [
          "Ikan Mentah Hidup Utuh",
          "Ikan Mentah Segar Dingin (Es)",
          "Gratis Bersih Sisik & Jeroan"
        ]
      : []
  };

  // Tambahkan item baru ke state (array immutability)
  setState({ links: [...state.links, newLink] });
});

// ===== AMBIL DATA (FETCH API - Pertemuan 4 Part C) =====
async function loadLinks() {
  try {
    const response = await fetch("data/links.json");
    if (!response.ok) {
      throw new Error("HTTP status " + response.status);
    }
    const links = await response.json();
    setState({ links: links, status: "ready" });
  } catch (error) {
    console.error("Gagal memuat file data/links.json:", error);
    setState({ status: "error" });
  }
}

// ===== INISIALISASI =====
const currentYearEl = document.querySelector("#current-year");
if (currentYearEl) {
  currentYearEl.textContent = new Date().getFullYear();
}

render();
loadLinks();
