const dbName = process.env.DB_NAME;
console.log('🚀 ~ dbName:', dbName);
//
const dbColec = process.env.DB_COLEC;
console.log('🚀 ~ dbColec:', dbColec);
//
const pass = process.env.PASS;
console.log('🚀 ~ pass:', pass);
//
const uri1 = process.env.URI1;
const uri2 = process.env.URI2;
const uri3 = process.env.URI3;
//
module.exports.dbName = dbName;
module.exports.dbColec = dbColec;
module.exports.pass = pass;
module.exports.uri1 = uri1;
module.exports.uri2 = uri2;
module.exports.uri3 = uri3;
