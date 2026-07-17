import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { getProduct } from '../utils/product-data';

// The Products API endpoint (relative to baseURL in playwright.config.ts).
const RECORDS = '/api/collections/products/records';

// .serial => these tests run in the written order and stop if one fails.
// We need this because TC-02 creates a product and saves its id, which
// TC-03 / TC-04 / TC-05 then reuse (same chaining you did in Postman).
test.describe.serial('Products API - CRUD lifecycle', () => {
  let productId: string;
  const product = getProduct(); // first row of api_test.csv

  test('TC-01: List products returns 200', async ({ request }) => {
    await allure.epic('Products API');
    await allure.feature('CRUD');
    await allure.story('List products');
    await allure.severity('normal');

    const response = await request.get(RECORDS);
    const body = await response.json();
    await allure.attachment('Response', JSON.stringify(body, null, 2), 'application/json');

    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('data');
  });

  test('TC-02: Create product returns 201 and echoes the fields we sent', async ({ request }) => {
    await allure.epic('Products API');
    await allure.feature('CRUD');
    await allure.story('Create product');
    await allure.severity('critical');

    const payload = {
      data: {
        name: product.name,
        price: product.price,
        category: product.category,
        in_stock: product.in_stock,
      },
    };

    const response = await request.post(RECORDS, { data: payload });
    const body = await response.json();

    await allure.attachment('Request', JSON.stringify(payload, null, 2), 'application/json');
    await allure.attachment('Response', JSON.stringify(body, null, 2), 'application/json');

    expect(response.status()).toBe(201);

    // reqres wraps the created record under body.data.data (see PPT slide 30).
    const created = body.data.data;
    expect(created.name).toBe(product.name);
    expect(created.price).toBe(product.price);
    expect(created.category).toBe(product.category);
    expect(created.in_stock).toBe(product.in_stock);

    // Save the id for the next tests — this is the Playwright equivalent of
    // Postman's pm.environment.set("user_Id", ...).
    productId = body.data.id;
    expect(productId).toBeTruthy();
  });

  test('TC-03: Get the product by ID returns 200', async ({ request }) => {
    await allure.story('Get product by ID');
    await allure.severity('critical');

    const response = await request.get(`${RECORDS}/${productId}`);
    const body = await response.json();
    await allure.attachment('Response', JSON.stringify(body, null, 2), 'application/json');

    expect(response.status()).toBe(200);
    expect(body.data.id).toBe(productId);
  });

  test('TC-04: Update the product returns 200', async ({ request }) => {
    await allure.story('Update product');
    await allure.severity('critical');

    const payload = {
      data: {
        name: product.name,
        price: 60.0, // change the price, like the PPT example
        category: product.category,
        in_stock: product.in_stock,
      },
    };

    const response = await request.put(`${RECORDS}/${productId}`, { data: payload });
    const body = await response.json();
    await allure.attachment('Response', JSON.stringify(body, null, 2), 'application/json');

    expect(response.status()).toBe(200);
    expect(body.data.data.price).toBe(60.0);
  });

  test('TC-05: Delete the product returns 204', async ({ request }) => {
    await allure.story('Delete product');
    await allure.severity('critical');

    const response = await request.delete(`${RECORDS}/${productId}`);
    expect(response.status()).toBe(204);
  });

  // ---------- Negative scenarios (from the PPT summary matrix) ----------

  test('TC-06: Request without the API key returns 401', async ({ playwright }) => {
    await allure.feature('Negative');
    await allure.story('Missing API key');
    await allure.severity('normal');

    // A brand-new request context that deliberately has NO x-api-key header.
    const noKey = await playwright.request.newContext({
      baseURL: 'https://reqres.in',
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });
    const response = await noKey.get(RECORDS);
    expect(response.status()).toBe(401);
    await noKey.dispose();
  });

  test('TC-07: Get a non-existent product returns 404', async ({ request }) => {
    await allure.feature('Negative');
    await allure.story('Invalid record ID');
    await allure.severity('normal');

    const response = await request.get(`${RECORDS}/does-not-exist-123`);
    expect(response.status()).toBe(404);
  });
});
