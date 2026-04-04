const express = require('express');
const Ticket = require('../models/Ticket');

const router = express.Router();

/** Slot IDs already assigned on a completed ticket booking */
router.get('/parking/occupied', async (req, res, next) => {
  try {
    // Use raw collection so legacy / manually inserted field names still count
    const docs = await Ticket.collection
      .find({})
      .project({ parkingSlot: 1, parking_slot: 1 })
      .toArray();

    const ids = new Set();
    for (const doc of docs) {
      const raw = doc.parkingSlot ?? doc.parking_slot;
      if (raw == null) continue;
      const id = String(raw).trim().toUpperCase();
      if (id) ids.add(id);
    }

    res.json({ occupiedSlotIds: [...ids] });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const {
      bookingId,
      fullName,
      email,
      phone,
      quantity,
      event,
      passType,
      passCode,
      parkingSlot,
      totalAmount,
      paymentMethod,
    } = req.body;

    const normalizedSlot =
      parkingSlot != null && String(parkingSlot).trim() !== ''
        ? String(parkingSlot).trim().toUpperCase()
        : null;

    const ticket = await Ticket.create({
      bookingId,
      fullName,
      email,
      phone,
      quantity: Number(quantity),
      event,
      passType,
      passCode: passCode || undefined,
      parkingSlot: normalizedSlot,
      totalAmount: Number(totalAmount),
      paymentMethod,
    });

    res.status(201).json(ticket);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
