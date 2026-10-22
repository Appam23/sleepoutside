import type { Product } from "./types.mts";

const apiUrl = (
  import.meta.env.PUBLIC_SERVER_URL ?? "http://localhost:3000/api/v1/"
).replace(/\/?$/, "/");

export async function findProductById(id: string): Promise<Product> {
  const response = await fetch(
    `${apiUrl}products/${id}`,
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
    `${apiUrl}products?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Unable to load products");
  }

  return await response.json();
}
