const express = require('express');
const router = express.Router();

let meetings = [
  {
    id: 'EMS-001',
    title: 'Symposium Logistics Sync',
    type: 'event',
    platform: 'Google Meet',
    date: '2026-03-25 09:00 AM',
    relatedEntity: 'Annual Tech Symposium',
    status: 'Upcoming',
    link: 'https://meet.google.com/abc-defg-hij',
  },
  {
    id: 'EMS-002',
    title: 'Hackathon Sponsor Finalization',
    type: 'event',
    platform: 'Microsoft Teams',
    date: '2026-03-28 03:00 PM',
    relatedEntity: 'CodeRed Hackathon 2026',
    status: 'Upcoming',
    link: 'https://teams.microsoft.com/...',
  },
  {
    id: 'EMS-003',
    title: 'Career Fair Vendor Briefing',
    type: 'event',
    platform: 'Zoom',
    date: '2026-04-10 11:00 AM',
    relatedEntity: 'Global Career Fair',
    status: 'Upcoming',
    link: 'https://zoom.us/j/123456789',
  },
  {
    id: 'CMS-001',
    title: 'Robotics Club Board Meeting',
    type: 'club',
    platform: 'Zoom',
    date: '2026-04-02 05:00 PM',
    relatedEntity: 'Robotics Club',
    status: 'Upcoming',
    link: 'https://zoom.us/j/...',
  },
  {
    id: 'CMS-002',
    title: 'Drama Society Casting Sync',
    type: 'club',
    platform: 'Google Meet',
    date: '2026-04-05 02:00 PM',
    relatedEntity: 'Drama Society',
    status: 'Upcoming',
    link: 'https://meet.google.com/...',
  }
];

// GET /api/meetings
router.get('/', (req, res) => {
  res.json(meetings);
});

// POST /api/meetings
router.post('/', (req, res) => {
  const newMeeting = {
    id: `MS-00${meetings.length + 1}`,
    title: req.body.title,
    type: req.body.type,
    platform: req.body.platform,
    date: req.body.date,
    relatedEntity: req.body.relatedEntity,
    status: 'Upcoming',
    link: 'https://meet.provider.com/join'
  };
  meetings.push(newMeeting);
  res.status(201).json({ message: 'Meeting scheduled successfully', meeting: newMeeting });
});

module.exports = router;
