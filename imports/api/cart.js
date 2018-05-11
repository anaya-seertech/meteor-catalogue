import { Mongo } from 'meteor/mongo';

const Cart = new Mongo.Collection('cart');

export default Cart;