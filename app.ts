import * as fs from 'fs';

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

