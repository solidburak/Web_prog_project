// =========================================================
//  Bloom & Petal — Stage 6: JavaScript & DOM Interaction
//  Shopping cart with dynamic DOM updates
// =========================================================

const products = [
    { id: 1, name: "Red Rose Bouquet",     price: 250, icon: "fa-heart" },
    { id: 2, name: "Sunflower Arrangement",price: 180, icon: "fa-sun" },
    { id: 3, name: "Orchid Plant",         price: 320, icon: "fa-spa" },
    { id: 4, name: "Tulip Bouquet",        price: 150, icon: "fa-seedling" },
    { id: 5, name: "Mixed Spring Flowers", price: 200, icon: "fa-leaf" },
    { id: 6, name: "White Lily Bouquet",   price: 220, icon: "fa-snowflake" }
];

let cart = [];

// ----- Add a product to the cart -----
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    // Mark the product card visually
    const card = document.getElementById("card-" + productId);
    if (card) card.classList.add("in-cart");

    renderCart();

    // Open cart panel when something is added
    const panel = document.getElementById("cart-panel");
    if (!panel.classList.contains("open")) {
        panel.classList.add("open");
        panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

// ----- Remove one product line from the cart -----
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);

    const card = document.getElementById("card-" + productId);
    if (card) card.classList.remove("in-cart");

    renderCart();
}

// ----- Update quantity directly -----
function changeQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    renderCart();
}

// ----- Clear the entire cart -----
function clearCart() {
    cart = [];
    // Remove visual highlights from all cards
    products.forEach(p => {
        const card = document.getElementById("card-" + p.id);
        if (card) card.classList.remove("in-cart");
    });
    renderCart();
}

// ----- Render cart contents into the DOM -----
function renderCart() {
    const cartItemsEl  = document.getElementById("cart-items");
    const cartTotalEl  = document.getElementById("cart-total");
    const cartSummary  = document.getElementById("cart-summary");
    const cartCountEl  = document.getElementById("cart-count");

    // Total item count for badge
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalQty;

    if (cart.length === 0) {
        cartItemsEl.innerHTML =
            '<p class="empty-cart">' +
            '<i class="fa-regular fa-face-smile"></i> Your cart is empty.<br>Add some flowers!' +
            '</p>';
        cartSummary.style.display = "none";
        return;
    }

    // Build cart rows
    let html = "";
    cart.forEach(item => {
        html += `
        <div class="cart-item">
            <span class="cart-item-name">
                <i class="fa-solid ${item.icon}"></i> ${item.name}
            </span>
            <span class="cart-item-qty">
                <button class="cart-item-remove" onclick="changeQuantity(${item.id}, -1)" title="Decrease">−</button>
                &nbsp;${item.quantity}&nbsp;
                <button class="cart-item-remove" onclick="changeQuantity(${item.id},  1)" title="Increase">+</button>
            </span>
            <span class="cart-item-subtotal">${item.price * item.quantity} TL</span>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Remove">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </div>`;
    });

    cartItemsEl.innerHTML = html;

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotalEl.textContent = total + " TL";
    cartSummary.style.display = "block";
}

// ----- Toggle cart panel visibility -----
function toggleCart() {
    const panel = document.getElementById("cart-panel");
    panel.classList.toggle("open");

    if (panel.classList.contains("open")) {
        panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

// ----- Checkout -----
function checkout() {
    if (cart.length === 0) return;

    const confirmation = document.getElementById("order-confirmation");
    confirmation.style.display = "block";
    clearCart();

    const panel = document.getElementById("cart-panel");
    panel.classList.remove("open");
}

// ----- Close order confirmation overlay -----
function closeConfirmation() {
    document.getElementById("order-confirmation").style.display = "none";
}

// ----- Contact form submit (prevent reload, show success) -----
function submitForm(event) {
    event.preventDefault();
    const successMsg = document.getElementById("form-success");
    successMsg.style.display = "block";
    event.target.reset();

    setTimeout(() => {
        successMsg.style.display = "none";
    }, 5000);
}
