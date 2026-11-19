// Highlight the current navigation section
const navLinks = document.querySelectorAll('.navbar nav a');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.forEach(item => item.classList.remove('active'));
        link.classList.add('active');
    });
});

// Log that the website is ready
console.log("Web Security Sandbox is ready!");
