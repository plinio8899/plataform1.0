import { db } from "../db/index.js"
import { hashingPass } from "../Utils/handlePassword.js";

export const getUser = () => {
    let ret = "Plinio Acuña"
    return ret
}

export const postUser = async (phone, name, password, sexo) => {
    try {
        const passh = await hashingPass(password)
        const newUser = await db.users.create({
            data: {
                phone: phone,
                password: passh,
                name: name,
                points: 0,
                cuesStatus: 0,
                rango: "Novato",
                rol: "Indefinido",
                sexo: sexo,
                totalPoints: 0
            }
        })
        if(newUser.id){
            let ret = `Se ha creado el usuario: ${newUser.name}`
            return ret
        }else{
            let error = "User not found"
            return error
        }
    } catch (error) {
        let err = "No se pudo crear el usuario"
        return err
    }
}

export const deleteUser = (id) => {
    let ret = "User " + id + " has been deleted"
    return ret
}

export const updateUser = (id) => {
    let ret = "User " + id + " has been updated"
    return ret
}