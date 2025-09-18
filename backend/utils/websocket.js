const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

class WebSocketService {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });
        this.clients = new Map(); // Store client connections with their user IDs

        this.wss.on('connection', (ws, req) => {
            this.handleConnection(ws, req);
        });
    }

    handleConnection(ws, req) {
        // Extract JWT token from query parameters
        const url = new URL(req.url, 'ws://localhost');
        const token = url.searchParams.get('token');

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId;

            // Store the connection
            this.clients.set(userId, ws);

            ws.on('message', (message) => {
                this.handleMessage(userId, message);
            });

            ws.on('close', () => {
                this.clients.delete(userId);
            });

        } catch (error) {
            ws.close(1008, 'Invalid token');
        }
    }

    handleMessage(userId, message) {
        // Handle incoming messages if needed
    }

    // Broadcast updates to all connected clients
    broadcast(data) {
        this.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }

    // Send update to specific user
    sendToUser(userId, data) {
        const client = this.clients.get(userId);
        if (client && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    }
}

module.exports = WebSocketService;