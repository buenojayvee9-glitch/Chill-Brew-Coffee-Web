// ======================
// AUTH SYSTEM (FIXED)
// ======================

// SIGNUP
function signup(e) {
    e.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim().toLowerCase();
    let password = document.getElementById("password").value.trim();

    if (localStorage.getItem(email)) {
        alert("Account already exists!");
        return;
    }

    let user = { name, email, password };
    localStorage.setItem(email, JSON.stringify(user));

    alert("Account created successfully!");
    window.location.href = "login.html";
}

// LOGIN (FIXED)
function login(e) {
    e.preventDefault();

    let email = document.getElementById("loginEmail").value.trim().toLowerCase();
    let password = document.getElementById("loginPassword").value.trim();

    let storedData = localStorage.getItem(email);

    if (!storedData) {
        alert("Account not found!");
        return;
    }

    let user = JSON.parse(storedData);

    if (user.password === password) {
        localStorage.setItem("user", email);
        alert("Login successful!");
        window.location.href = "dashboard.html";
    } else {
        alert("Incorrect password!");
    }
}

// LOGOUT
function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

// DASHBOARD DISPLAY
if (document.getElementById("userInfo")) {
    let email = localStorage.getItem("user");

    if (!email) {
        window.location.href = "login.html";
    } else {
        let user = JSON.parse(localStorage.getItem(email));
        document.getElementById("userInfo").innerText =
            "Hello, " + user.name + " (" + user.email + ")";
    }
}

// ======================
// CART SYSTEM
// ======================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ADD TO CART
function addToCart(name, price) {
    let item = cart.find(i => i.name === name);

    if (item) {
        item.qty++;
    } else {
        cart.push({ name, price, qty: 1 });
    }

    saveCart();
    displayCart();
}

// DISPLAY CART (SAFE)
function displayCart() {
    let cartList = document.getElementById("cartList");
    let totalDisplay = document.getElementById("total");

    if (!cartList || !totalDisplay) return;

    cartList.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.qty;

        let li = document.createElement("li");
        li.innerHTML = `
            ${item.name} x${item.qty} - ₱${item.price * item.qty}
            <button onclick="increaseQty(${index})">+</button>
            <button onclick="decreaseQty(${index})">-</button>
            <button onclick="removeItem(${index})">Remove</button>
        `;
        cartList.appendChild(li);
    });

    totalDisplay.innerText = total;
}

// INCREASE
function increaseQty(index) {
    cart[index].qty++;
    saveCart();
    displayCart();
}

// DECREASE
function decreaseQty(index) {
    if (cart[index].qty > 1) {
        cart[index].qty--;
    } else {
        cart.splice(index, 1);
    }
    saveCart();
    displayCart();
}

// REMOVE
function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    displayCart();
}

// SAVE CART
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// ======================
// CHECKOUT SYSTEM
// ======================

function placeOrder() {
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    let paymentElement = document.getElementById("payment");
    let payment = paymentElement ? paymentElement.value : "Cash";

    localStorage.setItem("receipt", JSON.stringify(cart));
    localStorage.setItem("payment", payment);

    // SAVE HISTORY
    let history = JSON.parse(localStorage.getItem("history")) || [];
    history.push({ items: cart, payment: payment });

    localStorage.setItem("history", JSON.stringify(history));

    localStorage.removeItem("cart");

    window.location.href = "receipt.html";
}

// ======================
// RECEIPT PAGE
// ======================

if (document.getElementById("receiptList")) {
    let receipt = JSON.parse(localStorage.getItem("receipt")) || [];
    let total = 0;

    let list = document.getElementById("receiptList");

    receipt.forEach(item => {
        let li = document.createElement("li");
        li.innerText = `${item.name} x${item.qty} = ₱${item.price * item.qty}`;
        list.appendChild(li);

        total += item.price * item.qty;
    });

    document.getElementById("receiptTotal").innerText = total;

    let payment = localStorage.getItem("payment");
    let paymentText = document.getElementById("paymentMethod");

    if (paymentText) {
        paymentText.innerText = "Payment Method: " + payment;
    }
}

// ======================
// ORDER HISTORY
// ======================

if (document.getElementById("historyList")) {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    let list = document.getElementById("historyList");

    history.forEach(order => {
        let li = document.createElement("li");

        let itemsText = order.items
            .map(i => i.name + " x" + i.qty)
            .join(", ");

        li.innerText = itemsText + " | " + order.payment;

        list.appendChild(li);
    });
}

// ======================
// AUTO LOAD CART
// ======================

if (document.getElementById("cartList")) {
    displayCart();
}