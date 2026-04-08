// Event emitter for broadcasting updates to all connected clients
class EventEmitter {
    constructor() {
        this.clients = new Set();
    }

    // Add a client to the event stream
    addClient(res) {
        this.clients.add(res);
        console.log(`✅ Client connected. Total clients: ${this.clients.size}`);
    }

    // Remove a client from the event stream
    removeClient(res) {
        this.clients.delete(res);
        console.log(`❌ Client disconnected. Total clients: ${this.clients.size}`);
    }

    // Broadcast an event to all connected clients
    broadcast(eventType, data) {
        const message = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
        
        for (const client of this.clients) {
            try {
                client.write(message);
            } catch (error) {
                console.error('Error sending to client:', error);
                this.clients.delete(client);
            }
        }
    }

    // Send feed-related events
    sendFeedUpdate(action, post) {
        this.broadcast('feed', { action, post });
    }

    // Send points/ranking updates
    sendPointsUpdate(userId, points, rank) {
        this.broadcast('points', { userId, points, rank });
    }

    // Send notification to specific user
    sendNotification(userId, message) {
        this.broadcast('notification', { userId, message });
    }
}

// Export singleton instance
export const eventEmitter = new EventEmitter();
