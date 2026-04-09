/**
 * Middleware centralizado para manejo de errores
 */
export const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);

    // Determinar el código de estado
    const statusCode = err.statusCode || 500;

    // Mensaje de error
    const message = err.message || "Error interno del servidor";

    // Si es una solicitud AJAX/API, devolver JSON
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
        return res.status(statusCode).json({
            success: false,
            error: message
        });
    }

    // Para solicitudes normales, renderizar página de error
    res.status(statusCode).send(`
        <html>
            <head>
                <title>Error ${statusCode}</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    h1 { color: #e74c3c; }
                    p { color: #666; }
                    a { color: #3498db; }
                </style>
            </head>
            <body>
                <h1>Error ${statusCode}</h1>
                <p>${message}</p>
                <a href="javascript:history.back()">Volver atrás</a>
            </body>
        </html>
    `);
};

/**
 * Middleware para rutas no encontradas (404)
 */
export const notFound = (req, res, next) => {
    // Ignorar rutas especiales de Chrome DevTools
    if (req.originalUrl.startsWith('/.well-known/')) {
        return res.status(200).send('');
    }
    
    const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

/**
 * Middleware para crear errores con código de estado
 */
export const createError = (message, statusCode = 500) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};
