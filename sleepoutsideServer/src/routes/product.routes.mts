
import { Router } from "express";
import productService from "../services/product.service.mts";
import EntityNotFoundError from "../errors/EntityNotFoundError.mts";
import type { QueryParams } from "../models/types.mts";
import { buildPaginationWrapper, sanitize } from "../services/utils.mts";

const router: Router = Router();

// GET /products
// Get all products, search, filter, and paginate
router.get("/", async (req, res, next) => {
  try {
    const cleanQuery = sanitize({ ...req.query });
    const query: QueryParams = {
      q: typeof req.query.q === "string" ? req.query.q : undefined,
      category:
        typeof req.query.category === "string"
          ? req.query.category
          : undefined,
      fields:
        typeof req.query.fields === "string"
          ? req.query.fields
          : undefined,
      limit:
        typeof req.query.limit === "string"
          ? req.query.limit
          : undefined,
      offset:
        typeof req.query.offset === "string"
          ? req.query.offset
          : undefined,
    };

    const result = await productService.getAllProducts(query);

// Check if any products were found
if (result.total === 0) {
  return next(
    new EntityNotFoundError({
      message: "No products found matching your search",
      code: "ERR_NF",
      statusCode: 404,
    })
  );
}

// Build the pagination response
const pagination = buildPaginationWrapper(result.total, query);

// Add the products to the results array
pagination.results = result.products;

// Send the formatted response
res.status(200).json(pagination);
  } catch (error) {
    next(error);
  }
});

// GET /products/:id
// Get a single product by ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(
        new EntityNotFoundError({
          message: "Id required",
          code: "ERR_VALID",
          statusCode: 400,
        })
      );
    }

    const product = await productService.getProductById(id);

    if (!product) {
      return next(
        new EntityNotFoundError({
          message: `Product ${id} Not Found`,
          code: "ERR_NF",
          statusCode: 404,
        })
      );
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

export default router;
