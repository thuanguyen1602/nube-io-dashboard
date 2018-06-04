export function getSwitch(req, res) {
  // generates random boolean for switch value
  const result = {
    value: Math.random() >= 0.5,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  getSwitch,
};
