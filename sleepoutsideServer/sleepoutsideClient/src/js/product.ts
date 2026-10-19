console.log("product.ts loaded");
import type { Product } from "./types.mts";
import { setLocalStorage } from "./utils.mts";
import { findProductById } from "./productData.mts";

function addProductToCart(product: Product) {
  setLocalStorage("so-cart", product);
}
// add to cart button event handler
async function addToCartHandler(e: Event) {
  console.log("Add to Cart clicked");
  const target = e.currentTarget as HTMLButtonElement;
  console.log("Product ID:", target.dataset.id);
  if (target.dataset.id) {
    const product = await findProductById(target.dataset.id);
    addProductToCart(product);
  }
}

// add listener to Add to Cart button
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("addToCart")
    ?.addEventListener("click", addToCartHandler);
});

export async function getProducts(
  q = "",
  category = "",
  limit = 5,
  offset = 0
) {
  const params = new URLSearchParams();

  if (q) {
    params.set("q", q);
  }

  if (category) {
    params.set("category", category);
  }

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
