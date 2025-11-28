// Qon bosimi ko'rsatkichlari saqlanadigan array (Local Storage ishlatiladi)
let bpHistory = JSON.parse(localStorage.getItem('bpHistory')) || [];

// Qon bosimi holati uchun standartlar (AHA/ACC 2017)
const BP_STANDARDS = {
    NORMAL: { minS: 0, maxS: 120, minD: 0, maxD: 80, name: "Normal", advice: "Sog'liq a'lo darajada. Ushbu ko'rsatkichlarni saqlang." },
    ELEVATED: { minS: 120, maxS: 130, minD: 0, maxD: 80, name: "Ko'tarilgan (Elevated)", advice: "Parhez va turmush tarzingizga diqqat qiling." },
    STAGE1: { minS: 130, maxS: 140, minD: 80, maxD: 90, name: "Gipertenziya 1-bosqich", advice: "Shifokor bilan maslahatlashing. Ehtimol, dori kerak." },
    STAGE2: { minS: 140, maxS: 180, minD: 90, maxD: 120, name: "Gipertenziya 2-bosqich", advice: "Shoshilinch tibbiy yordam talab qilinadi. Dori-darmonlar kerak." },
    CRISIS: { minS: 180, maxS: Infinity, minD: 120, maxD: Infinity, name: "Gipertonik Krizis", advice: "TEZDAN shifokorga murojaat qiling!" },
    HYPOTENSION: { minS: 0, maxS: 90, minD: 0, maxD: 60, name: "Gipotoniya (Past)", advice: "Bosim juda past. Sababini aniqlash uchun shifokorga ko'rining." }
};

// 1. Qon Bosimini Tahlil Qilish Funksiyasi
function analyzeBloodPressure(systolic, diastolic) {
    let result = null;

    // Krizis holati (eng yuqori prioritet)
    if (systolic >= BP_STANDARDS.CRISIS.minS || diastolic >= BP_STANDARDS.CRISIS.minD) {
        result = { ...BP_STANDARDS.CRISIS, className: 'status-crisis' };
    } 
    // Gipertenziya 2-bosqich
    else if (systolic >= BP_STANDARDS.STAGE2.minS || diastolic >= BP_STANDARDS.STAGE2.minD) {
        result = { ...BP_STANDARDS.STAGE2, className: 'status-stage2' };
    } 
    // Gipertenziya 1-bosqich
    else if (systolic >= BP_STANDARDS.STAGE1.minS || diastolic >= BP_STANDARDS.STAGE1.minD) {
        result = { ...BP_STANDARDS.STAGE1, className: 'status-stage1' };
    } 
    // Ko'tarilgan (Elevated)
    else if (systolic >= BP_STANDARDS.ELEVATED.minS && diastolic < BP_STANDARDS.ELEVATED.maxD) {
        result = { ...BP_STANDARDS.ELEVATED, className: 'status-elevated' };
    } 
    // Normal (Eng past prioritet)
    else if (systolic < BP_STANDARDS.NORMAL.maxS && diastolic < BP_STANDARDS.NORMAL.maxD) {
        result = { ...BP_STANDARDS.NORMAL, className: 'status-normal' };
    }
    // Gipotoniya (Past bosim)
    else if (systolic < BP_STANDARDS.HYPOTENSION.maxS || diastolic < BP_STANDARDS.HYPOTENSION.maxD) {
        result = { ...BP_STANDARDS.HYPOTENSION, className: 'status-hypo' };
    }
    
    // Agar yuqoridagilarga to'g'ri kelmasa, normal deb hisoblash (bu kamdan-kam holat)
    return result || { ...BP_STANDARDS.NORMAL, className: 'status-normal' };
}

// 2. Tahlil Natijasini Ekranga Chiqarish
function displayAnalysis(systolic, diastolic) {
    const analysis = analyzeBloodPressure(systolic, diastolic);
    
    document.getElementById('bp-value').textContent = `${systolic} / ${diastolic} mm Hg`;
    
    const statusElement = document.getElementById('bp-status');
    statusElement.textContent = analysis.name;
    
    // Eski rang klasslarini o'chirish va yangisini qo'shish
    statusElement.className = '';
    statusElement.classList.add(analysis.className);
    
    document.getElementById('bp-advice').textContent = analysis.advice;
    document.getElementById('latest-analysis').classList.remove('hidden');
}

