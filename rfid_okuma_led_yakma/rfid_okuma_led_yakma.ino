#include <SPI.h>
#include <MFRC522.h>

// Kullanıcı tanımlı pinler
#define RST_PIN 8
#define SS_PIN 9
#define LED_PIN 7

// MFRC522 örneğini oluşturuyoruz
MFRC522 mfrc522(SS_PIN, RST_PIN);

void setup()
{
  Serial.begin(9600); // Backend ile iletişim hızı
  while (!Serial)
    ; // Portun açılmasını bekle

  SPI.begin();        // SPI barasını başlat
  mfrc522.PCD_Init(); // RFID okuyucuyu başlat

  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW); // Başlangıçta LED kapalı
}

void loop()
{
  // 1. ADIM: Backend'den gelen komutları kontrol et (Öncelikli)
  if (Serial.available() > 0)
  {
    // Backend'den "LED-001:on\n" formatında veri bekliyoruz
    String rawData = Serial.readStringUntil('\n'); 
    rawData.trim(); // Boşlukları temizle

    int separatorIndex = rawData.indexOf(':');
    if (separatorIndex != -1) {
      String deviceName = rawData.substring(0, separatorIndex);
      String command = rawData.substring(separatorIndex + 1);

      // Sadece bu cihaza ait komutları işle
      if (deviceName == "LED-001") {
        if (command == "on") {
          digitalWrite(LED_PIN, HIGH);
          delay(2000); 
          digitalWrite(LED_PIN, LOW);
        } else if (command == "off") {
          digitalWrite(LED_PIN, LOW);
        }
      }
    }
  }

  // 2. ADIM: RFID Okuma (Sadece kart varsa)
  // Yeni bir kart okutulmadıysa veya okunmadıysa loop'un başına dön
  if ( ! mfrc522.PICC_IsNewCardPresent()) return;
  if ( ! mfrc522.PICC_ReadCardSerial()) return;

  String content = "";
  for (byte i = 0; i < mfrc522.uid.size; i++)
  {
    content.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : ""));
    content.concat(String(mfrc522.uid.uidByte[i], HEX));
  }

  content.toUpperCase();

  // Backend'e temiz veri gönder
  Serial.print("RFID_DATA:");
  Serial.println(content);
  
  // Aynı kartın defalarca okunmasını engellemek için kısa bir bekleme
  delay(500); 
}

/*
Burada serial.available iyi kartı bulmaya çalışmadan yapıyoruz ki eğer ki  biz böyle yapmasaydık sign-in yaptığımızda ledimiz yanmayacaktı.
*/
