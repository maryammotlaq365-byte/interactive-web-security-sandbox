const PRICE = 100;

let cartQuantity = 0;
let isFixed = false;

const quantityInput = document.getElementById("quantity");
const addToCartButton = document.getElementById("addToCart");
const vulnerableModeButton = document.getElementById("vulnerableMode");
const fixedModeButton = document.getElementById("fixedMode");
const modeStatus = document.getElementById("modeStatus");
const cartQuantityDisplay = document.getElementById("cartQuantity");
const totalDisplay = document.getElementById("total");
const messageDisplay = document.getElementById("message");
const resetCartButton = document.getElementById("resetCart");
const payloadButtons = document.querySelectorAll(".payload");

function updateCart() {
    cartQuantityDisplay.textContent = cartQuantity;
    totalDisplay.textContent = cartQuantity * PRICE;
}

function addToCart() {
    const inputValue = quantityInput.value.trim();
    const quantity = Number(inputValue);

    if (inputValue === "" || !Number.isInteger(quantity)) {
        messageDisplay.textContent = "Invalid quantity. Enter a whole number.";
        return;
    }

    if (isFixed && quantity <= 0) {
        messageDisplay.textContent = "Blocked: Quantity must be greater than zero!";
        return;
    }

    if (!isFixed && quantity === 0) {
        messageDisplay.textContent = "Quantity cannot be zero.";
        return;
    }

    cartQuantity += quantity;
    updateCart();

    if (isFixed) {
        messageDisplay.textContent = "Product added safely.";
    } else if (cartQuantity < 0) {
        messageDisplay.textContent =
            `Exploited! The total is negative: the store now owes you $${Math.abs(cartQuantity * PRICE)}.`;
    } else {
        messageDisplay.textContent = "Product added in Vulnerable Mode.";
    }
}

function setMode(fixed) {
    isFixed = fixed;
    cartQuantity = 0;
    updateCart();

    modeStatus.textContent = fixed
        ? "Current Mode: Fixed"
        : "Current Mode: Vulnerable";
    modeStatus.className = fixed ? "status fixed" : "status vulnerable";

    vulnerableModeButton.classList.toggle("selected", !fixed);
    fixedModeButton.classList.toggle("selected", fixed);

    messageDisplay.textContent = fixed
        ? "Security validation is enabled."
        : "Warning: Negative quantities are accepted.";

    quantityInput.value = 1;
}

function resetCart() {
    cartQuantity = 0;
    updateCart();
    messageDisplay.textContent = "Cart has been reset.";
}

addToCartButton.addEventListener("click", addToCart);

vulnerableModeButton.addEventListener("click", () => setMode(false));
fixedModeButton.addEventListener("click", () => setMode(true));

resetCartButton.addEventListener("click", resetCart);

payloadButtons.forEach((button) => {
    button.addEventListener("click", () => {
        payloadButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");

        quantityInput.value = button.dataset.value;
        addToCart();
    });
});

updateCart();
