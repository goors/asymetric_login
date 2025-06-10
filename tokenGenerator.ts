import * as crypto from 'crypto';
import { CryptoUtils } from './cryptoUtils';


// Helper function to convert standard base64 to URL-safe base64
function toUrlSafeBase64(input: string): string {
  return btoa(input)
    .replace(/\+/g, '-') // Replace + with -
    .replace(/\//g, '_') // Replace / with _
    .replace(/=+$/, ''); // Remove trailing =
}

interface TokenPayload {
  email: string;
  timestamp: string;
  company_id: any;
}

interface SignedData {
  payload: string;
  signature: string;
}

interface TokenData {
  key: string;
  iv: string;
  data: string;
}
export class TokenGenerator {
  static createToken(
    email: string,
    company_id: any,
    recipientPublicKeyPem: string,
    ourPrivateKeyPem: string
  ): string {
    /**
     * Create a secure token containing an email and timestamp, signed and encrypted.
     * Args:
     *   email: User's email address
     *   recipientPublicKeyPem: Recipient's public key in PEM format
     *   ourPrivateKeyPem: Our own private key in PEM format
     * Returns:
     *   A base64-url encoded secure token string
     */
    // Load our private RSA key
    const ourPrivateKey = crypto.createPrivateKey(ourPrivateKeyPem);

    // Load recipient's public RSA key
    const recipientPublicKey = crypto.createPublicKey(recipientPublicKeyPem);

    // Create a payload with email and UTC timestamp
    const payload: TokenPayload = {
      email,
      timestamp: new Date().toISOString(),
      company_id,
    };
    const payloadBytes = Buffer.from(JSON.stringify(payload));

    // Sign the payload using our private key with PSS padding
    const signature = crypto.sign(
      'sha256',
      payloadBytes,
      {
        key: ourPrivateKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN,
      }
    );

    // Combine payload and signature into a JSON object
    const signed: SignedData = {
      payload: payloadBytes.toString('base64'),
      signature: signature.toString('base64'),
    };
    const signedBytes = Buffer.from(JSON.stringify(signed));

    // Generate a random AES key for encrypting the signed data
    const aesKey = crypto.randomBytes(32);
    const { iv, encrypted: encryptedSigned } = CryptoUtils.aesEncrypt(signedBytes, aesKey);

    // Encrypt AES key using recipient's RSA public key with OAEP padding
    const encryptedKey = crypto.publicEncrypt(
      {
        key: recipientPublicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      aesKey
    );

    // Create the final token as a JSON object
    const tokenData: TokenData = {
      key: encryptedKey.toString('base64'),
      iv: iv.toString('base64'),
      data: encryptedSigned.toString('base64'),
    };

    // Return base64-url encoded token using btoa
    return `${toUrlSafeBase64(JSON.stringify(tokenData))}==`;
  }
}
