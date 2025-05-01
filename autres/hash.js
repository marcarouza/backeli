// const crypto = require('crypto');
import crypto from 'crypto';



const randomString = crypto.randomBytes(64).toString('hex');
console.log(randomString);
