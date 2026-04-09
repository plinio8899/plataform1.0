import { Router } from "express";
import { verifyRange } from "../Middlewares/range.middleware.js";
import { isAuthenticated } from "../Middlewares/auth.middleware.js";
import { isAdmin } from "../Middlewares/role.middleware.js";
import {
    getDashboard,
    getDatos,
    postDatos,
    getTareas,
    postTareas,
    getCuestionario,
    postCuestionario,
    getRevision,
    getPuntos,
    postPuntos,
    getPuntosPrivados,
    postPuntosPrivados,
    getRangos,
    getGame1,
    getGame,
    getGamePoints
} from "../Controllers/dashboard.controllers.js";

const router = Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(isAuthenticated);

// Aplicar middleware de rango
router.use(verifyRange);

// Dashboard principal
router.get('/', getDashboard);

// Gestión de datos del usuario
router.get('/datos', getDatos);
router.post('/datos', postDatos);

// Gestión de tareas
router.get('/tareas', getTareas);
router.post('/tareas', isAdmin, postTareas);

// Cuestionario
router.get('/tareas/cuestionario', getCuestionario);
router.post('/tareas/cuestionario', postCuestionario);
router.get('/tareas/cuestionario/revision', getRevision);

// Puntos grupales
router.get('/puntos', getPuntos);
router.post('/puntos', isAdmin, postPuntos);

// Puntos privados (ocultos) - Solo para admins
router.get('/ocult/puntos', isAdmin, getPuntosPrivados);
router.post('/ocult/puntos', isAdmin, postPuntosPrivados);

// Rangos
router.get('/rangos', getRangos);

// Juegos
router.get('/game1', getGame1);
router.get('/game/:gameId', getGame);
router.get('/gamepoints', getGamePoints);

export default router;
