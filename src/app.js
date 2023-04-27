import express from "express";
import router_products from "./routes/products.router.js";
import realtimeproducts from "./routes/realtimeproducts.router.js";
import { engine } from 'express-handlebars';
import { __dirname } from './utils.js';
import { Server } from 'socket.io';
import router_carts from './routes/carts.router.js'
import {ProductManager, manager} from './routes/products.router.js'


const PUERTO = 8080;
const WS_PORT = 8081;
const server = express();
const httpServer = server.listen(WS_PORT, () => {console.log(`Servidor socketio iniciado en puerto ${WS_PORT}`);});
const wss = new Server(httpServer, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
});


server.use(express.json());
server.use(express.urlencoded({extended: true }));
server.use('/api/products',router_products)
server.use('/api/carts',router_carts)
server.use('/public', express.static(`${__dirname}/public`));
server.use('/', router_products);
server.use('/realtimeproducts',realtimeproducts)


server.engine('handlebars', engine());
server.set('view engine', 'handlebars');
server.set('views', './views');


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

server.listen(PUERTO,()=>{
    console.log(`Server started on port ${PUERTO}`)
})


