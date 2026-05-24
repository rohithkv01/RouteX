require('dotenv').config();
const mongoose = require('mongoose');
const Route = require('../models/Route');
const Seat = require('../models/Seat');
const Coupon = require('../models/Coupon');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');
};

const routes = [
  // BUS ROUTES
  { type:'bus', operator:'VRL Travels', from:'Mumbai', to:'Pune', departureTime:'21:00', arrivalTime:'01:30', duration:'4h 30m', vehicleType:'Volvo AC Sleeper', totalSeats:40, pricePerSeat:499, amenities:['WiFi','AC','Charging Point','Blanket'], rating:4.5, ratingCount:1240 },
  { type:'bus', operator:'Orange Travels', from:'Bangalore', to:'Chennai', departureTime:'22:00', arrivalTime:'06:00', duration:'8h', vehicleType:'AC Seater/Sleeper', totalSeats:44, pricePerSeat:699, amenities:['AC','Charging Point','Water Bottle'], rating:4.3, ratingCount:890 },
  { type:'bus', operator:'KSRTC', from:'Bangalore', to:'Mysore', departureTime:'07:00', arrivalTime:'10:30', duration:'3h 30m', vehicleType:'Non-AC Seater', totalSeats:52, pricePerSeat:199, amenities:['Reclining Seats'], rating:3.8, ratingCount:2100 },
  { type:'bus', operator:'Parveen Travels', from:'Chennai', to:'Hyderabad', departureTime:'20:30', arrivalTime:'07:00', duration:'10h 30m', vehicleType:'Volvo Multi-Axle AC', totalSeats:36, pricePerSeat:849, amenities:['WiFi','AC','Charging Point','Blanket','Pillow'], rating:4.6, ratingCount:670 },
  { type:'bus', operator:'SRS Travels', from:'Mumbai', to:'Goa', departureTime:'19:00', arrivalTime:'08:00', duration:'13h', vehicleType:'AC Sleeper', totalSeats:40, pricePerSeat:1199, amenities:['AC','Blanket','Pillow','Charging'], rating:4.2, ratingCount:980 },
  { type:'bus', operator:'Neeta Tours', from:'Mumbai', to:'Ahmedabad', departureTime:'23:00', arrivalTime:'07:00', duration:'8h', vehicleType:'Volvo AC Sleeper', totalSeats:40, pricePerSeat:649, amenities:['WiFi','AC','Charging'], rating:4.4, ratingCount:560 },
  { type:'bus', operator:'Hans Travels', from:'Delhi', to:'Jaipur', departureTime:'06:00', arrivalTime:'11:30', duration:'5h 30m', vehicleType:'AC Seater', totalSeats:44, pricePerSeat:399, amenities:['AC','Charging'], rating:4.1, ratingCount:1340 },
  { type:'bus', operator:'Shyam Travels', from:'Hyderabad', to:'Vijayawada', departureTime:'14:00', arrivalTime:'20:00', duration:'6h', vehicleType:'AC Sleeper', totalSeats:36, pricePerSeat:549, amenities:['AC','Charging','Water'], rating:4.0, ratingCount:430 },

  // TRAIN ROUTES
  { type:'train', operator:'Indian Railways', from:'Mumbai', to:'Delhi', departureTime:'16:35', arrivalTime:'08:30', duration:'15h 55m', vehicleType:'Rajdhani Express', trainNumber:'12951', totalSeats:72, pricePerSeat:1450, classes:[{className:'3A',price:1450,seats:72},{className:'2A',price:2200,seats:48},{className:'1A',price:4500,seats:24}], amenities:['Meals Included','Bedroll','Charging'], rating:4.7, ratingCount:5600 },
  { type:'train', operator:'Indian Railways', from:'Bangalore', to:'Mumbai', departureTime:'20:00', arrivalTime:'12:30', duration:'16h 30m', vehicleType:'Udyan Express', trainNumber:'11301', totalSeats:72, pricePerSeat:980, classes:[{className:'3A',price:980,seats:72},{className:'2A',price:1600,seats:48}], amenities:['Charging','Pantry'], rating:4.2, ratingCount:3200 },
  { type:'train', operator:'Indian Railways', from:'Delhi', to:'Kolkata', departureTime:'17:00', arrivalTime:'09:00', duration:'16h', vehicleType:'Duronto Express', trainNumber:'12259', totalSeats:72, pricePerSeat:1200, classes:[{className:'3A',price:1200,seats:72},{className:'2A',price:1950,seats:48},{className:'1A',price:3800,seats:24}], amenities:['Meals','Bedroll','Charging'], rating:4.5, ratingCount:4100 },
  { type:'train', operator:'Indian Railways', from:'Chennai', to:'Bangalore', departureTime:'06:00', arrivalTime:'10:30', duration:'4h 30m', vehicleType:'Shatabdi Express', trainNumber:'12007', totalSeats:80, pricePerSeat:890, classes:[{className:'CC',price:890,seats:80},{className:'EC',price:1650,seats:40}], amenities:['Meals','Tea/Coffee'], rating:4.8, ratingCount:6700 },

  // FLIGHT ROUTES
  { type:'flight', operator:'IndiGo', airline:'IndiGo', flightNumber:'6E-201', from:'Mumbai', to:'Delhi', departureTime:'06:00', arrivalTime:'08:10', duration:'2h 10m', vehicleType:'Airbus A320', totalSeats:180, pricePerSeat:3499, cabin:['economy','business'], amenities:['Web Check-in','Meal Optional'], rating:4.3, ratingCount:12500 },
  { type:'flight', operator:'Air India', airline:'Air India', flightNumber:'AI-805', from:'Delhi', to:'Bangalore', departureTime:'08:30', arrivalTime:'11:00', duration:'2h 30m', vehicleType:'Boeing 787', totalSeats:250, pricePerSeat:4299, cabin:['economy','business','first'], amenities:['Meal Included','Extra Legroom'], rating:4.5, ratingCount:9800 },
  { type:'flight', operator:'Vistara', airline:'Vistara', flightNumber:'UK-101', from:'Bangalore', to:'Hyderabad', departureTime:'10:00', arrivalTime:'11:15', duration:'1h 15m', vehicleType:'Airbus A320neo', totalSeats:168, pricePerSeat:2899, cabin:['economy','business'], amenities:['Meal Included','Priority Boarding'], rating:4.7, ratingCount:7300 },
  { type:'flight', operator:'SpiceJet', airline:'SpiceJet', flightNumber:'SG-301', from:'Mumbai', to:'Goa', departureTime:'07:30', arrivalTime:'08:45', duration:'1h 15m', vehicleType:'Boeing 737', totalSeats:189, pricePerSeat:2199, cabin:['economy'], amenities:['Web Check-in','Meal Optional'], rating:4.0, ratingCount:5600 },
  { type:'flight', operator:'GoFirst', airline:'GoFirst', flightNumber:'G8-101', from:'Delhi', to:'Mumbai', departureTime:'09:00', arrivalTime:'11:15', duration:'2h 15m', vehicleType:'Airbus A320', totalSeats:180, pricePerSeat:3199, cabin:['economy'], amenities:['Web Check-in'], rating:3.9, ratingCount:4200 },
];

