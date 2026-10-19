import type {Product} from "./types.mts"

export async function findProductById(id: string): Promise<Product> {
  const response = await fetch(
    "http://localhost:3000/api/v1/products/" + id,
  );

  if (!response.ok) {
    throw new Error("Unable to find product " + id);
  }

  return await response.json();
}

export async function getProducts(
  q = "",
  category = "",
  limit = 5,
  offset = 0
) {
  const params = new URLSearchParams();

  if (q) params.set("q", q);
  if (category) params.set("category", category);

  params.set("limit", limit.toString());
  params.set("offset", offset.toString());

  const response = await fetch(
    `http://localhost:3000/api/v1/products?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Unable to load products");
  }

  return await response.json();
}
