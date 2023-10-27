import { Router } from "express";
import { comparePass } from "../Utils/handlePassword.js";
import { PrismaClient } from "@prisma/client"

const db = new PrismaClient();

const router = Router();

router.get('/', (req, res) => {
    const err = req.query.err
    const clas = req.query.clas
    const clax = req.query.clax
    const id = req.query.id
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    res.render('login', {err, clas, clax, id})
})

router.post('/', async (req, res) => {
try {
    const user = req.body.phone
    const passw = req.body.pass
    const passBd = await db.users.findFirst({
        where: {
            phone: user
        }
    })
    const result = await comparePass(passw, passBd.password)
    if (result) {
        console.log(result)
        res.redirect(`/dashboard?id=${passBd.id}`)
    } else {
        res.redirect('/auth?clas=alert alert-danger&err=No se pudo iniciar sesion')
    }
} catch (error) {
    res.redirect('/auth?clas=alert alert-danger&err=Inicio de sesión incorrecto')
}
})

export default router;