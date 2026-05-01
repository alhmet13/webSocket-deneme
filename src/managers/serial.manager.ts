import { SerialPort } from 'serialport'; // Yeni ekledik
import { findUserByRfid_ID } from '../services';

// Portu burada BİR KEZ oluşturuyoruz
export const sharedPort = new SerialPort({
  path: 'COM6',
  baudRate: 9600,
});

// LED yakma mantığını tek bir fonksiyona topladık
export const triggerLed = (status: '1' | '0') => {
  if (sharedPort.isOpen) {
    sharedPort.write(status);
  }
};

const handleAccessRequest = async (rfid_ID: string) => {
  const user = await findUserByRfid_ID(rfid_ID);

  if (user) {
    triggerLed('1'); // Paylaşımlı fonksiyonu kullan
    console.log(`${user.name} için izin verildi.`);
  } else {
    triggerLed('0');
    console.log('Yetkisiz kart: ' + rfid_ID);
  }
};

export { handleAccessRequest };

/*
?Bu commit ile beraber serial.manager.ts de önemli değişikliklere gittik. Port'u oluşturmayı serial.listener.ts den alıp serial.manager.ts'e aldık.
*Ve triggerLed fonksiyonu oluşturup hem burada hem de controller da kullanıyoruz.
*/
