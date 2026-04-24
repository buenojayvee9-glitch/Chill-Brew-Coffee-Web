let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ADD TO CART
function add(name, price) {
    let item = cart.find(i => i.name === name);
    if (item) item.qty++;
    else cart.push({ name, price, qty: 1 });

    save();
    show();
}

// DISPLAY CART WITH BUTTONS
function show() {
    let list = document.getElementById("cart");
    if (!list) return;

    list.innerHTML = "";
    let total = 0;

    cart.forEach((i, index) => {
        total += i.price * i.qty;

        list.innerHTML += `
        <li>
            ${i.name} x${i.qty} = ₱${i.price * i.qty}
            <br>
            <button onclick="increase(${index})">+</button>
            <button onclick="decrease(${index})">-</button>
            <button onclick="removeItem(${index})">Remove</button>
        </li>
        `;
    });

    document.getElementById("total").innerText = total;
}

// INCREASE
function increase(i) {
    cart[i].qty++;
    save();
    show();
}

// DECREASE
function decrease(i) {
    if (cart[i].qty > 1) {
        cart[i].qty--;
    } else {
        cart.splice(i, 1);
    }
    save();
    show();
}

// REMOVE
function removeItem(i) {
    cart.splice(i, 1);
    save();
    show();
}

// SAVE CART
function save() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// CHECKOUT + LOYALTY POINTS
function checkout() {
    if (cart.length === 0) {
        alert("Cart empty");
        return;
    }

    let type = document.querySelector('input[name="type"]:checked').value;
    let address = "", desc = "";

    if (type === "delivery") {
        address = document.getElementById("address").value;
        desc = document.getElementById("desc").value;

        if (!address || !desc) {
            alert("Fill delivery info");
            return;
        }
    }

    let total = cart.reduce((a, b) => a + b.price * b.qty, 0);

    // LOYALTY POINTS (1 point per ₱50)
    let email = localStorage.getItem("currentUser");
    if (email) {
        let user = JSON.parse(localStorage.getItem(email));
        if (user) {
            let earned = Math.floor(total / 50);
            user.points = (user.points || 0) + earned;
            localStorage.setItem(email, JSON.stringify(user));

            alert("You earned " + earned + " loyalty points!");
        }
    }

    let receipt = { cart, type, address, desc, total };

    localStorage.setItem("receipt", JSON.stringify(receipt));
    localStorage.removeItem("cart");

    alert("Please proceed to the cashier");
    location.href = "receipt.html";
}

// RECEIPT PAGE
if (document.getElementById("items")) {
    let r = JSON.parse(localStorage.getItem("receipt"));

    let total = 0;

    r.cart.forEach(i => {
        document.getElementById("items").innerHTML +=
            `<li>${i.name} x${i.qty}</li>`;
        total += i.price * i.qty;
    });

    document.getElementById("total").innerText = total;

    document.getElementById("info").innerText =
        r.type === "delivery"
            ? "Delivery to: " + r.address + " (" + r.desc + ")"
            : "Takeout Order";
}

// AUTO LOAD
show();
