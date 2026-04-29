import { SerialPort, ReadlineParser } from 'serialport';
import { createDevice } from '../services';

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
        await createDevice({ deviceName: 'led-001', light: cleanData === 'led yandi' });
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
