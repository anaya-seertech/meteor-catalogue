import { Template } from 'meteor/templating';
import { Apparels } from '/imports/api/apparels.js';

import './main.html';

Template.list.helpers({
  	getApparels() {
    	return Apparels.find();
  	},
});

Template.search.events({
  	'click button#create'(event, instance) {
  		Router.go("/apparel/add");
  	},
});

Template.list.events({
  	'click button#update'(event, instance) {
  		Router.go("/apparel/update");
  	},
  	'click button#delete'(event, instance) {
  		var element = document.getElementById("modal-apparel");
    	element.classList.add("is-active");
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

Router.route('/', function () {
  this.render('apparelList');
});

Router.route('/apparel', function () {
  this.render('apparelList');
});

Router.route('/apparel/add', function () {
  this.render('apparelItem');
});

Router.route('/apparel/update', function () {
  this.render('apparelItem');
});