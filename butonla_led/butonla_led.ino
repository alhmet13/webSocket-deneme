const int BUTTON_PIN = 9;
const int LED_PIN = 8;

bool lastState = false; // Önceki LED durumunu tutar

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int buttonState = digitalRead(BUTTON_PIN);

  if (buttonState == LOW) {
    digitalWrite(LED_PIN, HIGH);
    if (!lastState) {              // Sadece durum değiştiğinde yaz
      Serial.println("led yandi");
      lastState = true;
    }
  } else {
    digitalWrite(LED_PIN, LOW);
    if (lastState) {               // Sadece durum değiştiğinde yaz
      Serial.println("led sondu");
      lastState = false;
    }
  }
}
