function createDemoObject() {
    return {
        own: {},
        prototype: {}
    };
}

// Vulnerable merge simulation
function vulnerableMerge(target, source) {
    for (const key of Object.keys(source)) {
        const value = source[key];

        if (key === "_proto_" && value && typeof value === "object") {
            Object.assign(target.prototype, value);
        } else if (
            key === "constructor" &&
            value &&
            typeof value === "object" &&
            value.prototype &&
            typeof value.prototype === "object"
        ) {
            Object.assign(target.prototype, value.prototype);
        } else if (value && typeof value === "object") {
            target.own[key] = {
                ...(target.own[key] || {}),
                ...value
            };
        } else {
            target.own[key] = value;
        }
    }

    return target;
}

function getDemoProperty(target, property) {
    if (Object.hasOwn(target.own, property)) {
        return target.own[property];
    }

    return target.prototype[property];
}

const prototypePayloads = [
    {
        id: "payload-1",
        label: "_proto_ - isAdmin",
        payload: JSON.parse('{"_proto_":{"isAdmin":true}}')
    },
    {
        id: "payload-2",
        label: "constructor.prototype - role",
        payload: JSON.parse('{"constructor":{"prototype":{"role":"admin"}}}')
    },
    {
        id: "payload-3",
        label: "_proto_ - canDelete",
        payload: JSON.parse('{"_proto_":{"canDelete":true}}')
    }
];

function runVulnerablePayload(index) {
    const selectedPayload = prototypePayloads[index];

    if (!selectedPayload) {
        return null;
    }

    const demoObject = createDemoObject();

    vulnerableMerge(demoObject, selectedPayload.payload);

    const affectedProperty = Object.keys(demoObject.prototype)[0];

    return {
        label: selectedPayload.label,
        property: affectedProperty,
        value: getDemoProperty(demoObject, affectedProperty),
        demoObject: demoObject
    };
}

if (typeof document !== "undefined") {
    const payloadButtons = document.querySelectorAll(".payload-btn");
    const result = document.getElementById("result");

    payloadButtons.forEach(button => {
        button.addEventListener("click", () => {
            const index = Number(button.dataset.index);
            const outcome = runVulnerablePayload(index);

            if (!outcome) {
                result.textContent = "Invalid payload selection.";
                return;
            }

            payloadButtons.forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            result.textContent = "Payload executed: " + outcome.label +
                " | Affected property: " + outcome.property +
                " | Value: " + outcome.value;
        });
    });
}
