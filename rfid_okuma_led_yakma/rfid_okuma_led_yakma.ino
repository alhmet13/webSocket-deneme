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
  if (Serial.available() > 0)
  {
    char command = Serial.read(); // Backend'den gelen tek karakteri oku
    if (command == '1')
    { // Eğer '1' gelirse
      digitalWrite(LED_PIN, HIGH);
      delay(2000); // 2 saniye yak
      digitalWrite(LED_PIN, LOW);
    }
    else if (command == '0')
    { // Eğer '0' gelirse (Opsiyonel: Hata sinyali)
      // Belki LED'i hızlı hızlı yakıp söndürürsün (Hata mesajı gibi)
    }
  }

  if (!mfrc522.PICC_IsNewCardPresent())
  {
    return;
  }

  // Kart verisi okunamazsa devam et
  if (!mfrc522.PICC_ReadCardSerial())
  {
    return;
  }

  String content = "";
  for (byte i = 0; i < mfrc522.uid.size; i++)
  {
    content.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : ""));
    content.concat(String(mfrc522.uid.uidByte[i], HEX));
  }

  content.toUpperCase();

  Serial.print("RFID_DATA:");
  Serial.println(content);
  delay(1000);
}

/*
Burada serial.available iyi kartı bulmaya çalışmadan yapıyoruz ki eğer ki  biz böyle yapmasaydık sign-in yaptığımızda ledimiz yanmayacaktı.
*/
