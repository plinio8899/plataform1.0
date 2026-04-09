import { db } from "../db/index.js";
import { comparePass } from "../Utils/handlePassword.js";

export const authenticateUser = async (phone, password) => {
    try {
        const user = await db.users.findFirst({
            where: {
                phone: phone
            }
        });

        if (!user) {
            return { success: false, error: "Usuario no encontrado" };
        }

        const isValidPassword = await comparePass(password, user.password);

        if (!isValidPassword) {
            return { success: false, error: "Contraseña incorrecta" };
        }

        return { success: true, user: user };
    } catch (error) {
        throw new Error("Error al autenticar usuario: " + error.message);
    }
};

export const getUserById = async (id) => {
    try {
        const user = await db.users.findFirst({
            where: {
                id: id
            }
        });

        if (!user) {
            return null;
        }

        return {
            id: user.id,
            name: user.name,
            phone: user.phone,
            sexo: user.sexo,
            rango: user.rango,
            cuest: user.cuesStatus,
            rol: user.rol,
            points: user.points,
            totalPoints: user.totalPoints
        };
    } catch (error) {
        throw new Error("Error al obtener usuario: " + error.message);
    }
};
