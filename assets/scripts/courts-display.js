const List=document.getElementById("courts-list");
window.courts.forEach(function(court) {
    let li= document.createElement("li");
    let a = document.createElement("a");
    let img = document.createElement("img");
    let name =  document.createElement("h3");
    let description =  document.createElement("p");
    let pricing = document.createElement("p");
    let address = document.createElement("p");
    let hotline = document.createElement("p");
    a.className = "main__navbar-info";
    a.href = "/san/index.html?id=" + court.id;

    name.className="main__navbar-desc";
    name.textContent=court.name;

    img.className="main__navbar--images";
    img.src= court.cover;
    img.alt= "Court Cover";

    description.className="main__navbar-desc";
    description.textContent=court.description.slice(0, 128) + (court.description.length > 128 ? "..." : "");

    pricing.className="main__navbar-desc main__navbar-prices";

    address.style="text-align:center";
    address.textContent="Address: "+court.address;

    hotline.style="text-align:center";
    hotline.textContent="Hotline: "+court.hotline;
    let PText = "";
    for (let i = 0; i < court.pricing.length; i++) {
        let price = court.pricing[i];
        PText += price.startedAt + " - " + price.endedAt + ": " + price.price + " VND\n";
    }
    pricing.textContent=PText;
    a.appendChild(img);
    a.appendChild(name);
    a.appendChild(description);
    a.appendChild(address);
    a.appendChild(hotline);
    a.appendChild(pricing);
    li.appendChild(a);
    List.appendChild(li);
});
