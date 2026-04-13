import { io } from 'socket.io-client';

const socket = io('https://api.nerands.com/', {
    transports: ['websocket'],
});

export default socket;