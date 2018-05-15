import { Meteor } from 'meteor/meteor';  
import express from 'express';
import bodyParser from 'body-parser';

import Apparels from './apparels';
import Cart from './cart';

if(Meteor.isServer){
    async function checkout(req, res){
        var ids = req.body.ids;
        var stocks = req.body.stocks;
        var quantities = req.body.quantities;
        var data = [];
        if(ids && ids.length){
            if(ids.length > 1){
                for(var i = 0; i < ids.length; i++){
                    const result = await Apparels.update(ids[i], 
                        { $set: 
                            {stock: (parseInt(stocks[i]) - parseInt(quantities[i]))} 
                        });
                    const cart = await Cart.remove({item_id: ids[i]});
                    var apparel = await Apparels.findOne(ids[i]);
                    data.push(apparel);
                }   
            }else{
                const result = await Apparels.update(ids[0], 
                    { $set: 
                        {stock: (parseInt(stocks[0]) - parseInt(quantities[0]))} 
                    });
                const cart = await Cart.remove({item_id: ids[0]});
                var apparel = await Apparels.findOne(ids[0]);
                data.push(apparel);
            }
        }
        res.status(200).json({ data: data });           
    }

    async function getCartApparel(req, res) {  
        const cart = await Cart.findOne({item_id: req.params.item_id});

        res.status(200).json({ data: cart });
    }

    async function updateCartApparel(req, res) { 
        const result = await Cart.update({item_id: req.body.item_id}, 
            { $set: 
                {item_quantity: (parseInt(req.body.old_quantity) + parseInt(req.body.item_quantity)), item_stock: req.body.item_stock, item_price: req.body.item_price, total: req.body.total} 
            });
        const cart = await Cart.findOne({item_id: req.params.item_id});
        res.status(200).json({ data: cart });
    }

    async function deleteApparelCart(req, res) {  
        const result = await Cart.remove(req.params.id);

        res.status(202).json({ data: result });
    }

    async function cartList(req, res) {  
        const cart = await Cart.find().fetch();

        res.status(200).json({ data: cart });
    }

    async function addApparelCart(req, res) {  
        const cartItemId = await Cart.insert({ 
            item_id: req.body.item_id, 
            item_name: req.body.item_name, 
            item_quantity: req.body.item_quantity, 
            item_stock: req.body.item_stock, 
            item_price: req.body.item_price,
            total: req.body.total
        });

        const cartItem = await Cart.findOne(cartItemId);
        res.status(201).json({ data: cartItem });
    }

    export function setupApiCart() {  
        const app = express();
        app.use(bodyParser.json())

        app.get('/api/cart/:item_id', getCartApparel);
        app.put('/api/cart/:id', updateCartApparel);
        app.delete('/api/cart/:id', deleteApparelCart);
        app.get('/api/cart', cartList);
        app.post('/api/cart', addApparelCart);
        app.put('/api/checkout', checkout);
        WebApp.connectHandlers.use(app);
    }
}

    