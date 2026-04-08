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

const port = process.env.PORT || 3000;

//Arreglando lo de la ubicacion de ejs
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')

app.use(express.static(__dirname + '/views'));

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next(); // Continúa con el manejo de la solicitud
  });

app.use(cors());
app.use("/", userRoute);
app.use("/auth", authRoute);
app.use("/dashboard", dashRoute);
app.use("/feed", feedRoute);
app.use(express.json());

app.get('/', async(req, res) => {
    try {
        const tPoints = await db.points.findMany({
            where: {
                id: 1
            }
        })
        const pMan = parseInt(tPoints[0].man)
        const pWoman = parseInt(tPoints[0].woman)
        res.render('index', {id: 123, pMan, pWoman})
    } catch (error) {
        res.send(error.message)
    }
})

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

app.listen(port || 3000, () => {
    console.log("[+]listening on port: " + port)
});
