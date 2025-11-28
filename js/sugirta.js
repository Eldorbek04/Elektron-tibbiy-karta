// 1. Yorliqlarni (Tabs) boshqarish funksiyasi
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tabs-container .tab-button');
    const tabContents = document.querySelectorAll('.coverage-section .tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');

            // Barcha yorliqlarni va kontentni nofaol qilish
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Tanlangan yorliq va kontentni faollashtirish
            button.classList.add('active');
            document.querySelector(`.tab-content[data-content="${tabName}"]`).classList.add('active');
        });
    });
}

// 2. Da'vo (Claim) arizasini yuborish funksiyasi
function setupClaimForm() {
    const form = document.getElementById('claim-form');
    const messageBox = document.getElementById('claim-message');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Sahifaning qayta yuklanishini to'xtatish

        const claimType = document.getElementById('claim-type').value;
        const amount = document.getElementById('amount').value;
        const receiptFile = document.getElementById('receipt').files[0];

        // Oddiy tekshiruv
        if (!claimType || !amount || !receiptFile) {
            messageBox.textContent = "Barcha maydonlar to'ldirilishi shart!";
            messageBox.style.backgroundColor = '#f8d7da';
            messageBox.style.color = '#721c24';
            messageBox.classList.remove('hidden');
            return;
        }

        // Simulyatsiya: Haqiqiy hayotda bu yerda serverga ma'lumot yuboriladi
        console.log("Arizani yuborish simulyatsiyasi...");
        console.log(`Turi: ${claimType}, Summasi: ${amount}, Fayl: ${receiptFile.name}`);

        // Xabarni ko'rsatish
        messageBox.textContent = `✅ Arizangiz muvaffaqiyatli qabul qilindi! (${claimType} - $${amount}). Qayta ishlash 2 ish kunigacha davom etadi.`;
        messageBox.style.backgroundColor = '#d4edda';
        messageBox.style.color = '#155724';
        messageBox.classList.remove('hidden');
        
        // Formani tozalash
        form.reset();
        
        // Xabarni 5 soniyadan keyin yashirish
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 5000);
    });
}

// 3. Polis tafsilotlari uchun oddiy funksiya (brauzer alerti)
function showDetails() {
    alert("Polis raqami: UMS-987654321\nSug'urta kompaniyasi: O'zbek Sug'urta\nQoplama darajasi: Premium\nFranshiza (deductible): $100");
}
window.showDetails = showDetails; // HTML dan chaqirish uchun

// Sahifa yuklanganda barcha funksiyalarni ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    setupClaimForm();
});