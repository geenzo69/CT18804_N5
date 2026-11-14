const List=document.getElementById("courts-list");

window.courts.forEach(function(court) {
    let pricesText = "";
    for (let i = 0; i < court.pricing.length; i++) {
        let price = court.pricing[i];
        pricesText += price.startedAt + " - " + price.endedAt + ": " + price.price + " VND <br>";
    }
    List.innerHTML += `
        <li>
            <a class="main__navbar-info" href="/san/index.html?id=${court.id}">
                <img class="main__navbar--images" src="${court.cover}" alt="${court.name}">
                <p class="main__navbar-desc"><b>${court.name}</b></p>
                <p class="main__navbar-desc">${court.description}</p>
                <p class="main__navbar-desc">Pricing:<br>${pricesText}</p>
                <p style="text-align: center;">${court.address}</p>
                <p style="text-align: center;">Hotline: ${court.hotline}</p>
            </a>
        </li>
    `;
});