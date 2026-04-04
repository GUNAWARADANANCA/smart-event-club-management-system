const { connectDb, disconnectDb } = require('../src/config/db');
const Event = require('../src/models/Event');

const SAMPLE_EVENTS = [
  {
    title: 'Annual Tech Symposium',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    description: 'Guest talks, workshops, and a student project showcase.',
  },
  {
    title: 'Design & Innovation Expo',
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    description: 'Poster sessions and demos from final-year project teams.',
  },
];

(async () => {
  try {
    await connectDb();

    const existing = await Event.countDocuments();
    if (existing > 0) {
      console.log(`Skip seed: "events" already has ${existing} document(s).`);
      return;
    }

    await Event.insertMany(SAMPLE_EVENTS);
    console.log(`Seeded ${SAMPLE_EVENTS.length} event(s) into collection "events".`);
  } catch (e) {
    console.error(e.message || e);
    process.exitCode = 1;
  } finally {
    await disconnectDb();
  }
})();
