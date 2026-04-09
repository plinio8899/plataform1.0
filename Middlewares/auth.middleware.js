import { db } from "../db/index.js";

/**
 * Middleware para verificar si el usuario existe y está autenticado
 */
export const isAuthenticated = async (req, res, next) => {
    try {
        const id = parseInt(req.query.id);

        if (!id) {
            return res.redirect('/auth?clas=alert alert-warning&err=Debe iniciar sesión');
        }

        const user = await db.users.findFirst({
            where: { id: id }
        });

        if (!user) {
            return res.redirect('/auth?clas=alert alert-danger&err=Usuario no encontrado');
        }

        // Adjuntar el usuario a la solicitud para uso posterior
        req.user = user;
        next();
    } catch (error) {
        console.error("Error en autenticación:", error);
        res.redirect('/auth?clas=alert alert-danger&err=Error de autenticación');
    }
};

/**
 * Middleware para verificar si el usuario NO está autenticado
 * (útil para redirigir si ya está logueado)
 */
export const isGuest = async (req, res, next) => {
    try {
        const id = parseInt(req.query.id);

        if (id) {
            const user = await db.users.findFirst({
                where: { id: id }
            });

            if (user) {
                return res.redirect(`/dashboard?id=${id}`);
            }
        }

        next();
    } catch (error) {
        next();
    }
};
