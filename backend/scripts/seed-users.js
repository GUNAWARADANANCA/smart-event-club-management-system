/**
 * Seed mock users into MongoDB database "itpm", collection "users".
 * Run from backend folder: node scripts/seed-users.js
 */
require('../src/config/loadEnv');

const dns = require('node:dns');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');

const MONGO_URI = process.env.MONGO_URI?.trim();

const dnsServers = process.env.DNS_SERVERS?.split(',')
  .map((s) => s.trim())
  .filter(Boolean);
if (dnsServers.length > 0) {
  dns.setServers(dnsServers);
}
dns.setDefaultResultOrder?.('ipv4first');

const BCRYPT_ROUNDS = 12;

const SEED_USERS = [
  { email: 'alice@example.com', password: 'password123' },
  { email: 'bob@example.com', password: 'mypassword' },
  { email: 'charlie@example.com', password: '12345678' },
];

async function main() {
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

  let created = 0;
  for (const { email, password } of SEED_USERS) {
    const normalized = String(email).trim().toLowerCase();
    const alreadyThere = await User.exists({ email: normalized });
    if (alreadyThere) {
      continue;
    }

    const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);
    await User.create({
      email: normalized,
      password: hashed,
      role: 'student',
    });
    created += 1;
  }

  if (created < SEED_USERS.length) {
    const skipped = SEED_USERS.length - created;
    console.log(
      `Note: ${skipped} user(s) were skipped (email already exists).`
    );
  }

  console.log('Users seeded successfully');
}

(async () => {
  try {
    await main();
  } catch (err) {
    console.error('Seed failed:', err.message || err);
    process.exitCode = 1;
  } finally {
    try {
      await mongoose.disconnect();
    } catch (disconnectErr) {
      console.error('Disconnect error:', disconnectErr.message || disconnectErr);
      process.exitCode = 1;
    }
  }
})();
