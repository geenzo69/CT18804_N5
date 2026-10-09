let bookings = [];

const courtInput = document.getElementById("court");
const dayInput = document.getElementById("day");
const monthInput = document.getElementById("month");
const yearInput = document.getElementById("year");
const hourInput = document.getElementById("hour");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const message = document.getElementById("message");
const list = document.getElementById("list");
const btnBook = document.getElementById("btnBook");

function showMessage(text, type) {
  message.textContent = text;
  message.className = type;
}

function isValidDate(day, month, year) {

  const d = new Date(year, month - 1, day);

  return (
    d.getFullYear() === year &&
    d.getMonth() === month - 1 &&
    d.getDate() === day
  );
}


function isPastDate(day, month, year) {
  const chosen = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // bỏ giờ phút, chỉ so sánh ngày
  return chosen < today;
}


function showList() {
  list.innerHTML = ""; // xóa danh sách cũ

  for (let i = 0; i < bookings.length; i++) {
    const b = bookings[i];
    const item = document.createElement("li");
    item.textContent =
      b.court + " - " + b.date + " - " + b.hour + "h - " + b.name + " (" + b.phone + ")";
    list.appendChild(item);
  }
}


function bookCourt() {

  const court = courtInput.value;
  const day = Number(dayInput.value);
  const month = Number(monthInput.value);
  const year = Number(yearInput.value);
  const hour = Number(hourInput.value);
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();


  if (!day || !month || !year) {
    showMessage("Vui lòng nhập đầy đủ ngày, tháng, năm.", "error");
    return;
  }

  if (!isValidDate(day, month, year)) {
    showMessage("Ngày không hợp lệ. Ví dụ đúng: 20 / 10 / 2026.", "error");
    return;
  }

  if (isPastDate(day, month, year)) {
    showMessage("Không thể đặt sân vào ngày này.", "error");
    return;
  }

  if (name === "") {
    showMessage("Vui lòng nhập họ tên.", "error");
    return;
  }

  if (phone.length !== 10) {
    showMessage("Số điện thoại phải có 10 chữ số.", "error");
    return;
  }


  const date = day + "/" + month + "/" + year;

  for (let i = 0; i < bookings.length; i++) {
    const b = bookings[i];
    if (b.court === court && b.date === date && b.hour === hour) {
      showMessage("Khung giờ này đã có người đặt, vui lòng chọn giờ khác.", "error");
      return;
    }
  }


  bookings.push({
    court: court,
    date: date,
    hour: hour,
    name: name,
    phone: phone
  });

  showMessage("Đặt sân thành công!", "success");
  showList();
}

btnBook.addEventListener("click", bookCourt);
