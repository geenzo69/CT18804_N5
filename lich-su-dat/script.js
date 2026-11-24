// B2408815 - Trần Cẩm Sơn
// ============================================================
// Lịch sử đặt sân - script.js
//
// Quy ước localStorage (theo Quy_ước_chung):
//   - Từng booking : key "booking:<id>" → JSON.stringify(Booking)
//
// Cấu trúc Booking:
// {
//   id          : string
//   courtId     : string         ← Court.id trong window.courts
//   slotId      : number         ← index trong Court.pricing
//   date        : string         ← "dd/MM/yyyy"
//   price       : number
//   isCancelled : boolean
//   createdAt   : number         ← timestamp mili giây
// }
// ============================================================

// ---------- Hằng số ----------
const PAGE_SIZE = 8;

const STATUS_LABEL = {
  upcoming:  "Sắp tới",
  done:      "Đã hoàn thành",
  cancelled: "Đã hủy",
};

// ---------- Chuẩn hóa ngày dd/MM/yyyy thành YYYY-MM-DD để so sánh chuỗi ----------
function toComparableDate(ddMMYYYY) {
  const parts = ddMMYYYY.split("/");
  const d = parts[0].padStart(2, "0");
  const m = parts[1].padStart(2, "0");
  const y = parts[2];
  return `${y}-${m}-${d}`;
}

