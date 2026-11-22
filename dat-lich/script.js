
const form = document.getElementById("bookingForm");
const courtSelect = document.getElementById("court");
const courtInfo = document.getElementById("courtInfo");
const dayInput = document.getElementById("day");
const monthInput = document.getElementById("month");
const yearInput = document.getElementById("year");
const slotSelect = document.getElementById("slot");
const priceText = document.getElementById("price");
const message = document.getElementById("message");

function showMessage(text, type) {
  message.textContent = text;
  message.className = type;
}

function pad(n) {
  if (n < 10) {
    return "0" + n;
  }
  return String(n);
}

function renderCourts() {
  for (let i = 0; i < courts.length; i++) {
    const option = document.createElement("option");
    option.value = courts[i].id;
    option.textContent = courts[i].name;
    option.dataset.id = courts[i].id;
    option.dataset.address = courts[i].address;
    option.dataset.hotline = courts[i].hotline;
    option.dataset.activeDays = courts[i].activeDays.join(",");
    courtSelect.appendChild(option);
  }
}

function renderSlots() {
  const court = courts[courtSelect.selectedIndex];
  const courtOption = courtSelect.options[courtSelect.selectedIndex];

  courtInfo.textContent = courtOption.dataset.address + " - Hotline: " + courtOption.dataset.hotline;

  slotSelect.innerHTML = "";
  for (let i = 0; i < court.pricing.length; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = court.pricing[i].startedAt + " - " + court.pricing[i].endedAt;
    option.dataset.slotId = i; // slotId là vị trí trong mảng pricing
    option.dataset.price = court.pricing[i].price;
    slotSelect.appendChild(option);
  }

  const searchQueries = new URLSearchParams(location.search);

  courtSelect.value = searchQueries.get("id") || "001";

  showPrice();
}

function showPrice() {
  const slotOption = slotSelect.options[slotSelect.selectedIndex];
  priceText.textContent = Number(slotOption.dataset.price).toLocaleString("vi-VN");
}

function isTaken(courtId, slotId, date) {
  const keys = Object.keys(localStorage);
  for (let i = 0; i < keys.length; i++) {
    if (keys[i].startsWith("booking:")) {
      const b = JSON.parse(localStorage.getItem(keys[i]));
      if (b.courtId === courtId && b.slotId === slotId && b.date === date && !b.isCancelled) {
        return true;
      }
    }
  }
  return false;
}

function nextId() {
  let max = -1;
  const keys = Object.keys(localStorage);
  for (let i = 0; i < keys.length; i++) {
    if (keys[i].startsWith("booking:")) {
      const id = Number(keys[i].split(":")[1]);
      if (id > max) {
        max = id;
      }
    }
  }
  return String(max + 1);
}

function bookCourt() {
 
  const phone = localStorage.getItem("account");
  if (!phone) {
    showMessage("Vui lòng đăng nhập để đặt lịch.", "error");
    return;
  }

  const courtOption = courtSelect.options[courtSelect.selectedIndex];
  const slotOption = slotSelect.options[slotSelect.selectedIndex];

  const courtId = courtOption.dataset.id;
  const activeDays = courtOption.dataset.activeDays.split(",").map(Number);
  const slotId = Number(slotOption.dataset.slotId);
  const price = Number(slotOption.dataset.price);

  const day = Number(dayInput.value);
  const month = Number(monthInput.value);
  const year = Number(yearInput.value);

  const d = new Date(year, month - 1, day);
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) {
    showMessage("Ngày không hợp lệ. Ví dụ đúng: 20 / 11 / 2026.", "error");
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (d < today) {
    showMessage("Không thể đặt lịch vào ngày đã qua.", "error");
    return;
  }

  let weekday = d.getDay() + 1;
  if (weekday === 1) {
    weekday = 8;
  }
  if (!activeDays.includes(weekday)) {
    showMessage("Sân này không hoạt động vào ngày đã chọn.", "error");
    return;
  }

  const date = pad(day) + "/" + pad(month) + "/" + year;

  if (isTaken(courtId, slotId, date)) {
    showMessage("Khung giờ này đã có người đặt, vui lòng chọn khung giờ khác.", "error");
    return;
  }

  const booking = {
    id: nextId(),
    courtId: courtId,
    slotId: slotId,
    date: date,
    price: price,
    isCancelled: false,
    createdAt: Date.now()
  };

  localStorage.setItem("booking:" + booking.id, JSON.stringify(booking));
  showMessage("Đặt lịch thành công! Bạn có thể xem trong mục Lịch sử đặt.", "success");
}

courtSelect.addEventListener("change", renderSlots);
slotSelect.addEventListener("change", showPrice);
form.addEventListener("submit", function (e) {
  e.preventDefault(); // không cho trang tải lại
  bookCourt();
});

if (typeof courts === "undefined") {
  showMessage("Không tải được dữ liệu sân.", "error");
} else {
  renderCourts();
  renderSlots();
}
