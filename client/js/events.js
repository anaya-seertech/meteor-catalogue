if(Meteor.isClient){
	/*EVENTS*/
	Template.search.events({
	  	'click button#create'(event, instance) {
	  		Session.set('action', 'Add');
	  		Router.go("/apparel/add");
	  	},
	  	'click button#cartPage'(event, instance) {
	  		Router.go("/cart");
	  	},
	  	'click button#searchItem'(event, instance) {
	  		var name = document.getElementById('searchName').value ? document.getElementById('searchName').value : null; 
	  		if(name != null || name != ""){
		  		HTTP.call( "GET", 'http://localhost:3000/api/search/'+name, {},
	            function( error, response ) {
	                var status = response.statusCode ? response.statusCode : 404;    
	                if (status != 200 || error) {
	                    console.log(error);
	                    location.reload();
	                } else {
	                    var response = JSON.parse(response.content);
	                    Session.set("resultSearch", response.data);
	                    Session.set("resultLengthSearch", response.data.length);
	                }
	            });
	        }else{
	        	Session.set("resultSearch", undefined);
	            Session.set("resultLengthSearch", 0);
	        }
	  	},
	});

	Template.apparelList.events({
	  	'click #login-buttons-logout'(event, instance) {
	  		location.reload();
	  	},
	});

	Template.cartRow.events({
	  	'click #deleteItem'(event, instance) {
	  		var element = document.getElementById("modal-delete");
	    	element.classList.add("is-active");
	    	Session.set("deleteCartId", this._id);
	  	},
	});

	Template.receipt.events({
	  	'click #goBack'(event, instance) {
	  		Router.go('/apparel');
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
	  		
	  		Session.set("receipt",result);

	  		HTTP.call('PUT', 'http://localhost:3000/api/checkout', {
  				data: { ids: ids, stocks: stocks, quantities: quantities }
			}, (error, response) => {
  				var status = response.statusCode ? response.statusCode : 404;    
                if (status != 200 || error) {
                    console.log(error);
                    location.reload();
                } else {
                    Router.go("/receipt");
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

	  		if(name != null && parseInt(price) != 0 && parseInt(stock) != 0 && typeof(stock) != "boolean" && !isNaN(stock) && typeof(price) != "boolean" && !isNaN(price)){
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

	Template.modalDelete.events({
	  	'click button#cancelModalCart'(event, instance) {
	  		var element = document.getElementById("modal-delete");
	    	element.classList.remove("is-active");
	  	},
	  	'click button#confirmDeleteCart'(event, instance) {
	  		var delete_id = Session.get("deleteCartId");
	  		var element = document.getElementById("modal-delete");
	  		var success = document.getElementById("modal-cart-success");
	  		HTTP.call( "DELETE", 'http://localhost:3000/api/cart/'+delete_id, {},
            function( error, response ) {
                var status = response.statusCode ? response.statusCode : 404;    
                if (status != 202 || error) {
                    console.log(error);
                    location.reload();
                } else {
                    var response = JSON.parse(response.content);
                    Session.set("resultCart", response.data);
                    element.classList.remove("is-active");
                    success.classList.add("is-active");
                }
            });
	  	},
	});

	Template.modalCartSuccess.events({
	  	'click button#closeModalCart'(event, instance) {
	  		var element = document.getElementById("modal-cart-success");
	    	element.classList.remove("is-active");
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
	    	var old_quantity = Session.get("oldQuantity") ? Session.get("oldQuantity") : 0;
	    	var quantity = document.getElementById('cartQuantity') ? document.getElementById('cartQuantity').value : 0; 
	    	var final_quantity = parseInt(old_quantity) + parseInt(quantity);
	    	var result = Session.get("isExisting");
	    	if(parseInt(quantity) != 0 && parseInt(quantity) <= parseInt(stock) && typeof(quantity) != "boolean" && !isNaN(quantity)){
		  		if(result){
		  			HTTP.call('PUT', 'http://localhost:3000/api/cart/'+id, {
		  				data: { item_id: id, item_name: name, item_quantity: quantity, item_stock: stock, item_price: price, old_quantity: old_quantity, total: parseInt(price) * parseInt(final_quantity)}
					}, (error, response) => {
		  				var status = response.statusCode ? response.statusCode : 404;    
		                if (status != 200 || error) {
		                    console.log(error);
		                    location.reload();
		                } else {
							Session.clear("oldQuantity")
		                    Router.go("/cart");
		                }
					});
		  		}else{
		  			HTTP.call('POST', 'http://localhost:3000/api/cart', {
		  				data: { item_id: id, item_name: name, item_quantity: quantity, item_stock: stock, item_price: price, total: parseInt(price) * parseInt(final_quantity)}
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
}