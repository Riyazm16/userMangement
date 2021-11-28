const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;
const algorithm = "aes-256-cbc";
const key = crypto.scryptSync(secret, "salt", 32);
const iv = Buffer.alloc(16, 0); // Initialization crypto vector

/**
 * Encrypts text
 * @param {string} text - text to encrypt
 */
const encrypt = (text = null) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

const escapeRegex = (string) => {
  return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

/**
 * Decrypts text
 * @param {string} text - text to decrypt
 */
const decrypt = (text = "") => {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  try {
    let decrypted = decipher.update(text, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return jwt.verify(decrypted, secret);
  } catch (err) {
    return false;
  }
};

module.exports = { encrypt, escapeRegex, decrypt };