// ---------- Lấy ngày hôm nay theo giờ local (tránh lệch múi giờ UTC) ----------
function getTodayLocal() {
  const d    = new Date();
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  const dd   = String(d.getDate()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy}`;
}

// ---------- Đọc tất cả booking từ localStorage ----------
function getAllBookings() {
  const result = [];
  const keys = Object.keys(localStorage);
  keys.forEach(function (key) {
    if (key.startsWith("booking:")) {
      const item = localStorage.getItem(key);
      if (item) {
        result.push(JSON.parse(item));
      }
    }
  });
  return result;
}

// ---------- Lưu một booking ----------
function saveBooking(booking) {
  localStorage.setItem("booking:" + booking.id, JSON.stringify(booking));
}

// ---------- Xác định trạng thái hiển thị của booking ----------
function getStatus(booking) {
  if (booking.isCancelled) return "cancelled";
  const today = getTodayLocal();
  return toComparableDate(booking.date) >= toComparableDate(today) ? "upcoming" : "done";
}

// ---------- Tìm thông tin sân và slot từ window.courts ----------
function resolveCourt(courtId, slotId) {
  const courts = window.courts;
  const court  = courts.find(function (c) {
    return parseInt(c.id, 10) === parseInt(courtId, 10);
  });
  const slot = court.pricing[slotId];
  return { court: court, slot: slot };
}

// ---------- Format ----------
function formatPrice(n) {
  return n.toLocaleString("vi-VN") + "đ";
}

function formatTime(slot) {
  return slot.startedAt + " – " + slot.endedAt;
}

// ---------- Trạng thái bộ lọc & phân trang ----------
let currentPage = 1;
let filtered    = [];

// ---------- Áp dụng bộ lọc ----------
function applyFilters() {
  const searchVal = document.getElementById("search").value.trim().toLowerCase();
  const statusVal = document.getElementById("filter-status").value;
  const dateVal   = document.getElementById("filter-date").value;

  const all = getAllBookings();

  filtered = all.filter(function (b) {
    const info      = resolveCourt(b.courtId, b.slotId);
    const courtName = info.court.name.toLowerCase();

    // Tìm theo mã đặt hoặc tên sân
    if (searchVal &&
        !String(b.id).toLowerCase().includes(searchVal) &&
        !courtName.includes(searchVal)) {
      return false;
    }

    // Lọc theo trạng thái
    const status = getStatus(b);
    if (statusVal !== "all" && status !== statusVal) return false;

    // Lọc theo ngày
    if (dateVal) {
      if (toComparableDate(b.date) !== dateVal) return false;
    }

    return true;
  });

  // Sắp xếp:
  // 1. Sắp tới (upcoming) lên đầu, tăng dần theo ngày (gần nhất trước). Nếu cùng ngày thì slot sớm hơn lên trước
  // 2. Đã qua (done/cancelled) xuống dưới, giảm dần theo ngày (mới nhất trước). Nếu cùng ngày thì đặt sau lên trước
  filtered.sort(function (a, b) {
    const aStatus    = getStatus(a);
    const bStatus    = getStatus(b);
    const aUpcoming  = aStatus === "upcoming";
    const bUpcoming  = bStatus === "upcoming";

    if (aUpcoming && !bUpcoming) return -1;
    if (!aUpcoming && bUpcoming) return 1;

    const aComp = toComparableDate(a.date);
    const bComp = toComparableDate(b.date);

    if (aUpcoming && bUpcoming) {
      if (aComp !== bComp) return aComp < bComp ? -1 : 1;
      return a.slotId - b.slotId;
    }
    if (aComp !== bComp) return aComp > bComp ? -1 : 1;
    return b.createdAt - a.createdAt;
  });

  currentPage = 1;
  renderStats(all);
  renderList();
  renderPagination();
}

// ---------- Thống kê ----------
function renderStats(all) {
  document.getElementById("stat-total").textContent = all.length;

  document.getElementById("stat-upcoming").textContent = all.filter(function (b) {
    return getStatus(b) === "upcoming";
  }).length;

  document.getElementById("stat-done").textContent = all.filter(function (b) {
    return getStatus(b) === "done";
  }).length;

  const totalMoney = all
    .filter(function (b) { return !b.isCancelled; })
    .reduce(function (sum, b) { return sum + b.price; }, 0);

  document.getElementById("stat-money").textContent = formatPrice(totalMoney);
}

// ---------- Helper: tạo ô có data-label ----------
function makeCell(label, content) {
  const div = document.createElement("div");
  if (label) div.setAttribute("data-label", label);
  if (typeof content === "string") {
    div.textContent = content;
  } else {
    div.appendChild(content);
  }
  return div;
}

// ---------- Render danh sách ----------
function renderList() {
  const list     = document.getElementById("booking-list");
  const emptyMsg = document.getElementById("empty-msg");

  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  const start = (currentPage - 1) * PAGE_SIZE;
  const page  = filtered.slice(start, start + PAGE_SIZE);

  if (page.length === 0) {
    emptyMsg.hidden = false;
    return;
  }
  emptyMsg.hidden = true;

  page.forEach(function (b) {
    const info   = resolveCourt(b.courtId, b.slotId);
    const court  = info.court;
    const slot   = info.slot;
    const status = getStatus(b);

    const todayComp  = toComparableDate(getTodayLocal());
    const canCancel  = !b.isCancelled && toComparableDate(b.date) > todayComp;

    const row = document.createElement("div");
    row.className = "row";

    // Cột: Mã đặt
    row.appendChild(makeCell("Mã đặt", b.id));

    // Cột: Sân
    const courtDiv  = document.createElement("div");
    courtDiv.setAttribute("data-label", "Sân");
    courtDiv.className = "court-name";
    const courtName = document.createElement("span");
    courtName.textContent = court.name;
    const courtAddr = document.createElement("small");
    courtAddr.textContent = court.address;
    courtDiv.appendChild(courtName);
    courtDiv.appendChild(courtAddr);
    row.appendChild(courtDiv);

    // Cột: Ngày
    row.appendChild(makeCell("Ngày", b.date));

    // Cột: Giờ
    row.appendChild(makeCell("Giờ", formatTime(slot)));

    // Cột: Giá
    row.appendChild(makeCell("Giá", formatPrice(b.price)));

    // Cột: Trạng thái
    const statusDiv = document.createElement("div");
    statusDiv.setAttribute("data-label", "Trạng thái");
    const badge = document.createElement("span");
    badge.className = "badge badge-" + status;
    badge.textContent = STATUS_LABEL[status];
    statusDiv.appendChild(badge);
    row.appendChild(statusDiv);

    // Cột: Thao tác
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "actions";

    const btnDetail = document.createElement("button");
    btnDetail.type = "button";
    btnDetail.className = "btn-detail";
    btnDetail.textContent = "Chi tiết";
    btnDetail.addEventListener("click", function () { openDetail(b.id); });
    actionsDiv.appendChild(btnDetail);

    if (canCancel) {
      const btnCancel = document.createElement("button");
      btnCancel.type = "button";
      btnCancel.className = "btn-cancel";
      btnCancel.textContent = "Hủy";
      btnCancel.addEventListener("click", function () { cancelBooking(b.id); });
      actionsDiv.appendChild(btnCancel);
    }

    row.appendChild(actionsDiv);
    list.appendChild(row);
  });
}

// ---------- Phân trang ----------
function renderPagination() {
  const container  = document.getElementById("pagination");
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  if (totalPages <= 1) return;

  function addBtn(label, page, isCurrent) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = label;
    if (isCurrent) btn.classList.add("current");
    btn.disabled = isCurrent;
    btn.addEventListener("click", function () {
      currentPage = page;
      renderList();
      renderPagination();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    container.appendChild(btn);
  }

  if (currentPage > 1) addBtn("‹", currentPage - 1, false);
  for (let i = 1; i <= totalPages; i++) {
    addBtn(i, i, i === currentPage);
  }
  if (currentPage < totalPages) addBtn("›", currentPage + 1, false);
}

// ---------- Hộp thoại chi tiết ----------
function openDetail(bookingId) {
  const all = getAllBookings();
  const b   = all.find(function (x) { return String(x.id) === String(bookingId); });
  if (!b) return;

  const info   = resolveCourt(b.courtId, b.slotId);
  const court  = info.court;
  const slot   = info.slot;
  const status = getStatus(b);

  document.getElementById("detail-id").textContent = b.id;

  const body = document.getElementById("detail-body");
  while (body.firstChild) {
    body.removeChild(body.firstChild);
  }

  function addRow(label, value) {
    const dt = document.createElement("dt");
    dt.textContent = label;
    body.appendChild(dt);

    const dd = document.createElement("dd");
    if (value instanceof Node) {
      dd.appendChild(value);
    } else {
      dd.textContent = value;
    }
    body.appendChild(dd);
  }

  addRow("Sân",        court.name);
  addRow("Địa chỉ",   court.address);
  addRow("Hotline",   court.hotline);
  addRow("Ngày",      b.date);
  addRow("Khung giờ", formatTime(slot));
  addRow("Giá",       formatPrice(b.price));

  const badgeEl = document.createElement("span");
  badgeEl.className = "badge badge-" + status;
  badgeEl.textContent = STATUS_LABEL[status];
  addRow("Trạng thái", badgeEl);

  addRow("Đặt lúc", new Date(b.createdAt).toLocaleString("vi-VN"));

  document.getElementById("detail-dialog").showModal();
}

// ---------- Hủy đặt sân ----------
function cancelBooking(bookingId) {
  if (!confirm("Bạn có chắc muốn hủy lượt đặt " + bookingId + "?")) return;

  const all = getAllBookings();
  const b   = all.find(function (x) { return String(x.id) === String(bookingId); });
  if (!b) return;

  b.isCancelled = true;
  saveBooking(b);
  applyFilters();
}

// ---------- Khởi động ----------
function init() {
  document.getElementById("search").addEventListener("input", applyFilters);
  document.getElementById("filter-status").addEventListener("change", applyFilters);
  document.getElementById("filter-date").addEventListener("change", applyFilters);
  document.getElementById("btn-reset").addEventListener("click", function () {
    document.getElementById("search").value = "";
    document.getElementById("filter-status").value = "all";
    document.getElementById("filter-date").value = "";
    applyFilters();
  });

  document.getElementById("btn-close").addEventListener("click", function () {
    document.getElementById("detail-dialog").close();
  });

  document.getElementById("detail-dialog").addEventListener("click", function (e) {
    if (e.target === e.currentTarget) e.currentTarget.close();
  });

  applyFilters();
}

// Chờ DOM sẵn sàng
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
