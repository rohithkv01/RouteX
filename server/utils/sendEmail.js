const nodemailer = require('nodemailer');

// Guard: only send real emails when SMTP is properly configured
const isEmailConfigured =
  process.env.EMAIL_USER &&
  process.env.EMAIL_USER !== 'your.email@gmail.com' &&
  process.env.EMAIL_PASS &&
  process.env.EMAIL_PASS !== 'your_gmail_app_password';

const transporter = isEmailConfigured
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    })
  : null;

async function safeSendMail(mailOptions) {
  if (!isEmailConfigured) {
    console.log('[RouteX Email] Skipped — SMTP not configured. To enable: set EMAIL_USER and EMAIL_PASS in server/.env');
    return;
  }
  return transporter.sendMail(mailOptions);
}

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #000; font-family: 'Inter', Arial, sans-serif; color: #fff; }
    .container { max-width: 600px; margin: 0 auto; background: #0a0a0a; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #1a0505 0%, #000 100%); padding: 32px; border-bottom: 1px solid rgba(239,35,60,0.3); }
    .logo { display: flex; align-items: center; gap: 10px; }
    .logo-dot { width: 16px; height: 16px; background: #ef233c; transform: rotate(45deg); }
    .logo-text { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .body { padding: 32px; }
    .footer { padding: 24px 32px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; color: #52525b; font-size: 12px; }
    .badge { display: inline-block; background: rgba(239,35,60,0.1); border: 1px solid rgba(239,35,60,0.3); color: #ef233c; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; }
    .btn { display: inline-block; background: #ef233c; color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; margin-top: 20px; }
    .info-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .info-label { color: #a1a1aa; font-size: 13px; }
    .info-value { color: #fff; font-weight: 600; font-size: 13px; }
    .ticket-box { background: #141414; border: 1px dashed rgba(239,35,60,0.4); border-radius: 12px; padding: 20px; margin: 20px 0; }
    h2 { font-size: 22px; font-weight: 700; margin-bottom: 8px; }
    p { color: #a1a1aa; line-height: 1.6; font-size: 14px; }
    .amount { font-size: 32px; font-weight: 800; color: #ef233c; }
  </style>
</head>
<body>
  <div style="padding: 24px;">
    <div class="container">
      <div class="header">
        <div class="logo">
          <div class="logo-dot"></div>
          <span class="logo-text">RouteX</span>
        </div>
        <p style="color: #a1a1aa; margin-top: 8px; font-size: 13px;">Your Journey, Redefined.</p>
      </div>
      <div class="body">${content}</div>
      <div class="footer">
        <p>© 2024 RouteX Travel Pvt. Ltd. | <a href="#" style="color: #ef233c;">Support</a> | <a href="#" style="color: #ef233c;">Terms</a></p>
        <p style="margin-top: 8px;">This is an automated email, please do not reply.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

const sendWelcomeEmail = async (to, name) => {
  await safeSendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: '🚀 Welcome to RouteX — Your Journey Begins!',
    html: baseTemplate(`
      <h2>Welcome aboard, ${name}! 👋</h2>
      <p style="margin-top: 12px;">You've successfully joined <strong style="color:#ef233c;">RouteX</strong> — India's most premium travel booking platform. Book Bus, Train, and Flight tickets seamlessly.</p>
      <div class="ticket-box" style="margin-top: 24px;">
        <div class="badge">🎁 First Booking Offer</div>
        <p style="margin-top: 12px;">Use code <strong style="color:#ef233c; font-size: 18px; font-family: monospace;">FIRST50</strong> to get ₹50 off your first booking!</p>
      </div>
      <a href="${process.env.CLIENT_URL}" class="btn">Start Booking →</a>
    `),
  });
};

const sendBookingConfirmationEmail = async (to, booking) => {
  const route = booking.routeId;
  const passengersHtml = booking.passengers.map(p =>
    `<div class="info-row"><span class="info-label">${p.name} (${p.gender})</span><span class="info-value">Seat ${p.seatNumber}</span></div>`
  ).join('');

  await safeSendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: `✅ Booking Confirmed — PNR: ${booking.pnr}`,
    html: baseTemplate(`
      <div class="badge">✅ Booking Confirmed</div>
      <h2 style="margin-top: 16px;">${route?.from || 'Origin'} → ${route?.to || 'Destination'}</h2>
      <p>${route?.operator || ''} | ${new Date(booking.journeyDate).toDateString()}</p>
      <div class="ticket-box">
        <div class="info-row">
          <span class="info-label">PNR Number</span>
          <span class="info-value" style="font-family: monospace; color: #ef233c; font-size: 16px;">${booking.pnr}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Departure</span>
          <span class="info-value">${route?.departureTime || '--'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Arrival</span>
          <span class="info-value">${route?.arrivalTime || '--'}</span>
        </div>
        ${passengersHtml}
        <div class="info-row">
          <span class="info-label">Total Paid</span>
          <span class="info-value" style="color: #ef233c;">₹${booking.fare?.total || 0}</span>
        </div>
      </div>
      ${booking.qrCode ? `<img src="${booking.qrCode}" alt="QR Code" style="width:150px; margin-top: 12px; border-radius: 8px;" />` : ''}
      <a href="${process.env.CLIENT_URL}/bookings" class="btn">View My Bookings →</a>
    `),
  });
};

const sendCancellationEmail = async (to, booking, refundAmount) => {
  await safeSendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: `❌ Booking Cancelled — PNR: ${booking.pnr}`,
    html: baseTemplate(`
      <div class="badge" style="background: rgba(239,35,60,0.1); color: #ef233c;">Booking Cancelled</div>
      <h2 style="margin-top: 16px;">Your booking has been cancelled</h2>
      <p style="margin-top: 8px;">PNR: <strong style="color:#ef233c; font-family: monospace;">${booking.pnr}</strong></p>
      <div class="ticket-box">
        <div class="info-row">
          <span class="info-label">Cancellation Reason</span>
          <span class="info-value">${booking.cancellationReason || 'User requested'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Refund Amount</span>
          <span class="info-value" style="color: #22c55e;">₹${refundAmount?.toFixed(2)}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Refund Timeline</span>
          <span class="info-value">5-7 business days</span>
        </div>
      </div>
      <p style="margin-top: 16px;">The refund will be credited to your original payment method. For any queries, contact our 24/7 support.</p>
      <a href="${process.env.CLIENT_URL}" class="btn">Book Again →</a>
    `),
  });
};

const sendPaymentFailureEmail = async (to, name, amount) => {
  await safeSendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: '⚠️ Payment Failed — RouteX',
    html: baseTemplate(`
      <h2>Payment was unsuccessful</h2>
      <p style="margin-top: 12px;">Hi ${name}, your payment of <strong style="color:#ef233c;">₹${amount}</strong> could not be processed. Please try again.</p>
      <a href="${process.env.CLIENT_URL}" class="btn">Retry Payment →</a>
    `),
  });
};

module.exports = { sendWelcomeEmail, sendBookingConfirmationEmail, sendCancellationEmail, sendPaymentFailureEmail };
