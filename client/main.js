import { Template } from 'meteor/templating';
import { Apparels } from '/imports/api/apparels.js';
import { Accounts } from 'meteor/accounts-base'

import './main.html';

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
    Template.list.helpers({
	  	getApparels() {
	  		var result = [];
	  		HTTP.call( "GET", 'http://localhost:3000/api/apparels', {},
            function( error, response ) {
            	var status = response.statusCode ? response.statusCode : 404;    
                if (status != 200 || error) {
                    console.log(error);
                    location.reload();
                } else {
                    var response = JSON.parse(response.content);
                    Session.set("result", response.data);
                    Session.set("resultLength", response.data.length);
                }
            });

	  		result = Session.get("result");
	    	return result;
	  	},
	  	checkList(){
	  		var result = Session.get("resultLength") ? Session.get("resultLength") : 0;
	  		return result == 0;
	  	},
	  	notCheckList(){
	  		var result = Session.get("resultLength") ? Session.get("resultLength") : 0;
	  		return result != 0;
	  	}
	});

	Template.cartList.helpers({
	  	getCartApparels() {
	  		var result = [];
	  		HTTP.call( "GET", 'http://localhost:3000/api/cart', {},
            function( error, response ) {
            	var status = response.statusCode ? response.statusCode : 404;    
                if (status != 200 || error) {
                    console.log(error);
                    location.reload();
                } else {
                    var response = JSON.parse(response.content);
                    Session.set("resultCart", response.data);
                    Session.set("resultCartLength", response.data.length);
                }
            });

	  		result = Session.get("resultCart");
	    	return result;
	  	},
	  	checkCartList(){
	  		var result = Session.get("resultCartLength") ? Session.get("resultCartLength") : 0;
	  		return result == 0;
	  	},
	  	getTotal(){
	  		var result = Session.get("resultCart");
	  		var total = 0;
	  		if(result && result.length){
		  		if(result.length > 1){
			  		for(var i = 0; i < result.length; i++){
			  			total += parseInt(result[i].item_price);
			  		} 	
		  		}else{
		  			total = result[0].item_price;
		  		}
	  		}
	  		return total;
	  	}
	});

	Template.search.helpers({
	  	isAdmin() {
	  		const user = Meteor.user();
	  		return user.username == "admin";
	  	},
	  	isCustomer() {
	    	const user = Meteor.user();
	  		return user.username == "customer";
	  	},
	});

	Template.modalCart.helpers({
	  	getItemData() {
	    	return Session.get("itemName");
	  	},
	})

	Template.cartItems.helpers({
	  	notCheckCartList(){
	  		var result = Session.get("resultCartLength") ? Session.get("resultCartLength") : 0;
	  		return result != 0;
	  	},
	});

	Template.apparel.helpers({
	  	isAdmin(){
	  		const user = Meteor.user();
	  		return user.username == "admin";
	  	},
	  	isCustomer(){
	  		const user = Meteor.user();
	  		return user.username == "customer";
	  	},
	  	outOfStock: function(stock){
	  		return stock == 0;
	  	},
	  	hasStock: function(stock){
	  		return stock != 0;
	  	},
	});

	Template.apparelItem.helpers({
	  	getAction(){
	  		return Session.get('action');
	  	},
	});

	Template.addForm.helpers({
	  	getApparel(){
	  		var selectedApparel = Session.get('selectedApparel');

	  		HTTP.call( "GET", 'http://localhost:3000/api/apparels/'+selectedApparel, {},
            function( error, response ) {
                var status = response.statusCode ? response.statusCode : 404;    
                if (status != 200 || error) {
                    console.log(error);
                    location.reload();
                } else {
                    var response = JSON.parse(response.content);
                    Session.set("resultItem", response.data);
                }
            });

	  		result = Session.get("resultItem");
	    	return result;

	  	},
	  	getActionUpdate(){
	  		return Session.get('action') === "Update";
	  	},
	});

	Template.search.events({
	  	'click button#create'(event, instance) {
	  		Session.set('action', 'Add');
	  		Router.go("/apparel/add");
	  	},
	  	'click button#cartPage'(event, instance) {
	  		Router.go("/cart");
	  	},
	});

	Template.apparelList.events({
	  	'click #login-buttons-logout'(event, instance) {
	  		location.reload();
	  	},
	});

	Template.cartItems.events({
	  	'click #back'(event, instance) {
	  		Router.go('/apparel');
	  	},
	  	'click #checkOut'(event, instance) {
	  		var result = Session.get("resultCart");
	  		var ids = [];
	  		var stocks = [];
	  		var quantities = [];
	  		if(result && result.length){
		  		if(result.length > 1){
			  		for(var i = 0; i < result.length; i++){
			  			ids.push(result[i].item_id);
			  			stocks.push(result[i].item_stock);
			  			quantities.push(result[i].item_quantity);
			  		} 	
		  		}else{
		  			ids.push(result[0].item_id);
		  			stocks.push(result[0].item_stock);
		  			quantities.push(result[0].item_quantity);
		  		}
	  		}
	  		
	  		HTTP.call('PUT', 'http://localhost:3000/api/checkout', {
  				data: { ids: ids, stocks: stocks, quantities: quantities }
			}, (error, response) => {
  				var status = response.statusCode ? response.statusCode : 404;    
                if (status != 200 || error) {
                    console.log(error);
                    location.reload();
                } else {
                    Router.go("/apparel");
                }
			});
	  	},
	});

	Template.list.events({
	  	'click button#update'(event, instance) {
	  		Session.set('selectedApparel', this._id);
	  		Session.set('action', 'Update');
	  		Router.go("/apparel/update");
	  	},
	  	'click button#delete'(event, instance) {
	  		var element = document.getElementById("modal-apparel");
	    	element.classList.add("is-active");
	    	Session.set("deleteId", this._id);
	  	},
	  	'click button#addToCart'(event, instance) {
	  		var element = document.getElementById("modal-cart");
	    	element.classList.add("is-active");
	    	Session.set("itemId", this._id);
	    	Session.set("itemName", this.name);
	    	Session.set("itemStock", this.stock);
	    	Session.set("itemPrice", this.price);
	    	HTTP.call( "GET", 'http://localhost:3000/api/cart/'+this._id, {},
            function( error, response ) {
                var status = response.statusCode ? response.statusCode : 404;    
                if (status != 200 || error) {
                    console.log(error);
                    location.reload();
                } else {
                    var response = JSON.parse(response.content);
                    if(Object.keys(response).length != 0){
	                    if(Session.get("itemId") == response.data.item_id){
	                    	Session.set("oldQuantity", response.data.item_quantity);
	                    	Session.set("isExisting", true);
	                    }else{
	                    	Session.set("isExisting", false);
	                    }
                    }else{
	                    Session.set("isExisting", false);
	                }
                }
            });
	  	},
	});

	Template.addForm.events({
	  	'click button#cancel'(event, instance) {
	  		Router.go("/apparel");
	  	},
	  	'submit form#updateForm'(event, instance) {
	  		event.preventDefault();
	  		var id = Session.get('selectedApparel');
	  		var name = event.target.updateName.value ? event.target.updateName.value : null;
	  		var price = event.target.updatePrice.value ? event.target.updatePrice.value : 0;
	  		var stock = event.target.updateStock.value ? event.target.updateStock.value : 0;
	  		var currentUser = Meteor.userId();
	  		if(name != null && price != 0 && stock != 0 && typeof(stock) != "boolean" && !isNaN(stock) && typeof(price) != "boolean" && !isNaN(price)){
		  		HTTP.call('PUT', 'http://localhost:3000/api/apparels/'+id, {
	  				data: { name: name, price: price, stock: stock, admin: currentUser }
				}, (error, response) => {
	  				var status = response.statusCode ? response.statusCode : 404;    
	                if (status != 200 || error) {
	                    console.log(error);
	                    location.reload();
	                } else {
	                    Router.go("/apparel");
	                }
				});
			}else{
				alert('Invalid input');
			}
	  	},
	  	'submit form#createForm'(event, instance) {
	  		event.preventDefault();
	  		var name = event.target.createName.value ? event.target.createName.value : null;
	  		var price = event.target.createPrice.value ? event.target.createPrice.value : 0;
	  		var stock = event.target.createStock.value ? event.target.createStock.value : 0;
	  		var currentUser = Meteor.userId();

	  		if(name != null && price != 0 && stock != 0 && typeof(stock) != "boolean" && !isNaN(stock) && typeof(price) != "boolean" && !isNaN(price)){
		  		HTTP.call('POST', 'http://localhost:3000/api/apparels', {
	  				data: { name: name, price: price, stock: stock, admin: currentUser }
				}, (error, response) => {
	  				var status = response.statusCode ? response.statusCode : 404;    
	                if (status != 201 || error) {
	                    console.log(error);
	                    location.reload();
	                } else {
	                    Router.go("/apparel");
	                }
				});
	  		}else{
	  			alert('Invalid input');
	  		}
	  	},
	});

	Template.modal.events({
	  	'click button#cancelModal'(event, instance) {
	  		var element = document.getElementById("modal-apparel");
	    	element.classList.remove("is-active");
	  	},
	  	'click button#confirmDelete'(event, instance) {
	  		var delete_id = Session.get("deleteId");
	  		var element = document.getElementById("modal-apparel");
	  		var success = document.getElementById("modal-success");
	  		HTTP.call( "DELETE", 'http://localhost:3000/api/apparels/'+delete_id, {},
            function( error, response ) {
                var status = response.statusCode ? response.statusCode : 404;    
                if (status != 202 || error) {
                    console.log(error);
                    location.reload();
                } else {
                    var response = JSON.parse(response.content);
                    Session.set("resultItem", response.data);
                    Session.set("actionDone", "delete");
                    element.classList.remove("is-active");
                    success.classList.add("is-active");
                }
            });
	  	},
	});

	Template.modalSuccess.events({
	  	'click button#closeModal'(event, instance) {
	  		var element = document.getElementById("modal-success");
	    	element.classList.remove("is-active");
	    	location.reload();
	  	},
	});

	Template.modalCart.events({
	  	'click button#closeCartModal'(event, instance) {
	  		var element = document.getElementById("modal-cart");
	    	element.classList.remove("is-active");
	  	},
	  	'click button#confirmAdd'(event, instance) {
	  		var id = Session.get("itemId");
	  		var name = Session.get("itemName");
	    	var price = Session.get("itemPrice");
	    	var stock = Session.get("itemStock");
	    	var old_quantity = Session.get("oldQuantity");
	    	var quantity = document.getElementById('cartQuantity') ? document.getElementById('cartQuantity').value : 0 

	    	var result = Session.get("isExisting");
	    	if(quantity != 0 && quantity <= stock && typeof(quantity) != "boolean" && !isNaN(quantity)){
		  		if(result){
		  			HTTP.call('PUT', 'http://localhost:3000/api/cart/'+id, {
		  				data: { item_id: id, item_name: name, item_quantity: quantity, item_stock: stock, item_price: price, old_quantity: old_quantity}
					}, (error, response) => {
		  				var status = response.statusCode ? response.statusCode : 404;    
		                if (status != 200 || error) {
		                    console.log(error);
		                    location.reload();
		                } else {
		                    Router.go("/cart");
		                }
					});
		  		}else{
		  			HTTP.call('POST', 'http://localhost:3000/api/cart', {
		  				data: { item_id: id, item_name: name, item_quantity: quantity, item_stock: stock, item_price: price }
					}, (error, response) => {
		  				var status = response.statusCode ? response.statusCode : 404;    
		                if (status != 201 || error) {
		                    console.log(error);
		                    location.reload();
		                } else {
		                    Router.go("/cart");
		                }
					});
		  		}
	    	}else{
	    		alert("Invalid input");
	    	}

	  	},
	});

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
}

	