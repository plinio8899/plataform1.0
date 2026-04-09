import express from "express";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import bodyParser from "body-parser";
import cors from "cors";
import userRoute from "./Routes/users.routes.js"
import authRoute from "./Routes/auth.routes.js"
import dashRoute from "./Routes/dashboard.routes.js"
import feedRoute from "./Routes/feed.routes.js"
import { db } from "./db/index.js"
import { eventEmitter } from "./Utils/events.js"
import { getIndex } from "./Controllers/index.controllers.js"
import { errorHandler, notFound } from "./Middlewares/error.middleware.js"

const port = process.env.PORT || 3000;

// Arreglando lo de la ubicacion de ejs
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middlewares globales
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/views'));

// Middleware para prevenir caché
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

// Rutas
app.use("/", userRoute);
app.use("/auth", authRoute);
app.use("/dashboard", dashRoute);
app.use("/feed", feedRoute);
app.use(express.json());

// Ruta principal
app.get('/', getIndex);

// SSE endpoint for real-time updates
app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Disable buffering
    res.flushHeaders();
    
    // Add client to emitter
    eventEmitter.addClient(res);
    
    // Send initial connection message
    res.write(`event: connected\ndata: ${JSON.stringify({ message: 'Connected to real-time updates' })}\n\n`);
    
    // Keep connection alive with heartbeat
    const heartbeat = setInterval(() => {
        res.write(`: heartbeat\n\n`);
    }, 30000);
    
    // Remove client on close
    req.on('close', () => {
        clearInterval(heartbeat);
        eventEmitter.removeClient(res);
    });
});

// Middlewares de manejo de errores (deben ir al final)
app.use(notFound);
app.use(errorHandler);

app.listen(port || 3000, () => {
    console.log("[+]listening on port: " + port)
});
