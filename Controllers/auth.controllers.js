import { authenticateUser } from "../Services/auth.service.js";

export const getLogin = (req, res) => {
    const err = req.query.err;
    const clas = req.query.clas;
    const clax = req.query.clax;
    const id = req.query.id;
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    res.render('login', { err, clas, clax, id });
};

export const postLogin = async (req, res) => {
    try {
        const { phone, pass } = req.body;

        if (!phone || !pass) {
            return res.redirect('/auth?clas=alert alert-danger&err=Por favor complete todos los campos');
        }

        const result = await authenticateUser(phone, pass);

        if (result.success) {
            res.redirect(`/dashboard?id=${result.user.id}`);
        } else {
            res.redirect('/auth?clas=alert alert-danger&err=' + encodeURIComponent(result.error));
        }
    } catch (error) {
        console.error("Error en login:", error);
        res.redirect('/auth?clas=alert alert-danger&err=Inicio de sesión incorrecto');
    }
};
