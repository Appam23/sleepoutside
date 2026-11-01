
import { Router } from "express";
import productRoutes from "./product.routes.mts";
import swaggerRouter from "./swagger.routes.mts";
import userRoutes from "./user.routes.mts";

const router: Router = Router();

// The home page route
router.get("/", (req, res) => {
  res.json({ title: "API V1" });
});

// Load product routes
router.use("/products", productRoutes);
router.use("/users", userRoutes);

// Load Swagger documentation routes
router.use(swaggerRouter);

// Export the router
export default router;
