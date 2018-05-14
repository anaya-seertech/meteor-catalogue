import { Template } from 'meteor/templating';
import { Apparels } from '/imports/api/apparels.js';
import { Accounts } from 'meteor/accounts-base'

import './main.html';
import './js/helpers.js';
import './js/events.js';

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});

Template.registerHelper('and',(a,b)=>{
  return a && b;
});
Template.registerHelper('or',(a,b)=>{
  return a || b;
});

if(Meteor.isClient){
	/*ROUTES*/
	function checkIsAdmin(){
		const user = Meteor.user();
		if(user.username != "admin"){
	  		Router.go('/apparel');
	  	}
	}

	function checkIsCustomer(){
		var user = Meteor.user();
		if(user.username != "customer"){
	  		Router.go('/apparel');
	  	}
	}

	Router.route('/', function () {
	  Router.go('/apparel');
	});

	Router.route('/apparel', function () {
	  this.render('apparelList');
	});

	Router.route('/apparel/add', function () {
	  checkIsAdmin();
	  this.render('apparelItem');	
	});

	Router.route('/apparel/update', function () {
	  checkIsAdmin();
	  this.render('apparelItem');
	});

	Router.route('/cart', function () {
	  checkIsCustomer();
	  this.render('cartItems');
	});

	Router.route('/receipt', function () {
	  this.render('receipt');
	});
}

	