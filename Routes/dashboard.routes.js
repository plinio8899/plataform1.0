import { Router } from "express";
import { PrismaClient } from "@prisma/client"
import { verifyRange } from "../Middlewares/range.middleware.js";
const db = new PrismaClient();
const router = Router();

router.get('/', verifyRange, async (req, res) => {
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
        const rol = passBd.rol
        res.render('dash', {id, usuario, phone, sexo, rango, cuest, rol});
    } catch (error) {
        res.send(error.message)
    }
})

router.get('/datos', verifyRange, async (req, res) => {
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
        let msg = req.query.msg
        res.render('datos', {id, usuario, phone, sexo, rango, cuest, msg})
    } catch (error) {
        res.send(error.message)
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
        const rol = passBd.rol
        res.render('ant-cuest', {id, usuario, phone, sexo, rango, cuest, rol})
    } catch (error) {
        res.send(error.message)
    }
})

router.get('/tareas/cuestionario', async (req, res) => {
    try {
        const id = parseInt(req.query.id)
        const passBd = await db.users.findFirst({
            where: {
                id: id
            }
        })
        const cuest = passBd.cuesStatus
        const cuesBd = await db.cuest.findMany()
        res.render('cuestionario', {id, cuest, cuesBd})
    } catch (error) {
        res.send("Hello" + error.message)
    }
})

router.get('/tareas/cuestionario/revision', async (req, res) => {
    try {
        const rev = req.query.points
        const id = req.query.id
        let msg = req.query.msg
        res.render('resultado', {id, rev, msg})
    } catch (error) {
        res.send("Error: " + error.message)
    }
})


router.post('/tareas/cuestionario', async (req, res) => {
    try {
        const respuesta1 = req.body[0]
        const respuesta2 = req.body[1]
        const respuesta3 = req.body[2]
        const respuesta4 = req.body[3]
        const respuesta5 = req.body[4]
        const respuesta6 = req.body[5]
        const respuesta7 = req.body[6]
        const respuesta8 = req.body[7]
        const respuesta9 = req.body[8]
        const respuesta10 = req.body[9]
        const id = parseInt(req.query.id)
        let points = 0
        const cuesBd = await db.cuest.findMany()
        if(cuesBd[0].repTrue == respuesta1){
            points = points + cuesBd[0].cuestPoints
        }
        if(cuesBd[1].repTrue == respuesta2){
            points = points + cuesBd[1].cuestPoints
        }
        if(cuesBd[2].repTrue == respuesta3){
            points = points + cuesBd[2].cuestPoints
        }
        if(cuesBd[3].repTrue == respuesta4){
            points = points + cuesBd[3].cuestPoints
        }
        if(cuesBd[4].repTrue == respuesta5){
            points = points + cuesBd[4].cuestPoints
        }
        if(cuesBd[5].repTrue == respuesta6){
            points = points + cuesBd[5].cuestPoints
        }
        if(cuesBd[6].repTrue == respuesta7){
            points = points + cuesBd[6].cuestPoints
        }
        if(cuesBd[7].repTrue == respuesta8){
            points = points + cuesBd[7].cuestPoints
        }
        if(cuesBd[8].repTrue == respuesta9){
            points = points + cuesBd[8].cuestPoints
        }
        if(cuesBd[9].repTrue == respuesta10){
            points = points + cuesBd[9].cuestPoints
        }

        const getUser = await db.users.findFirst({
            where: {
                id: id
            }
        })

        let oldPoints = getUser.points
        let totalOldPoints = getUser.totalPoints

        let pointsResult = oldPoints + points
        let totalPointsresult = totalOldPoints + points

        const changeStatusCues = await db.users.update({
            where: {
                id: id
            },
            data: {
                cuesStatus: 0,
                points: pointsResult,
                totalPoints: totalPointsresult
            }
        })
        res.redirect(`/dashboard/tareas/cuestionario/revision?id=${id}&points=${points}&msg=no`)
    } catch (error) {
        res.send("Hola" + error.message)
    }

})

router.get('/puntos', async (req, res) => {
    try {
        const id = parseInt(req.query.id)
        let sexoU = ""
    
        const getUser = await db.users.findFirst({
            where: {
                id: id
            }
        })

        if(getUser.sexo == "man"){
            sexoU = "man"
        }else {
            sexoU = "woman"
        }

        const getUsers = await db.users.findMany({
            select: {
                name: true,
                points: true,
                totalPoints: true
            },
            where: {
                id: {
                    notIn: [1, 2, 3 ,4]
                },
                sexo: sexoU
            },
            orderBy: {
                totalPoints: 'desc'
            }
        })
    
        const totalPoints = getUser.totalPoints
        const currentPoints = getUser.points
        const rol = getUser.rol
        res.render('puntos', {id, totalPoints, currentPoints, rol, getUsers})
    } catch (error) {
        res.send(error.message)
    }

})

router.post('/puntos', async (req, res) => {
    try {
        const id = parseInt(req.query.id)
        const setPoints = await db.points.findFirst({
            where: {
                id: 1,
            }
        })
        const pushHombres = await db.users.aggregate({
            where: {
                sexo: "man"
            },
            _sum: {
                points: true
            }
        })
        const pushMujeres = await db.users.aggregate({
            where: {
                sexo: "woman"
            },
            _sum: {
                points: true
            }
        })
        let hPoints = parseInt(pushHombres._sum.points) + parseInt(setPoints.man)
        let mPoints = parseInt(pushMujeres._sum.points) + parseInt(setPoints.woman)
        await db.points.update({
            where: {
                id: 1
            },
            data: {
                man: hPoints,
                woman: mPoints
            }
        })

        await db.users.updateMany({
            data: {
                points: 0
            }
        })

        console.log("Hombres: " + hPoints + " Mujeres: " + mPoints)
        res.redirect(`/dashboard/puntos?id=${id}`)
    } catch (error) {
        res.send(error.message)
    }
})

