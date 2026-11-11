function update() {
    const searchQueries = new URLSearchParams(location.search);
    
    const d = courts.find((v) => v.id == searchQueries.get("id")) || courts[0];

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

    document.title = d.name;

    title.textContent = d.name;
    address.textContent = d.address;
    cover.setAttribute("src", d.cover);
    description.textContent = d.description;
    datLichButton.setAttribute("href", `/dat-lich?id=${d.id}`);
    hotline.textContent = d.hotline;
    email.textContent = d.email;
    time.textContent = `${d.pricing[0].startedAt} - ${d.pricing[d.pricing.length - 1].endedAt}`;
    
    const featuredImg = document.querySelector(".featured-img");
    const imgList = document.querySelector(".img-list");
    
    featuredImg.src = d.images[0];

    imgList.replaceChildren(...d.images.map((v) => {
        const el = document.createElement("img");
        el.loading = "lazy";
        el.src = v;
        
        return el;
    }))

    imgList.querySelectorAll("img").forEach((v) => v.addEventListener("click", (e) => {
        featuredImg.setAttribute("src", v.src);
    }));

    schedules.querySelectorAll("tr").forEach((v) => {
        if (v.querySelector("th")) return;

        v.remove();
    });


    schedules.append(...d.pricing.map((v) => {
        const el = document.createElement("tr");

        const first = document.createElement("td");
        first.textContent = `${v.startedAt} - ${v.endedAt}`;

        const tds = [
            first
        ];

        for (let i = 0; i < 15; i++) {
            tds.push(document.createElement("td"));
        }

        el.append(...tds);

        return el;
    }));
}

update()