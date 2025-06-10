import * as crypto from 'crypto';
import { promisify } from 'util';
import * as fs from 'fs';

// const generateKeyPairAsync = promisify(crypto.generateKeyPair);

// // Helper function to convert standard base64 to URL-safe base64
// function toUrlSafeBase64(input: string): string {
//   return btoa(input)
//     .replace(/\+/g, '-') // Replace + with -
//     .replace(/\//g, '_') // Replace / with _
//     .replace(/=+$/, ''); // Remove trailing =
// }

// interface AesEncryptResult {
//   iv: Buffer;
//   encrypted: Buffer;
// }

// interface TokenPayload {
//   email: string;
//   timestamp: string;
//   company_id: any;
// }

// interface SignedData {
//   payload: string;
//   signature: string;
// }

// interface TokenData {
//   key: string;
//   iv: string;
//   data: string;
// }

// export class CryptoUtils {
//   static async generateKeyPair(): Promise<{
//     privateKey: string;
//     publicKey: string;
//   }> {
//     /**
//      * Generate a 2048-bit RSA key pair.
//      * Returns: privateKey (PEM), publicKey (PEM)
//      */
//     const { publicKey, privateKey } = await generateKeyPairAsync('rsa', {
//       modulusLength: 2048,
//       publicKeyEncoding: {
//         type: 'spki',
//         format: 'pem',
//       },
//       privateKeyEncoding: {
//         type: 'pkcs8',
//         format: 'pem',
//       },
//     });

//     return { privateKey, publicKey };
//   }

//   static aesEncrypt(data: Buffer, key: Buffer): AesEncryptResult {
//     /**
//      * Encrypt data using AES-256 in CBC mode with PKCS7 padding.
//      * Args:
//      *   data: Data to encrypt
//      *   key: 32-byte AES key
//      * Returns:
//      *   iv: Initialization vector
//      *   encrypted: Encrypted data
//      */
//     const iv = crypto.randomBytes(16);
//     const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

//     // Node.js crypto module automatically handles PKCS7 padding
//     let encrypted = cipher.update(data);
//     encrypted = Buffer.concat([encrypted, cipher.final()]);

//     return { iv, encrypted };
//   }

//   static aesDecrypt(iv: Buffer, data: Buffer, key: Buffer): Buffer {
//     /**
//      * Decrypt AES-CBC encrypted data.
//      * Args:
//      *   iv: Initialization vector
//      *   data: Encrypted data
//      *   key: AES key
//      * Returns:
//      *   Decrypted plaintext
//      */
//     const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

//     // Node.js automatically removes PKCS7 padding
//     let decrypted = decipher.update(data);
//     decrypted = Buffer.concat([decrypted, decipher.final()]);

//     return decrypted;
//   }
// }

// export class TokenGenerator {
//   static createToken(
//     email: string,
//     company_id: any,
//     recipientPublicKeyPem: string,
//     ourPrivateKeyPem: string
//   ): string {
//     /**
//      * Create a secure token containing an email and timestamp, signed and encrypted.
//      * Args:
//      *   email: User's email address
//      *   recipientPublicKeyPem: Recipient's public key in PEM format
//      *   ourPrivateKeyPem: Our own private key in PEM format
//      * Returns:
//      *   A base64-url encoded secure token string
//      */
//     // Load our private RSA key
//     const ourPrivateKey = crypto.createPrivateKey(ourPrivateKeyPem);

//     // Load recipient's public RSA key
//     const recipientPublicKey = crypto.createPublicKey(recipientPublicKeyPem);

//     // Create a payload with email and UTC timestamp
//     const payload: TokenPayload = {
//       email,
//       timestamp: new Date().toISOString(),
//       company_id,
//     };
//     const payloadBytes = Buffer.from(JSON.stringify(payload));

//     // Sign the payload using our private key with PSS padding
//     const signature = crypto.sign(
//       'sha256',
//       payloadBytes,
//       {
//         key: ourPrivateKey,
//         padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
//         saltLength: crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN,
//       }
//     );

//     // Combine payload and signature into a JSON object
//     const signed: SignedData = {
//       payload: payloadBytes.toString('base64'),
//       signature: signature.toString('base64'),
//     };
//     const signedBytes = Buffer.from(JSON.stringify(signed));

//     // Generate a random AES key for encrypting the signed data
//     const aesKey = crypto.randomBytes(32);
//     const { iv, encrypted: encryptedSigned } = CryptoUtils.aesEncrypt(signedBytes, aesKey);

//     // Encrypt AES key using recipient's RSA public key with OAEP padding
//     const encryptedKey = crypto.publicEncrypt(
//       {
//         key: recipientPublicKey,
//         padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
//         oaepHash: 'sha256',
//       },
//       aesKey
//     );

//     // Create the final token as a JSON object
//     const tokenData: TokenData = {
//       key: encryptedKey.toString('base64'),
//       iv: iv.toString('base64'),
//       data: encryptedSigned.toString('base64'),
//     };

//     // Return base64-url encoded token using btoa
//     return toUrlSafeBase64(JSON.stringify(tokenData));
//   }
// }

