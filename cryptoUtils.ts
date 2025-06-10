import * as crypto from 'crypto';
import { promisify } from 'util';
import * as fs from 'fs';

const generateKeyPairAsync = promisify(crypto.generateKeyPair);


interface AesEncryptResult {
  iv: Buffer;
  encrypted: Buffer;
}

export class CryptoUtils {
  static async generateKeyPair(): Promise<{
    privateKey: string;
    publicKey: string;
  }> {
    /**
     * Generate a 2048-bit RSA key pair.
     * Returns: privateKey (PEM), publicKey (PEM)
     */
    const { publicKey, privateKey } = await generateKeyPairAsync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    return { privateKey, publicKey };
  }

  static aesEncrypt(data: Buffer, key: Buffer): AesEncryptResult {
    /**
     * Encrypt data using AES-256 in CBC mode with PKCS7 padding.
     * Args:
     *   data: Data to encrypt
     *   key: 32-byte AES key
     * Returns:
     *   iv: Initialization vector
     *   encrypted: Encrypted data
     */
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    // Node.js crypto module automatically handles PKCS7 padding
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return { iv, encrypted };
  }

  static aesDecrypt(iv: Buffer, data: Buffer, key: Buffer): Buffer {
    /**
     * Decrypt AES-CBC encrypted data.
     * Args:
     *   iv: Initialization vector
     *   data: Encrypted data
     *   key: AES key
     * Returns:
     *   Decrypted plaintext
     */
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    // Node.js automatically removes PKCS7 padding
    let decrypted = decipher.update(data);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted;
  }
}