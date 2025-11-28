// SIMULATSIYA MA'LUMOTLARI
const clinicData = {
    "Toshkent": {
        "Shahar": {
            "Klinika 1": ["Kardiologiya", "Terapevt"],
            "Klinika 2": ["Nevrologiya", "Ginekologiya"]
        },
        "Sergeli": {
            "Sergeli Med": ["Terapevt"]
        }
    },
    "Samarqand": {
        "Shahar": {
            "Samarqand Med": ["Nevrologiya", "Kardiologiya"]
        }
    }
};

const doctors = [
    { name: "Dr. Axmedov", speciality: "Kardiologiya", clinic: "Klinika 1", schedule: "09:00 - 18:00", maxBookings: 15, currentBookings: 8 },
    { name: "Dr. Karimova", speciality: "Terapevt", clinic: "Klinika 1", schedule: "08:00 - 17:00", maxBookings: 20, currentBookings: 12 },
    { name: "Dr. Aliyev", speciality: "Nevrologiya", clinic: "Klinika 2", schedule: "10:00 - 16:00", maxBookings: 10, currentBookings: 3 }
];

const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

const bemorVisits = [
    { date: "25.11.2025", time: "14:30", doctor: "Dr. Axmedov", specialty: "Kardiologiya", diagnosis: "Gipertoniya (II daraja)", instructions: "Maxsus dietaga amal qilish va dori-darmonlarni qabul qilishni boshlash." },
    { date: "10.09.2025", time: "10:00", doctor: "Dr. Karimova", specialty: "Terapevt", diagnosis: "O'RVI. Profilaktika", instructions: "Burun oqishi, tomoq og'rig'i. Grippga qarshi emlash tavsiya qilindi." }
];


