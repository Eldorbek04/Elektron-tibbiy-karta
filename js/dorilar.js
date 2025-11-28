document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsContainer = document.getElementById('resultsContainer');

    // === STATIK MA'LUMOTLAR BAZASI (DEMO UCHUN) ===
    const drugsData = [
        {
            name: "Parasetamol",
            type: "Tabletka",
            symptoms: ["bosh og'rig'i", "isitma", "og'riq"],
            info: "Keng tarqalgan og'riq qoldiruvchi va isitmani tushiruvchi vosita.",
            country: "Hindiston",
            date: "12/2026",
            image: "./image/paras.jfif" // Haqiqiy rasm URL o'rniga placeholder
        },
        {
            name: "Ibuprofen",
            type: "Kapsula",
            symptoms: ["bosh og'rig'i", "tish og'rig'i", "yallig'lanish"],
            info: "Yallig'lanishga qarshi nosteroid dori vositasi (NSAIDS).",
            country: "Turkiya",
            date: "05/2027",
            image: "./image/Ibuprofen.jfif"
        },
        {
            name: "Nurofen Sirop",
            type: "Sirop",
            symptoms: ["bolalarda isitma", "bosh og'rig'i"],
            info: "Bolalar uchun maxsus ishlab chiqarilgan, mevali ta'mli sirop.",
            country: "Buyuk Britaniya",
            date: "08/2025",
            image: "./image/NurofenSirop.jfif"
        },
        {
            name: "Aspirin",
            type: "Tabletka",
            symptoms: ["bosh og'rig'i", "qonni suyultirish"],
            info: "Asetilsalisil kislotasi. Og'riq qoldiruvchi va antikoagulyant.",
            country: "Germaniya",
            date: "01/2028",
            image: "./image/Aspirin.jfif"
        },
    ];

    // === FUNKSIYALAR ===

    function renderDrugCard(drug) {
        const card = document.createElement('div');
        card.classList.add('drug-card');

        card.innerHTML = `
            <div class="drug-header">
                <img src="${drug.image}" alt="${drug.name} rasmi" class="drug-image">
                <div>
                    <h4 class="drug-name">${drug.name}</h4>
                    <span class="drug-type"><i class="fas fa-pills"></i> ${drug.type}</span>
                </div>
            </div>
            <div class="drug-details">
                <p><strong>Izoh:</strong> ${drug.info}</p>
                <p><strong>Tavsiya etiladi:</strong> ${drug.symptoms.join(', ')}</p>
                <p><strong>Ishlab chiqaruvchi:</strong> ${drug.country}</p>
                <p><strong>Yaroqlilik muddati:</strong> ${drug.date}</p>
            </div>
        `;
        return card;
    }

    function displayResults(query) {
        resultsContainer.innerHTML = ''; // Natijalarni tozalash

        const normalizedQuery = query.toLowerCase().trim();
        let found = false;

        if (normalizedQuery.length < 2) {
            resultsContainer.innerHTML = `<p class="initial-message">Qidirish uchun kamida 2 ta harf kiriting.</p>`;
            return;
        }

        drugsData.forEach(drug => {
            // Qidiruvni dorining nomi yoki simptomlari bo'yicha o'tkazish
            const isMatch = drug.name.toLowerCase().includes(normalizedQuery) ||
                            drug.symptoms.some(s => s.toLowerCase().includes(normalizedQuery));

            if (isMatch) {
                const card = renderDrugCard(drug);
                resultsContainer.appendChild(card);
                found = true;
            }
        });

        if (!found) {
            resultsContainer.innerHTML = `<p class="initial-message">"${query}" bo'yicha hech qanday dori topilmadi. Qidiruv so'zini qisqartirib ko'ring.</p>`;
        }
    }

    // === EVENT HANDLERS ===

    // Tugma bosilganda
    searchButton.addEventListener('click', () => {
        displayResults(searchInput.value);
    });

    // Enter tugmasi bosilganda
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            displayResults(searchInput.value);
        }
    });

    // Sahifa yuklanganda default qidiruv (ixtiyoriy)
    // displayResults("bosh og'rig'i"); 
});