import { SerialPort, ReadlineParser } from 'serialport';
import { handleAccessRequest } from '../managers';

type OnRecordCreated = (newRecord: any) => void;

const initArduinoListener = (OnRecordCreated: OnRecordCreated) => {
  const port = new SerialPort({
    path: 'COM6',
    baudRate: 9600,
  });

  const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
  parser.on('data', async (data: string) => {
    const cleanData = data.trim();

    if (cleanData.length > 0) {
      try {
        const rfidId = data.replace('RFID_DATA:', '').trim();
        handleAccessRequest(rfidId, port);
      } catch (err) {
        throw err;
      }
    }
  });

  port.on('error', (err) => {
    throw err;
  });
};

export { initArduinoListener };
