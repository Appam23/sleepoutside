
import { Router } from "express";
import productRoutes from "./product.routes.mjs";
import swaggerRouter from "./swagger.routes.mjs";

const router: Router = Router();

// The home page route
router.get("/", (req, res) => {
  res.json({ title: "API V1" });
});

// Load product routes
router.use("/products", productRoutes);

// Load Swagger documentation routes
router.use(swaggerRouter);

// Export the router
export default router;
