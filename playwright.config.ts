import { defineConfig } from '@playwright/test';
import 'dotenv/config'; // loads variables from your .env file into process.env

export default defineConfig({
  testDir: './tests',

  // Run tests one at a time so the CRUD flow stays in order
  // (create -> get -> update -> delete on the same product id).
  workers: 1,

  reporter: [
    ['list'], // prints results in the terminal
    ['html', { open: 'never' }], // Playwright's built-in report (no Java needed)
    ['allure-playwright', { resultsDir: 'allure-results' }], // Allure results
  ],

  use: {
    // Every request the tests make starts from this base URL.
    baseURL: 'https://reqres.in/api/collections/products',

    // These headers are attached to every request automatically —
    // exactly like the collection-level headers you set in Postman.
    extraHTTPHeaders: {
      'x-api-key': process.env.API_KEY || '',
      'X-Reqres-Env': 'prod',
      'Content-Type': 'application/json',
    },
  },
});
