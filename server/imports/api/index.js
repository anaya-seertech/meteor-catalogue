import { Meteor } from 'meteor/meteor';  
import express from 'express';
import bodyParser from 'body-parser';

import Apparels from './apparels';

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

  	app.get('/api/apparels', getApparels);
  	app.post('/api/apparels', addApparel);
  	app.get('/api', (req, res) => {
   		res.status(200).json({ message: 'Hello World!!!'});
  	});

  	WebApp.connectHandlers.use(app);
}