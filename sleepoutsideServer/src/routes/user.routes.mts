import { Router } from "express";
import EntityNotFoundError from "../errors/EntityNotFoundError.mts";
import authorize from "../middleware/authorize.mts";
import userService from "../services/user.service.mts";
import { sanitize } from "../services/utils.mts";

const router: Router = Router();

router.post("/login", async (req, res, next) => {
  try {
    const body = sanitize({ ...req.body });
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    const { user, token } = await userService.login(email, password);

    if (!user || !token) {
      next(
        new EntityNotFoundError({
          message: "Invalid email or password",
          statusCode: 401,
          code: "ERR_VALID",
        })
      );
      return;
    }

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const body = sanitize({ ...req.body });
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const user = await userService.register(email, password, name);

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/protected", authorize, (req, res) => {
  res.json({ message: `Hello, ${res.locals.user.name}!` });
});

export default router;
