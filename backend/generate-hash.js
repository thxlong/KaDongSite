/**
 * Generate bcrypt hash for password
 * Usage: node generate-hash.js
 */

import bcrypt from 'bcrypt';

const password = 'Admin123!@#';
const saltRounds = 10;

try {
  const hash = await bcrypt.hash(password, saltRounds);
  console.log('\n========================================');
  console.log('✅ Password Hash Generated');
  console.log('========================================');
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('========================================\n');
} catch (error) {
  console.error('Error generating hash:', error);
  process.exit(1);
}
