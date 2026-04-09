import { db } from "../db/index.js";

export const getIndex = async (req, res) => {
    try {
        const tPoints = await db.points.findMany({
            where: { id: 1 }
        });

        const pMan = parseInt(tPoints[0].man);
        const pWoman = parseInt(tPoints[0].woman);

        res.render('index', { id: 123, pMan, pWoman });
    } catch (error) {
        res.send(error.message);
    }
};
