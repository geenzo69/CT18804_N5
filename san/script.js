// B2504801 - Hoàng Tuấn Kiệt
// Tạo đối tượng URLSearchParams để đơn giản hoá việc lấy id
const searchQueries = new URLSearchParams(location.search);

// Tìm kiếm sân dựa trên id
const d = courts.find((v) => v.id == searchQueries.get("id")) || courts[0];

// Chọn các phần tử trong trang
const title = document.getElementById("title");
const address = document.getElementById("address");
const cover = document.getElementById("cover");
const description = document.getElementById("description");
const datLichButton = document.getElementById("datlich-btn");
const hotline = document.getElementById("hotline");
const email = document.getElementById("email");
const images = document.getElementById("images");
const time = document.getElementById("time");
const schedules = document.getElementById("schedules");

// Đặt các giá trị vô
document.title = d.name;

title.textContent = d.name;
address.textContent = d.address;
cover.setAttribute("src", d.cover);
description.textContent = d.description;
datLichButton.setAttribute("href", `/dat-lich?id=${d.id}`);
hotline.textContent = d.hotline;
email.textContent = d.email;
time.textContent = `${d.pricing[0].startedAt} - ${d.pricing[d.pricing.length - 1].endedAt}`;

const featuredImg = document.querySelector(".container__featured-img img");
const imgList = document.querySelector(".container__img-list");

featuredImg.src = d.images[0];

imgList.replaceChildren(...d.images.map((v) => {
    const el = document.createElement("img");
    el.loading = "lazy";
    el.src = v;
    
    return el;
}))

// Thêm event listener để chọn hình ảnh
imgList.querySelectorAll("img").forEach((v) => v.addEventListener("click", (e) => {
    featuredImg.setAttribute("src", v.src);
}));

// Thêm event listener cho việc xem hình ảnh ở mobile
const featuredImgPrevBtn = document.querySelector(".container__featured-img-btn-prev");
const featuredImgNextBtn = document.querySelector(".container__featured-img-btn-next");

featuredImgNextBtn.addEventListener("click", () => {
    const images = document.querySelectorAll(".container__img-list img");
    const arr = [...images];

    const current = arr.findIndex((v) => v.getAttribute("src").includes(featuredImg.getAttribute("src")));

    featuredImg.setAttribute("src", current != -1 && current < arr.length - 1 ? arr[current + 1].getAttribute("src") : featuredImg.getAttribute("src"))
});

featuredImgPrevBtn.addEventListener("click", () => {
    const images = document.querySelectorAll(".container__img-list img");
    const arr = [...images];

    const current = arr.findIndex((v) => v.getAttribute("src").includes(featuredImg.getAttribute("src")));

    featuredImg.setAttribute("src", current ? arr[current - 1].getAttribute("src") : featuredImg.getAttribute("src"))
});

// Xoá hết các hàng được thêm trước
schedules.querySelectorAll("tr").forEach((v) => {
    if (v.querySelector("th")) return;

    v.remove();
});

const bookings = Object.keys(localStorage).filter((v) => v.startsWith("booking:")).map((v) => {
    const booking = localStorage.getItem(v);

    const data = JSON.parse(booking);

    return data;
});

function get14Days() {
    const date = new Date();

    const output = [];

    output.push(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`);

    for (let i = 0; i < 13; i++) {
        date.setDate(date.getDate() + 1);
        output.push(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`);
    }

    return output;
}

const courtBookings = bookings.filter((v) => v.courtId == d.id);

const date = new Date();
const schedulesHeaders = [...schedules.querySelectorAll("th")];
schedulesHeaders.forEach((v) => {
    if (!v.textContent) return;

    v.textContent = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    date.setDate(date.getDate() + 1);
});

// Thêm các hàng dựa trên thông tin của sân
schedules.append(...d.pricing.map((v, pricingIndex) => {
    const el = document.createElement("tr");

    const first = document.createElement("td");
    first.textContent = `${v.startedAt} - ${v.endedAt}`;

    const tds = [first];

    for (let i = 0; i < 14; i++) {
        const td = document.createElement("td");

        if (courtBookings.find((booking) => schedulesHeaders[i + 1].textContent == booking.date && booking.slotId == pricingIndex && !booking.isCancelled)) {
            td.textContent = "X";
        }

        tds.push(td);
    }

    el.append(...tds);

    return el;
}));