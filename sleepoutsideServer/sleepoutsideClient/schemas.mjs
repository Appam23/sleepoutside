// Collections:
// 1. products
// 2. users
// 3. orders
// 4. reviews
// 5. alerts

export const userSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "User",
  description: "Schema for a SleepOutside user",
  type: "object",

  required: [
    "_id",
    "username",
    "email",
    "passwordHash",
    "cart",
    "createdAt",
    "modifiedAt"
  ],

  properties: {
    _id: {
      type: "string",
      description: "Unique identifier for the user"
    },

    username: {
      type: "string",
      minLength: 3,
      maxLength: 30,
      description: "The user's unique username"
    },

    email: {
      type: "string",
      format: "email",
      description: "The user's email address"
    },

    passwordHash: {
      type: "string",
      minLength: 1,
      description: "The user's securely hashed password"
    },

    firstName: {
      type: "string",
      maxLength: 50,
      description: "The user's first name"
    },

    lastName: {
      type: "string",
      maxLength: 50,
      description: "The user's last name"
    },

    address: {
      type: "object",

      required: [
        "street",
        "city",
        "state",
        "postalCode",
        "country"
      ],

      properties: {
        street: {
          type: "string"
        },

        city: {
          type: "string"
        },

        state: {
          type: "string"
        },

        postalCode: {
          type: "string"
        },

        country: {
          type: "string"
        }
      },

      additionalProperties: false
    },

    cart: {
      type: "array",

      items: {
        type: "object",

        required: [
          "productId",
          "quantity",
          "priceAtAdd"
        ],

        properties: {
          productId: {
            type: "string",
            description: "The ID of the product in the cart"
          },

          quantity: {
            type: "integer",
            minimum: 1,
            description: "The number of products in the cart"
          },

          priceAtAdd: {
            type: "number",
            minimum: 0,
            description: "The product price when it was added to the cart"
          }
        },

        additionalProperties: false
      }
    },

    createdAt: {
      type: "string",
      format: "date-time",
      description: "When the user account was created"
    },

    modifiedAt: {
      type: "string",
      format: "date-time",
      description: "When the user account was last modified"
    }
  },

  additionalProperties: false
};

export const orderSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Order",
  description: "Schema for a customer order",
  type: "object",

  required: [
    "_id",
    "orderNumber",
    "userId",
    "items",
    "shippingAddress",
    "subtotal",
    "tax",
    "shippingCost",
    "total",
    "status",
    "createdAt",
    "modifiedAt"
  ],

  properties: {
    _id: {
      type: "string",
      description: "Unique identifier for the order"
    },

    orderNumber: {
      type: "string",
      description: "Human-readable order number"
    },

    userId: {
      type: "string",
      description: "Reference to the user who placed the order"
    },

    items: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",

        required: [
          "productId",
          "name",
          "quantity",
          "unitPrice",
          "subtotal"
        ],

        properties: {
          productId: {
            type: "string",
            description: "Reference to the purchased product"
          },

          name: {
            type: "string",
            description: "Product name at the time of purchase"
          },

          quantity: {
            type: "integer",
            minimum: 1,
            description: "Quantity ordered"
          },

          unitPrice: {
            type: "number",
            minimum: 0,
            description: "Price per item at time of purchase"
          },

          subtotal: {
            type: "number",
            minimum: 0,
            description: "Subtotal for this line item"
          }
        },

        additionalProperties: false
      }
    },

    shippingAddress: {
      type: "object",

      required: [
        "street",
        "city",
        "state",
        "postalCode",
        "country"
      ],

      properties: {
        street: {
          type: "string"
        },

        city: {
          type: "string"
        },

        state: {
          type: "string"
        },

        postalCode: {
          type: "string"
        },

        country: {
          type: "string"
        }
      },

      additionalProperties: false
    },

    subtotal: {
      type: "number",
      minimum: 0,
      description: "Order subtotal before tax and shipping"
    },

    tax: {
      type: "number",
      minimum: 0,
      description: "Tax for the order"
    },

    shippingCost: {
      type: "number",
      minimum: 0,
      description: "Shipping cost for the order"
    },

    total: {
      type: "number",
      minimum: 0,
      description: "Final order total"
    },

    status: {
      type: "string",
      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled"
      ],
      description: "Current status of the order"
    },

    createdAt: {
      type: "string",
      format: "date-time",
      description: "When the order was created"
    },

    modifiedAt: {
      type: "string",
      format: "date-time",
      description: "When the order was last modified"
    }
  },

  additionalProperties: false
};
export const reviewSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Review",
  description: "Schema for a product review",
  type: "object",

  required: [
    "_id",
    "productId",
    "userId",
    "rating",
    "comment",
    "createdAt",
    "modifiedAt"
  ],

  properties: {
    _id: {
      type: "string",
      description: "Unique identifier for the review"
    },

    productId: {
      type: "string",
      description: "The product being reviewed"
    },

    userId: {
      type: "string",
      description: "The user who wrote the review"
    },

    rating: {
      type: "integer",
      minimum: 1,
      maximum: 5,
      description: "Rating from 1 to 5"
    },

    title: {
      type: "string",
      maxLength: 100,
      description: "Optional review title"
    },

    comment: {
      type: "string",
      minLength: 1,
      maxLength: 2000,
      description: "The full review text"
    },

    createdAt: {
      type: "string",
      format: "date-time"
    },

    modifiedAt: {
      type: "string",
      format: "date-time"
    }
  },

  additionalProperties: false
};
export const alertSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Alert",
  description: "Schema for a SleepOutside alert",
  type: "object",

  required: [
    "_id",
    "title",
    "message",
    "type",
    "status",
    "createdAt",
    "modifiedAt"
  ],

  properties: {
    _id: {
      type: "string",
      description: "Unique identifier for the alert"
    },

    title: {
      type: "string",
      minLength: 1,
      maxLength: 100,
      description: "Short title of the alert"
    },

    message: {
      type: "string",
      minLength: 1,
      maxLength: 500,
      description: "The body of the alert shown to users"
    },

    type: {
      type: "string",
      enum: [
        "warning",
        "info",
        "promotion"
      ],
      description: "The category of alert"
    },

    status: {
      type: "string",
      enum: [
        "active",
        "inactive"
      ],
      description: "Whether the alert is currently active"
    },

    condition: {
      type: "object",
      description: "Optional condition that determines when the alert should display",
      additionalProperties: true
    },

    createdAt: {
      type: "string",
      format: "date-time"
    },

    modifiedAt: {
      type: "string",
      format: "date-time"
    }
  },

  additionalProperties: false
};