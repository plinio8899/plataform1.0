import { db } from "../db/index.js"
import { eventEmitter } from "../Utils/events.js"

export const getAllPosts = async () => {
    try {
        const posts = await db.feed.findMany({
            include: {
                author: {
                    select: {
                        name: true,
                        rango: true
                    }
                },
                reactions: {
                    select: {
                        id: true,
                        userId: true,
                        type: true
                    }
                },
                comments: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                rango: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                _count: {
                    select: {
                        reactions: true,
                        comments: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return posts
    } catch (error) {
        throw new Error("Error al obtener los posts: " + error.message)
    }
}

export const createPost = async (authorId, description) => {
    try {
        const newPost = await db.feed.create({
            data: {
                authorId: authorId,
                description: description
            }
        })
        
        // Broadcast new post to all connected clients
        const postWithDetails = await db.feed.findUnique({
            where: { id: newPost.id },
            include: {
                author: { select: { name: true, rango: true } },
                _count: { select: { reactions: true, comments: true } }
            }
        });
        eventEmitter.sendFeedUpdate('created', postWithDetails);
        
        return newPost
    } catch (error) {
        throw new Error("Error al crear el post: " + error.message)
    }
}

// Toggle reaction: add if not exists, remove if exists
export const toggleReaction = async (postId, userId, type = 'like') => {
    try {
        // Check if reaction exists
        const existingReaction = await db.reaction.findUnique({
            where: {
                postId_userId: {
                    postId: postId,
                    userId: userId
                }
            }
        })

        if (existingReaction) {
            // Remove reaction
            await db.reaction.delete({
                where: {
                    postId_userId: {
                        postId: postId,
                        userId: userId
                    }
                }
            })
            eventEmitter.sendFeedUpdate('reaction', { postId, userId, action: 'removed' });
            return { action: 'removed' }
        } else {
            // Add reaction
            await db.reaction.create({
                data: {
                    postId: postId,
                    userId: userId,
                    type: type
                }
            })
            eventEmitter.sendFeedUpdate('reaction', { postId, userId, action: 'added' });
            return { action: 'added' }
        }
    } catch (error) {
        throw new Error("Error al gestionar reacción: " + error.message)
    }
}

export const createComment = async (postId, userId, content) => {
    try {
        const newComment = await db.comment.create({
            data: {
                postId: postId,
                userId: userId,
                content: content
            }
        })
        return newComment
    } catch (error) {
        throw new Error("Error al crear comentario: " + error.message)
    }
}

export const updatePost = async (postId, authorId, newDescription) => {
    try {
        // Verificar que el post existe
        const post = await db.feed.findUnique({
            where: { id: postId }
        })
        
        if (!post) {
            throw new Error("Publicación no encontrada")
        }
        
        // Verificar que el usuario es el autor
        if (post.authorId !== authorId) {
            throw new Error("No tienes permiso para editar esta publicación")
        }
        
        // Actualizar el post
        const updatedPost = await db.feed.update({
            where: { id: postId },
            data: { description: newDescription }
        })
        
        // Broadcast update to all clients
        eventEmitter.sendFeedUpdate('updated', { postId, description: newDescription });
        
        return updatedPost
    } catch (error) {
        throw new Error(error.message)
    }
}

export const deletePost = async (postId, authorId) => {
    try {
        // Verificar que el post existe
        const post = await db.feed.findUnique({
            where: { id: postId }
        })
        
        if (!post) {
            throw new Error("Publicación no encontrada")
        }
        
        // Verificar que el usuario es el autor
        if (post.authorId !== authorId) {
            throw new Error("No tienes permiso para eliminar esta publicación")
        }
        
        // Eliminar el post (las reacciones y comentarios se eliminan en cascada)
        await db.feed.delete({
            where: { id: postId }
        })
        
        // Broadcast deletion to all clients
        eventEmitter.sendFeedUpdate('deleted', { postId });
        
        return { success: true, message: "Publicación eliminada" }
    } catch (error) {
        throw new Error(error.message)
    }
}
