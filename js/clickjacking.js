const frame = document.getElementById("attack-frame");
const stage = document.getElementById("demo-stage");
const result = document.getElementById("result");
const modeStatus = document.getElementById("mode-status");

const vulnerableBtn = document.getElementById("vulnerable-btn");
const fixedBtn = document.getElementById("fixed-btn");
const claimBtn = document.getElementById("claim-btn");

const payloadButtons = document.querySelectorAll(".payload-btn");

let currentMode = "vulnerable";
let selectedAction = "Change Email";

// Build the invisible "target" page that sits on top of the reward button
function updateFrame() {
    const safeAction = JSON.stringify(selectedAction).replace(/</g, "\\u003c");

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
            <button id="hidden-target" aria-hidden="true" tabindex="-1"></button>
            <script>
                document.getElementById("hidden-target").addEventListener("click", function () {
                    parent.postMessage({
                        type: "clickjacking-demo",
                        action: ${safeAction}
                    }, "*");
                });
            <\/script>
        </body>
        </html>
    `;
}

// Switch between Vulnerable and Fixed modes
function setMode(mode) {
    currentMode = mode;
    const isVulnerable = mode === "vulnerable";

    // In Fixed mode the frame is blocked (CSS hides it), like frame-ancestors 'none'
    stage.classList.toggle("fixed", !isVulnerable);

    modeStatus.textContent = isVulnerable ? "VULNERABLE" : "FIXED";
    modeStatus.className = isVulnerable ? "status vulnerable" : "status fixed";

    vulnerableBtn.classList.toggle("selected", isVulnerable);
    fixedBtn.classList.toggle("selected", !isVulnerable);

    result.textContent = isVulnerable
        ? "Vulnerable mode: the invisible frame is on top of the reward button. Click it."
        : "Fixed mode: the browser refuses to load the page in a frame (simulated). Click the reward button.";
}

// Select a payload
payloadButtons.forEach(button => {
    button.addEventListener("click", () => {
        selectedAction = button.dataset.action;
        payloadButtons.forEach(item => item.classList.remove("active"));
        button.classList.add("active");
        updateFrame();
        result.textContent = `Selected payload: ${selectedAction}`;
    });
});

vulnerableBtn.addEventListener("click", () => setMode("vulnerable"));
fixedBtn.addEventListener("click", () => setMode("fixed"));

// Visible reward button (only reachable in Fixed mode, or by keyboard)
claimBtn.addEventListener("click", () => {
    if (currentMode === "fixed") {
        result.textContent =
            "Blocked! The frame was refused, so only the reward button was clicked. No hidden action ran.";
    } else {
        result.textContent =
            `Clickjacking simulated! The hidden action "${selectedAction}" was triggered instead of claiming the reward.`;
    }
});

// Message coming from the hidden frame
window.addEventListener("message", event => {
    if (event.source !== frame.contentWindow) return;

    if (
        event.data &&
        event.data.type === "clickjacking-demo" &&
        currentMode === "vulnerable"
    ) {
        result.textContent =
            `Clickjacking simulated! The hidden action "${event.data.action}" was triggered instead of claiming the reward.`;
    }
});

updateFrame();
setMode("vulnerable");
