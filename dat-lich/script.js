// ===== 1. Kiểm tra đã đăng nhập chưa =====
// Khóa "account" chứa số điện thoại nếu đã đăng nhập, ngược lại là null
const phone = localStorage.getItem("account");

// ===== 2. Lấy các phần tử trong HTML =====
const courtSelect = document.getElementById("court");
const courtInfo = document.getElementById("courtInfo");
const dayInput = document.getElementById("day");
const monthInput = document.getElementById("month");
const yearInput = document.getElementById("year");
const slotSelect = document.getElementById("slot");
const priceText = document.getElementById("price");
const message = document.getElementById("message");
const btnBook = document.getElementById("btnBook");

// Danh sách sân đọc từ courts.json
let courts = [];

// ===== 3. Các hàm nhỏ =====
function showMessage(text, type) {
  message.textContent = text;
  message.className = type;
}

// Thêm số 0 phía trước nếu nhỏ hơn 10: 5 -> "05"
function pad(n) {
  if (n < 10) {
    return "0" + n;
  }
  return String(n);
}

// Tìm sân theo id
function findCourt(id) {
  for (let i = 0; i < courts.length; i++) {
    if (courts[i].id === id) {
      return courts[i];
    }
  }
  return null;
}

// ===== 4. Đọc danh sách sân và đổ vào danh sách chọn =====
async function loadCourts() {
  const res = await fetch("/assets/data/courts.json");
  courts = await res.json();

  for (let i = 0; i < courts.length; i++) {
    const option = document.createElement("option");
    option.value = courts[i].id;
    option.textContent = courts[i].name;
    courtSelect.appendChild(option);
  }

  showCourt();
}

// Khi chọn sân: hiện thông tin sân và danh sách khung giờ của sân đó
function showCourt() {
  const court = findCourt(courtSelect.value);
  if (court === null) {
    return;
  }

  courtInfo.textContent = court.address + " - Hotline: " + court.hotline;

  slotSelect.innerHTML = "";
  for (let i = 0; i < court.pricing.length; i++) {
    const option = document.createElement("option");
    option.value = i; // slotId chính là vị trí trong mảng pricing
    option.textContent = court.pricing[i].startedAt + " - " + court.pricing[i].endedAt;
    slotSelect.appendChild(option);
  }

  showPrice();
}

// Hiện giá của khung giờ đang chọn
function showPrice() {
  const court = findCourt(courtSelect.value);
  if (court === null) {
    return;
  }
  const slot = court.pricing[Number(slotSelect.value)];
  priceText.textContent = slot.price.toLocaleString("vi-VN");
}

// ===== 5. Kiểm tra lượt đặt =====
// Duyệt các khóa bắt đầu bằng "booking:" xem sân + ngày + giờ này đã có người đặt chưa
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

// Tạo id mới = id lớn nhất hiện có + 1
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

// ===== 6. Xử lý khi bấm nút Đặt lịch =====
function bookCourt() {
  // Phải đăng nhập mới được đặt
  if (phone === null) {
    showMessage("Vui lòng đăng nhập để đặt lịch.", "error");
    return;
  }

  const court = findCourt(courtSelect.value);
  const slotId = Number(slotSelect.value);
  const day = Number(dayInput.value);
  const month = Number(monthInput.value);
  const year = Number(yearInput.value);

  if (!day || !month || !year) {
    showMessage("Vui lòng nhập đầy đủ ngày, tháng, năm.", "error");
    return;
  }

  // Ngày có tồn tại không? (ví dụ 31/02 là sai)
  const d = new Date(year, month - 1, day);
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) {
    showMessage("Ngày không hợp lệ. Ví dụ đúng: 20 / 11 / 2026.", "error");
    return;
  }

  // Không đặt ngày đã qua
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (d < today) {
    showMessage("Không thể đặt lịch vào ngày đã qua.", "error");
    return;
  }

  // Sân có hoạt động vào thứ này không? (getDay: 0 = Chủ nhật ... 6 = Thứ bảy)
  if (!court.activeDays.includes(d.getDay())) {
    showMessage("Sân này không hoạt động vào ngày đã chọn.", "error");
    return;
  }

  const date = pad(day) + "/" + pad(month) + "/" + year;

  if (isTaken(court.id, slotId, date)) {
    showMessage("Khung giờ này đã có người đặt, vui lòng chọn khung giờ khác.", "error");
    return;
  }

  // Tạo lượt đặt theo đúng cấu trúc nhóm trưởng quy định
  const booking = {
    id: nextId(),
    courtId: court.id,
    slotId: slotId,
    date: date,
    price: court.pricing[slotId].price,
    isCancelled: false,
    createdAt: Date.now()
  };

  localStorage.setItem("booking:" + booking.id, JSON.stringify(booking));
  showMessage("Đặt lịch thành công! Bạn có thể xem trong mục Lịch sử đặt.", "success");
}

// ===== 7. Gắn sự kiện và chạy =====
courtSelect.addEventListener("change", showCourt);
slotSelect.addEventListener("change", showPrice);
btnBook.addEventListener("click", bookCourt);

loadCourts();
