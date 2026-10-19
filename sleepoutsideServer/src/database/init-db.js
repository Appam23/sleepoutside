
import { MongoClient, ServerApiVersion } from "mongodb";
import * as argon2 from "argon2";
import { products } from "./products.js";

// Get database connection information
const uri = process.env.MONGO_URI;
const databaseName = process.env.MONGO_DATABASE;

// Check environment variables
if (!uri) {
  throw new Error("MONGO_URI is missing from the .env file");
}

if (!databaseName) {
  throw new Error("MONGO_DATABASE is missing from the .env file");
}

// Create MongoDB client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Convert the first letter of object keys to lowercase
function lowerCaseKeys(value) {
  if (Array.isArray(value)) {
    return value.map(lowerCaseKeys);
  }

  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key.charAt(0).toLowerCase() + key.slice(1),
        lowerCaseKeys(nestedValue),
      ]),
    );
  }

  return value;
}

// Drop an existing collection and create a new one
async function resetCollection(db, collectionName) {
  try {
    await db.collection(collectionName).drop();
  } catch (error) {
    if (error.codeName !== "NamespaceNotFound") {
      throw error;
    }
  }

  await db.createCollection(collectionName);
}

// Create products collection and insert products
async function seedProducts(db) {
  await resetCollection(db, "products");

  const productCollection = db.collection("products");

  const updatedProducts = products.map((product) => {
    const formattedProduct = lowerCaseKeys(product);

    formattedProduct.reviews.reviewsUrl =
      `/products/${formattedProduct.id.toLowerCase()}/reviews/`;

    return formattedProduct;
  });

  // Insert products
  if (updatedProducts.length > 0) {
    await productCollection.insertMany(updatedProducts);
  }

  // Create product indexes
  await productCollection.createIndex({ name: 1 });
  await productCollection.createIndex({ description: 1 });
  await productCollection.createIndex({ category: 1 });
  await productCollection.createIndex({ id: 1 });

  console.log(`Inserted ${updatedProducts.length} products`);
  console.log("Product indexes created successfully");
}

// Create alerts collection
async function seedAlerts(db) {
  await resetCollection(db, "alerts");

  console.log("Alerts collection created successfully");
}

// Create orders collection
async function seedOrders(db) {
  await resetCollection(db, "orders");

  console.log("Orders collection created successfully");
}

// Create users collection and insert test user
async function seedUsers(db) {
  await resetCollection(db, "users");

  const userCollection = db.collection("users");

  // Hash password using Argon2
  const hashedPassword = await argon2.hash("password123");

  // Create test user
  const testUser = {
    name: "Test User",
    email: "test@example.com",
    password_hash: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Create user indexes
  await userCollection.createIndex({ name: 1 });
  await userCollection.createIndex(
    { email: 1 },
    { unique: true }
  );

  // Insert test user
  await userCollection.insertOne(testUser);

  console.log("Test user inserted successfully");
  console.log("User indexes created successfully");
}

// Main database initialization function
async function init() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    // Select database
    const db = client.db(databaseName);

    // Initialize all collections
    await seedProducts(db);
    await seedAlerts(db);
    await seedOrders(db);
    await seedUsers(db);

    console.log(`Database initialized: ${databaseName}`);
    console.log("All collections initialized successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exitCode = 1;
  } finally {
    // Close MongoDB connection
    await client.close();
    console.log("MongoDB connection closed");
  }
}

// Start database initialization
init();
