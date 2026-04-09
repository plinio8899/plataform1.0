import {
    getUserData,
    getQuestions,
    processCuestionario,
    processCode,
    updateQuestion,
    activateTasks,
    addGamePoints,
    resetWeeklyPoints,
    addPrivatePoints,
    getPointsRanking
} from "../Services/dashboard.service.js";

// Vista principal del dashboard
export const getDashboard = async (req, res) => {
    try {
        const id = parseInt(req.query.id);
        const user = await getUserData(id);

        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        res.render('dash', {
            id: user.id,
            usuario: user.name,
            phone: user.phone,
            sexo: user.sexo,
            rango: user.rango,
            cuest: user.cuest,
            rol: user.rol
        });
    } catch (error) {
        res.send(error.message);
    }
};

// Gestión de datos del usuario
export const getDatos = async (req, res) => {
    try {
        const id = parseInt(req.query.id);
        const msg = req.query.msg;
        const user = await getUserData(id);

        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        res.render('datos', {
            id: user.id,
            usuario: user.name,
            phone: user.phone,
            sexo: user.sexo,
            rango: user.rango,
            cuest: user.cuest,
            msg
        });
    } catch (error) {
        res.send(error.message);
    }
};

export const postDatos = async (req, res) => {
    try {
        const id = parseInt(req.query.id);
        const code = parseInt(req.body.code);

        const result = await processCode(id, code);

        if (result.success) {
            res.redirect(`/dashboard/tareas/cuestionario/revision?id=${id}&points=${result.points}&msg=hola`);
        } else {
            res.redirect(`/dashboard/datos?id=${id}&msg=codigoincorrecto`);
        }
    } catch (error) {
        res.send(error.message);
    }
};

// Gestión de tareas
export const getTareas = async (req, res) => {
    try {
        const id = parseInt(req.query.id);
        const user = await getUserData(id);

        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        res.render('ant-cuest', {
            id: user.id,
            usuario: user.name,
            phone: user.phone,
            sexo: user.sexo,
            rango: user.rango,
            cuest: user.cuest,
            rol: user.rol
        });
    } catch (error) {
        res.send(error.message);
    }
};

export const postTareas = async (req, res) => {
    try {
        const id = parseInt(req.query.id);
        const estado = parseInt(req.body.estado);

        if (estado) {
            await activateTasks(estado);
            res.redirect(`/dashboard/tareas?id=${id}`);
        } else {
            const { idp, preg, op1, op2, op3, op4, repTrue, cuestPoints } = req.body;
            await updateQuestion(parseInt(idp), preg, op1, op2, op3, op4, repTrue, cuestPoints);
            res.redirect(`/dashboard/tareas?id=${id}`);
        }
    } catch (error) {
        res.send(error.message);
    }
};

// Cuestionario
export const getCuestionario = async (req, res) => {
    try {
        const id = parseInt(req.query.id);
        const user = await getUserData(id);
        const cuesBd = await getQuestions();

        res.render('cuestionario', {
            id,
            cuest: user.cuest,
            cuesBd
        });
    } catch (error) {
        res.send("Error: " + error.message);
    }
};

export const postCuestionario = async (req, res) => {
    try {
        const id = parseInt(req.query.id);

        // Recopilar respuestas del formulario
        const respuestas = [];
        for (let i = 0; i < 10; i++) {
            respuestas.push(req.body[i]);
        }

        const result = await processCuestionario(id, respuestas);
        res.redirect(`/dashboard/tareas/cuestionario/revision?id=${id}&points=${result.points}&msg=no`);
    } catch (error) {
        res.send("Error: " + error.message);
    }
};

// Resultado del cuestionario
export const getRevision = async (req, res) => {
    try {
        const rev = req.query.points;
        const id = req.query.id;
        const msg = req.query.msg;

        res.render('resultado', { id, rev, msg });
    } catch (error) {
        res.send("Error: " + error.message);
    }
};

// Puntos grupales
export const getPuntos = async (req, res) => {
    try {
        const id = parseInt(req.query.id);
        const rankingData = await getPointsRanking(id);

        res.render('puntos', {
            id,
            totalPoints: rankingData.totalPoints,
            currentPoints: rankingData.currentPoints,
            rol: rankingData.rol,
            getUsers: rankingData.getUsers
        });
    } catch (error) {
        res.send(error.message);
    }
};

export const postPuntos = async (req, res) => {
    try {
        const id = parseInt(req.query.id);
        await resetWeeklyPoints();
        res.redirect(`/dashboard/puntos?id=${id}`);
    } catch (error) {
        res.send(error.message);
    }
};

// Puntos privados (ocultos)
export const getPuntosPrivados = async (req, res) => {
    try {
        const id = req.query.id;
        res.render('puntos-p', { id });
    } catch (error) {
        res.send(error.message);
    }
};

export const postPuntosPrivados = async (req, res) => {
    try {
        const id = parseInt(req.query.id);
        const puntos = parseInt(req.body.puntos);
        const sexo = req.body.sexo;

        await addPrivatePoints(puntos, sexo);
        res.redirect(`/dashboard/ocult/puntos?id=${id}`);
    } catch (error) {
        res.send(error.message);
    }
};

// Rangos
export const getRangos = async (req, res) => {
    try {
        const id = parseInt(req.query.id);
        const user = await getUserData(id);

        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        res.render('rangos', {
            id: user.id,
            usuario: user.name,
            phone: user.phone,
            sexo: user.sexo,
            rango: user.rango,
            cuest: user.cuest,
            rol: user.rol
        });
    } catch (error) {
        res.send(error.message);
    }
};

// Juegos
export const getGame1 = async (req, res) => {
    try {
        const id = parseInt(req.query.id);
        const user = await getUserData(id);

        res.render('game1', { id, cuest: user.cuest });
    } catch (error) {
        res.send(error.message);
    }
};

export const getGame = async (req, res) => {
    try {
        const id = parseInt(req.query.id);
        const gameId = parseInt(req.params.gameId);
        const user = await getUserData(id);

        // Verificar si tiene intentos suficientes
        if (!user || user.cuest <= 1) {
            return res.redirect('/dashboard/game1?id=' + id);
        }

        if (gameId === 1) {
            res.render('game-tower', { id, cuest: user.cuest });
        } else if (gameId === 2) {
            res.render('game-flappy', { id, cuest: user.cuest });
        } else if (gameId === 3) {
            res.render('game-tictactoe', { id, cuest: user.cuest });
        } else {
            res.redirect('/dashboard/game1?id=' + id);
        }
    } catch (error) {
        res.send(error.message);
    }
};

export const getGamePoints = async (req, res) => {
    try {
        const id = parseInt(req.query.id);
        const points = parseInt(req.query.points);

        await addGamePoints(id, points);
        res.redirect(`/dashboard/game1?id=${id}`);
    } catch (error) {
        res.send(error.message);
    }
};
