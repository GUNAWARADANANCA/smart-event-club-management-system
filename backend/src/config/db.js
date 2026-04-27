require('./loadEnv');
const dns = require('node:dns');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI?.trim();

// Optional: comma-separated resolvers (e.g. 8.8.8.8,1.1.1.1). Helps when the system DNS
// refuses SRV lookups for mongodb+srv (querySrv ECONNREFUSED on some Windows setups).
const dnsServers = process.env.DNS_SERVERS
  ? process.env.DNS_SERVERS.split(',').map((s) => s.trim()).filter(Boolean)
  : ['8.8.8.8', '1.1.1.1']; // Fallback to Google and Cloudflare DNS to fix ENOTFOUND issues

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

const util = require('node:util');
const resolve4 = util.promisify(dns.resolve4);

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
    serverSelectionTimeoutMS: 50000, // Keep trying to send operations for 50 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    connectTimeoutMS: 50000, // Give up initial connection after 50 seconds
    maxPoolSize: 50, // Maintain up to 50 socket connections
    // Fix for intermittent ENOTFOUND DNS issues in some network environments
    lookup: (hostname, options, callback) => {
      let cb = typeof options === 'function' ? options : callback;
      let opts = typeof options === 'object' ? options : {};
      resolve4(hostname)
        .then(addresses => {
          if (addresses && addresses.length > 0) {
            if (opts.all) {
              cb(null, addresses.map(addr => ({ address: addr, family: 4 })));
            } else {
              cb(null, addresses[0], 4);
            }
          } else {
            dns.lookup(hostname, options, callback); // Fallback
          }
        })
        .catch(err => {
          dns.lookup(hostname, options, callback); // Fallback
        });
    }
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