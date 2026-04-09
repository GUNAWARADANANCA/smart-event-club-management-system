/**
 * Create Event Admin and Finance Admin accounts (database itpm, collection users).
 * Run from backend: node scripts/seed-admins.js
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

const ADMIN_USERS = [
  {
    email: 'events.admin@university.edu',
    password: 'EventAdmin2026!',
    role: 'event_admin',
  },
  {
    email: 'finance.admin@university.edu',
    password: 'FinanceAdmin2026!',
    role: 'finance_admin',
  },
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

  for (const { email, password, role } of ADMIN_USERS) {
    const normalized = String(email).trim().toLowerCase();
    const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const existing = await User.findOne({ email: normalized });
    if (existing) {
      await User.updateOne(
        { _id: existing._id },
        { $set: { password: hashed, role } }
      );
      console.log(`Updated admin: ${normalized} (${role})`);
      continue;
    }

    await User.create({
      email: normalized,
      password: hashed,
      role,
    });
    console.log(`Created admin: ${normalized} (${role})`);
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
