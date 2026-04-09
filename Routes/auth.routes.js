import { Router } from "express";
import { getLogin, postLogin } from "../Controllers/auth.controllers.js";
import { validateLogin } from "../Middlewares/validation.middleware.js";
import { isGuest } from "../Middlewares/auth.middleware.js";

const router = Router();

router.get('/', isGuest, getLogin);
router.post('/', validateLogin, postLogin);

export default router;
