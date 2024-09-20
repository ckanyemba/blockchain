const crypto = require('crypto');

const cryptoHash = (...inputs) => {
  const hash = crypto.createHash('sha256');

  // Map through inputs, stringify only if not already a string
  hash.update(inputs.map(input => typeof input === 'string' ? input : JSON.stringify(input)).join(' '));

  return hash.digest('hex');
};

module.exports = cryptoHash;
