import { db } from "../db/index.js";
import { getAllPosts, createPost, toggleReaction, createComment, updatePost, deletePost } from "../Services/feed.services.js";
import { eventEmitter } from "../Utils/events.js";

export const getFeed = async (req, res) => {
    try {
        const id = parseInt(req.query.id);
        
        // Obtener datos del usuario para mantener la sesión
        const passBd = await db.users.findFirst({
            where: { id: id }
        });
        
        const usuario = passBd.name;
        const phone = passBd.phone;
        const sexo = passBd.sexo;
        const rango = passBd.rango;
        const cuest = passBd.cuesStatus;
        const rol = passBd.rol;
        
        // Obtener todos los posts con reacciones y comentarios
        const posts = await getAllPosts();
        
        res.render('feed', { 
            id, 
            usuario, 
            phone, 
            sexo, 
            rango, 
            cuest, 
            rol,
            posts 
        });
    } catch (error) {
        res.send(error.message);
    }
}

export const postFeed = async (req, res) => {
    try {
        const id = parseInt(req.query.id);
        const { description } = req.body;
        
        if (!description || description.trim() === "") {
            return res.redirect(`/feed?id=${id}&error=empty`);
        }
        
        await createPost(id, description.trim());
        
        res.redirect(`/feed?id=${id}`);
    } catch (error) {
        res.send(error.message);
    }
}

export const postReaction = async (req, res) => {
    try {
        const id = parseInt(req.query.id);
        const postId = parseInt(req.query.postId);
        
        await toggleReaction(postId, id, 'like');

        // Intentar enviar notificacion sin romper el flujo
        try {
            const post = await db.post.findUnique({
                where: { id: postId },
                select: { authorId: true, description: true }
            });
            
            const user = await db.users.findUnique({
                where: { id },
                select: { name: true }
            });
            
            // Enviar notificacion al autor del post si no soy yo mismo
            if(post && user && post.authorId !== id) {
                eventEmitter.broadcast('notification', {
                    userId: post.authorId,
                    type: 'like',
                    userName: user.name,
                    postId: postId,
                    postPreview: post.description ? post.description.substring(0, 50) : '',
                    timestamp: new Date().toISOString()
                });
            }
        } catch (notificationError) {
            // Ignorar errores de notificacion, no afectar la funcionalidad principal
            console.log('Error al enviar notificacion:', notificationError.message);
        }
        
        res.redirect(`/feed?id=${id}`);
    } catch (error) {
        res.send(error.message);
    }
}

export const postComment = async (req, res) => {
    try {
        const id = parseInt(req.query.id);
        const postId = parseInt(req.query.postId);
        const { comment } = req.body;
        
        if (!comment || comment.trim() === "") {
            return res.redirect(`/feed?id=${id}`);
        }
        
        await createComment(postId, id, comment.trim());

        // Intentar enviar notificacion sin romper el flujo
        try {
            const post = await db.post.findUnique({
                where: { id: postId },
                select: { authorId: true, description: true }
            });
            
            const user = await db.users.findUnique({
                where: { id },
                select: { name: true }
            });
            
            // Enviar notificacion al autor del post si no soy yo mismo
            if(post && user && post.authorId !== id) {
                eventEmitter.broadcast('notification', {
                    userId: post.authorId,
                    type: 'comment',
                    userName: user.name,
                    commentText: comment.trim(),
                    postId: postId,
                    postPreview: post.description ? post.description.substring(0, 50) : '',
                    timestamp: new Date().toISOString()
                });
            }
        } catch (notificationError) {
            // Ignorar errores de notificacion, no afectar la funcionalidad principal
            console.log('Error al enviar notificacion:', notificationError.message);
        }
        
        res.redirect(`/feed?id=${id}`);
    } catch (error) {
        res.send(error.message);
    }
}

export const updateFeed = async (req, res) => {
    try {
        const id = parseInt(req.query.id);
        const postId = parseInt(req.query.postId);
        const { description } = req.body;
        
        if (!description || description.trim() === "") {
            return res.redirect(`/feed?id=${id}&error=empty`);
        }
        
        await updatePost(postId, id, description.trim());
        
        res.redirect(`/feed?id=${id}`);
    } catch (error) {
        res.send(error.message);
    }
}

export const deleteFeed = async (req, res) => {
    try {
        const id = parseInt(req.query.id);
        const postId = parseInt(req.query.postId);
        
        await deletePost(postId, id);
        
        res.redirect(`/feed?id=${id}`);
    } catch (error) {
        res.send(error.message);
    }
}
