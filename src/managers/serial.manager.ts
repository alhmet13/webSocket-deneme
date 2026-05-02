import { SerialPort } from 'serialport'; // Yeni ekledik
import { findUserByRfid_ID, createLog, findDevice } from '../services';

// Portu burada BİR KEZ oluşturuyoruz
export const sharedPort = new SerialPort({
  path: 'COM6',
  baudRate: 9600,
});

const sendCommand = async (deviceName: string, command: string, userId: number) => {
  if (!sharedPort.isOpen) {
    throw new Error('Seri port kapalı! Komut gönderilemedi.');
  }

  // Protokol: "CihazAdı:Komut\n" (Tek bir paket)
  const packet = `${deviceName}:${command}\n`; //?Böylece hem kodun spagetti olmamasını sağladık ve Arduino tarafının da kafasının karışmamasını sağladık.

  const device = await findDevice(deviceName);
  if (!device) {
    throw new Error('Cihaz bulunamadı');
  }
  const deviceId = device.id;
  const logStatus = `${deviceName} is ${command}`;

  await createLog({ userId, deviceId, status: logStatus });

  return new Promise((resolve, reject) => {
    sharedPort.write(packet, (err) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
};

let sayac = 2;

const handleAccessRequest = async (rfid_ID: string) => {
  const user = await findUserByRfid_ID(rfid_ID);

  if (user) {
    const userId = user.id; //!Bu satırı ilk başta user var mı yok mu diye kontrol et sonra yaz yoksa patlarsın.
    if (sayac % 2 == 0) {
      await sendCommand('LED-001', 'on', userId);
      console.log(`${user.name} için izin verildi.`);
      sayac++;
      //* WebSocket'e gidecek paketi dönüyoruz
      return { status: 'authorized', name: user.name, rfid_ID, time: new Date() };
    } else {
      await sendCommand('LED-001', 'off', userId);
      console.log(`${user.name} için izin verildi.`);
      sayac++;
      //* WebSocket'e gidecek paketi dönüyoruz
      return { status: 'authorized', name: user.name, rfid_ID, time: new Date() };
    }
  } else {
    console.log('Yetkisiz kart: ' + rfid_ID);
    //* Yetkisiz deneme paketini dönüyoruz
    return { status: 'unauthorized', name: 'Bilinmeyen', rfid_ID, time: new Date() };
  }
};

export { sendCommand, handleAccessRequest };

/*
?Bu commit ile beraber serial.manager.ts de önemli değişikliklere gittik. Port'u oluşturmayı serial.listener.ts den alıp serial.manager.ts'e aldık.
*Ve triggerLed fonksiyonu oluşturup hem burada hem de controller da kullanıyoruz.
*/
