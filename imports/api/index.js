import { Meteor } from 'meteor/meteor';  
import express from 'express';
import bodyParser from 'body-parser';

import Apparels from './apparels';

if(Meteor.isServer){
    async function getApparel(req, res) {  
        const apparel = await Apparels.findOne(req.params.id);

        res.status(200).json({ data: apparel });
    }

    async function updateApparel(req, res) {  
        const result = await Apparels.update(req.params.id, 
            { $set: 
                { name: req.body.name, price: req.body.price, stock: req.body.stock } 
            });
        const apparel = await Apparels.findOne(req.params.id);

        res.status(200).json({ data: apparel });
    }

    async function deleteApparel(req, res) {  
        const result = await Apparels.remove(req.params.id);

        res.status(202).json({ data: result });
    }

    async function getApparels(req, res) {  
        const apparels = await Apparels.find().fetch();

        res.status(200).json({ data: apparels });
    }

    async function addApparel(req, res) {  
        const apparelId = await Apparels.insert({ 
            name: req.body.name, 
            price: req.body.price, 
            stock: req.body.stock 
        });

        const apparel = await Apparels.findOne(apparelId);
        res.status(201).json({ data: apparel });
    }

    export function setupApi() {  
        const app = express();
        app.use(bodyParser.json())

        app.get('/api/apparels/:id', getApparel);
        app.put('/api/apparels/:id', updateApparel);
        app.delete('/api/apparels/:id', deleteApparel);
        app.get('/api/apparels', getApparels);
        app.post('/api/apparels', addApparel);
        app.get('/api', (req, res) => {
            res.status(200).json({ message: 'Hello World!!!'});
        });

        WebApp.connectHandlers.use(app);
    }
}

    