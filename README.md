# Crypto Login Console App

A Node.js TypeScript console application for generating RSA key pairs and secure authentication tokens, designed for integration with the BetterSea portal.

## Features

- Generate a new RSA private/public key pair for your system.
- Generate a secure, signed, and encrypted token for user authentication.
- Console-based interactive menu.

## Prerequisites

- [Node.js](https://nodejs.org/) v20 or newer
- [pnpm](https://pnpm.io/) (recommended for dependency management)
- [ts-node](https://typestrong.org/ts-node/) (for running TypeScript directly)

## Setup

1. **Clone the repository**

   ```sh
   git clone <your-repo-url>
   cd crypto_login
   ```

2. **Install dependencies using pnpm**

   ```sh
   pnpm install
   ```

   If you don't have `pnpm` installed, install it globally:

   ```sh
   npm install -g pnpm
   ```

3. **Run the application**

   ```sh
   pnpm exec ts-node app.ts
   ```

   Or, if you have `ts-node` installed globally:

   ```sh
   ts-node app.ts
   ```

## Usage

When you run the app, you'll see a menu:

```
-----------------------------------
  Welcome to the Node.js Console App
-----------------------------------
Please choose an option:
1. Generate private public key for our system
2. Generate token
3. Exit Application
Enter your choice (1-3):
```

- **Option 1:** Generates a new RSA key pair and saves them as `our_private.key` and `our_public.key`.
- **Option 2:** Generates a secure token using the keys and outputs a BetterSea portal link.
- **Option 3:** Exits the application.

## Project Structure

- `app.ts` - Main console application
- `cryptoUtils.ts` - Cryptographic utility functions
- `tokenGenerator.ts` - Token creation logic
- `bettersea_public.key` - BetterSea's public key (required for token generation)
- `our_private.key` / `our_public.key` - Your generated keys

## Notes

- Make sure `bettersea_public.key` is present in the project root before generating tokens.
- The generated token includes both the email and company ID (edit `app.ts` to provide real values).

## License

ISC

## Python version
[python version](https://gist.github.com/goors/cac8c8028f012c06c247599e0b4bebc9) (for running same dman thing in python)
