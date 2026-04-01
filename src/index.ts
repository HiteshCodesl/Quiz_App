import http from 'http';
import { Server } from 'socket.io';
import { IoManager } from './managers/IoManager.js';
import { UserManager } from './managers/UserManager.js';
const server = http.createServer();

const io = IoManager.getInstance();
console.log("Request in index.ts");

const userManager = new UserManager();

io.on('connection', socket => {
  console.log("Server is Connected on port 3000");
  console.log("Type of Socket/client",typeof socket, socket);
  userManager.addUser(socket);

  socket.on('disconnect', () => {
    console.log("Socket Disconnected");
  });
});

io.listen(3000);