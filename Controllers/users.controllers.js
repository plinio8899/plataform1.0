import { getUser, postUser, deleteUser, updateUser } from "../Services/users.services.js";

export const getUsers = (req, res) => {
    try {
        const result = getUser();
        const agree = req.query.agree;
        res.render('user', { user: result, agree})
    } catch (error) {
        res.send(error.message);
    }
}

export const postUsers = async (req, res) => {
    try {
        const body =  req.body;
        const result =  await postUser(body.phone, body.name, body.password, body.sexo);
        res.redirect(`/users?agree=${result}`);
    } catch (error) {
        res.send("No se pudo crear el usuario");
    }
}

export const deleteUsers = (req, res) => {
    try {
        const body = req.body;
        const result = deleteUser(body.id);
        res.send(result);
    } catch (error) {
        res.send(error.message);
    }
}

export const updateUsers = (req, res) => {
    try {
        const body = req.body;
        const result = updateUser(body.id);
        res.send(result);
    } catch (error) {
        res.send(error.message);
    }
}