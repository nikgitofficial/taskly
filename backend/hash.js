import bcrypt from 'bcryptjs';
const hashed = await bcrypt.hash("123", 10);
console.log(hashed);
