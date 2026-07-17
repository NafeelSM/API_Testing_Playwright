import * as fs from 'fs';
import * as path from 'path';

export interface Product {
  name: string;
  price: number;
  category: string;
  in_stock: boolean;
}

/**
 * Reads the first data row from api_test.csv and returns it as a typed Product.
 * CSV columns (in order): name, price, category, in_stock
 *
 * This keeps the test "data-driven" like the Postman/Newman version, without
 * needing any extra CSV library.
 */
export function getProduct(): Product {
  const csvPath = path.join(__dirname, '..', 'api_test.csv');
  const content = fs.readFileSync(csvPath, 'utf-8').trim();
  const lines = content.split(/\r?\n/);

  const headers = lines[0].split(',').map((h) => h.trim());
  const firstDataRow = lines[1].split(',').map((c) => c.trim());

  const row: Record<string, string> = {};
  headers.forEach((header, i) => (row[header] = firstDataRow[i]));

  return {
    name: row.name,
    price: Number(row.price),
    category: row.category,
    in_stock: row.in_stock.toLowerCase() === 'true',
  };
}
