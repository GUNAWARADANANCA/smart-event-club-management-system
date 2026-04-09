require('./loadEnv');
const dns = require('node:dns');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI?.trim();

// Optional: comma-separated resolvers (e.g. 8.8.8.8,1.1.1.1). Helps when the system DNS
// refuses SRV lookups for mongodb+srv (querySrv ECONNREFUSED on some Windows setups).
const dnsServers = process.env.DNS_SERVERS?.split(',')
  .map((s) => s.trim())
  .filter(Boolean);
if (Array.isArray(dnsServers) && dnsServers.length > 0) {
  dns.setServers(dnsServers);
}

dns.setDefaultResultOrder?.('ipv4first');

mongoose.connection.on('connected', () => {
  console.log('[MongoDB] Connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('[MongoDB] Connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('[MongoDB] Disconnected');
});

/**
 * Connect to MongoDB using MONGO_URI.
 * Mongoose 6+ uses the modern driver; useNewUrlParser / useUnifiedTopology are obsolete.
 */
async function connectDb() {
  if (!MONGO_URI) {
    throw new Error(
      'MONGO_URI is not set. Add it to backend/.env (e.g. MONGO_URI=mongodb+srv://...)'
    );
  }

  const dbName = process.env.MONGO_DB_NAME?.trim() || 'itpm';

  await mongoose.connect(MONGO_URI, {
    dbName,
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true,
    },
    autoSelectFamily: false,
    family: 4,
  });

  return mongoose.connection;
}

async function disconnectDb() {
  await mongoose.disconnect();
}

module.exports = {
  connectDb,
  disconnectDb,
  mongoose,
};