document.addEventListener('DOMContentLoaded', () => {
    
    const menuButtons = document.querySelectorAll('.menu-button');
    const tabPanes = document.querySelectorAll('.phr-tab-pane');
    const visitListContainer = document.getElementById('visit-history-list');

    // Joriy sanani ko'rsatish
    const now = new Date();
    // Boshqa bo'limlarda ishlatish uchun sanani formatlash
    const formattedDate = now.toLocaleDateString('uz-UZ', { 
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' 
    });
    // Agar HTMLda bo'lsa, uni topib to'ldirish
    const dateDisplay = document.getElementById('current-date-display');
    if (dateDisplay) {
        dateDisplay.textContent = formattedDate;
    }


    // --- 1. Tablar Orqali O'tish Funksiyasi ---
    menuButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Sahifaning yuqorisiga sakrashni oldini olish

            // Aktiv button va kontentni o'chirish
            menuButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.add('hidden'));

            // Yangi tabni aktiv qilish
            button.classList.add('active');
            
            // Tegishli kontentni ko'rsatish
            const targetTab = button.getAttribute('data-tab');
            const targetContentId = 'content-' + targetTab;
            
            const targetPane = document.getElementById(targetContentId);
            if (targetPane) {
                targetPane.classList.remove('hidden');
                targetPane.classList.add('active'); // CSS stillari uchun
            }
        });
    });

    // --- 2. Tashrif Tarixini Dinamik Yuklash ---
    function loadVisitHistory() {
        visitListContainer.innerHTML = '';
        
        bemorVisits.forEach(visit => {
            const visitItem = document.createElement('div');
            visitItem.classList.add('chat-message', 'vrach-message');
            
            visitItem.innerHTML = `
                <span class="chat-time">${visit.date} (${visit.time})</span>
                <p class="chat-sender">${visit.doctor} - ${visit.specialty}</p>
                <p><b>Tashxis:</b> ${visit.diagnosis}</p>
                <p><b>Ko'rsatma:</b> ${visit.instructions}</p>
                <button class="view-details-btn">Batafsil ko'rish</button>
            `;
            visitListContainer.appendChild(visitItem);

            visitItem.querySelector('.view-details-btn').addEventListener('click', () => {
                alert(`Tashrif Tafsilotlari:\nSana: ${visit.date}\nShifokor: ${visit.doctor}\nTashxis: ${visit.diagnosis}\nKo'rsatmalar: ${visit.instructions}`);
            });
        });
    }

    // --- 3. Vrachga Yozilish Formasi Funksiyasi ---
    const regionSelect = document.getElementById('location-region');
    const citySelect = document.getElementById('location-city');
    const clinicSelect = document.getElementById('clinic');
    const specialitySelect = document.getElementById('speciality');
    const doctorSelect = document.getElementById('doctor');
    const doctorInfoBox = document.getElementById('doctor-info-box');
    const timeSelect = document.getElementById('appointment-time');
    const appointmentForm = document.getElementById('appointment-form');
    
    function createOption(text, value = "") {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        return option;
    }
    
    function resetAndPopulate(element, defaultText, data) {
        element.innerHTML = '';
        element.appendChild(createOption(defaultText));
        if (data) {
            Object.keys(data).forEach(key => {
                element.appendChild(createOption(key, key));
            });
        }
    }
    
    function populateRegions() {
        resetAndPopulate(regionSelect, "Viloyatni tanlang", clinicData);
    }

    regionSelect.addEventListener('change', () => {
        const selectedRegion = regionSelect.value;
        doctorInfoBox.classList.add('hidden');
        
        resetAndPopulate(citySelect, "Shaharni tanlang", selectedRegion ? clinicData[selectedRegion] : null);
        resetAndPopulate(clinicSelect, "Klinikani tanlang");
        resetAndPopulate(specialitySelect, "Mutaxassislikni tanlang");
        resetAndPopulate(doctorSelect, "Vrachni tanlang");
        resetAndPopulate(timeSelect, "Vaqtni tanlang");
    });

    citySelect.addEventListener('change', () => {
        const selectedRegion = regionSelect.value;
        const selectedCity = citySelect.value;
        doctorInfoBox.classList.add('hidden');

        resetAndPopulate(clinicSelect, "Klinikani tanlang", (selectedRegion && selectedCity) ? clinicData[selectedRegion][selectedCity] : null);
        resetAndPopulate(specialitySelect, "Mutaxassislikni tanlang");
        resetAndPopulate(doctorSelect, "Vrachni tanlang");
        resetAndPopulate(timeSelect, "Vaqtni tanlang");
    });

    clinicSelect.addEventListener('change', () => {
        const selectedRegion = regionSelect.value;
        const selectedCity = citySelect.value;
        const selectedClinic = clinicSelect.value;
        doctorInfoBox.classList.add('hidden');

        let specialities = null;
        if (selectedRegion && selectedCity && selectedClinic) {
             specialities = {};
             clinicData[selectedRegion][selectedCity][selectedClinic].forEach(spec => specialities[spec] = spec);
        }
        
        resetAndPopulate(specialitySelect, "Mutaxassislikni tanlang", specialities);
        resetAndPopulate(doctorSelect, "Vrachni tanlang");
        resetAndPopulate(timeSelect, "Vaqtni tanlang");
    });

    specialitySelect.addEventListener('change', () => {
        const selectedSpec = specialitySelect.value;
        const selectedClinic = clinicSelect.value;
        doctorInfoBox.classList.add('hidden');
        resetAndPopulate(doctorSelect, "Vrachni tanlang");
        resetAndPopulate(timeSelect, "Vaqtni tanlang");

        if (selectedSpec) {
            doctors.filter(d => d.speciality === selectedSpec && d.clinic === selectedClinic).forEach(doctor => {
                doctorSelect.appendChild(createOption(doctor.name, doctor.name));
            });
        }
    });

    doctorSelect.addEventListener('change', () => {
        const selectedDoctorName = doctorSelect.value;
        doctorInfoBox.classList.add('hidden');
        resetAndPopulate(timeSelect, "Vaqtni tanlang");

        if (selectedDoctorName) {
            const selectedDoctor = doctors.find(d => d.name === selectedDoctorName);
            if (selectedDoctor) {
                document.getElementById('doctor-schedule').textContent = selectedDoctor.schedule;
                document.getElementById('booked-count').textContent = `${selectedDoctor.currentBookings} / ${selectedDoctor.maxBookings}`;
                doctorInfoBox.classList.remove('hidden');

                timeSlots.forEach(time => {
                    const isBooked = timeSlots.indexOf(time) % 5 === 0; 
                    const option = createOption(time + (isBooked ? ' (Band)' : ' (Bo\'sh)'), time);
                    option.disabled = isBooked;
                    timeSelect.appendChild(option);
                });
            }
        }
    });

    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const doctorName = doctorSelect.value;
        const selectedDate = document.getElementById('appointment-date').value;
        const selectedTime = timeSelect.value;

        if (doctorName && selectedDate && selectedTime) {
            alert(`Siz ${doctorName} qabuliga ${selectedDate} kuni soat ${selectedTime} ga muvaffaqiyatli yozildingiz!`);
            appointmentForm.reset();
            regionSelect.dispatchEvent(new Event('change')); 
        } else {
            alert("Iltimos, barcha maydonlarni to'ldiring.");
        }
    });

    // Boshlash
    populateRegions();
    loadVisitHistory();
});

