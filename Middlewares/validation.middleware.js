import { createError } from "./error.middleware.js";

/**
 * Middleware para validar datos de login
 */
export const validateLogin = (req, res, next) => {
    const { phone, pass } = req.body;
    const errors = [];

    if (!phone || phone.trim() === "") {
        errors.push("El teléfono es requerido");
    }

    if (!pass || pass.trim() === "") {
        errors.push("La contraseña es requerida");
    }

    if (phone && phone.length < 7) {
        errors.push("El teléfono debe tener al menos 7 caracteres");
    }

    if (pass && pass.length < 4) {
        errors.push("La contraseña debe tener al menos 4 caracteres");
    }

    if (errors.length > 0) {
        const errorMsg = errors.join(", ");
        return res.redirect(`/auth?clas=alert alert-danger&err=${encodeURIComponent(errorMsg)}`);
    }

    next();
};

/**
 * Middleware para validar datos de usuario
 */
export const validateUser = (req, res, next) => {
    const { phone, name, password, sexo } = req.body;
    const errors = [];

    if (!phone || phone.trim() === "") {
        errors.push("El teléfono es requerido");
    } else if (phone.length < 7) {
        errors.push("El teléfono debe tener al menos 7 caracteres");
    }

    if (!name || name.trim() === "") {
        errors.push("El nombre es requerido");
    } else if (name.length < 2) {
        errors.push("El nombre debe tener al menos 2 caracteres");
    }

    if (!password || password.trim() === "") {
        errors.push("La contraseña es requerida");
    } else if (password.length < 4) {
        errors.push("La contraseña debe tener al menos 4 caracteres");
    }

    if (!sexo || (sexo !== "man" && sexo !== "woman")) {
        errors.push("El sexo debe ser 'man' o 'woman'");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors: errors
        });
    }

    next();
};

/**
 * Middleware para validar que el ID sea un número válido
 */
export const validateId = (req, res, next) => {
    const id = parseInt(req.query.id);

    if (!id || isNaN(id) || id < 1) {
        const error = createError("ID inválido", 400);
        return next(error);
    }

    req.query.id = id;
    next();
};

/**
 * Middleware para validar datos del cuestionario
 */
export const validateCuestionario = (req, res, next) => {
    const respuestas = [];
    for (let i = 0; i < 10; i++) {
        if (!req.body[i]) {
            return res.redirect(`/dashboard/tareas/cuestionario?id=${req.query.id}&error=complete`);
        }
        respuestas.push(req.body[i]);
    }
    req.respuestas = respuestas;
    next();
};
