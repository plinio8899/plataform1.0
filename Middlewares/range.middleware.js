import { PrismaClient } from "@prisma/client"

const db = new PrismaClient();

export const verifyRange = async(req, res, next) =>{
    const id = parseInt(req.query.id)

    const verifyID = await db.users.findFirst({
        where: {
            id: id,
        }
    })
        if(parseInt(verifyID.totalPoints) >= 1000){
            await db.users.update({
                where: {
                    id: id,
                },
                data: {
                    rango: "Receptor de Luz"
                }
            })
        } else if(parseInt(verifyID.totalPoints) <= 999){
            await db.users.update({
                where: {
                    id: id,
                },
                data: {
                    rango: "Novato"
                }
            })
        }
    next()
}