<?php
// telegram_bot.php - Barcha logika va konfiguratsiya bitta faylda

// 1. KONFIGURATSIYA
// !!! Bu yerga o'z bot tokeningizni kiriting !!!
define('BOT_TOKEN', '8453644429:AAFGsS-BMoDNV5lTHwPcvOqWLT-dNvz4YDs');
define('API_URL', 'https://api.telegram.org/bot' . BOT_TOKEN . '/');

// 2. YORDAMCHI FUNKSIYALAR

// Foydalanuvchiga xabar yuborish funksiyasi
function sendMessage($chat_id, $text, $reply_markup = null) {
    $url = API_URL . 'sendMessage';
    $data = [
        'chat_id' => $chat_id,
        'text' => $text,
        'parse_mode' => 'Markdown',
    ];
    if ($reply_markup) {
        $data['reply_markup'] = $reply_markup;
    }

    $options = [
        'http' => [
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => 'POST',
            'content' => http_build_query($data),
        ],
    ];
    // Eslatma: productionda error handling (xato bilan ishlash) tavsiya etiladi.
    file_get_contents($url, false, stream_context_create($options));
}

// Asosiy menyu (Reply Keyboard) yaratish funksiyasi
function getMainMenuMarkup() {
    // Rasmdagi chap menyu tugmachalari
    $keyboard = [
        ['Bosh bo\'lim', 'Vrash ko\'riklari'],
        ['Analiz Natijalari', 'Retseptlarim'],
        ['Tashxislar', 'Qo\'shimcha ma\'lumotnoma'],
        ['Allergiyalar Va Reaksiyalar']
    ];

    return json_encode([
        'keyboard' => $keyboard,
        'resize_keyboard' => true,
        'one_time_keyboard' => false,
    ]);
}

// Bosh bo'lim ichidagi inline tugmachalarni yaratish funksiyasi
function getBoshBolimInlineMarkup() {
    // Rasmdagi o'ngdagi 3x3 kataklar
    $keyboard = [
        ['text' => 'Online maslahat olish', 'callback_data' => 'online_maslahat'],
        ['text' => 'Teri kasalliklarini aniqlash', 'callback_data' => 'teri_kasalliklari'],
        ['text' => 'Virach bilan videoqo\'ng\'iroq', 'callback_data' => 'video_qongiroq'],

        ['text' => 'Eng yaqin dori xonani topish', 'callback_data' => 'dori_xona'],
        ['text' => 'Ai yordamchidan foydalanish', 'callback_data' => 'ai_yordamchi'],
        ['text' => '0.86 - 0.82 malumotnoma', 'callback_data' => 'malumotnoma_86'],

        ['text' => 'Tez tibbiy yordam', 'callback_data' => 'tez_yordam'],
        ['text' => 'Tibbiy sug\'urta', 'callback_data' => 'sugurta'],
        ['text' => 'Nogironligi', 'callback_data' => 'nogironligi'],
        
        ['text' => 'Xoronik kasalliklar monitoring', 'callback_data' => 'monitoring']
    ];

    // Har bir qatorda maksimal 3 ta tugma bo'lishi uchun qayta shakllantiramiz
    $inline_keyboard = [];
    $temp_row = [];
    foreach ($keyboard as $i => $button) {
        $temp_row[] = $button;
        // Agar qatorda 3 ta tugma bo'lsa yoki oxirgi tugma bo'lsa
        if (count($temp_row) == 3 || $i == count($keyboard) - 1) {
            $inline_keyboard[] = $temp_row;
            $temp_row = [];
        }
    }

    return json_encode([
        'inline_keyboard' => $inline_keyboard
    ]);
}

// 3. ASOSIY LOGIKA

// Telegramdan kelgan JSON ma'lumotlarni olish
$content = file_get_contents("php://input");
$update = json_decode($content, true);

if (!$update) {
    exit;
}

// Xabar va chat identifikatorlarini ajratib olish
$chat_id = $update['message']['chat']['id'] ?? $update['callback_query']['message']['chat']['id'] ?? null;
$text = $update['message']['text'] ?? $update['callback_query']['data'] ?? '';