router.post('/tareas', async (req, res) => {
    try {
        const id = parseInt(req.query.id)
        const estado = parseInt(req.body.estado)
        if(estado){
            const getAllusers = await db.users.updateMany({
                where: {
                    NOT: {
                        rol: "Administrador"
                    }
                },
                data: {
                    cuesStatus: estado
                }
            })
            res.redirect(`/dashboard/tareas?id=${id}`)
        }else{
            const idp = parseInt(req.body.idp)
            const preg = req.body.preg
            const op1 = req.body.op1
            const op2 = req.body.op2
            const op3 = req.body.op3
            const op4 = req.body.op4
            const repTrue = req.body.repTrue
            const cuestPoints = parseInt(req.body.cuestPoints)

            const updateCuest = await db.cuest.update({
                where:{
                    id: idp
                },
                data: {
                    preg: preg,
                    op1: op1,
                    op2: op2,
                    op3: op3,
                    op4: op4,
                    repTrue: repTrue,
                    cuestPoints: cuestPoints
                }
            })
            res.redirect(`/dashboard/tareas?id=${id}`)
        }
    } catch (error) {
        res.send(error.message)
    }
})

router.get('/ocult/puntos', (req, res) => {
    try {
        const id = req.query.id
        res.render('puntos-p', {id})
    } catch (error) {
        res.send(error.message)
    }
})
router.post('/ocult/puntos', async(req, res) => {
    try {
        const id = parseInt(req.query.id)
        const puntos = parseInt(req.body.puntos)
        const sexo = req.body.sexo

        const pointsBd = await db.points.findMany()
        let hPoints = parseInt(pointsBd[0].man)
        let mPoints = parseInt(pointsBd[0].woman)
        let tPoints = 0

        if(sexo == "man"){
           tPoints = hPoints + puntos
            await db.points.update({
                where: {
                    id: 1
                },

                data: {
                    man: tPoints
                }
            })
        }else if(sexo == "woman"){
            tPoints = mPoints + puntos
            await db.points.update({
                where: {
                    id: 1
                },

                data: {
                    woman: tPoints
                }
            })
        }
        res.redirect(`/dashboard/ocult/puntos?id=${id}`)
    } catch (error) {
        res.send(error.message)
    }
})

router.get('/rangos', async (req, res) => {
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
        const rol = passBd.rol
        res.render('rangos', {id, usuario, phone, sexo, rango, cuest, rol})
    } catch (error) {
        res.send(error.message)
    }
})

router.get('/game1', async (req, res) => {
    try {
        const id = parseInt(req.query.id)
        const passB = await db.users.findFirst({
            where: {
                id: id
            }
        })
        const cuest = passB.cuesStatus
        res.render('game1', {id, cuest})
    } catch (error) {
        res.send(error.message)
    }
})

router.get('/gamepoints', async(req, res) => {
    try {
        const id = parseInt(req.query.id)
        const ponts = parseInt(req.query.points)
        const passB = await db.users.findFirst({
            where: {
                id: id
            }
        })
        const oldPoints = parseInt(passB.points)
        const oldTotalPoints = parseInt(passB.totalPoints)
        let cuest = passB.cuesStatus
        let result = oldPoints + ponts
        let result2 = oldTotalPoints + ponts
        const passBd = await db.users.update({
            where: {
                id: id
            },
            data: {
                points: result,
                totalPoints: result2,
                cuesStatus: cuest -1
            }
        })
        res.redirect(`/dashboard/game1?id=${id}`)
    } catch (error) {
        res.send(error.message)
    }

})


router.post('/datos', async(req, res) => {
    try {
        const id = parseInt(req.query.id)
        const code = parseInt(req.body.code)
        let plusPoints = 0
        console.log(code.toString().length)

        const coder = await db.codes.findFirst({
            where: {
                code: code,
            }
        })

        if(coder){
            if(parseInt(coder.code) == code) {
                const user = await db.users.findFirst({
                    where: {
                        id: id,
                    }
                })
                if(code.toString().length == 10){
                    plusPoints = 60
                }
                if(code.toString().length == 9){
                    plusPoints = 50
                }
                if(code.toString().length == 8){
                    plusPoints = 40
                }
                if(code.toString().length == 7){
                    plusPoints = 30
                }
                await db.users.update({
                    where: {
                        id: id
                    },
                    data: {
                      points: parseInt(user.points) + plusPoints,
                      totalPoints: parseInt(user.totalPoints) + plusPoints	
                    }
                })
                await db.codes.delete({
                    where: {
                        code: code
                    }
                })
                res.redirect(`/dashboard/tareas/cuestionario/revision?id=${id}&points=${plusPoints}&msg=hola`)
            }else if(code == 0){
                res.redirect(`/dashboard/datos?id=${id}&msg=codigoincorrecto`)
            }else{
                res.redirect(`/dashboard/datos?id=${id}&msg=codigoincorrecto`) 
            }
        }else{
            res.redirect(`/dashboard/datos?id=${id}&msg=codigoincorrecto`) 
        }
    } catch ({error}) {
        res.send(error)
    }
})

router.get('/feed', (req, res) => {
    try {
        const id = parseInt(req.query.id)
        res.render('feed', {id})
    } catch (error) {
        res.send(error)
    }
})

export default router; 