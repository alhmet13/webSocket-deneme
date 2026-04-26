const randomTemperature = (deviceName: string) => {
  const temperature = Number((Math.random() * (30 - 20) + 20).toFixed(2));
  deviceName = 'DVC-001';

  return { temperature, deviceName };
};

export { randomTemperature };
