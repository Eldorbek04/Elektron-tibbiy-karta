document.addEventListener('DOMContentLoaded', () => {
    // Elementlarni olish
    const startSelectionBtn = document.getElementById('startSelectionBtn');
    const selectionArea = document.getElementById('selectionArea');
    const specialtySelect = document.getElementById('specialtySelect');
    const doctorSelect = document.getElementById('doctorSelect');
    const startChatBtn = document.getElementById('startChatBtn');
    const chatMessages = document.getElementById('chatMessages');
    const chatForm = document.getElementById('chatForm');
    const messageInput = document.getElementById('messageInput');

    let selectedDoctor = null;

    // Mutaxassislar ma'lumotlari
    const doctors = {
        dermatolog: [
            { id: 1, name: "Dr. Aliyev", welcome: "Men dermatolog Dr. Aliyevman. Teri muammolaringiz bo'yicha yordam berishga tayyorman." },
            { id: 2, name: "Dr. Karimova", welcome: "Men dermatolog Dr. Karimovaman. Savollaringizni bering." }
        ],
        terapevt: [
            { id: 3, name: "Dr. Sobirov", welcome: "Men terapevt Dr. Sobirovman. Qanday umumiy kasalliklar bezovta qilmoqda?" },
        ],
        kardiolog: [
            { id: 4, name: "Dr. Vohidova", welcome: "Men kardiolog Dr. Vahidovaman. Yurak-qon tomir muammolari bo'yicha murojaat qilishingiz mumkin." }
        ]
    };

    // --- FUNKSIYALAR ---

    function getCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    function addMessage(messageText, type) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);
        
        const p = document.createElement('p');
        p.textContent = messageText;
        messageDiv.appendChild(p);

        const timestampSpan = document.createElement('span');
        timestampSpan.classList.add('timestamp');
        timestampSpan.textContent = getCurrentTime();
        messageDiv.appendChild(timestampSpan);
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // --- EVENT HANDLERS ---

    // 1. "Mutaxassis tanlash" tugmasi bosilganda
    startSelectionBtn.addEventListener('click', () => {
        startSelectionBtn.style.display = 'none'; // Tugmani yashirish
        selectionArea.style.display = 'block';   // Tanlash maydonini ko'rsatish
    });

    // 2. Yo'nalish tanlanganda
    specialtySelect.addEventListener('change', (e) => {
        const specialty = e.target.value;
        const doctorList = doctors[specialty];
        
        // Vrachlar selectini tozalash
        doctorSelect.innerHTML = '<option value="" disabled selected>Vrachni tanlang</option>';
        doctorSelect.disabled = false;
        startChatBtn.disabled = true;

        // Vrachlar ro'yxatini to'ldirish
        doctorList.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.textContent = doctor.name;
            doctorSelect.appendChild(option);
        });
    });

    // 3. Vrach tanlanganda
    doctorSelect.addEventListener('change', (e) => {
        const selectedId = parseInt(e.target.value);
        const specialty = specialtySelect.value;
        
        // Tanlangan vrach obyektini topish
        selectedDoctor = doctors[specialty].find(doc => doc.id === selectedId);
        
        if (selectedDoctor) {
            startChatBtn.disabled = false;
        }
    });

    // 4. "Chatni boshlash" tugmasi bosilganda
    startChatBtn.addEventListener('click', () => {
        if (!selectedDoctor) return;

        // Tanlash qismini yashirish
        selectionArea.style.display = 'none';
        
        // Chat interfeysini ko'rsatish
        chatMessages.style.display = 'flex';
        chatForm.style.display = 'flex';

        // Chatni tanlangan vrach nomidan xush kelibsiz xabari bilan boshlash
        addMessage(`Siz ${selectedDoctor.name} bilan bog'landingiz. ${selectedDoctor.welcome}`, 'received');
        
        // Boshqa chatlar uchun default xabar (agar kerak bo'lsa)
        setTimeout(() => {
             addMessage(`Salom, men sizga qanday yordam bera olaman?`, 'received');
        }, 500);

    });


    // 5. Xabar yuborish
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault(); 

        const messageText = messageInput.value.trim();

        if (messageText !== '') {
            addMessage(messageText, 'sent');
            messageInput.value = '';

            // Demo javob
            setTimeout(() => {
                addMessage(`Rahmat, ${selectedDoctor.name} xabaringizni oldi va tez orada javob yozadi.`, 'received');
            }, 1000);
        }
    });
});

// ... avvalgi JS kodining boshlanishi ...

    // Yangi xabarni chat oynasiga qo'shish funksiyasi
    function addMessage(messageText, type) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);
        
        // ... xabar va vaqt tamg'asi yaratish qismlari ...
        // (Xabarning ichidagi matn va vaqt tamg'asini yaratish qismi o'zgarishsiz qoladi)

        messageDiv.appendChild(p);
        timestampSpan.innerHTML = getCurrentTime();
        
        // Agar 'sent' bo'lsa, o'qish belgisini qo'shish qismi (o'zgarishsiz)
        if (type === 'sent') {
             // ... readStatus yaratish va uni timestampSpan ga qo'shish qismlari ...
        }
        
        messageDiv.appendChild(timestampSpan);

        // 💥 O'ZGARTIRISH: Xabarni eng oxiriga (pastga) qo'shish
        // prepend() o'rniga appendChild() ishlatiladi
        chatMessages.appendChild(messageDiv);
        
        // 💥 O'ZGARTIRISH: Avtomatik aylantirish (scroll)
        // Eng yangi xabar pastda bo'lgani uchun, eng pastki qismga aylantiriladi
        chatMessages.scrollTop = chatMessages.scrollHeight; 
    }

// ... qolgan JS kodi o'zgarishsiz qoladi ...