// ... (avvalgi JS kodlari) ...

document.addEventListener('DOMContentLoaded', () => {
    
    const menuButtons = document.querySelectorAll('.menu-button');
    const tabPanes = document.querySelectorAll('.phr-tab-pane');
    const visitListContainer = document.getElementById('visit-history-list');

    // YANGI QO'SHILGAN QISM
    const goToAppointmentBtn = document.getElementById('go-to-appointment-btn');
    const tashrifTabButton = document.querySelector('.menu-button[data-tab="tashrif"]');

    function switchToTab(targetDataTab) {
        // 1. Menyuni o'zgartirish
        menuButtons.forEach(btn => btn.classList.remove('active'));
        const targetButton = document.querySelector(`.menu-button[data-tab="${targetDataTab}"]`);
        if (targetButton) {
            targetButton.classList.add('active');
        }

        // 2. Kontentni o'zgartirish
        tabPanes.forEach(pane => {
            pane.classList.remove('active');
            pane.classList.add('hidden');
        });
        const targetContentId = 'content-' + targetDataTab;
        const targetPane = document.getElementById(targetContentId);
        if (targetPane) {
            targetPane.classList.remove('hidden');
            targetPane.classList.add('active');
        }
    }
    
    // YANGI QO'SHILGAN LISTENER
    if (goToAppointmentBtn && tashrifTabButton) {
        goToAppointmentBtn.addEventListener('click', () => {
            switchToTab('tashrif');
            // Foydalanuvchi ko'rigi yozilish formasiga o'tganini sezishi uchun sahifani yuqoriga aylantirish
            const mainContent = document.querySelector('.details-content-phr');
            if (mainContent) {
                mainContent.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // --- 1. Tablar Orqali O'tish Funksiyasi (Endi tozalangan) ---
    menuButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); 
            const targetTab = button.getAttribute('data-tab');
            switchToTab(targetTab);
        });
    });

    // ... (qolgan funksiyalar: loadVisitHistory, Vrachga yozilish formasi funksiyasi) ...
    
    // Boshlash
    populateRegions();
    loadVisitHistory();
});
document.addEventListener('DOMContentLoaded', () => {
    
    const menuButtons = document.querySelectorAll('.menu-button');
    const tabPanes = document.querySelectorAll('.phr-tab-pane');
    const visitListContainer = document.getElementById('visit-history-list');
    const receiptListContainer = document.getElementById('receipt-list');
    const diagnosisListContainer = document.getElementById('diagnosis-list');

    const goToAppointmentBtn = document.getElementById('go-to-appointment-btn');
    
    // ----------------------------------------------------
    // Yordamchi funksiya: Tabni almashtirish
    // ----------------------------------------------------
    function switchToTab(targetDataTab) {
        menuButtons.forEach(btn => btn.classList.remove('active'));
        const targetButton = document.querySelector(`.menu-button[data-tab="${targetDataTab}"]`);
        if (targetButton) {
            targetButton.classList.add('active');
        }

        tabPanes.forEach(pane => {
            pane.classList.remove('active');
            pane.classList.add('hidden');
        });
        const targetContentId = 'content-' + targetDataTab;
        const targetPane = document.getElementById(targetContentId);
        if (targetPane) {
            targetPane.classList.remove('hidden');
            targetPane.classList.add('active');
        }
        
        const mainContent = document.querySelector('.details-content-phr');
        if (mainContent) {
            mainContent.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    // ----------------------------------------------------
    // 1. Tugmalar Listenerlari
    // ----------------------------------------------------
    if (goToAppointmentBtn) {
        goToAppointmentBtn.addEventListener('click', () => {
            switchToTab('tashrif'); 
        });
    }

    menuButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); 
            const targetTab = button.getAttribute('data-tab');
            switchToTab(targetTab);
        });
    });

    // ----------------------------------------------------
    // 2. Ko'riklar Tarixi (10+ ta ma'lumot)
    // ----------------------------------------------------
    function loadVisitHistory() {
        if (!visitListContainer) return;

        const mockVisits = [
            { date: "25.11.2025", doctor: "Dr. Axmedov", speciality: "Kardiolog", diagnosis: "Gipertoniya (II daraja)", details: "Qon bosimini nazorat qilish bo'yicha tavsiyalar." },
            { date: "10.09.2025", doctor: "Dr. Karimova", speciality: "Terapevt", diagnosis: "O'RVI", details: "Simptomatik davolash tayinlandi. Issiqlikni tushirish." },
            { date: "01.07.2025", doctor: "Dr. Ibragimov", speciality: "Okulist", diagnosis: "Miopiya (Yaqindan ko'rolmaslik)", details: "Ko'zoynak retsepti berildi. Keyingi ko'rik 6 oyda." },
            { date: "15.05.2025", doctor: "Dr. Alimova", speciality: "Pediatr", diagnosis: "Allergik rinit", details: "Antigistamin preparatlar tavsiya etildi. Allergen aniqlandi." },
            { date: "28.03.2025", doctor: "Dr. Axmedov", speciality: "Kardiolog", diagnosis: "Yuqori qon bosimi", details: "Amlodipin dozasi korreksiya qilindi. 30 kun nazorat." },
            { date: "05.02.2025", doctor: "Dr. Karimova", speciality: "Terapevt", diagnosis: "Bronxit", details: "Antibiotik kursi yakunlandi. O'pka eshitildi." },
            { date: "12.12.2024", doctor: "Dr. Alimova", speciality: "Pediatr", diagnosis: "O'tkir faringit", details: "Tomog'i qizargan. Issiq ichimliklar tavsiya etildi." },
            { date: "18.10.2024", doctor: "Dr. Ibragimov", speciality: "Okulist", diagnosis: "Konyunktivit", details: "Ko'z tomchisi tavsiya etildi. 7 kun davomida." },
            { date: "03.09.2024", doctor: "Dr. Karimova", speciality: "Terapevt", diagnosis: "Nevralgiya", details: "B12 vitamini kursi belgilandi. Fizioterapiya." },
            { date: "17.07.2024", doctor: "Dr. Axmedov", speciality: "Kardiolog", diagnosis: "Tekshiruv", details: "Yillik profilaktik tekshiruv o'tkazildi. Shikoyatlar yo'q." },
            { date: "01.06.2024", doctor: "Dr. Alimova", speciality: "Pediatr", diagnosis: "Dermatit", details: "Terida qizarish bor. Maxsus krem buyurildi." },
            { date: "10.04.2024", doctor: "Dr. Ibragimov", speciality: "Okulist", diagnosis: "Ko'z bosimini o'lchash", details: "Ko'z ichi bosimi normal. Muntazam nazorat zarur." }
        ];

        visitListContainer.innerHTML = '<h3>Avvalgi Ko\'riklar Tarixi</h3>';
        
        mockVisits.forEach(visit => {
            const visitElement = document.createElement('div');
            visitElement.classList.add('chat-message', 'vrach-message');
            visitElement.innerHTML = `
                <span class="chat-time">${visit.date}</span>
                <p class="chat-sender"><strong>Vrach:</strong> ${visit.doctor} (${visit.speciality})</p>
                <p><strong>Tashxis:</strong> ${visit.diagnosis}</p>
                <p><strong>Ko'rsatma:</strong> ${visit.details}</p>
                <button class="download-link" style="margin-top: 5px;">Batafsil ko'rish</button>
            `;
            visitListContainer.appendChild(visitElement);
        });
    }
    
    // ----------------------------------------------------
    // 3. Retseptlar Ro'yxati (10+ ta ma'lumot)
    // ----------------------------------------------------
    function loadReceipts() {
        if (!receiptListContainer) return;
        
        const mockReceipts = [
            { date: "26.11.2025", doctor: "Dr. Axmedov (Kardiolog)", medicine: "Amlodipin 5mg", usage: "Kuniga 1 mahal, ertalab. 30 kun davomida." },
            { date: "26.11.2025", doctor: "Dr. Axmedov (Kardiolog)", medicine: "Lizinopril 10mg", usage: "Kuniga 1 mahal, kechqurun. Doimiy qabul qilish." },
            { date: "10.09.2025", doctor: "Dr. Karimova (Terapevt)", medicine: "Paratsetamol 500mg", usage: "Isitma tushganda 1 tabletka, 3 mahalgacha." },
            { date: "10.09.2025", doctor: "Dr. Karimova (Terapevt)", medicine: "Ambroksol sirop", usage: "Kuniga 3 mahal, 10 ml. 7 kun davomida." },
            { date: "01.07.2025", doctor: "Dr. Ibragimov (Okulist)", medicine: "Tobrex ko'z tomchisi", usage: "Har 4 soatda bir tomchi. 5 kun davomida." },
            { date: "15.05.2025", doctor: "Dr. Alimova (Pediatr)", medicine: "Setirizin 10mg", usage: "Kechqurun 1 tabletka. 10 kun." },
            { date: "28.03.2025", doctor: "Dr. Axmedov (Kardiolog)", medicine: "Magniy B6", usage: "Kuniga 2 mahal, ovqatdan keyin. 1 oy davomida." },
            { date: "05.02.2025", doctor: "Dr. Karimova (Terapevt)", medicine: "Azitromitsin 500mg", usage: "Kuniga 1 mahal, 3 kun." },
            { date: "12.12.2024", doctor: "Dr. Alimova (Pediatr)", medicine: "Faringosept", usage: "Kuniga 4 mahal, so'rish uchun. 5 kun." },
            { date: "18.10.2024", doctor: "Dr. Ibragimov (Okulist)", medicine: "Vitrum Vision", usage: "Kuniga 1 mahal, doimiy." },
            { date: "03.09.2024", doctor: "Dr. Karimova (Terapevt)", medicine: "Meloksikam 15mg", usage: "Kuniga 1 mahal, 5 kun. Nevralgiya uchun." },
            { date: "17.07.2024", doctor: "Dr. Axmedov (Kardiolog)", medicine: "Atorvastatin 20mg", usage: "Kechqurun 1 tabletka. Doimiy nazorat ostida." }
        ];

        receiptListContainer.innerHTML = '<h2>Retseptlar Ro\'yxati</h2><p>Oxirgi retseptlar va ularni qabul qilish bo\'yicha ko\'rsatmalar.</p>';
        
        mockReceipts.forEach(receipt => {
            const receiptElement = document.createElement('div');
            receiptElement.classList.add('chat-message', 'vrach-message');
            receiptElement.innerHTML = `
                <span class="chat-time">${receipt.date}</span>
                <p class="chat-sender">${receipt.doctor}</p>
                <p><b>Dori:</b> ${receipt.medicine}</p>
                <p><b>Qabul qilish:</b> ${receipt.usage}</p>
            `;
            receiptListContainer.appendChild(receiptElement);
        });
    }

    // ----------------------------------------------------
    // 4. Tasdiqlangan Tashxislar (10+ ta ma'lumot)
    // ----------------------------------------------------
    function loadDiagnosis() {
        if (!diagnosisListContainer) return;
        
        const mockDiagnosis = [
            { name: "Gipertoniya", stage: "II daraja", date: "25.11.2025", type: "chronic" },
            { name: "O'RVI", stage: null, date: "10.09.2025", type: "acute" },
            { name: "Miopiya", stage: "-1.5 D", date: "01.07.2025", type: "chronic" },
            { name: "Allergik rinit", stage: "Mavsumiy", date: "15.05.2025", type: "chronic" },
            { name: "Bronxit", stage: "O'tkir", date: "05.02.2025", type: "acute" },
            { name: "Osteoxondroz", stage: "Bel-dumg'aza", date: "03.12.2024", type: "chronic" },
            { name: "Konyunktivit", stage: null, date: "18.10.2024", type: "acute" },
            { name: "Surunkali gastrit", stage: "Remissiya", date: "20.06.2024", type: "chronic" },
            { name: "Anemiya", stage: "Yengil", date: "10.03.2024", type: "chronic" },
            { name: "Piyelonefrit", stage: "Surunkali", date: "05.01.2024", type: "chronic" },
            { name: "Qandli diabet", stage: "Tipi: Prediabet", date: "15.10.2023", type: "chronic" },
            { name: "Tish kariesi", stage: "Ko'p sonli", date: "01.08.2023", type: "acute" }
        ];

        diagnosisListContainer.innerHTML = '';
        
        mockDiagnosis.forEach(diag => {
            const item = document.createElement('li');
            
            // Stillarni tashxis turiga qarab belgilash
            let bgColor = '#e9f5ff'; 
            let borderColor = '#007bff';
            if (diag.type === 'chronic') {
                 bgColor = '#ffe0e0'; 
                 borderColor = '#dc3545';
            }

            item.style.cssText = `padding: 10px; margin-bottom: 5px; background-color: ${bgColor}; border-left: 4px solid ${borderColor}; border-radius: 4px;`;
            
            const stageText = diag.stage ? ` (${diag.stage})` : '';
            item.textContent = `${diag.name}${stageText} - ${diag.date}`;
            diagnosisListContainer.appendChild(item);
        });
    }


    // ----------------------------------------------------
    // 5. Vrachga Yozilish Formasi uchun Mockup Ma'lumotlar
    // ----------------------------------------------------
    const regionsData = { "Toshkent sh.": ["Yunusobod", "Chilonzor"], "Samarqand vil.": ["Samarqand sh."], "Farg'ona vil.": ["Qo'qon"], };
    const clinicsData = { 
        "Yunusobod": ["Medion Klinikasi", "Respublika kardiologiya markazi"], 
        "Samarqand sh.": ["Markaziy shifoxona", "Avitsenna Klinikasi"], 
        "Qo'qon": ["Shaharchilik Poliklinikasi"]
    };
    const specialityData = ["Kardiolog", "Terapevt", "Pediatr", "Endokrinolog", "Okulist", "Nevropatolog", "Stomatolog", "Urolog"];
    
    // Vrach ma'lumotlari: Rayimjonov Eldorbekni kiritamiz
    const doctorsData = {
        "Kardiolog": [
            { name: "Dr. Axmedov A.A.", schedule: "Dush-Jum, 9:00-16:00", booked: 5 },
            { name: "Dr. Ibragimov N.B.", schedule: "Ses-Shan, 14:00-18:00", booked: 2 },
            { name: "Dr. Salimova F.B.", schedule: "Har kuni, 8:00-12:00", booked: 10 }
        ],
        "Terapevt": [
            { name: "Dr. Karimova Z.N.", schedule: "Har kuni, 8:00-17:00", booked: 8 },
            { name: "Dr. Rayimjonov E.U.", schedule: "Shanba, 10:00-15:00", booked: 1 }, // <--- Rayimjonov Eldorbek
            { name: "Dr. Xamidov O.K.", schedule: "Ses-Jum, 9:00-17:00", booked: 4 }
        ],
        "Pediatr": [
            { name: "Dr. Alimova S.T.", schedule: "Dush-Jum, 10:00-14:00", booked: 3 },
            { name: "Dr. Boboyev D.A.", schedule: "Ses-Shan, 14:00-17:00", booked: 6 }
        ],
        "Endokrinolog": [
            { name: "Dr. Qodirova G.Sh.", schedule: "Har kuni, 9:00-13:00", booked: 7 }
        ]
        // Boshqa mutaxassisliklar uchun kamida 1 ta ma'lumot qo'shiladi
    };
    
    // ----------------------------------------------------
    // 6. Form Elementlarini To'ldirish va Boshqarish
    // ----------------------------------------------------
    
    function populateRegions() {
        const regionSelect = document.getElementById('location-region');
        if (!regionSelect) return;
        
        regionSelect.innerHTML = '<option value="">Viloyat tanlang</option>';
        Object.keys(regionsData).forEach(region => {
            regionSelect.innerHTML += `<option value="${region}">${region}</option>`;
        });
        
        regionSelect.addEventListener('change', populateCities);
        document.getElementById('location-city').addEventListener('change', populateClinics);
        document.getElementById('clinic').addEventListener('change', populateSpeciality);
        document.getElementById('speciality').addEventListener('change', populateDoctors);
        document.getElementById('doctor').addEventListener('change', displayDoctorInfo); 
        
        populateTimeSlots();
    }

    function populateCities() {
        // ... (o'zgarishsiz)
    }

    function populateClinics() {
        // ... (o'zgarishsiz)
    }

    function populateSpeciality() {
        // ... (o'zgarishsiz)
    }

    
    function populateDoctors() {
        const speciality = document.getElementById('speciality').value;
        const doctorSelect = document.getElementById('doctor');
        doctorSelect.innerHTML = '<option value="">Vrach tanlang</option>';
        
        if (speciality && doctorsData[speciality]) {
            doctorsData[speciality].forEach(doc => {
                doctorSelect.innerHTML += `<option value="${doc.name}">${doc.name}</option>`;
            });
        }
        doctorSelect.disabled = !speciality;
        document.getElementById('doctor-info-box').classList.add('hidden');
    }
    
    function displayDoctorInfo() {
        const doctorName = document.getElementById('doctor').value;
        const speciality = document.getElementById('speciality').value;
        const infoBox = document.getElementById('doctor-info-box');
        
        infoBox.classList.add('hidden');
        
        if (doctorName && speciality && doctorsData[speciality]) {
            const doctor = doctorsData[speciality].find(doc => doc.name === doctorName);
            
            if (doctor) {
                document.getElementById('doctor-schedule').textContent = doctor.schedule;
                document.getElementById('booked-count').textContent = doctor.booked;
                infoBox.classList.remove('hidden'); 
            }
        }
    }

    function populateTimeSlots() {
        // ... (o'zgarishsiz)
    }

    // ----------------------------------------------------
    // 7. Yozilishni tasdiqlash funksiyasi
    // ----------------------------------------------------
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const doctorName = document.getElementById('doctor').value;
            const date = document.getElementById('appointment-date').value;
            const time = document.getElementById('appointment-time').value;

            if (doctorName && date && time) {
                alert(`✅ Muvaffaqiyatli! Siz ${doctorName} qabuliga ${date} sanasida, soat ${time} ga yozildingiz.`);
                appointmentForm.reset();
                loadVisitHistory(); 
                switchToTab('asosiy'); 
            } else {
                alert("Iltimos, barcha maydonlarni to'ldiring.");
            }
        });
    }

    // --- Boshlash: Hamma ma'lumotlarni yuklash ---
    populateRegions();
    loadVisitHistory();
    loadReceipts(); 
    loadDiagnosis();
});