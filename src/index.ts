import http from 'http';
import {Server} from 'socket.io';
import { IoManager } from './managers/IoManager.js';
const server = http.createServer();

const io = IoManager.getInstance();

io.on('connection', client => {
  client.on('event', data => { 
    const payload = data.payload
  });
  client.on('disconnect', () => {
    
   });
});

io.listen(3000);