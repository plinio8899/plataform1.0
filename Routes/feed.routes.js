import { Router } from "express";
import { getFeed, postFeed, postReaction, postComment } from "../Controllers/feed.controllers.js";
import { verifyRange } from "../Middlewares/range.middleware.js";

const router = Router();

router.get('/', verifyRange, getFeed);
router.post('/', verifyRange, postFeed);
router.post('/reaction', verifyRange, postReaction);
router.post('/comment', verifyRange, postComment);

export default router;
