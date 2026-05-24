const express = require('express');
const router = express.Router();

const CITIES = [
  'Mumbai','Delhi','Bangalore','Hyderabad','Chennai','Kolkata','Pune','Ahmedabad',
  'Jaipur','Surat','Lucknow','Kanpur','Nagpur','Indore','Thane','Bhopal',
  'Visakhapatnam','Pimpri-Chinchwad','Patna','Vadodara','Ghaziabad','Ludhiana',
  'Agra','Nashik','Faridabad','Meerut','Rajkot','Kalyan','Vasai','Varanasi',
  'Coimbatore','Madurai','Guwahati','Chandigarh','Mysore','Kochi','Srinagar',
  'Mangalore','Hubli','Tiruppur','Tiruchirappalli','Amritsar','Jodhpur',
  'Raipur','Kota','Gwalior','Jabalpur','Vijayawada','Dhanbad','Aurangabad',
  'Ranchi','Allahabad','Jalandhar','Udaipur','Bhubaneswar','Dehradun'
];

// GET /api/cities?q=mum
router.get('/', (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ success: true, data: CITIES.slice(0, 10) });
  const filtered = CITIES.filter(c => c.toLowerCase().includes(q.toLowerCase())).slice(0, 10);
  res.json({ success: true, data: filtered });
});

module.exports = router;
