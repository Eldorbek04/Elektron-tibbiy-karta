let isAmbulanceCalled = false;
let callStartTime = null;

// Tez yordam chaqirish funksiyasi
function callAmbulance() {
    if (isAmbulanceCalled) {
        alert("Tez yordam allaqachon chaqirilgan va yo'lda!");
        return;
    }

    const location = document.getElementById('location-input').value;
    if (location.trim() === "") {
        alert("Iltimos, manzilni kiriting.");
        return;
    }

    isAmbulanceCalled = true;
    callStartTime = new Date(); // Chaqiruv boshlangan vaqt
    
    document.getElementById('ambulance-status').textContent = `Tez yordam yo'lda: ${location}`;
    document.getElementById('call-button').textContent = "✅ Chaqiruv Jo'natildi";
    document.getElementById('call-button').disabled = true;

    // Kelish vaqtini taxmin qilish (Masalan, 10 daqiqa)
    let minutesLeft = 10;
    
    const arrivalInterval = setInterval(() => {
        minutesLeft--;
        const timeDisplay = `${minutesLeft.toString().padStart(2, '0')}:00`;
        document.getElementById('arrival-time').textContent = timeDisplay;
        
        if (minutesLeft <= 0) {
            clearInterval(arrivalInterval);
            arrivalAction();
        }
    }, 60000); // Har 1 daqiqada yangilash (Test uchun tezroq qilish mumkin)
    
    // Test uchun 5 soniyadan keyin 10 daqiqa deb ko'rsatish
    document.getElementById('arrival-time').textContent = "10:00";

    alert(`Tez yordam ${location} manziliga chaqirildi!`);
}

// Tez yordam manzilga yetib kelganda
function arrivalAction() {
    document.getElementById('ambulance-status').textContent = "Tez yordam manzilga yetib keldi!";
    document.getElementById('arrival-time').textContent = "00:00";
    
    if (callStartTime) {
        const arrivalTime = new Date();
        const timeDifference = arrivalTime.getTime() - callStartTime.getTime();
        
        // Millisekundlarni soat, daqiqa, soniyaga aylantirish
        const hours = Math.floor(timeDifference / 3600000);
        const minutes = Math.floor((timeDifference % 3600000) / 60000);
        const seconds = Math.floor((timeDifference % 60000) / 1000);
        
        const actualTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('actual-arrival-time').textContent = actualTime;
    }
    
    // Kirish tugmasini yana faollashtirish (Yangi chaqiruv uchun)
    document.getElementById('call-button').disabled = false;
    document.getElementById('call-button').textContent = "Yordam Chaqirish";
    isAmbulanceCalled = false;
}

// Muolaja jurnaliga yangi yozuv qo'shish
function addTreatmentLog() {
    const input = document.getElementById('new-treatment-input');
    const logText = input.value.trim();
    
    if (logText === "") {
        alert("Iltimos, muolaja matnini kiriting.");
        return;
    }

    const logContainer = document.getElementById('treatment-history');
    const currentTime = new Date();
    const timeStamp = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
    
    const newEntry = document.createElement('div');
    newEntry.classList.add('treatment-entry');
    newEntry.innerHTML = `<span class="time-stamp">${timeStamp}</span> - ${logText}`;
    
    logContainer.prepend(newEntry); // Eng yangisini yuqoriga qo'shish
    input.value = ''; // Input maydonini tozalash
}