if(Meteor.isClient){	
	/*HELPERS*/
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

	        var search = Session.get("resultSearch") ? Session.get("resultSearch") : [];
	        var searchLength = Session.get("resultLengthSearch") ? Session.get("resultLengthSearch") : 0;

	        if(searchLength > 0){
	        	result =  search;
	        }else{
	        	result = Session.get("result");
	        }
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
	  	hasList(){
	  		var result = Session.get("resultCartLength") ? Session.get("resultCartLength") : 0;
	  		return result != 0;
	  	},
	  	getTotal(){
	  		var result = Session.get("resultCart");
	  		var total = 0;
	  		if(result && result.length){
		  		if(result.length > 1){
			  		for(var i = 0; i < result.length; i++){
			  			total += parseInt(result[i].total);
			  		} 	
		  		}else{
		  			total = result[0].total;
		  		}
	  		}
	  		return total;
	  	}
	});

	Template.checkoutList.helpers({
		getOrdered() {
	  		var result = Session.get("receipt");
	  		if(!result){
	  			Router.go("/apparel");
	  		}
	    	return result;
	  	},
	  	getTotalOrdered(){
	  		var result = Session.get("receipt");
	  		var total = 0;
	  		if(result && result.length){
		  		if(result.length > 1){
			  		for(var i = 0; i < result.length; i++){
			  			total += parseInt(result[i].total);
			  		} 	
		  		}else{
		  			total = result[0].total;
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
}