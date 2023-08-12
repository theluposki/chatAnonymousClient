import CryptoJS from 'crypto-js';
import config from '../config.js'

function generateHash (data) {
  return CryptoJS.SHA256(data).toString();
};

function encryptValue(value) {
  const encryptedValue = CryptoJS.AES.encrypt(value, generateHash(config.SECRETKEY)).toString();
  return encryptedValue;
}

function decryptValue(encryptedValue) {
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedValue, generateHash(config.SECRETKEY));
  const decryptedValue = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedValue;
}

export { encryptValue, decryptValue }
