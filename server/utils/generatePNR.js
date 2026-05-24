const crypto = require('crypto');

const generatePNR = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pnr = 'RTX';
  const bytes = crypto.randomBytes(10);
  for (let i = 0; i < 10; i++) {
    pnr += chars[bytes[i] % chars.length];
  }
  return pnr;
};

module.exports = { generatePNR };
