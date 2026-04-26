const randomTemperature = () => {
  const temperature = Number((Math.random() * (30 - 20) + 20).toFixed(2));

  return { temperature };
};

export { randomTemperature };