// Main execution block for standalone script usage
// if (require.main === module) {
  

//     CryptoUtils.generateKeyPair()
//   .then(({ privateKey, publicKey }) => {
//     try {
//       // Load recipient's public key from file
//       const pubKeyBetterSea = fs.readFileSync('bettersea_public.key', 'utf8');

//       // Save our generated keys to files
//       fs.writeFileSync('our_private.key', privateKey, 'utf8');
//       fs.writeFileSync('our_public.key', publicKey, 'utf8');

//       // Load our private key from file (redundant but matches original logic)
//       const privKey = fs.readFileSync('our_private.key', 'utf8');

//       // Generate token for the provided email
//       const token = TokenGenerator.createToken(
//         'EMAIL_OF_A_USER_GOES_HERE',
//         'YOUR_INTERNAL_ID_OF_A_USER_COMPANY_GOES_HERE', // THIS IS IMPORTANT TO ME
//         pubKeyBetterSea,
//         privKey
//       );

//       console.log(
//         `<a href="https://app.bettersea.tech/auth?token=${token}">Go to Bettersea portal</a>`
//       );
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   })
//   .catch((error) => {
//     console.error('Key pair generation error:', error);
//   });

// }


// Import the 'readline' module for handling console input/output
// We use 'import * as' for the common case where 'readline' is a CommonJS module
// but we're consuming it in an ES module context.
import * as readline from 'readline';
import { CryptoUtils } from './cryptoUtils';
import { TokenGenerator } from './tokenGenerator';

// Define an interface for the console interface
interface CLI {
    question(query: string, callback: (answer: string) => void): void;
    close(): void;
}

// Create an interface for reading input from the process.stdin (standard input)
// and writing output to process.stdout (standard output).
const rl: CLI = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * --- Function Definitions for Each Option ---
 * These are the functions that will be called based on the user's selection.
 */

/**
 * Displays a welcome message for Option A.
 */
async function generateKeyPair(): Promise<void> {
    const { privateKey, publicKey } = await CryptoUtils.generateKeyPair();
    fs.writeFileSync('our_private.key', privateKey, 'utf8');
    fs.writeFileSync('our_public.key', publicKey, 'utf8');
    console.log('\n---Keys are generated ---');
}

/**
 * Displays a message for Option B, potentially with some data.
 */
function generateToken(): void {
    const privKey = fs.readFileSync('our_private.key', 'utf8');
    const pubKeyBetterSea = fs.readFileSync('bettersea_public.key', 'utf8');
      // Generate token for the provided email
    const token = TokenGenerator.createToken(
        'EMAIL_OF_A_USER_GOES_HERE',
        'YOUR_INTERNAL_ID_OF_A_USER_COMPANY_GOES_HERE', // THIS IS IMPORTANT TO ME PLASE DO NOT FORGET TO INCLUDE
        pubKeyBetterSea,
        privKey
    );

    console.log(
        `<a href="https://app.bettersea.tech/auth?token=${token}">Go to Bettersea portal</a>`
    );
}

/**
 * Exits the application gracefully.
 */
function exitApplication(): void {
    console.log('\n--- Exiting the application. Goodbye! ---');
    rl.close(); // Close the readline interface, which allows the process to exit
    process.exit(0); // Explicitly exit the Node.js process
}

/**
 * --- Main Application Logic ---
 * This section defines the options and the prompt loop.
 */

// Define an interface for each option's structure
interface MenuOption {
    text: string;
    handler: () => void;
}

// Define the available options and their corresponding functions.
// The key is the option number, and the value is an object containing
// the display text and the function to call.
const options: { [key: number]: MenuOption } = {
    1: { text: 'Generate private public key for our system', handler: generateKeyPair },
    2: { text: 'Generate token', handler: generateToken },
    3: { text: 'Exit Application', handler: exitApplication }
};

/**
 * Displays the main menu prompt to the user,
 * reads their input, and dispatches to the correct handler.
 */
function showMainMenu(): void {
    console.log('\n-----------------------------------');
    console.log('  Welcome to the Node.js Console App');
    console.log('-----------------------------------');
    console.log('Please choose an option:');

    // Iterate over the options object to display them to the user
    for (const key in options) {
        // Ensure we only iterate over own properties of the object
        if (Object.prototype.hasOwnProperty.call(options, key)) {
            console.log(`${key}. ${options[key].text}`);
        }
    }

    // Prompt the user for their choice
    rl.question('Enter your choice (1-' + Object.keys(options).length + '): ', (answer: string) => {
        const choice: number = parseInt(answer.trim()); // Parse the input to an integer

        // Check if the choice is a valid number and exists in our options
        if (options[choice] && typeof options[choice].handler === 'function') {
            options[choice].handler(); // Call the corresponding function
            // If the handler was not the exit function, show the menu again
            if (choice !== Object.keys(options).length) {
                showMainMenu();
            }
        } else {
            console.log('\nInvalid choice. Please enter a number between 1 and ' + Object.keys(options).length + '.');
            showMainMenu(); // If invalid, show the menu again
        }
    });
}

// Start the application by showing the main menu
showMainMenu();

