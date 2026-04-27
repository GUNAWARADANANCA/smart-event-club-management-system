const mongoose = require('mongoose');
require('dotenv').config();
const Sport = require('./models/Sport');

const seedSports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const sports = [
      { name: 'Cricket', description: 'University Cricket team' },
      { name: 'Football', description: 'University Football team' },
      { name: 'Rugby', description: 'University Rugby team' },
      { name: 'Swimming', description: 'University Swimming team' },
      { name: 'Badminton', description: 'University Badminton team' },
      { name: 'Volleyball', description: 'University Volleyball team' },
      { name: 'Basketball', description: 'University Basketball team' },
    ];

    for (const s of sports) {
      const existing = await Sport.findOne({ name: s.name });
      if (!existing) {
        await Sport.create(s);
        console.log(`Added sport: ${s.name}`);
      } else {
        console.log(`Sport already exists: ${s.name}`);
      }
    }

    console.log('Seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding sports:', error);
    process.exit(1);
  }
};

seedSports();
