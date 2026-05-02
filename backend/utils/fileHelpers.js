const crypto = require('crypto');

// Generate MD5 hash of filename and size
const generateFileHash = (filename, size) => {
  const hash = crypto.createHash('md5');
  hash.update(`${filename}-${size}`);
  return hash.digest('hex');
};

module.exports = {
  generateFileHash
};
