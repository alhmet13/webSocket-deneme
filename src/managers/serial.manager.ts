import { SerialPort } from 'serialport'; // Yeni ekledik
import { findUserByRfid_ID } from '../services';

// Portu burada BİR KEZ oluşturuyoruz
export const sharedPort = new SerialPort({
  path: 'COM6',
  baudRate: 9600,
});

const sendCommand = async (deviceName: string, command: string) => {
  if (!sharedPort.isOpen) {
    throw new Error('Seri port kapalı! Komut gönderilemedi.');
  }

  // Protokol: "CihazAdı:Komut\n" (Tek bir paket)
  const packet = `${deviceName}:${command}\n`; //?Böylece hem kodun spagetti olmamasını sağladık ve Arduino tarafının da kafasının karışmamasını sağladık.

  return new Promise((resolve, reject) => {
    sharedPort.write(packet, (err) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
};

const handleAccessRequest = async (rfid_ID: string) => {
  const user = await findUserByRfid_ID(rfid_ID);

  if (user) {
    await sendCommand('LED-001', 'on');
    console.log(`${user.name} için izin verildi.`);
    // WebSocket'e gidecek paketi dönüyoruz
    return { status: 'authorized', name: user.name, rfid_ID, time: new Date() };
  } else {
    console.log('Yetkisiz kart: ' + rfid_ID);
    // Yetkisiz deneme paketini dönüyoruz
    return { status: 'unauthorized', name: 'Bilinmeyen', rfid_ID, time: new Date() };
  }
};

export { sendCommand, handleAccessRequest };

/*
?Bu commit ile beraber serial.manager.ts de önemli değişikliklere gittik. Port'u oluşturmayı serial.listener.ts den alıp serial.manager.ts'e aldık.
*Ve triggerLed fonksiyonu oluşturup hem burada hem de controller da kullanıyoruz.
*/