const coupons = [
  { code:'FIRST50', description:'₹50 off on your first booking', discountType:'flat', discountValue:50, minAmount:200, expiryDate:new Date('2027-12-31'), applicableTypes:['bus','train','flight'], usageLimit:10000, bannerColor:'#ef233c' },
  { code:'ROUTEX20', description:'20% off on all bookings (max ₹200)', discountType:'percent', discountValue:20, minAmount:500, maxDiscount:200, expiryDate:new Date('2027-06-30'), applicableTypes:['bus','train','flight'], usageLimit:5000 },
  { code:'BUSRIDE10', description:'10% off on bus tickets', discountType:'percent', discountValue:10, minAmount:300, maxDiscount:100, expiryDate:new Date('2027-12-31'), applicableTypes:['bus'], usageLimit:3000 },
  { code:'FLYHIGH', description:'₹300 off on flight bookings', discountType:'flat', discountValue:300, minAmount:2000, expiryDate:new Date('2027-09-30'), applicableTypes:['flight'], usageLimit:2000 },
  { code:'TRAINPASS', description:'₹150 off on train tickets', discountType:'flat', discountValue:150, minAmount:800, expiryDate:new Date('2027-12-31'), applicableTypes:['train'], usageLimit:4000 },
  { code:'WEEKEND25', description:'25% off on weekend travel', discountType:'percent', discountValue:25, minAmount:600, maxDiscount:300, expiryDate:new Date('2027-12-31'), applicableTypes:['bus','train','flight'], usageLimit:1000 },
  { code:'MONSOON15', description:'15% off during monsoon season', discountType:'percent', discountValue:15, minAmount:400, maxDiscount:150, expiryDate:new Date('2026-09-30'), applicableTypes:['bus','train'], usageLimit:3000 },
  { code:'SUPERFLY', description:'Flat ₹500 off on premium flights', discountType:'flat', discountValue:500, minAmount:5000, expiryDate:new Date('2027-12-31'), applicableTypes:['flight'], usageLimit:500 },
];

