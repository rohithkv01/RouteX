const QRCode = require('qrcode');

const generateQR = async (data) => {
  try {
    const qr = await QRCode.toDataURL(typeof data === 'string' ? data : JSON.stringify(data), {
      color: { dark: '#ef233c', light: '#000000' },
      width: 200,
      margin: 1,
    });
    return qr;
  } catch (err) {
    console.error('QR generation error:', err);
    return null;
  }
};

module.exports = { generateQR };
