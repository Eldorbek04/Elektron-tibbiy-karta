// Yorliqlarni (Tabs) boshqarish funksiyasi
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');

            // Barcha yorliqlarni nofaol (deactivate) qilish
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Barcha kontentni yashirish
            tabContents.forEach(content => content.classList.remove('active'));

            // Tanlangan yorliq va kontentni faollashtirish
            button.classList.add('active');
            document.querySelector(`.tab-content[data-content="${tabName}"]`).classList.add('active');
        });
    });

    // Sahifa yuklanganda "Login" yorlig'ini faol qilish (Agar HTML da bo'lmasa)
    // document.querySelector('.tab-button[data-tab="login"]').click();
}

// Parolni ko'rinishini almashtirish funksiyasi
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleButton = document.querySelector('.password-toggle');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.innerHTML = '&#128064;'; // Ko'z ustiga chiziq belgisi
    } else {
        passwordInput.type = 'password';
        toggleButton.innerHTML = '&#128065;'; // Oddiy ko'z belgisi
    }
}

// Sahifa yuklanganda barcha funksiyalarni ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
});

// JavaScript funksiyasini HTML dan chaqirish uchun global qilib qo'yish
window.togglePasswordVisibility = togglePasswordVisibility;