const generateBusSeats = (routeId, price) => {
  const seats = [];
  // Lower deck: rows 1-5, seats A/B C/D
  for (let row = 1; row <= 5; row++) {
    ['A','B'].forEach((s, i) => {
      seats.push({ routeId, seatNumber:`L${row}${s}`, deck:'lower', seatType:'sleeper', isWindowSeat: i===0, price, bookings:[] });
    });
    ['C','D'].forEach((s, i) => {
      seats.push({ routeId, seatNumber:`L${row}${s}`, deck:'lower', seatType:'sleeper', isWindowSeat: i===1, price, bookings:[] });
    });
  }
  // Upper deck: rows 1-5
  for (let row = 1; row <= 5; row++) {
    ['A','B'].forEach((s, i) => {
      seats.push({ routeId, seatNumber:`U${row}${s}`, deck:'upper', seatType:'sleeper', isWindowSeat: i===0, price: price - 100, bookings:[] });
    });
    ['C','D'].forEach((s, i) => {
      seats.push({ routeId, seatNumber:`U${row}${s}`, deck:'upper', seatType:'sleeper', isWindowSeat: i===1, price: price - 100, bookings:[] });
    });
  }
  return seats;
};

const generateTrainSeats = (routeId, price) => {
  const seats = [];
  const berthTypes = ['LB','MB','UB','SL','SU'];
  for (let coach = 1; coach <= 2; coach++) {
    for (let compartment = 1; compartment <= 9; compartment++) {
      berthTypes.forEach((b, i) => {
        seats.push({ routeId, seatNumber:`C${coach}-${compartment}${b}`, deck: b.includes('U') ? 'upper' : b.includes('M') ? 'middle' : 'lower', seatType:'sleeper', isWindowSeat: b==='LB', price: price + (b==='SL'||b==='SU' ? -200 : 0), bookings:[] });
      });
    }
  }
  return seats;
};

const generateFlightSeats = (routeId, price) => {
  const seats = [];
  const cols = ['A','B','C','D','E','F'];
  for (let row = 1; row <= 30; row++) {
    cols.forEach((col) => {
      const isWindow = col === 'A' || col === 'F';
      const isAisle = col === 'C' || col === 'D';
      seats.push({ routeId, seatNumber:`${row}${col}`, deck:'none', seatType: isWindow ? 'window' : isAisle ? 'aisle' : 'middle', isWindowSeat: isWindow, price: isWindow ? price + 100 : isAisle ? price + 50 : price, bookings:[] });
    });
  }
  return seats;
};

const seed = async () => {
  try {
    await connectDB();
    await Route.deleteMany({});
    await Seat.deleteMany({});
    await Coupon.deleteMany({});
    console.log('Cleared existing data');

    const createdRoutes = await Route.insertMany(routes);
    console.log(`✅ ${createdRoutes.length} routes seeded`);

    const allSeats = [];
    for (const route of createdRoutes) {
      if (route.type === 'bus') allSeats.push(...generateBusSeats(route._id, route.pricePerSeat));
      else if (route.type === 'train') allSeats.push(...generateTrainSeats(route._id, route.pricePerSeat));
      else allSeats.push(...generateFlightSeats(route._id, route.pricePerSeat));
    }
    await Seat.insertMany(allSeats);
    console.log(`✅ ${allSeats.length} seats seeded`);

    await Coupon.insertMany(coupons);
    console.log(`✅ ${coupons.length} coupons seeded`);

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seed();
