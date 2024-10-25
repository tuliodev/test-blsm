backend

1. Install the necessary dependencies:
   npm i

2. Create a `.env` file.

3. Put your EOA wallet private key in the `.env` file.

4. Compile the contracts:
   npx hardhat compile

5. Start Hardhat:
   npx hardhat

6. Deploy the contracts to the `amoy` network:
   npx hardhat run scripts/deploy.ts --network amoy

7. To run the tests, use:
   npx hardhat test


frontend

1. Install the necessary dependencies:
   npm i

2. If you are using the contracts running on your machine, update the values of the contracts in the constants (e.g., ABI and address). **Do not** change the USDC values.

3. To start the development server, run:
   npm run dev

4. To run the tests, use:
   npm run test
