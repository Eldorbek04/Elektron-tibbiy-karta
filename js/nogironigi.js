// Boshlang'ich oila a'zolari ma'lumotlari
let familyMembers = [
    { name: "Sitora Alijonovna Valiyeva", dob: "1988-03-20", relation: "Xotini/Eri", disability: false },
    { name: "Madina Alijonovna Valiyeva", dob: "2015-09-12", relation: "O'g'li/Qizi", disability: false },
    { name: "Sobir Valiyevich Aliyev", dob: "1960-01-01", relation: "Otasi/Onasi", disability: true } // Misol uchun
];

// Jadvalni ma'lumotlar bilan to'ldirish
function renderFamilyTable() {
    const tableBody = document.querySelector('#family-members-table tbody');
    tableBody.innerHTML = ''; // Jadvalni tozalash

    familyMembers.forEach((member, index) => {
        const row = tableBody.insertRow();
        
        // Nogironlik holatini aniqlash
        const disabilityStatus = member.disability 
            ? `<span class="disability-yes">HA</span>` 
            : `<span class="disability-no">YO'Q</span>`;

        // Mobil ko'rinish uchun data-label atributlari
        row.innerHTML = `
            <td data-label="T/R">${index + 1}</td>
            <td data-label="F.I.SH.">${member.name}</td>
            <td data-label="Tug'ilgan sana">${member.dob}</td>
            <td data-label="Qarindoshlik darajasi">${member.relation}</td>
            <td data-label="Nogironligi bormi?">${disabilityStatus}</td>
        `;
    });
}

// Modal oynani ochish
function openAddMemberModal() {
    document.getElementById('add-member-modal').classList.remove('hidden');
}

// Modal oynani yopish
function closeAddMemberModal() {
    document.getElementById('add-member-modal').classList.add('hidden');
    document.getElementById('add-member-form').reset();
}

// Yangi a'zoni qo'shish formasi funksiyasi
function setupAddMemberForm() {
    const form = document.getElementById('add-member-form');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const newMember = {
            name: document.getElementById('name').value,
            dob: document.getElementById('dob').value,
            relation: document.getElementById('relation').value,
            disability: document.getElementById('has-disability').checked
        };
        
        // Ro'yxatga qo'shish
        familyMembers.push(newMember);
        
        // Jadvalni yangilash
        renderFamilyTable();
        
        // Modalni yopish
        closeAddMemberModal();
        
        alert(`Oila a'zosi ${newMember.name} muvaffaqiyatli qo'shildi.`);
    });
}

// Global funktsiyalar
window.openAddMemberModal = openAddMemberModal;
window.closeAddMemberModal = closeAddMemberModal;

// Sahifa yuklanganda ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    renderFamilyTable();
    setupAddMemberForm();
});