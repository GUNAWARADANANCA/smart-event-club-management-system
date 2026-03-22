const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`)
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Invalid file type'), false);
};

const upload = multer({ storage, fileFilter });

// Simulated MongoDB database collection
let mockBookings = [
  {
    _id: "65fd323a1",
    event: "Spring Break Hackathon",
    buyer: "Alex Chen",
    email: "alex@example.com",
    phone: "+94771234567",
    studentId: "IT21000000",
    type: "General",
    quantity: 1,
    paymentMethod: "Online",
    amount: 10000,
    parkingRequired: false,
    date: new Date().toISOString(),
    status: "Completed"
  }
];

// Create a new booking request
router.post('/', upload.single('receiptFile'), (req, res) => {
  try {
    const paymentMethod = req.body.paymentMethod;
    let parsedCardDetails = null;

    if (req.body.cardDetails) {
      parsedCardDetails = JSON.parse(req.body.cardDetails);
    }
    
    // Backend Validation for Online Payments
    if (paymentMethod === 'Online') {
      if (!parsedCardDetails || !parsedCardDetails.holderName || !parsedCardDetails.cardNumber || !parsedCardDetails.expiryDate) {
        return res.status(400).json({ message: 'Missing or invalid card details for online payment' });
      }
    }

    // Backend Validation for Bank Transfer
    if (paymentMethod === 'Bank Transfer') {
      if (!req.body.bankReference) {
        return res.status(400).json({ message: 'Missing Bank Reference Number' });
      }
      if (!req.file) {
        return res.status(400).json({ message: 'Missing configuration or file for receipt' });
      }
    }

    const newBooking = {
      ...req.body,
      cardDetails: parsedCardDetails || undefined,
      receiptFile: req.file ? req.file.filename : undefined,
      quantity: Number(req.body.quantity),
      amount: Number(req.body.amount),
      parkingRequired: String(req.body.parkingRequired) === 'true',
      _id: Math.random().toString(36).substring(2, 10), // Generate a random ID
      date: new Date().toISOString(),
      status: 'Pending'
    };
    mockBookings.unshift(newBooking);
    res.status(201).json(newBooking);
  } catch (err) {
    console.error('Error creating booking request:', err);
    res.status(500).json({ message: 'Failed to create booking request' });
  }
});

// Fetch all booking requests
router.get('/', (req, res) => {
  try {
    res.status(200).json(mockBookings);
  } catch (err) {
    console.error('Error fetching booking requests:', err);
    res.status(500).json({ message: 'Failed to fetch booking requests' });
  }
});

// Update booking request status (Approve / Reject)
router.put('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const index = mockBookings.findIndex(b => b._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Booking request not found' });
    }

    mockBookings[index].status = status;
    res.status(200).json(mockBookings[index]);
  } catch (err) {
    console.error('Error updating booking status:', err);
    res.status(500).json({ message: 'Failed to update booking status' });
  }
});

// Delete a booking request
router.delete('/:id', (req, res) => {
  try {
    const initialLength = mockBookings.length;
    mockBookings = mockBookings.filter(b => b._id !== req.params.id);
    
    if (mockBookings.length === initialLength) {
      return res.status(404).json({ message: 'Booking request not found' });
    }
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).json({ message: 'Failed to delete booking' });
  }
});

module.exports = router;
