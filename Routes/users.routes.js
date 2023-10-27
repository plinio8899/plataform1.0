import { Router } from "express";
import {deleteUsers, getUsers, postUsers, updateUsers} from "../Controllers/users.controllers.js"

const router = Router();

router.get("/users", getUsers);

router.post("/users", postUsers);

router.delete("/users", deleteUsers)

router.patch("/users", updateUsers)

export default router;