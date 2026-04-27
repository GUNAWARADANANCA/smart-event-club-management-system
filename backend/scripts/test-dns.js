const dns = require('dns');
const util = require('util');

dns.setServers(['8.8.8.8', '1.1.1.1']);

const resolve4 = util.promisify(dns.resolve4);
const lookup = util.promisify(dns.lookup);

async function test() {
  const host = 'ac-p0qnuvk-shard-00-01.nxqezs4.mongodb.net';
  
  console.log('Testing dns.lookup...');
  try {
    const res1 = await lookup(host);
    console.log('lookup success:', res1);
  } catch (err) {
    console.error('lookup failed:', err.message);
  }

  console.log('\nTesting dns.resolve4...');
  try {
    const res2 = await resolve4(host);
    console.log('resolve4 success:', res2);
  } catch (err) {
    console.error('resolve4 failed:', err.message);
  }
}

test();
