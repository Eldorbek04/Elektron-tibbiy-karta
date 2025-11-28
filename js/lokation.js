document.addEventListener('DOMContentLoaded', () => {
    const mapStatus = document.getElementById('mapStatus');
    const pharmacyListDiv = document.getElementById('pharmacyList');

    // Statik dorixonalar ro'yxati (Joylashuv ma'lumotlari)
    const staticPharmacies = [
        // Koordinatalar Toshkent shahridan olingan (Demo uchun)
        { name: "Markaziy Dorixona", address: "Navoiy k. 5", lat: 41.3275, lng: 69.2486 },
        { name: "Salomatlik Dorixonasi", address: "Bobur k. 12A", lat: 41.3100, lng: 69.2800 },
        { name: "Shifoapteka", address: "Amir Temur sh. k. 9", lat: 41.3400, lng: 69.2600 },
        { name: "A-Farm", address: "Mirzo Ulug'bek k.", lat: 41.3500, lng: 69.3000 }
    ];

    // Masofani metr yoki kilometrda hisoblash funksiyasi (Haversine)
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Yer radiusi kilometrda
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c * 1000; // Masofa metrda

        if (distance < 1000) {
            return { display: `${Math.round(distance / 10) * 10} m`, value: distance };
        } else {
            return { display: `${(distance / 1000).toFixed(1)} km`, value: distance };
        }
    }

    // Dorixonalarni ro'yxatda ko'rsatish
    function displayPharmacies(currentLocation) {
        pharmacyListDiv.innerHTML = '';
        
        // 1. Masofalarni hisoblash
        const pharmaciesWithDistance = staticPharmacies.map(pharmacy => {
            const distanceData = calculateDistance(
                currentLocation.lat, currentLocation.lng,
                pharmacy.lat, pharmacy.lng
            );
            return { 
                ...pharmacy, 
                distanceDisplay: distanceData.display, 
                sortableDistance: distanceData.value 
            };
        });

        // 2. Masofa bo'yicha saralash
        pharmaciesWithDistance.sort((a, b) => a.sortableDistance - b.sortableDistance);
        
        mapStatus.textContent = "Yaqin atrofdagi dorixonalar topildi. Marshrutni ko'rish uchun bosing:";
        mapStatus.classList.remove('loading-message');
        mapStatus.style.color = '#28a745'; 

        // 3. Ro'yxatni yaratish va Event qo'shish
        pharmaciesWithDistance.forEach(pharmacy => {
            const item = document.createElement('div');
            item.classList.add('pharmacy-item');
            
            item.innerHTML = `
                <div class="pharmacy-info">
                    <p class="pharmacy-name">${pharmacy.name}</p>
                    <p class="pharmacy-address"><i class="fas fa-map-marker-alt"></i> ${pharmacy.address}</p>
                </div>
                <div class="pharmacy-distance">${pharmacy.distanceDisplay}</div>
            `;
            
            // 💥 Marshrutni ko'rsatish funksiyasi
            item.addEventListener('click', () => {
                const directionsUrl = `http://googleusercontent.com/maps.google.com/3${currentLocation.lat},${currentLocation.lng}/${pharmacy.lat},${pharmacy.lng}`;
                window.open(directionsUrl, '_blank');
            });
            
            pharmacyListDiv.appendChild(item);
        });
    }

    // Joriy joylashuvni olish
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                displayPharmacies(userLocation);
            },
            (error) => {
                // Xato yuz berganda
                let errorMessage = 'Joylashuvni aniqlashda xato yuz berdi.';
                if (error.code === error.PERMISSION_DENIED) {
                    errorMessage = 'Joylashuvni aniqlash uchun brauzerda ruxsat berilmagan.';
                } else if (error.code === error.TIMEOUT) {
                    errorMessage = 'Joylashuvni aniqlash uchun vaqt tugadi.';
                }
                mapStatus.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${errorMessage}`;
                mapStatus.style.color = '#dc3545';
                mapStatus.classList.remove('loading-message');
            }
        );
    } else {
        // Brauzer geolokatsiyani qo'llab-quvvatlamaydi
        mapStatus.innerHTML = '<i class="fas fa-times-circle"></i> Brauzeringiz geolokatsiyani qo\'llab-quvvatlamaydi.';
        mapStatus.style.color = '#dc3545';
    }
});