
import type {
  QueryParams,
  FindProductObj,
  Product,
} from "../models/types.mts";

import productModel from "../models/product.model.mts";
import { formatFields } from "./utils.mts";

export async function getAllProducts(query: QueryParams) {
  const findProduct: FindProductObj = {
    search: {},
    limit: Number(query.limit ?? 20),
    offset: Number(query.offset ?? 0),
  };

  // Search by product name or description
  if (query.q) {
    findProduct.search = {
      $or: [
        {
          name: {
            $regex: query.q,
            $options: "i",
          },
        },
        {
          descriptionHtmlSimple: {
            $regex: query.q,
            $options: "i",
          },
        },
      ],
    };
  }

  // Filter by category
  if (query.category) {
    const validCategories: Product["category"][] = [
      "tents",
      "backpacks",
      "sleeping-bags",
      "hammocks",
    ];

    if (
      validCategories.includes(
        query.category as Product["category"]
      )
    ) {
      findProduct.search = {
        ...findProduct.search,
        category: query.category as Product["category"],
      };
    } else {
      throw new Error("Invalid product category");
    }
  }

  // Select specific fields
  if (query.fields) {
    findProduct.fields = formatFields(query.fields);
  }

  // Get products from the model
  return await productModel.getAllProducts(findProduct);
}

const getProductById = async (id: string) => {
  return await productModel.getProductById(id);
};

export default {
  getAllProducts,
  getProductById,
};
