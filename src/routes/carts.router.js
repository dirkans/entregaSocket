import express from "express";
import {Router} from "express";
const router = Router();

import fs from 'fs';



class CartManager{
    constructor(path) {
        this.path = path;
        this.lastId = 0;
        this.array = [];
    }

    refreshArray = async () => {
        const rescate = await fs.promises.readFile(this.path, 'utf-8');
        this.array = (JSON.parse(rescate))
        for (let i = 0; i < this.array.length; i++) {
            if (this.array[i].id > this.lastId) {
                this.lastId = this.array[i].id
            }
        }
    }

    async addCart(prods) {
        await this.refreshArray();

        const newCart = {
            id: ++this.lastId,
            items: [prods]
        }
        this.array.push(newCart)
        const cadenaCart = JSON.stringify(this.array);
        await fs.promises.writeFile(this.path, cadenaCart)

        return newCart
    }


    getCartById = async (id) => {
        await this.refreshArray();
        const cart = this.array.find(cart => cart.id === id);
        
        console.log(cart.items)
        if (cart) {
            return (cart)
        } else {
            return (`ID ${id} Not found`);
        }
    }


    addToCart = async (cid,pid) => {
        await this.refreshArray();
        const cart = this.array.find(cart => cart.id == cid);
        const indexBuscado = this.array.indexOf(cart)
        let made = false;
        console.log('cart before: ',cart.items)
        for(let i=0 ; i< cart.items.length ; i++ ){
            if(cart.items[i].id == pid){cart.items[i].quantity = cart.items[i].quantity+1; made=true} 
            
        }
        if (made==false){cart.items.push({id:pid,quantity:1})} 
        
        console.log('cart after: ',cart.items)
        this.array.splice(indexBuscado,1,cart);
        const newArrayStringuiseado = JSON.stringify(this.array);
        await fs.promises.writeFile(this.path,newArrayStringuiseado);
        console.log(`Se ha agregado correctamente el producto ${pid} al cart nro ${cid}`)
    }

}


const cart1 = new CartManager('./carrito.json');
cart1.refreshArray();
//cart1.addCart({id:1,quantity:2})







router.post('/', async (req, res) => {
    const objBody = req.body;
    await cart1.addCart(objBody)
    res.status(200).send("ok")
})


router.get('/:cid', (req, res) => {
    cid = parseInt(req.params.cid)
    cart1.getCartById(cid);

    res.status(200).send("ok")
})



router.post('/:cid/product/:pid', (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    
    cart1.addToCart(cid, pid);
    res.status(200).send("ok")
})

export default router;