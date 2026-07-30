import { io } from 'socket.io-client';

const socket = io('https://api.nerands.com/', {
    transports: ['websocket'],
});

socket.on("connect", () => {
    console.log("✅ Connected:", socket.id);
});

socket.on("connect_error", (err) => {
    console.log("❌ Connect Error:", err.message);
});

socket.on("disconnect", (reason) => {
    console.log("❌ Disconnected:", reason);
});

socket.on("test_event", (data) => {
    console.log("📩", data);
});

socket.on("join_user", (userId) => {
    socket.join(`user_${userId}`);

    console.log(`${socket.id} joined user_${userId}`);

    io.to(`user_${userId}`).emit("order_updated", {
        order_id: "test-order",
        status: "accepted"
    });
});

export default socket;