// 3. Tarix Ro'yxatini Yangilash
function renderHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    
    if (bpHistory.length === 0) {
        historyList.innerHTML = '<p class="no-data">Hozircha kiritilgan ma\'lumotlar yo\'q.</p>';
        return;
    }
    
    // Eng yangisini yuqorida ko'rsatish
    bpHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

    bpHistory.forEach(item => {
        const analysis = analyzeBloodPressure(item.systolic, item.diastolic);
        const dateObj = new Date(item.date);
        
        const listItem = document.createElement('div');
        listItem.classList.add('history-item');
        listItem.innerHTML = `
            <div>
                <strong>${item.systolic} / ${item.diastolic}</strong>
                <span class="history-date"> - ${dateObj.toLocaleDateString('uz-UZ')} ${dateObj.toLocaleTimeString('uz-UZ')}</span>
            </div>
            <span class="history-status-badge ${analysis.className}">
                ${analysis.name}
            </span>
        `;
        historyList.appendChild(listItem);
    });
    
    updateSummary();
}

// 4. Umumiy Xulosani Yangilash
function updateSummary() {
    if (bpHistory.length === 0) {
        document.getElementById('avg-systolic').textContent = '--';
        document.getElementById('avg-diastolic').textContent = '--';
        document.getElementById('max-status').textContent = '--';
        return;
    }

    const totalSystolic = bpHistory.reduce((sum, item) => sum + item.systolic, 0);
    const totalDiastolic = bpHistory.reduce((sum, item) => sum + item.diastolic, 0);
    
    document.getElementById('avg-systolic').textContent = Math.round(totalSystolic / bpHistory.length);
    document.getElementById('avg-diastolic').textContent = Math.round(totalDiastolic / bpHistory.length);
    
    // Eng yomon holatni aniqlash (Gipertenziya Krizisidan Normalgacha)
    const statusOrder = [
        BP_STANDARDS.CRISIS.name, 
        BP_STANDARDS.STAGE2.name, 
        BP_STANDARDS.STAGE1.name, 
        BP_STANDARDS.ELEVATED.name, 
        BP_STANDARDS.HYPOTENSION.name, 
        BP_STANDARDS.NORMAL.name
    ];
    
    let worstStatus = 'Normal';

    for (const item of bpHistory) {
        const statusName = analyzeBloodPressure(item.systolic, item.diastolic).name;
        if (statusOrder.indexOf(statusName) < statusOrder.indexOf(worstStatus)) {
            worstStatus = statusName;
        }
    }
    
    document.getElementById('max-status').textContent = worstStatus;
}


// 5. Forma Yuborilishi (Submit)
document.getElementById('bp-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const systolic = parseInt(document.getElementById('systolic').value);
    const diastolic = parseInt(document.getElementById('diastolic').value);
    const date = document.getElementById('date').value;
    
    // Validatsiya
    if (systolic < 50 || diastolic < 30 || systolic <= diastolic) {
        alert("Noto'g'ri qiymatlar kiritildi. Sistolik (Yuqori) Diastolikdan (Pastki) katta bo'lishi kerak.");
        return;
    }

    // Yangi yozuv yaratish
    const newEntry = { systolic, diastolic, date };
    
    // Ma'lumotlarni saqlash va yangilash
    bpHistory.push(newEntry);
    localStorage.setItem('bpHistory', JSON.stringify(bpHistory));
    
    // Natijalarni ko'rsatish
    displayAnalysis(systolic, diastolic);
    renderHistory();
    
    // Formani tozalash (Sana va vaqtdan tashqari)
    document.getElementById('systolic').value = '';
    document.getElementById('diastolic').value = '';
    
    alert("Ma'lumotlar saqlandi va tahlil qilindi!");
});

// Sahifa yuklanganda ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    // Joriy sana va vaqtni avtomatik qo'yish
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}T${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    document.getElementById('date').value = formattedDate;

    // Tarixni yuklash
    renderHistory();
});