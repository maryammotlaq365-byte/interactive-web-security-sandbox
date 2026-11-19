
const frame = document.getElementById("attack-frame");
const stage = document.getElementById("demo-stage");
const result = document.getElementById("result");
const status = document.getElementById("mode-status");

const vulnerableBtn = document.getElementById("vulnerable-btn");
const fixedBtn = document.getElementById("fixed-btn");
const claimBtn = document.getElementById("claim-btn");

const payloadButtons = document.querySelectorAll(".payload-btn");

let currentMode = "vulnerable";
let selectedAction = "Change Email";

// Create the hidden iframe content
function updateFrame() {
    const safeAction = JSON.stringify(selectedAction);

    frame.srcdoc = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                html, body {
                    margin: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }

                button {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    cursor: pointer;
                    border: 0;
                }
            </style>
        </head>
        <body>
            <button
                id="hidden-target"
                onclick="parent.postMessage({
                    type: 'clickjacking-demo',
                    action: ${safeAction}
                }, '*')">
            </button>
        </body>
        </html>
    `;
}

// Switch between Vulnerable and Fixed modes
function setMode(mode) {
    currentMode = mode;

    const isVulnerable = mode === "vulnerable";

    stage.classList.toggle("fixed", !isVulnerable);

    status.textContent = isVulnerable ? "VULNERABLE" : "FIXED";
    status.className = isVulnerable
        ? "status vulnerable"
        : "status fixed";

    vulnerableBtn.classList.toggle("selected", isVulnerable);
    fixedBtn.classList.toggle("selected", !isVulnerable);

    result.textContent = isVulnerable
        ? "Vulnerable mode: The hidden iframe overlay is active. Click the reward button."
        : "Fixed mode: Frame protection is simulated. Try clicking the reward button again.";
}

// Select a payload
payloadButtons.forEach(button => {
    button.addEventListener("click", () => {
        selectedAction = button.dataset.action;

        payloadButtons.forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        updateFrame();

        result.textContent = `Selected demonstration: ${selectedAction}`;
    });
});

// Activate Vulnerable mode
vulnerableBtn.addEventListener("click", () => {
    setMode("vulnerable");
});

// Activate Fixed mode
fixedBtn.addEventListener("click", () => {
    setMode("fixed");
});

// Handle the visible reward button
claimBtn.addEventListener("click", () => {
    if (currentMode === "fixed") {
        result.textContent =
            "Protected! The normal reward button was clicked. No hidden action was triggered.";
    } else {
        result.textContent =
            `Clickjacking simulated! The hidden action "${selectedAction}" was triggered instead of claiming the reward.`;
    }
});

// Receive messages from the iframe
window.addEventListener("message", event => {
    if (event.source !== frame.contentWindow) {
        return;
    }

    if (
        event.data &&
        event.data.type === "clickjacking-demo" &&
        currentMode === "vulnerable"
    ) {
        result.textContent =
            `Clickjacking simulated! The hidden action "${event.data.action}" was triggered instead of claiming the reward.`;
    }
});

// Initialize the demonstration
updateFrame();
setMode("vulnerable");
