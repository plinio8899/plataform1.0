import { Router } from "express";
import { PrismaClient } from "@prisma/client"

const db = new PrismaClient();
const router = Router();

router.get('/', async (req, res) => {
    try {
        const id = parseInt(req.query.id)
        const passBd = await db.users.findFirst({
            where: {
                id: id
            }
        })
        const usuario = passBd.name
        const phone = passBd.phone
        const sexo = passBd.sexo
        const rango = passBd.rango
        const cuest = passBd.cuesStatus
        res.render('dash', {id, usuario, phone, sexo, rango, cuest});
    } catch (error) {
        res.send(error.message)
    }
})

router.get('/datos', async (req, res) => {
    try {
        const id = parseInt(req.query.id)
        const passBd = await db.users.findFirst({
            where: {
                id: id
            }
        })
        const usuario = passBd.name
        const phone = passBd.phone
        const sexo = passBd.sexo
        const rango = passBd.rango
        const cuest = passBd.cuesStatus
        res.render('datos', {id, usuario, phone, sexo, rango, cuest})
    } catch (error) {
        
    }
})

router.get('/tareas', async (req, res) => {
    try {
        const id = parseInt(req.query.id)
        const passBd = await db.users.findFirst({
            where: {
                id: id
            }
        })
        const usuario = passBd.name
        const phone = passBd.phone
        const sexo = passBd.sexo
        const rango = passBd.rango
        const cuest = passBd.cuesStatus
        res.render('ant-cuest', {id, usuario, phone, sexo, rango, cuest})
    } catch (error) {
        
    }
})

export default router;