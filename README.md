# interactive-web-security-sandbox
Interactive Web Security Sandbox - Final Project

## About the Project

Interactive Web Security Sandbox is an educational web project designed to help users understand common web security vulnerabilities through interactive demonstrations.

The project explains how vulnerabilities work, demonstrates their potential impact in a simulated environment, and shows how security measures can prevent vulnerable behavior.

Users can switch between Vulnerable and Fixed modes to compare the behavior of the application and understand the importance of secure coding practices.

## Security Labs

### 1. Clickjacking
Demonstrates how an attacker can trick users into clicking hidden or misleading elements through iframe-based UI manipulation.

- **Vulnerable Mode:** Simulates a hidden iframe receiving a user's click instead of the visible reward button.
- **Fixed Mode:** Simulates protection by disabling the hidden iframe interaction.
- **Security Fix:** Use HTTP security headers such as `Content-Security-Policy` with `frame-ancestors` or `X-Frame-Options`.

### 2. Negative Quantity
Demonstrates a business logic vulnerability caused by insufficient validation of product quantities.

- **Vulnerable Mode:** Accepts negative quantities, which can result in unexpected cart totals.
- **Fixed Mode:** Rejects zero and negative quantities.
- **Security Fix:** Validate input quantities and enforce business rules before processing transactions.

### 3. Prototype Pollution
Demonstrates how unsafe object merging with user-controlled input can affect prototype-related properties and cause unexpected inheritance.

- **Vulnerable Mode:** Simulates prototype pollution through unsafe object merging.
- **Fixed Mode:** Ignores dangerous keys such as `__proto__`, `constructor`, and `prototype`.
- **Security Fix:** Use safe object-handling and merging techniques, validate input, and prevent unsafe modification of prototypes.

## Technologies Used

- HTML5
- CSS3
- JavaScript

## Project Structure

```text
interactive-web-security-sandbox/
│
├── index.html
├── README.md
│
├── css/
│   └── style.css
│
├── js/
│   ├── clickjacking.js
│   ├── negative-quantity.js
│   └── prototype-pollution.js
│
└── labs/
    ├── clickjacking/
    │   └── index.html
    │
    ├── negative-quantity/
    │   └── index.html
    │
    └── prototype-pollution/
        └── index.html
```

## How to Run

1. Clone or download the repository.
2. Navigate to the project directory.
3. Start a local web server:

```bash
python3 -m http.server 8000
```

4. Open the following URL in your browser:

```text
http://localhost:8000
```

5. Navigate to the desired security lab and start experimenting.

## How to Use the Labs

1. Open a security lab from the home page.
2. Explore the vulnerability explanation and vulnerable code.
3. Select Vulnerable Mode.
4. Test the provided payloads or inputs.
5. Observe the simulated vulnerability and its impact.
6. Switch to Fixed Mode.
7. Repeat the same test and compare the results.

## Project Objectives

- Understand common web security vulnerabilities.
- Explore vulnerable code and unsafe behavior.
- Demonstrate the potential impact of security flaws.
- Learn basic secure coding and mitigation techniques.
- Practice security testing through interactive simulations.

## Disclaimer

This project is intended for educational purposes only.

All vulnerability demonstrations are simulated in a controlled frontend environment. They do not exploit real websites, perform real financial transactions, or modify external systems.

The Fixed modes demonstrate security concepts and simulated protections. Real-world security controls must be properly implemented and enforced by the application and server.

## Team Project

Interactive Web Security Sandbox — Educational Web Security Project.
