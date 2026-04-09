const { connectDb, disconnectDb, mongoose } = require('../src/config/db');

(async () => {
  try {
    await connectDb();
    const admin = mongoose.connection.db.admin();
    await admin.command({ ping: 1 });
    console.log('MongoDB connection OK');
  } catch (e) {
    console.error(e.message || e);
    process.exitCode = 1;
  } finally {
    await disconnectDb();
  }
})();
