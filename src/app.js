import express from "express";
import router_products from "./routes/products.router.js";
import { engine } from 'express-handlebars';
import { __dirname } from './utils.js';
import { Server } from 'socket.io';
import router_carts from './routes/carts.router.js'
import {ProductManager, manager} from './routes/products.router.js'
import chokidar from 'chokidar';


//Este es el watcher de chokidar que controla cambios en el JSON para poder enviarlo por socket.io
const watcher = chokidar.watch('./productos.json', {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
  });
 

const PUERTO = 8080;
const WS_PORT = 8081;

const server = express();

const httpServer = server.listen(WS_PORT, () => {
    console.log(`Servidor socketio iniciado en puerto ${WS_PORT}`);
});

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




// Motor de plantillas
server.engine('handlebars', engine());
server.set('view engine', 'handlebars');
server.set('views', './views');

function wtd(){
    return manager.refreshArray();

}

//Eventos socket.io
wss.on('connection', (socket) => { // Escuchamos el evento connection por nuevas conexiones de clientes
    console.log(`Cliente conectado (${socket.id})`);
    
    
    function now(){
        
socket.emit('server_confirm', wtd())
    
    }
    
    // Emitimos el evento server_confirm
    socket.emit('server_confirm', "conex ok");
    
    socket.on("disconnect", (reason) => {
        console.log(`Cliente desconectado (${socket.id}): ${reason}`);
    });
    
    // Escuchamos por el evento evento_cl01 desde el cliente
    
    socket.on('event_cl01', (data) => {
        console.log(data);
    });


    // Escuchamos por el evento 'postRequest' cuando pulsamos en enviar en el formulario. 
    socket.on('postRequest', (data) => {
        const title = data.title;
        const description = data.description;
        const price = data.price;
        const code = data.code;
        const stock = data.stock;
        const status = data.status;
        const category = data.category;
        const thumbnail = data.thumbnail;
    manager.addProduct(title,description,price,code,stock,status,category,thumbnail);
    console.log("OK")
        
    });

    watcher
    .on('change', path => now())

});





server.listen(PUERTO,()=>{
    console.log(`Server started on port ${PUERTO}`)
})


