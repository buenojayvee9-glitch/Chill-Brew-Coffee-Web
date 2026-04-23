let cart = JSON.parse(localStorage.getItem("cart")) || [];

function add(name, price) {
    let item = cart.find(i => i.name === name);
    if (item) item.qty++;
    else cart.push({ name, price, qty: 1 });
    save();
    show();
}

function show() {
    let list = document.getElementById("cart");
    if (!list) return;

    list.innerHTML = "";
    let total = 0;

    cart.forEach(i => {
        total += i.price * i.qty;
        list.innerHTML += `<li>${i.name} x${i.qty}</li>`;
    });

    document.getElementById("total").innerText = total;
}

function save() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// SIGNUP
function signup(e) {
    e.preventDefault();

    let user = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        points: 0
    };

    localStorage.setItem(user.email, JSON.stringify(user));
    alert("Account created!");
    location.href = "login.html";
}

// LOGIN
function login(e) {
    e.preventDefault();

    let email = document.getElementById("loginEmail").value;
    let pass = document.getElementById("loginPassword").value;

    let user = JSON.parse(localStorage.getItem(email));

    if (user && user.password === pass) {
        localStorage.setItem("currentUser", email);
        alert("Login success");
        location.href = "menu.html";
    } else {
        alert("Invalid login");
    }
}

// CHECKOUT
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

    let receipt = { cart, type, address, desc, total };

    localStorage.setItem("receipt", JSON.stringify(receipt));
    localStorage.removeItem("cart");

    alert("Please proceed to the cashier");
    location.href = "receipt.html";
}

// RECEIPT
if (document.getElementById("items")) {
    let r = JSON.parse(localStorage.getItem("receipt"));

    r.cart.forEach(i => {
        document.getElementById("items").innerHTML += `<li>${i.name} x${i.qty}</li>`;
    });

    document.getElementById("total").innerText = r.total;

    document.getElementById("info").innerText =
        r.type === "delivery"
            ? "Delivery to: " + r.address + " (" + r.desc + ")"
            : "Takeout Order";
}

show();