// Matnli xabarlarga javob berish (Menyu tugmachalari)
if (isset($update['message'])) {
    
    // Foydalanuvchi ma'lumotlari (rasmdagi)
    $user_info = "Salom, Mirsadikov Nodirjon. Sizning asosiy ma'lumotlaringiz:
*Yoshi:* 39
*Qon Guruhimi:* A(II) Rh+
*Allergiya:* Penitsillin (Yuqori)";

    switch ($text) {
        case '/start':
        case 'Bosh bo\'lim':
            // Asosiy menyuni yuborish
            sendMessage($chat_id, $user_info, getMainMenuMarkup());

            // Bosh bo'lim ichidagi tugmachalarni inline orqali alohida yuborish
            sendMessage($chat_id, "Bosh bo'lim: Bu bo'limda shaxsiy tibbiy kartangizdagi eng muhim ma'lumotlarning qisqacha xulosasi ko'rsatiladi.", getBoshBolimInlineMarkup());
            break;

        case 'Vrash ko\'riklari':
            sendMessage($chat_id, "👨‍⚕️ *Vrash ko'riklari* bo'limi: Bu yerda sizning barcha tibbiy ko'riklaringizning tarixi, shifokorlar xulosalari va kelgusi qabullar jadvali ko'rsatiladi.");
            break;

        case 'Analiz Natijalari':
            sendMessage($chat_id, "🧪 *Analiz Natijalari* bo'limi: Qon, siydik va boshqa tahlillaringizning elektron natijalari shu yerda saqlanadi. Har bir natijani yuklab olishingiz mumkin.");
            break;

        case 'Retseptlarim':
            sendMessage($chat_id, "💊 *Retseptlarim* bo'limi: Shifokor tomonidan yozilgan elektron retseptlaringiz ro'yxati. Ularni eng yaqin dorixonada ko'rsatish orqali dori olishingiz mumkin.");
            break;

        case 'Tashxislar':
            sendMessage($chat_id, "🩺 *Tashxislar* bo'limi: Sizga qo'yilgan barcha tasdiqlangan tibbiy tashxislar ro'yxati. Ma'lumotlar tibbiy karta bilan avtomatik sinxronlashtirilgan.");
            break;

        case 'Qo\'shimcha ma\'lumotnoma':
            sendMessage($chat_id, "📄 *Qo'shimcha ma'lumotnoma* bo'limi: Turli xil rasmiy tibbiy ma'lumotnomalar (masalan, ish joyi, o'qish joyi uchun) olish uchun so'rov qoldirishingiz mumkin.");
            break;

        case 'Allergiyalar Va Reaksiyalar':
            sendMessage($chat_id, "🚨 *Allergiyalar Va Reaksiyalar* bo'limi: Mavjud allergiyalar ro'yxati va ularga berilgan reaksiyalar haqidagi batafsil ma'lumot. Hozirda sizda *Penitsillin*ga yuqori allergiya qayd etilgan.");
            break;

        default:
            // Tushunilmagan xabarlarga javob
            sendMessage($chat_id, "Tushunmadim. Iltimos, menyudan foydalaning yoki '/start' buyrug'ini kiriting.", getMainMenuMarkup());
            break;
    }

} elseif (isset($update['callback_query'])) {
    // Inline tugmachalarga javob berish (Callback Query)
    $callback_data = $update['callback_query']['data'];
    $chat_id = $update['callback_query']['message']['chat']['id'];
    
    // Callback ma'lumotlariga qarab javob berish
    $response_text = "Siz *__$callback_data__* funksiyasini tanladingiz. Bu funksiyani ishga tushirish uchun maxsus logika kerak bo'ladi.";
    
    switch ($callback_data) {
        case 'online_maslahat':
            $response_text = "Siz Online maslahat olish xizmatini yoqtirdingiz. Biz sizga mos shifokorni topamiz.";
            break;
        case 'video_qongiroq':
            $response_text = "Virach bilan videoqo'ng'iroqni boshlash uchun maxsus link tayyorlanadi. (Hozirda dummy javob).";
            break;
        case 'dori_xona':
            $response_text = "Eng yaqin dorixonani xaritada ko'rsatish uchun joylashuv (location) yuborishingiz kerak.";
            break;
        // Boshqa inline tugmachalar uchun mantiq shu yerda davom etadi...
    }

    // Foydalanuvchiga pop-up xabar ko'rsatish (callback_queryga javob)
    $answer_url = API_URL . 'answerCallbackQuery';
    $answer_data = [
        'callback_query_id' => $update['callback_query']['id'],
        'text' => 'Tanlandi: ' . strtoupper(str_replace('_', ' ', $callback_data)),
        'show_alert' => false 
    ];

    $options = [
        'http' => [
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => 'POST',
            'content' => http_build_query($answer_data),
        ],
    ];
    file_get_contents($answer_url, false, stream_context_create($options));
    
    // Chatga asosiy xabarni yuborish
    sendMessage($chat_id, $response_text);
}

?>