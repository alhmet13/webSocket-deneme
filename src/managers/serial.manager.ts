import { findUserByRfid_ID } from '../services';

const handleAccessRequest = async (rfid_ID: string, port: any) => {
  const user = await findUserByRfid_ID(rfid_ID);

  if (user) {
    port.write('1');
    console.log(`${user.name} için izin verildi.`);
  } else {
    port.write('0');
    console.log('Yetkisiz kart: ' + rfid_ID);
  }
};

export { handleAccessRequest };
