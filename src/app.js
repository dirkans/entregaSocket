import express from "express";
import router_products from "./routes/products.router.js";
import realtimeproducts from "./routes/realtimeproducts.router.js";
import { engine } from 'express-handlebars';
import { __dirname } from './utils.js';
import router_carts from './routes/carts.router.js'
import {ProductManager, manager} from './routes/products.router.js'


const PUERTO = 8080;
const server = express();


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




server.listen(PUERTO,()=>{
    console.log(`Server started on port ${PUERTO}`)
})

