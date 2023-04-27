import express from "express";
import {Router} from "express";
import {ProductManager, manager} from '../routes/products.router.js'

import fs from "fs";
import { Server } from 'socket.io';
const WS_PORT = 8081;

const router = Router();
const server = express();
const httpServer = server.listen(WS_PORT, () => {console.log(`Servidor socketio iniciado en puerto ${WS_PORT}`);});



const wss = new Server(httpServer, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
});




wss.on('connection', (socket) => { // Escuchamos el evento connection por nuevas conexiones de clientes
    console.log(`Cliente conectado (${socket.id})`);
    
    // Emitimos el evento server_confirm
    socket.emit('server_confirm', "Socket conection success");
    
    socket.on("disconnect", (reason) => {
        console.log(`Cliente desconectado (${socket.id}): ${reason}`)});
    
    // Escuchamos por el evento 'postRequest' cuando pulsamos en enviar en el formulario. 
    socket.on('postRequest', async (data) => {
        const title = data.title;
        const description = data.description;
        const price = data.price;
        const code = data.code;
        const stock = data.stock;
        const status = data.status;
        const category = data.category;
        const thumbnail = data.thumbnail;
        
        await manager.addProduct(title,description,price,code,stock,status,category,thumbnail);
        const q = await manager.getProducts();
        wss.emit('refreshList',q);
        
    });
});






export default router;
