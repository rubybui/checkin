import { config } from '../config';
import crypto from 'react-native-quick-crypto';
import { Buffer } from 'buffer';

const IV_LENGTH = 16;
const KEY_LENGTH = 16;

export function encrypt(text: string): string {
  const key = config.encryptionKey;
  // Prepare key and IV
  const keyBuffer = Buffer.from(key, 'utf8').slice(0, KEY_LENGTH); // AES-128
  const iv = crypto.randomBytes(IV_LENGTH);

  // Encrypt
  const cipher = crypto.createCipheriv('aes-128-ctr', keyBuffer, iv);
  const encrypted = Buffer.concat([cipher.update(Buffer.from(text, 'utf8')), cipher.final()]);

  // Concatenate iv + ciphertext (as raw binary) and base64 encode it
  const combined = Buffer.concat([iv, encrypted]);

  return combined.toString('base64');
}
