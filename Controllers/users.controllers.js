import { getUser, postUser, deleteUser, updateUser } from "../Services/users.services.js";

export const getUsers = (req, res) => {
    try {
        const result = getUser();
        const agree = req.query.agree;
        const id = req.query.id;
        res.render('user', { user: result, agree, id})
    } catch (error) {
        res.send(error.message);
    }
}

export const postUsers = async (req, res) => {
    try {
        const id = req.query.id;
        const body =  req.body;
        const result =  await postUser(body.phone, body.name, body.password, body.sexo);
        res.redirect(`/users?agree=${result}&id=${id}`);
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