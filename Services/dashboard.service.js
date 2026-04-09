import { db } from "../db/index.js";

export const getUserData = async (id) => {
    try {
        const user = await db.users.findFirst({
            where: { id: id }
        });

        if (!user) {
            return null;
        }

        return {
            id: user.id,
            name: user.name,
            phone: user.phone,
            sexo: user.sexo,
            rango: user.rango,
            cuest: user.cuesStatus,
            rol: user.rol,
            points: user.points,
            totalPoints: user.totalPoints
        };
    } catch (error) {
        throw new Error("Error al obtener datos del usuario: " + error.message);
    }
};

export const getQuestions = async () => {
    try {
        return await db.cuest.findMany();
    } catch (error) {
        throw new Error("Error al obtener preguntas: " + error.message);
    }
};

export const processCuestionario = async (id, respuestas) => {
    try {
        const cuesBd = await db.cuest.findMany();
        let points = 0;

        for (let i = 0; i < 10; i++) {
            if (cuesBd[i] && respuestas[i] && cuesBd[i].repTrue == respuestas[i]) {
                points += cuesBd[i].cuestPoints;
            }
        }

        const getUser = await db.users.findFirst({
            where: { id: id }
        });

        const pointsResult = getUser.points + points;
        const totalPointsresult = getUser.totalPoints + points;

        await db.users.update({
            where: { id: id },
            data: {
                cuesStatus: 0,
                points: pointsResult,
                totalPoints: totalPointsresult
            }
        });

        return { points, totalPoints: pointsResult };
    } catch (error) {
        throw new Error("Error al procesar cuestionario: " + error.message);
    }
};

export const processCode = async (id, code) => {
    try {
        const coder = await db.codes.findFirst({
            where: { code: code }
        });

        if (!coder) {
            return { success: false, error: "Código incorrecto" };
        }

        let plusPoints = 0;
        const codeLength = code.toString().length;

        if (codeLength === 10) plusPoints = 60;
        else if (codeLength === 9) plusPoints = 50;
        else if (codeLength === 8) plusPoints = 40;
        else if (codeLength === 7) plusPoints = 30;
        else return { success: false, error: "Código incorrecto" };

        const user = await db.users.findFirst({
            where: { id: id }
        });

        await db.users.update({
            where: { id: id },
            data: {
                points: user.points + plusPoints,
                totalPoints: user.totalPoints + plusPoints
            }
        });

        await db.codes.delete({
            where: { code: code }
        });

        return { success: true, points: plusPoints };
    } catch (error) {
        throw new Error("Error al procesar código: " + error.message);
    }
};

export const updateQuestion = async (idp, preg, op1, op2, op3, op4, repTrue, cuestPoints) => {
    try {
        return await db.cuest.update({
            where: { id: idp },
            data: {
                preg: preg,
                op1: op1,
                op2: op2,
                op3: op3,
                op4: op4,
                repTrue: repTrue,
                cuestPoints: parseInt(cuestPoints)
            }
        });
    } catch (error) {
        throw new Error("Error al actualizar pregunta: " + error.message);
    }
};

export const activateTasks = async (estado) => {
    try {
        return await db.users.updateMany({
            where: {
                NOT: { rol: "Administrador" }
            },
            data: { cuesStatus: estado }
        });
    } catch (error) {
        throw new Error("Error al activar tareas: " + error.message);
    }
};

export const addGamePoints = async (id, points) => {
    try {
        const passB = await db.users.findFirst({
            where: { id: id }
        });

        const newPoints = passB.points + points;
        const newTotalPoints = passB.totalPoints + points;
        const newCuesStatus = passB.cuesStatus - 1;

        await db.users.update({
            where: { id: id },
            data: {
                points: newPoints,
                totalPoints: newTotalPoints,
                cuesStatus: newCuesStatus
            }
        });

        return { points: newPoints, totalPoints: newTotalPoints };
    } catch (error) {
        throw new Error("Error al agregar puntos del juego: " + error.message);
    }
};

export const resetWeeklyPoints = async () => {
    try {
        const setPoints = await db.points.findFirst({
            where: { id: 1 }
        });

        const pushHombres = await db.users.aggregate({
            where: { sexo: "man" },
            _sum: { points: true }
        });

        const pushMujeres = await db.users.aggregate({
            where: { sexo: "woman" },
            _sum: { points: true }
        });

        let hPoints = parseInt(pushHombres._sum.points || 0) + parseInt(setPoints.man);
        let mPoints = parseInt(pushMujeres._sum.points || 0) + parseInt(setPoints.woman);

        await db.points.update({
            where: { id: 1 },
            data: { man: hPoints, woman: mPoints }
        });

        await db.users.updateMany({
            data: { points: 0 }
        });

        return { hPoints, mPoints };
    } catch (error) {
        throw new Error("Error al resetear puntos semanales: " + error.message);
    }
};

export const addPrivatePoints = async (puntos, sexo) => {
    try {
        const pointsBd = await db.points.findMany();
        let hPoints = parseInt(pointsBd[0].man);
        let mPoints = parseInt(pointsBd[0].woman);

        if (sexo === "man") {
            await db.points.update({
                where: { id: 1 },
                data: { man: hPoints + puntos }
            });
            return { man: hPoints + puntos, woman: mPoints };
        } else if (sexo === "woman") {
            await db.points.update({
                where: { id: 1 },
                data: { woman: mPoints + puntos }
            });
            return { man: hPoints, woman: mPoints + puntos };
        }
    } catch (error) {
        throw new Error("Error al agregar puntos privados: " + error.message);
    }
};

export const getPointsRanking = async (id) => {
    try {
        const getUser = await db.users.findFirst({
            where: { id: id }
        });

        const sexoU = getUser.sexo === "man" ? "man" : "woman";

        const getUsers = await db.users.findMany({
            select: {
                name: true,
                points: true,
                totalPoints: true
            },
            where: {
                id: { notIn: [1, 2, 3, 4] },
                sexo: sexoU
            },
            orderBy: { totalPoints: 'desc' }
        });

        return {
            getUsers,
            totalPoints: getUser.totalPoints,
            currentPoints: getUser.points,
            rol: getUser.rol
        };
    } catch (error) {
        throw new Error("Error al obtener ranking: " + error.message);
    }
};
