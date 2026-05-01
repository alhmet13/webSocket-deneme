import { ReadlineParser } from 'serialport';
import { sharedPort, handleAccessRequest } from '../managers';

type OnRecordCreated = (newRecord: any) => void;

const initArduinoListener = (onRecordCreated: OnRecordCreated) => {
  const parser = sharedPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

  parser.on('data', async (data: string) => {
    const cleanData = data.trim();
    if (cleanData.length > 0) {
      try {
        const rfidId = cleanData.replace('RFID_DATA:', '').trim();
        handleAccessRequest(rfidId);
      } catch (err) {
        console.error('Listener Hatası:', err);
      }
    }
  });

  sharedPort.on('error', (err) => {
    console.error('Port Hatası:', err.message);
  });
};

export { initArduinoListener };
