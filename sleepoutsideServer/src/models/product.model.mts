
import mongodb from "../database/index.mts";
import type { Product, FindProductObj } from "./types.mts";
import type { Collection } from "mongodb";

// Get all products with search, pagination, and field selection
async function getAllProducts(findProduct: FindProductObj) {
  const productsCollection: Collection<Product> =
    mongodb.getDb().collection<Product>("products");

  // Count matching products
  const total = await productsCollection.countDocuments(
    findProduct.search
  );

  // Find products matching the search
  const cursor = productsCollection
    .find(findProduct.search)
    .skip(findProduct.offset)
    .limit(findProduct.limit);

  // Select only requested fields
  if (findProduct.fields) {
    cursor.project(findProduct.fields);
  }

  // Convert results to an array
  const products = await cursor.toArray();

  return {
    total,
    products,
  };
}

// Get a single product by ID
async function getProductById(id: string): Promise<Product | null> {
  const product = await mongodb
    .getDb()
    .collection<Product>("products")
    .findOne({ id });

  return product;
}

export default {
  getAllProducts,
  getProductById,
};
