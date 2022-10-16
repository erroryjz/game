class MultiPlayerSocket
{
    constructor(playground) {
        this.playground = playground;

        this.ws = new WebSocket("ws://112.124.23.44:8000/ws/multiplayer/");

        this.start();
    }

    start() {
    }

    send_create_player() {
        this.ws.send(JSON.stringify({
            'message': "hello, server",
        }));
    }

    receive_create_player() {
    }
}
