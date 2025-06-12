const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex'); // 64 octets en hexadécimal (128 caractères)
console.log(secret);
