// B2404889 - Bùi Lê Quang Vinh
const courtsList = document.getElementById("courts-list");
const priceFormatter = new Intl.NumberFormat("vi-VN");
const courtItems = window.courts.map(function (court, index) {
    const item = document.createElement("li");
    const article = document.createElement("article");
    const link = document.createElement("a");
    const cover = document.createElement("img");
    const body = document.createElement("div");
    const name = document.createElement("h2");
    const address = document.createElement("p");
    const hours = document.createElement("p");
    const footer = document.createElement("div");
    const price = document.createElement("p");
    const action = document.createElement("span");
    const prices = court.pricing.map(function (slot) {
        return slot.price;
    });
    const minPrice = priceFormatter.format(Math.min(...prices));
    const maxPrice = priceFormatter.format(Math.max(...prices));

    item.className = "courts__item";
    article.className = "court-item";
    link.className = "court-item__link";
    link.href = "/san/index.html?id=" + court.id;
    cover.className = "court-item__cover";
    cover.src = court.cover;
    cover.alt = court.name;
    cover.width = 640;
    cover.height = 400;
    cover.loading = index < 3 ? "eager" : "lazy";
    body.className = "court-item__body";
    name.className = "court-item__name";
    name.textContent = court.name;
    address.className = "court-item__address";
    address.textContent = court.address;
    hours.className = "court-item__hours";
    hours.textContent = "Thời gian hoạt động: " + court.pricing[0].startedAt + " - " + court.pricing[court.pricing.length - 1].endedAt;
    footer.className = "court-item__footer";
    price.className = "court-item__price";
    price.textContent = (minPrice === maxPrice ? minPrice : minPrice + " - " + maxPrice) + " đ";
    action.className = "court-item__action";
    action.textContent = "Xem sân";

    footer.append(price, action);
    body.append(name, address, hours, footer);
    link.append(cover, body);
    article.append(link);
    item.append(article);

    return item;
});

courtsList.replaceChildren(...courtItems);
