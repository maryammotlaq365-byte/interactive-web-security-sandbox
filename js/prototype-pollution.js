const modeStatus = document.getElementById("mode-status");
const vulnerableBtn = document.getElementById("vulnerable-btn");
const fixedBtn = document.getElementById("fixed-btn");
const result = document.getElementById("result");
const payloadView = document.getElementById("payload-view");
const payloadButtons = document.querySelectorAll(".payload-btn");

let currentMode = "vulnerable";

const PAYLOADS = [
    {
        json: '{"__proto__": {"isAdmin": true}}',
        prop: "isAdmin",
        check: (user) => user.isAdmin === true,
        meaning: "Admin panel check"
    },
    {
        json: '{"constructor": {"prototype": {"role": "admin"}}}',
        prop: "role",
        check: (user) => user.role === "admin",
        meaning: "Role check"
    },
    {
        json: '{"__proto__": {"canDelete": true}}',
        prop: "canDelete",
        check: (user) => user.canDelete === true,
        meaning: "Delete permission check"
    }
];

/* Vulnerable merge (same code shown on the page) */
function vulnerableMerge(target, source) {
    for (const key in source) {
        if (typeof source[key] === "object" && source[key] !== null) {
            target[key] = target[key] || {};
            vulnerableMerge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

/* Fixed merge (same code shown on the page) */
function fixedMerge(target, source) {
    for (const key in source) {
        if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
        if (typeof source[key] === "object" && source[key] !== null) {
            target[key] = target[key] || {};
            fixedMerge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

/* A fresh demo class for every run, so the real Object.prototype is never the target */
function makeUserClass() {
    function User(name) {
        this.name = name;
    }
    return User;
}

function showResult(lines) {
    result.textContent = "";
    lines.forEach((line) => {
        const span = document.createElement("span");
        if (typeof line === "string") {
            span.textContent = line + "\n";
        } else {
            span.textContent = line.text + "\n";
            span.className = line.cls;
        }
        result.appendChild(span);
    });
}

function runPayload(index) {
    const payload = PAYLOADS[index];
    const merge = currentMode === "fixed" ? fixedMerge : vulnerableMerge;

    const User = makeUserClass();
    const alice = new User("alice");

    payloadView.textContent = `merge(alice.settings, JSON.parse('${payload.json}'))`;

    merge(alice, JSON.parse(payload.json));

    // "guest" never sent anything
    const guest = new User("guest");
    const passed = payload.check(guest);
    const guestValue = String(guest[payload.prop]);

    // Safety net: the real Object.prototype must stay clean
    let warning = null;
    if (Object.prototype.hasOwnProperty.call(Object.prototype, payload.prop)) {
        delete Object.prototype[payload.prop];
        warning = "Cleaned the real Object.prototype (should not happen).";
    }

    const lines = [
        "Alice sent the payload.",
        `guest never sent anything, but guest.${payload.prop} = ${guestValue}`
    ];

    if (passed) {
        lines.push({
            text: `${payload.meaning} PASSED for guest. The prototype was polluted.`,
            cls: "verdict-bad"
        });
    } else {
        lines.push({
            text: `${payload.meaning} FAILED for guest. The dangerous key was ignored.`,
            cls: "verdict-good"
        });
    }

    lines.push("Safe demo: only the simulated User class was affected.");
    if (warning) lines.push(warning);

    showResult(lines);
}

function setMode(mode) {
    currentMode = mode;
    const isVulnerable = mode === "vulnerable";

    modeStatus.textContent = isVulnerable ? "VULNERABLE" : "FIXED";
    modeStatus.className = isVulnerable ? "status vulnerable" : "status fixed";

    vulnerableBtn.classList.toggle("selected", isVulnerable);
    fixedBtn.classList.toggle("selected", !isVulnerable);

    payloadButtons.forEach((btn) => btn.classList.remove("active"));
    payloadView.textContent = "Select a payload to see the input.";

    result.textContent = isVulnerable
        ? "Vulnerable mode: the merge follows every key. Run a payload."
        : "Fixed mode: the merge skips __proto__, constructor and prototype. Run the same payload.";
}

payloadButtons.forEach((button) => {
    button.addEventListener("click", () => {
        payloadButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        runPayload(Number(button.dataset.index));
    });
});

vulnerableBtn.addEventListener("click", () => setMode("vulnerable"));
fixedBtn.addEventListener("click", () => setMode("fixed"));

setMode("vulnerable");
