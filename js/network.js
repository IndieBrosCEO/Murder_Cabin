const network = {
    ws: null,

    connect() {
        this.ws = new WebSocket('ws://localhost:8080');

        this.ws.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        this.ws.onmessage = event => {
            console.log(`Received message: ${event.data}`);
            // Handle incoming messages
        };

        this.ws.onclose = () => {
            console.log('Disconnected from WebSocket server');
        };
    },

    send(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(message);
        }
    }
};

export { network };
