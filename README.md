# Playwright Products API Automation

Playwright (TypeScript) automation for the **reqres.in Products API**, covering the full
CRUD lifecycle plus negative cases, with an Allure report. This mirrors the Postman/Newman
collection from the ASCEND WITH AZEND API Testing session.

## What it tests

| ID    | Scenario              | Method | Expected |
|-------|-----------------------|--------|----------|
| TC-01 | List products         | GET    | 200 |
| TC-02 | Create product        | POST   | 201 |
| TC-03 | Get product by ID     | GET    | 200 |
| TC-04 | Update product        | PUT    | 200 |
| TC-05 | Delete product        | DELETE | 204 |
| TC-06 | Missing API key       | GET    | 401 |
| TC-07 | Invalid record ID     | GET    | 404 |

## Setup

```bash
npm install
npx playwright install
```

Then add your API key:

1. Copy `.env.example` to a new file named `.env`
2. Paste your reqres.in API key into it (same key you used in Postman)

## Run

```bash
npm test                 # run all tests
npx playwright show-report   # open the built-in HTML report (no Java needed)
```

## Allure report (optional — needs Java installed)

```bash
npm run allure
```

## Notes

- The API key lives in `.env`, which is git-ignored, so it is never committed.
- If a status code here differs from what you saw in Postman, adjust the expected
  number in `tests/products.api.spec.ts` — the request structure is identical.
