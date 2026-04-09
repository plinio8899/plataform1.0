import { createError } from "./error.middleware.js";

/**
 * Middleware para verificar si el usuario es administrador
 */
export const isAdmin = (req, res, next) => {
    if (!req.user) {
        const error = createError("Usuario no autenticado", 401);
        return next(error);
    }

    if (req.user.rol !== "Administrador") {
        const error = createError("Acceso denegado. Se requiere rol de administrador", 403);
        return next(error);
    }

    next();
};

/**
 * Middleware para verificar roles específicos
 * @param {Array} roles - Array de roles permitidos
 */
export const hasRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            const error = createError("Usuario no autenticado", 401);
            return next(error);
        }

        if (!roles.includes(req.user.rol)) {
            const error = createError("Acceso denegado. No tienes permisos para esta acción", 403);
            return next(error);
        }

        next();
    };
};

/**
 * Middleware para verificar si el usuario puede editar contenido
 * (autor o administrador)
 */
export const canEdit = (req, res, next) => {
    if (!req.user) {
        const error = createError("Usuario no autenticado", 401);
        return next(error);
    }

    // El administrador puede editar todo
    if (req.user.rol === "Administrador") {
        return next();
    }

    // Aquí se verificaría si el usuario es el autor del contenido
    // Esto se implementaría en el controller específico
    next();
};
