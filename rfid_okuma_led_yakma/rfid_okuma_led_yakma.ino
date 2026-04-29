#include <SPI.h>
#include <MFRC522.h>

// Kullanıcı tanımlı pinler
#define RST_PIN         8          
#define SS_PIN          9          
#define LED_PIN         7

// MFRC522 örneğini oluşturuyoruz
MFRC522 mfrc522(SS_PIN, RST_PIN);  

void setup() {
  Serial.begin(9600);        // Backend ile iletişim hızı
  while (!Serial);           // Portun açılmasını bekle
  
  SPI.begin();               // SPI barasını başlat
  mfrc522.PCD_Init();        // RFID okuyucuyu başlat
  
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW); // Başlangıçta LED kapalı
  
  // Seri port üzerinden sistemin hazır olduğunu bildiriyoruz
  Serial.println("SYSTEM_READY");
}

void loop() {
  // Yeni bir kart okutulmadıysa devam et
  if ( ! mfrc522.PICC_IsNewCardPresent()) {
    return;
  }

  // Kart verisi okunamazsa devam et
  if ( ! mfrc522.PICC_ReadCardSerial()) {
    return;
  }

  // UID'yi string formatına çevirip Backend'e gönderiyoruz
  String content = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
     content.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : ""));
     content.concat(String(mfrc522.uid.uidByte[i], HEX));
  }
  
  content.toUpperCase();
  
  // Backend'in kolayca parse edebileceği bir formatta gönderiyoruz
  Serial.print("RFID_DATA:");
  Serial.println(content);

  // Görsel geri bildirim (Kart okundu sinyali)
  // Not: Yetki kontrolü backend'de olacağı için bu sadece "okuma" onayıdır
  blinkLed(1); 

  // Aynı kartın ardı ardına binlerce kez okunmasını engellemek için kısa bir bekleme
  delay(1000);
}

void blinkLed(int times) {
  for(int i = 0; i < times; i++) {
    digitalWrite(LED_PIN, HIGH);
    delay(500);
    digitalWrite(LED_PIN, LOW);
    delay(500);
  }
}
