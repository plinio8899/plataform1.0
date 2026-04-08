import { db } from "../db/index.js"

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
