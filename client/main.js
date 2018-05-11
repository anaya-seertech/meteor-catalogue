import { Template } from 'meteor/templating';
import { Apparels } from '/imports/api/apparels.js';

import './main.html';

if(Meteor.isClient){
    Template.list.helpers({
	  	getApparels() {
	    	return Apparels.find({});
	  	},
	});

	Template.search.helpers({
	  	isAdmin() {
	    	return Session.get("isAdmin");
	  	},
	});

	Template.apparel.helpers({
	  	isAdminItem: function(admin){
	  		var userID = admin;
	  		var currentUser = Meteor.userId();
	  		Session.set("isAdmin", userID == currentUser);
	  		return userID == currentUser;
	  	},
	  	isCustomerItem: function(customer){
	  		var userID = customer;
	  		var currentUser = Meteor.userId();
	  		Session.set("isCustomer", userID != currentUser);
	  		return userID != currentUser && currentUser;
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
   			return Apparels.findOne({ _id: selectedApparel });
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
	    	console.log(this._id);
	  	},
	});

	Template.addForm.events({
	  	'click button#cancel'(event, instance) {
	  		Router.go("/apparel");
	  	},
	});

	Template.modal.events({
	  	'click button#cancelModal'(event, instance) {
	  		var element = document.getElementById("modal-apparel");
	    	element.classList.remove("is-active");
	  	},
	});

	function checkIsAdmin(){
		var isAdmin = Session.get("isAdmin");
		if(!isAdmin){
	  		Router.go('/apparel');
	  	}
	}

	function checkIsCustomer(){
		var isCustomer = Session.get("isCustomer");
		if(!isCustomer){
	  		Router.go('/apparel');
	  	}
	}

	Router.route('/', function () {
	  this.render('apparelList');
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
}

	